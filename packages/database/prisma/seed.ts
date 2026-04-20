/**
 * Seed da Hotechann Faz — dados realistas para validar a fatia vertical.
 *
 * Popula:
 *  - Almoxarifados (RAW_MATERIAL, QUARANTINE, FINISHED_GOOD)
 *  - 12 matérias-primas + 1 embalagem
 *  - 5 produtos acabados (detergente, desinfetante, sabonete líquido, álcool, amaciante)
 *  - BOMs completas com quantidades realistas
 *  - Substituições homologadas (essência A ↔ essência B)
 *  - Saldos iniciais com UM produto em déficit proposital para exercitar a IA
 */
import { PrismaClient, ProductType, UnitOfMeasure, WarehouseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Hotechann database...');

  // 1) Almoxarifados
  const [whRaw, whQa, whPa] = await Promise.all([
    prisma.warehouse.upsert({
      where: { code: 'RAW-01' },
      update: {},
      create: { code: 'RAW-01', name: 'Matéria-Prima', type: WarehouseType.RAW_MATERIAL },
    }),
    prisma.warehouse.upsert({
      where: { code: 'QA-01' },
      update: {},
      create: { code: 'QA-01', name: 'Quarentena', type: WarehouseType.QUARANTINE },
    }),
    prisma.warehouse.upsert({
      where: { code: 'PA-01' },
      update: {},
      create: { code: 'PA-01', name: 'Produto Acabado', type: WarehouseType.FINISHED_GOOD },
    }),
  ]);

  // 2) Matérias-primas
  const rawMaterials = await Promise.all([
    upsertProduct('MP-AGUA', 'Água Deionizada', ProductType.RAW_MATERIAL, UnitOfMeasure.L, { unitCost: 0.02, minStock: 1000 }),
    upsertProduct('MP-LAS', 'LAS (Ácido Dodecilbenzeno Sulfônico)', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 8.5, minStock: 100 }),
    upsertProduct('MP-TENSNI', 'Tensoativo Não-Iônico (Nonilfenol 9,5 EO)', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 12.0, minStock: 50 }),
    upsertProduct('MP-NAOH', 'Hidróxido de Sódio 50%', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 3.8, minStock: 80 }),
    upsertProduct('MP-ESSFLO-A', 'Essência Floral A (Premium)', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 45.0, minStock: 20 }),
    upsertProduct('MP-ESSFLO-B', 'Essência Floral B (Alternativa)', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 32.0, minStock: 20 }),
    upsertProduct('MP-CLORO', 'Hipoclorito de Sódio 12%', ProductType.RAW_MATERIAL, UnitOfMeasure.L, { unitCost: 4.2, minStock: 200 }),
    upsertProduct('MP-ALCETIL', 'Álcool Etílico 96°GL', ProductType.RAW_MATERIAL, UnitOfMeasure.L, { unitCost: 6.8, minStock: 300 }),
    upsertProduct('MP-CORANTE-AZ', 'Corante Azul Brilhante FCF', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 85.0, minStock: 5 }),
    upsertProduct('MP-KATHON', 'Conservante Kathon CG', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 120.0, minStock: 3 }),
    upsertProduct('MP-EDTA', 'EDTA Tetrassódico', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 18.0, minStock: 15 }),
    upsertProduct('MP-SAL', 'Cloreto de Sódio (sal espessante)', ProductType.RAW_MATERIAL, UnitOfMeasure.KG, { unitCost: 1.8, minStock: 50 }),
    upsertProduct('EMB-5L', 'Bombona plástica 5L com tampa', ProductType.PACKAGING, UnitOfMeasure.UN, { unitCost: 3.5, minStock: 500 }),
  ]);

  const mp = Object.fromEntries(rawMaterials.map((p) => [p.sku, p]));

  // 3) Produtos acabados
  const pas = await Promise.all([
    upsertProduct('PA-DET-5L', 'Detergente Neutro 5L', ProductType.FINISHED_GOOD, UnitOfMeasure.UN, { basePrice: 28.9, minStock: 50 }),
    upsertProduct('PA-DES-FLO-5L', 'Desinfetante Floral 5L', ProductType.FINISHED_GOOD, UnitOfMeasure.UN, { basePrice: 24.5, minStock: 50 }),
    upsertProduct('PA-SAB-5L', 'Sabonete Líquido Perolado 5L', ProductType.FINISHED_GOOD, UnitOfMeasure.UN, { basePrice: 32.0, minStock: 40 }),
    upsertProduct('PA-ALC70-5L', 'Álcool Etílico 70% 5L', ProductType.FINISHED_GOOD, UnitOfMeasure.UN, { basePrice: 38.9, minStock: 80 }),
    upsertProduct('PA-AGUA-SAN-5L', 'Água Sanitária 2,5% 5L', ProductType.FINISHED_GOOD, UnitOfMeasure.UN, { basePrice: 16.9, minStock: 60 }),
  ]);

  const [detergente, desinfetante, sabonete, alcool, aguaSanitaria] = pas;

  // 4) BOM — Detergente Neutro 5L (rende 1 bombona = 5L)
  await createBom(detergente!.id, [
    { sku: 'MP-AGUA', qty: 4.2 },
    { sku: 'MP-LAS', qty: 0.45 },
    { sku: 'MP-TENSNI', qty: 0.12 },
    { sku: 'MP-NAOH', qty: 0.08 },
    { sku: 'MP-SAL', qty: 0.05 },
    { sku: 'MP-KATHON', qty: 0.002 },
    { sku: 'EMB-5L', qty: 1 },
  ], mp);

  // BOM — Desinfetante Floral 5L — USA ESSÊNCIA FLORAL A (com substituto B homologado)
  await createBom(desinfetante!.id, [
    { sku: 'MP-AGUA', qty: 4.5 },
    { sku: 'MP-TENSNI', qty: 0.08 },
    { sku: 'MP-ESSFLO-A', qty: 0.05, substitutes: [{ sku: 'MP-ESSFLO-B', factor: 1.2, score: 85 }] },
    { sku: 'MP-CORANTE-AZ', qty: 0.001 },
    { sku: 'MP-KATHON', qty: 0.002 },
    { sku: 'EMB-5L', qty: 1 },
  ], mp);

  // BOM — Sabonete Líquido Perolado 5L
  await createBom(sabonete!.id, [
    { sku: 'MP-AGUA', qty: 3.8 },
    { sku: 'MP-LAS', qty: 0.35 },
    { sku: 'MP-TENSNI', qty: 0.25 },
    { sku: 'MP-NAOH', qty: 0.06 },
    { sku: 'MP-SAL', qty: 0.08 },
    { sku: 'MP-ESSFLO-A', qty: 0.04, substitutes: [{ sku: 'MP-ESSFLO-B', factor: 1.2, score: 75 }] },
    { sku: 'MP-EDTA', qty: 0.02 },
    { sku: 'MP-KATHON', qty: 0.003 },
    { sku: 'EMB-5L', qty: 1 },
  ], mp);

  // BOM — Álcool 70% 5L
  await createBom(alcool!.id, [
    { sku: 'MP-ALCETIL', qty: 3.65 },
    { sku: 'MP-AGUA', qty: 1.35 },
    { sku: 'EMB-5L', qty: 1 },
  ], mp);

  // BOM — Água Sanitária 2,5% 5L
  await createBom(aguaSanitaria!.id, [
    { sku: 'MP-CLORO', qty: 1.1 },
    { sku: 'MP-AGUA', qty: 3.88 },
    { sku: 'MP-NAOH', qty: 0.02 },
    { sku: 'EMB-5L', qty: 1 },
  ], mp);

  // 5) Saldos iniciais — propositalmente com ESSÊNCIA A abaixo do mínimo
  //    para exercitar a sugestão de substituição via IA
  const balances: Array<[string, number]> = [
    ['MP-AGUA', 5000],
    ['MP-LAS', 450],
    ['MP-TENSNI', 180],
    ['MP-NAOH', 220],
    ['MP-ESSFLO-A', 3], // ⚠️ déficit proposital
    ['MP-ESSFLO-B', 45], // substituto em estoque ok
    ['MP-CLORO', 800],
    ['MP-ALCETIL', 1200],
    ['MP-CORANTE-AZ', 8],
    ['MP-KATHON', 6],
    ['MP-EDTA', 22],
    ['MP-SAL', 90],
    ['EMB-5L', 2000],
  ];

  for (const [sku, qty] of balances) {
    const product = mp[sku];
    if (!product) continue;
    await prisma.stockBalance.upsert({
      where: { productId_warehouseId: { productId: product.id, warehouseId: whRaw.id } },
      update: { quantity: qty },
      create: { productId: product.id, warehouseId: whRaw.id, quantity: qty },
    });
  }

  console.log('✅ Seed completo.');
  console.log(`   → ${rawMaterials.length} MPs, ${pas.length} PAs, 5 BOMs, 13 saldos`);
  console.log('   → MP-ESSFLO-A em déficit proposital (3 KG vs mínimo 20 KG)');
}

