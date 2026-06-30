import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RedeemPointsDto {
  @ApiPropertyOptional({ description: 'Booking ID to apply redemption (for direct discount)' })
  @IsOptional()
  @IsUUID()
  booking_id?: string;

  @ApiPropertyOptional({ description: 'Points to redeem (default: all eligible)', example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  points?: number;
}
