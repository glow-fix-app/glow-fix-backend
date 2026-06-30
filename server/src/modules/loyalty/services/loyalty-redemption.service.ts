import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoyaltyRepository } from '../repositories/loyalty.repository';
import { LoyaltyConfigService } from './loyalty-config.service';
import { LoyaltyNotificationService } from './loyalty-notification.service';
import { RedemptionCalculationResponseDto, RedemptionResultDto, QuickRedeemResponseDto } from '../dto/response/redemption-response.dto';
import {
  BookingNotFoundException,
  BookingOwnershipException,
  InvalidBookingStatusException,
  PointsAlreadyRedeemedException,
  InsufficientPointsException,
  MinimumPointsException,
} from '../exceptions/loyalty.exceptions';
import { DEFAULT_QUICK_REDEEM_OPTIONS, LOYALTY_EVENTS } from '../constants/loyalty.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyRedemptionService {
  private readonly logger = new Logger(LoyaltyRedemptionService.name);

  constructor(
    private readonly repository: LoyaltyRepository,
    private readonly configService: LoyaltyConfigService,
    private readonly notificationService: LoyaltyNotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async calculateRedemption(
    clientId: string,
    totalAmount: number,
    pointsToRedeem?: number,
  ): Promise<RedemptionCalculationResponseDto> {
    const config = await this.configService.getConfig();
    const pointsBalance = await this.repository.aggregatePoints(clientId);

    if (!config.is_active) {
      return {
        eligible: false,
        points_available: pointsBalance,
        max_points_to_redeem: 0,
        max_discount_amount: 0,
        message: 'Loyalty program is currently inactive',
      };
    }

    if (pointsBalance < config.min_points_to_redeem) {
      return {
        eligible: false,
        points_available: pointsBalance,
        max_points_to_redeem: 0,
        max_discount_amount: 0,
        message: `Minimum ${config.min_points_to_redeem} points required for redemption`,
      };
    }

    const maxDiscountAmount = (totalAmount * config.max_redeem_pct) / 100;
    const maxPointsForDiscount = Math.floor(maxDiscountAmount / config.egp_per_point);
    const maxPointsToRedeem = Math.min(pointsBalance, maxPointsForDiscount);

    let pointsToUse = pointsToRedeem || maxPointsToRedeem;
    pointsToUse = Math.min(pointsToUse, maxPointsToRedeem);

    if (pointsToUse < config.min_points_to_redeem && pointsToRedeem) {
      return {
        eligible: false,
        points_available: pointsBalance,
        max_points_to_redeem: maxPointsToRedeem,
        max_discount_amount: maxDiscountAmount,
        message: `Minimum ${config.min_points_to_redeem} points required. You have ${pointsBalance} points.`,
      };
    }

    const discountAmount = pointsToUse * config.egp_per_point;

    return {
      eligible: true,
      points_available: pointsBalance,
      max_points_to_redeem: maxPointsToRedeem,
      max_discount_amount: maxDiscountAmount,
      suggested_points: pointsToUse,
      discount_amount: discountAmount,
      remaining_points: pointsBalance - pointsToUse,
    };
  }

  async redeemPointsForBooking(
    clientId: string,
    bookingId: string,
    pointsToRedeem?: number,
  ): Promise<RedemptionResultDto> {
    const booking = await this.repository.findBookingWithClient(bookingId);

    if (!booking) {
      throw new BookingNotFoundException();
    }

    if (booking.vehicle.client.userId !== clientId) {
      throw new BookingOwnershipException();
    }

    const bookingStatus = await this.repository.findBookingStatus(bookingId);
    const status = bookingStatus?.status?.context || 'PENDING';
    
    if (status !== 'PENDING' && status !== 'CONFIRMED') {
      throw new InvalidBookingStatusException();
    }

    const existingRedemption = await this.repository.findTransactionForBooking(bookingId, 'REDEEMED');
    if (existingRedemption) {
      throw new PointsAlreadyRedeemedException();
    }

    const calculation = await this.calculateRedemption(
      clientId,
      Number(booking.totalPrice) / 100,
      pointsToRedeem,
    );

    if (!calculation.eligible || !calculation.discount_amount || !calculation.suggested_points) {
      throw new InsufficientPointsException(calculation.message || 'Not enough points for redemption');
    }

    const pointsBalance = await this.repository.aggregatePoints(clientId);
    const discountInCents = Math.floor(calculation.discount_amount * 100);

    await this.repository.createTransaction({
      clientId,
      bookingId,
      type: 'REDEEMED',
      points: -calculation.suggested_points,
      reason: `Redeemed ${calculation.suggested_points} points for EGP ${calculation.discount_amount.toFixed(2)} discount`,
    } as Prisma.LoyaltyTransactionUncheckedCreateInput);

    await this.repository.updateBookingDiscount(bookingId, discountInCents);

    this.logger.log(`Redeemed ${calculation.suggested_points} points for client ${clientId} on booking ${bookingId}`);

    await this.notificationService.notifyPointsRedeemed(clientId, calculation.suggested_points, calculation.discount_amount);

    this.eventEmitter.emit(LOYALTY_EVENTS.POINTS_REDEEMED, {
      clientId,
      bookingId,
      points: calculation.suggested_points,
      discount: calculation.discount_amount,
    });

    return {
      success: true,
      points_used: calculation.suggested_points,
      discount_amount: calculation.discount_amount,
      remaining_points: pointsBalance - calculation.suggested_points,
      message: `Successfully redeemed ${calculation.suggested_points} points for EGP ${calculation.discount_amount.toFixed(2)} discount!`,
    };
  }

  async quickRedeem(
    clientId: string,
    pointsToRedeem: number,
  ): Promise<RedemptionResultDto> {
    const config = await this.configService.getConfig();
    const pointsBalance = await this.repository.aggregatePoints(clientId);

    if (pointsToRedeem < config.min_points_to_redeem) {
      throw new MinimumPointsException();
    }

    if (pointsToRedeem > pointsBalance) {
      throw new InsufficientPointsException(`Insufficient points. You have ${pointsBalance} points.`);
    }

    const discountAmount = pointsToRedeem * config.egp_per_point;
    const couponCode = `SAVE${discountAmount}_${Date.now()}_${clientId.slice(0, 6)}`;

    await this.repository.createTransaction({
      clientId,
      type: 'REDEEMED',
      points: -pointsToRedeem,
      reason: `Redeemed ${pointsToRedeem} points for EGP ${discountAmount.toFixed(2)} off coupon (${couponCode})`,
      bookingId: null,
    } as Prisma.LoyaltyTransactionUncheckedCreateInput);

    this.logger.log(`Redeemed ${pointsToRedeem} points for coupon ${couponCode} for client ${clientId}`);

    await this.notificationService.notifyCouponGenerated(clientId, pointsToRedeem, couponCode, discountAmount);

    return {
      success: true,
      points_used: pointsToRedeem,
      discount_amount: discountAmount,
      remaining_points: pointsBalance - pointsToRedeem,
      coupon_code: couponCode,
      message: `Successfully redeemed ${pointsToRedeem} points for EGP ${discountAmount.toFixed(2)} off!`,
    };
  }

  async getQuickRedeemOptions(): Promise<QuickRedeemResponseDto> {
    const config = await this.configService.getConfig();

    const options = DEFAULT_QUICK_REDEEM_OPTIONS.map(points => ({
      points,
      value_egp: points * config.egp_per_point,
      description: `EGP ${points * config.egp_per_point} off`,
    }));

    return { options };
  }
}
