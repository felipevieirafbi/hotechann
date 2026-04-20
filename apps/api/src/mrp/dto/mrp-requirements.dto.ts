import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class MrpRequirementsDto {
  @IsUUID()
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity!: number;
}
