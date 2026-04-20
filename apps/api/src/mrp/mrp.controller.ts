import { Controller, Get, Query } from '@nestjs/common';
import { MrpService } from './mrp.service';
import { MrpRequirementsDto } from './dto/mrp-requirements.dto';

@Controller('mrp')
export class MrpController {
  constructor(private readonly mrp: MrpService) {}

  // GET /api/mrp/requirements?productId=UUID&quantity=100
  @Get('requirements')
  requirements(@Query() dto: MrpRequirementsDto) {
    return this.mrp.calculateRequirements(dto.productId, dto.quantity);
  }
}
