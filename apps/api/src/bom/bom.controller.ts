import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { BomService } from './bom.service';

@Controller('bom')
export class BomController {
  constructor(private readonly bom: BomService) {}

  // GET /bom?productId=xxx  → lista fórmulas ativas do produto
  @Get()
  async listByProduct(@Query('productId') productId: string) {
    if (!productId) throw new NotFoundException('productId é obrigatório');
    return this.bom.listActiveByProduct(productId);
  }

  // GET /bom/:id  → fórmula com itens e substituições
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.bom.findById(id);
  }
}
