import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsInt, Min, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  message?: string;
}