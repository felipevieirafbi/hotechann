import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BomService {
  constructor(private readonly prisma: PrismaService) {}

  listActiveByProduct(productId: string) {
    return this.prisma.bomFormula.findMany({
      where: { productId, isActive: true },
      include: {
        items: {
          include: {
            rawMaterial: true,
            substitutions: { include: { substituteMaterial: true } },
          },
        },
      },
      orderBy: { version: 'desc' },
    });
  }

  async findById(id: string) {
    const bom = await this.prisma.bomFormula.findUnique({
      where: { id },
      include: {
        product: true,
        items: {
          include: {
            rawMaterial: true,
            substitutions: { include: { substituteMaterial: true } },
          },
        },
      },
    });
    if (!bom) throw new NotFoundException(`BOM ${id} não encontrada`);
    return bom;
  }
}
