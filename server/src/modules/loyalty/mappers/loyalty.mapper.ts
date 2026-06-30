import { Injectable } from '@nestjs/common';
import { LoyaltyConfigResponseDto } from '../dto/response/loyalty-config-response.dto';
import { LoyaltySummaryResponseDto } from '../dto/response/loyalty-summary-response.dto';
import { LoyaltyTransactionResponseDto } from '../dto/response/loyalty-transaction-response.dto';

@Injectable()
export class LoyaltyMapper {

  toConfigResponse(config: any): LoyaltyConfigResponseDto {
    return {
      id: config.id,
      points_per_100_egp: config.pointsPer100Egp,
      egp_per_point: Number(config.egpPerPoint),
      max_redeem_pct: config.maxRedeemPct,
      min_points_to_redeem: 100,
      points_expiry_days: undefined,
      is_active: config.isActive,
      created_at: config.createdAt,
      updated_at: config.updatedAt,
    };
  }

  toTransactionResponse(t: any): LoyaltyTransactionResponseDto {
    return {
      id: t.id,
      client_id: t.clientId,
      booking_id: t.bookingId || undefined,
      type: t.type,
      points: t.points,
      balance_after: t.balance_after,
      reason: t.reason,
      business_name: t.booking?.business?.businessName,
      created_at: t.createdAt,
    };
  }

  toSummaryResponse(data: {
    pointsBalance: number,
    pointsValueEgp: number,
    pointsEarnedLifetime: number,
    pointsRedeemedLifetime: number,
    pointsExpiringSoon: number,
    nextTier?: string,
    pointsToNextTier?: number,
    currentTierName: string,
    currentTierDiscount: number,
  }): LoyaltySummaryResponseDto {
    return {
      points_balance: data.pointsBalance,
      points_value_egp: Math.round(data.pointsValueEgp * 100) / 100,
      points_earned_lifetime: data.pointsEarnedLifetime,
      points_redeemed_lifetime: data.pointsRedeemedLifetime,
      points_expiring_soon: data.pointsExpiringSoon,
      next_tier: data.nextTier,
      points_to_next_tier: data.pointsToNextTier,
      tier_name: data.currentTierName,
      tier_discount: data.currentTierDiscount,
    };
  }
}
