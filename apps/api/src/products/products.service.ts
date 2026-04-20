import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductType } from '@hotechann/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  list(type?: ProductType) {
    return this.prisma.product.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        fispqs: { where: { active: true }, orderBy: { effectiveAt: 'desc' } },
      },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
