import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from './gemini.service';
import type {
  MrpRequirementsResponse,
  MrpShortfallItem,
} from './dto/suggest-substitution.dto';

@Injectable()
export class MrpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  /**
   * Calcula a necessidade bruta para produzir {quantity} unidades do produto.
   * Retorna status OK/SHORTFALL por MP; para cada SHORTFALL chama o Gemini
   * e anexa a sugestão de substituição.
   */
  async calculateRequirements(
    productId: string,
    quantity: number,
  ): Promise<MrpRequirementsResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const bom = await this.prisma.bomFormula.findFirst({
      where: { productId, isActive: true },
      include: {
        items: {
          include: {
            rawMaterial: true,
            substitutions: {
              include: { substituteMaterial: true },
              orderBy: { aiPreferenceScore: 'desc' },
            },
          },
        },
      },
    });

    if (!bom) {
      throw new NotFoundException(
        `Nenhuma BOM ativa para o produto ${product.sku}`,
      );
    }

    // 1. Calcular necessidade bruta por MP
    const yieldFactor = quantity / Number(bom.baseYieldQty);
    const requiredBySkuId = new Map<
      string,
      { required: number; item: (typeof bom.items)[number] }
    >();

    for (const item of bom.items) {
      const required = Number(item.requiredQty) * yieldFactor;
      requiredBySkuId.set(item.rawMaterialId, { required, item });
    }

    // 2. Buscar saldos atuais (qualquer almoxarifado — soma)
    const rawMaterialIds = Array.from(requiredBySkuId.keys());
    const balances = await this.prisma.stockBalance.groupBy({
      by: ['productId'],
      where: { productId: { in: rawMaterialIds } },
      _sum: { quantity: true },
    });
    const availableByProductId = new Map<string, number>(
      balances.map((b) => [b.productId, Number(b._sum.quantity ?? 0)]),
    );

    // 3. Montar itens e detectar déficits
    const items: MrpRequirementsResponse['items'] = [];
    const shortfalls: MrpShortfallItem[] = [];

    for (const [rawMaterialId, { required, item }] of requiredBySkuId) {
      const available = availableByProductId.get(rawMaterialId) ?? 0;
      const isShortfall = available < required;
      const raw = item.rawMaterial;

      items.push({
        rawMaterialId,
        sku: raw.sku,
        name: raw.name,
        unit: raw.unit,
        requiredQty: round(required),
        availableQty: round(available),
        status: isShortfall ? 'SHORTFALL' : 'OK',
      });

      if (isShortfall) {
        const substitutesIds = item.substitutions.map(
          (s) => s.substituteMaterialId,
        );
        const subBalances = substitutesIds.length
          ? await this.prisma.stockBalance.groupBy({
              by: ['productId'],
              where: { productId: { in: substitutesIds } },
              _sum: { quantity: true },
            })
          : [];
        const subAvailableMap = new Map(
          subBalances.map((b) => [b.productId, Number(b._sum.quantity ?? 0)]),
        );

        const availableSubstitutes = item.substitutions.map((s) => ({
          sku: s.substituteMaterial.sku,
          name: s.substituteMaterial.name,
          conversionFactor: Number(s.conversionFactor),
          aiPreferenceScore: s.aiPreferenceScore,
          availableQty: subAvailableMap.get(s.substituteMaterialId) ?? 0,
        }));

        const shortfall: MrpShortfallItem = {
          rawMaterialId,
          rawMaterialSku: raw.sku,
          rawMaterialName: raw.name,
          requiredQty: round(required),
          availableQty: round(available),
          shortfallQty: round(required - available),
          availableSubstitutes,
          aiSuggestion: null,
        };

        shortfall.aiSuggestion = await this.gemini.suggestSubstitution(shortfall);
        shortfalls.push(shortfall);
      }
    }

    return {
      product: { id: product.id, sku: product.sku, name: product.name },
      plannedQty: quantity,
      bomVersion: bom.version,
      items,
      shortfalls,
      feasible: shortfalls.length === 0,
    };
  }
}

function round(n: number, decimals = 4) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}
