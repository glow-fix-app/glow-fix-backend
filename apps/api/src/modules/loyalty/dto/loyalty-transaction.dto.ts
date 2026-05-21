// modules/loyalty/dto/loyalty-transaction.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyTransactionResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  client_id: string;
  @ApiPropertyOptional()
  booking_id?: string;
  @ApiProperty({ enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'ADJUSTED'] })
  type: string;
  @ApiProperty()
  points: number;
  @ApiProperty()
  balance_after: number;
  @ApiProperty()
  reason: string;
  @ApiProperty()
  created_at: Date;
}

export class LoyaltySummaryResponseDto {
  @ApiProperty()
  total_points: number;
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
}

export class LoyaltyLeaderboardEntryDto {
  @ApiProperty()
  rank: number;
  @ApiProperty()
  client_id: string;
  @ApiProperty()
  client_name: string;
  @ApiProperty()
  total_points: number;
  @ApiProperty()
  avatar_url?: string;
}