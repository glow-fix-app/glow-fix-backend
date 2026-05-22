// modules/loyalty/dto/redeem-points.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class RedeemPointsDto {
  @ApiPropertyOptional({ description: 'Booking ID to apply redemption' })
  @IsOptional()
  @IsUUID()
  booking_id?: string;

  @ApiPropertyOptional({ description: 'Points to redeem (default: all eligible)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @ApiPropertyOptional({ description: 'Redeem for coupon code instead of direct discount' })
  @IsOptional()
  @IsString()
  coupon_code?: string;
}

export class RedemptionResultDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  points_used: number;
  @ApiProperty()
  discount_amount: number;
  @ApiProperty()
  remaining_points: number;
  @ApiPropertyOptional()
  coupon_code?: string;
  @ApiPropertyOptional()
  message?: string;
}

export class CalculateRedemptionDto {
  @ApiProperty({ description: 'Booking total amount in EGP' })
  @IsInt()
  @Min(0)
  total_amount: number;

  @ApiPropertyOptional({ description: 'Points to redeem (optional)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  points_to_redeem?: number;
}

export class RedemptionCalculationResponseDto {
  @ApiProperty()
  eligible: boolean;
  @ApiProperty()
  points_available: number;
  @ApiProperty()
  max_points_to_redeem: number;
  @ApiProperty()
  max_discount_amount: number;
  @ApiPropertyOptional()
  suggested_points?: number;
  @ApiPropertyOptional()
  discount_amount?: number;
  @ApiPropertyOptional()
  remaining_points?: number;
}