import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateRedemptionDto {
  @ApiProperty({ description: 'Booking total amount in EGP', example: 320 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  total_amount: number;

  @ApiPropertyOptional({ description: 'Points to redeem (optional)', example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  points_to_redeem?: number;
}
