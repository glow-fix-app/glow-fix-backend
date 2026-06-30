import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltySummaryResponseDto {
  @ApiProperty()
  points_balance: number;

  @ApiProperty()
  points_value_egp: number;

  @ApiProperty()
  points_earned_lifetime: number;

  @ApiProperty()
  points_redeemed_lifetime: number;

  @ApiProperty()
  points_expiring_soon: number;

  @ApiPropertyOptional()
  next_tier?: string;

  @ApiPropertyOptional()
  points_to_next_tier?: number;

  @ApiPropertyOptional()
  tier_name?: string;

  @ApiPropertyOptional()
  tier_discount?: number;
}
