import { Module } from '@nestjs/common';
import { MrpController } from './mrp.controller';
import { MrpService } from './mrp.service';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [MrpController],
  providers: [MrpService, GeminiService],
  exports: [MrpService],
})
export class MrpModule {}
