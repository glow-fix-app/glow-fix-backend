import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyTransactionEntity {
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
  reason: string;

  @ApiProperty()
  created_at: Date;
}

export class LoyaltyTransactionWithDetailsEntity extends LoyaltyTransactionEntity {
  @ApiPropertyOptional()
  booking_code?: string;

  @ApiPropertyOptional()
  business_name?: string;

  @ApiPropertyOptional()
  balance_after?: number;
}

export class LoyaltySummaryEntity {
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

export class QuickRedeemOptionEntity {
  @ApiProperty()
  points: number;

  @ApiProperty()
  value_egp: number;

  @ApiProperty()
  description: string;
}