// ---------- helpers ----------

async function upsertProduct(
  sku: string,
  name: string,
  type: ProductType,
  unit: UnitOfMeasure,
  extra: { unitCost?: number; basePrice?: number; minStock?: number } = {},
) {
  return prisma.product.upsert({
    where: { sku },
    update: {},
    create: {
      sku,
      name,
      type,
      unit,
      unitCost: extra.unitCost,
      basePrice: extra.basePrice,
      minStock: extra.minStock ?? 0,
    },
  });
}

type BomEntry = {
  sku: string;
  qty: number;
  substitutes?: Array<{ sku: string; factor: number; score: number }>;
};

async function createBom(
  productId: string,
  entries: BomEntry[],
  mp: Record<string, { id: string; sku: string }>,
) {
  // checa se já existe a fórmula ativa
  const existing = await prisma.bomFormula.findFirst({
    where: { productId, isActive: true },
  });
  if (existing) return existing;

  const formula = await prisma.bomFormula.create({
    data: {
      productId,
      version: '1.0',
      baseYieldQty: 1, // rende 1 unidade (1 bombona 5L)
      isActive: true,
    },
  });

  for (const entry of entries) {
    const raw = mp[entry.sku];
    if (!raw) throw new Error(`MP ${entry.sku} não encontrada no seed`);

    const item = await prisma.bomItem.create({
      data: {
        bomId: formula.id,
        rawMaterialId: raw.id,
        requiredQty: entry.qty,
      },
    });

    if (entry.substitutes) {
      for (const sub of entry.substitutes) {
        const subRaw = mp[sub.sku];
        if (!subRaw) continue;
        await prisma.bomSubstitution.create({
          data: {
            bomItemId: item.id,
            substituteMaterialId: subRaw.id,
            conversionFactor: sub.factor,
            aiPreferenceScore: sub.score,
          },
        });
      }
    }
  }

  return formula;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
