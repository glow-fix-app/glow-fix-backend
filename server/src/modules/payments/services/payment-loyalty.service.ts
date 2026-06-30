import { Injectable, Logger } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { LoyaltyConfig } from '@prisma/client';

@Injectable()
export class PaymentLoyaltyService {
  private readonly logger = new Logger(PaymentLoyaltyService.name);

  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async getPointsBalance(clientId: string): Promise<number> {
    return this.paymentsRepository.getClientPointsBalance(clientId);
  }

  async calculateRedemption(
    totalAmount: number,
    pointsToRedeem: number | undefined,
    pointsBalance: number,
    config: LoyaltyConfig | null,
  ): Promise<{ eligible: boolean; discountAmount: number; pointsUsed: number }> {
    if (!config || !config.isActive) {
      return { eligible: false, discountAmount: 0, pointsUsed: 0 };
    }

    const maxDiscountPercent = config.maxRedeemPct;
    const maxDiscountAmount = (totalAmount * maxDiscountPercent) / 100;
    const pointsPerEGP = 1 / Number(config.egpPerPoint);
    const maxPointsForDiscount = Math.floor(maxDiscountAmount * pointsPerEGP);

    let pointsToUse = pointsToRedeem || Math.min(pointsBalance, maxPointsForDiscount);
    pointsToUse = Math.min(pointsToUse, pointsBalance, maxPointsForDiscount);

    if (pointsToUse < 100) {
      return { eligible: false, discountAmount: 0, pointsUsed: 0 };
    }

    const discountAmount = pointsToUse * Number(config.egpPerPoint);

    return {
      eligible: true,
      discountAmount,
      pointsUsed: pointsToUse,
    };
  }

  async recordPointsRedemption(
    clientId: string,
    bookingId: string,
    pointsUsed: number,
    loyaltyDiscount: number,
  ): Promise<void> {
    if (pointsUsed <= 0) return;

    await this.paymentsRepository.createLoyaltyTransaction({
      clientId,
      bookingId,
      type: 'REDEEMED',
      points: -pointsUsed,
      reason: `Redeemed ${pointsUsed} points for EGP ${loyaltyDiscount.toFixed(2)} discount`,
    });
  }

  getSuccessMessage(pointsUsed: number, pointsEarned: number, discountAmount: number): string {
    if (pointsUsed > 0 && pointsEarned > 0) {
      return `Payment successful! You redeemed ${pointsUsed} points (saved EGP ${discountAmount.toFixed(2)}) and earned ${pointsEarned} new points!`;
    } else if (pointsUsed > 0) {
      return `Payment successful! You redeemed ${pointsUsed} points and saved EGP ${discountAmount.toFixed(2)}!`;
    } else if (pointsEarned > 0) {
      return `Payment successful! You earned ${pointsEarned} loyalty points!`;
    }
    return 'Payment processed successfully!';
  }
}
