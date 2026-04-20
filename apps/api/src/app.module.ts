import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { ProductsModule } from './products/products.module';
import { BomModule } from './bom/bom.module';
import { MrpModule } from './mrp/mrp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    PrismaModule,
    ProductsModule,
    BomModule,
    MrpModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
