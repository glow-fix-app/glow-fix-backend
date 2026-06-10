import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRecommendedRepairDto {
  @ApiProperty({ description: 'Business service ID from the business catalog' })
  @IsNotEmpty()
  @IsUUID()
  businessServiceId: string;
}
