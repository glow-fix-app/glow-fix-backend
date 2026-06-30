import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class QuickRedeemOptionDto {
  @ApiProperty()
  points: number;

  @ApiProperty()
  value_egp: number;

  @ApiProperty()
  description: string;
}

export class QuickRedeemResponseDto {
  @ApiProperty({ type: [QuickRedeemOptionDto] })
  options: QuickRedeemOptionDto[];
}
