import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductType } from '@hotechann/database';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query('type') type?: ProductType) {
    return this.products.list(type);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.products.findById(id);
  }
}
