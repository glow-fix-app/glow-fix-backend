import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  client_id: string;

  @ApiPropertyOptional()
  booking_id?: string;

  @ApiProperty({ enum: ['EARNED', 'REDEEMED'] })
  type: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  balance_after: number;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  booking_code?: string;

  @ApiPropertyOptional()
  business_name?: string;

  @ApiProperty()
  created_at: Date;
}

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