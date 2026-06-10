import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications/notifications.service';
import {
  UpdateLoyaltyConfigDto,
  LoyaltyConfigResponseDto,
} from './dto/loyalty-config.dto';
import {
  RedeemPointsDto,
  RedemptionResultDto,
  CalculateRedemptionDto,
  RedemptionCalculationResponseDto,
} from './dto/redeem-points.dto';
import {
  LoyaltySummaryResponseDto,
  LoyaltyTransactionResponseDto,
  QuickRedeemResponseDto,
} from './dto/loyalty-transaction.dto';

interface LoyaltyConfig {
  id: string;
  points_per_100_egp: number;
  egp_per_point: number;
  max_redeem_pct: number;
  min_points_to_redeem: number;
  points_expiry_days: number | null;
  is_active: boolean;
}

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);
  private cachedConfig: LoyaltyConfig | null = null;
  private configCacheTime: Date | null = null;
  private readonly CONFIG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ==================== CONFIGURATION ====================

  /**
   * Get current loyalty configuration (cached)
   */
  async getConfig(): Promise<LoyaltyConfig> {
    // Check cache
    if (
      this.cachedConfig &&
      this.configCacheTime &&
      Date.now() - this.configCacheTime.getTime() < this.CONFIG_CACHE_TTL_MS
    ) {
      return this.cachedConfig;
    }

    // Fetch from database
    let config = await this.prisma.loyaltyConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      // Create default config if none exists
      config = await this.prisma.loyaltyConfig.create({
        data: {
          pointsPer100Egp: 100,
          egpPerPoint: 0.1,
          maxRedeemPct: 50,
          isActive: true,
        },
      });
    }

    this.cachedConfig = {
      id: config.id,
      points_per_100_egp: config.pointsPer100Egp,
      egp_per_point: Number(config.egpPerPoint),
      max_redeem_pct: config.maxRedeemPct,
      min_points_to_redeem: 100, // Default, would come from config table
      points_expiry_days: null,
      is_active: config.isActive,
    };
    this.configCacheTime = new Date();

    return this.cachedConfig;
  }

  /**
   * Update loyalty configuration (admin only)
   */
  async updateConfig(
    adminId: string,
    dto: UpdateLoyaltyConfigDto,
  ): Promise<LoyaltyConfigResponseDto> {
    const config = await this.prisma.loyaltyConfig.findFirst();

    if (!config) {
      const newConfig = await this.prisma.loyaltyConfig.create({
        data: {
          pointsPer100Egp: dto.points_per_100_egp ?? 100,
          egpPerPoint: dto.egp_per_point ?? 0.1,
          maxRedeemPct: dto.max_redeem_pct ?? 50,
          isActive: dto.is_active ?? true,
        },
      });

      this.cachedConfig = null;
      this.logger.log(`Loyalty config created by admin ${adminId}`);

      return this.formatConfigResponse(newConfig);
    }

    const updated = await this.prisma.loyaltyConfig.update({
      where: { id: config.id },
      data: {
        pointsPer100Egp: dto.points_per_100_egp,
        egpPerPoint: dto.egp_per_point,
        maxRedeemPct: dto.max_redeem_pct,
        isActive: dto.is_active,
      },
    });

    this.cachedConfig = null; // Invalidate cache
    this.logger.log(`Loyalty config updated by admin ${adminId}`);

    return this.formatConfigResponse(updated);
  }

  // ==================== POINTS EARNING ====================

  /**
   * Award points to a client for a completed booking
   */
  async awardPoints(
    clientId: string,
    bookingId: string,
    amount: number,
  ): Promise<number> {
    const config = await this.getConfig();

    if (!config.is_active) {
      return 0;
    }

    // Calculate points: (amount / 100) * points_per_100_egp
    const pointsEarned = Math.floor((amount / 100) * config.points_per_100_egp);

    if (pointsEarned <= 0) {
      return 0;
    }

    // Check if points already awarded for this booking
    const existingTransaction = await this.prisma.loyaltyTransaction.findFirst({
      where: {
        bookingId,
        type: 'EARNED',
      },
    });

    if (existingTransaction) {
      this.logger.warn(`Points already awarded for booking ${bookingId}`);
      return existingTransaction.points;
    }

    // Create transaction
    await this.prisma.loyaltyTransaction.create({
      data: {
        clientId,
        bookingId,
        type: 'EARNED',
        points: pointsEarned,
        reason: `Earned ${pointsEarned} points from booking (${amount} EGP)`,
      },
    });

    this.logger.log(
      `Awarded ${pointsEarned} points to client ${clientId} for booking ${bookingId}`,
    );

    // Send notification
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_EARNED',
      title: 'Loyalty Points Earned! 🎉',
      body: `You earned ${pointsEarned} points from your recent booking. Keep earning!`,
    });

    this.eventEmitter.emit('loyalty.points_earned', {
      clientId,
      bookingId,
      points: pointsEarned,
      amount,
    });

    return pointsEarned;
  }

  /**
   * Award signup bonus points to new client
   */
  async awardSignupBonus(clientId: string): Promise<number> {
    const signupBonus = 500; // 500 points for new users

    const existingBonus = await this.prisma.loyaltyTransaction.findFirst({
      where: {
        clientId,
        reason: { contains: 'Signup bonus' },
      },
    });

    if (existingBonus) {
      return 0;
    }

    await this.prisma.loyaltyTransaction.create({
      data: {
        clientId,
        type: 'EARNED',
        points: signupBonus,
        reason: 'Signup bonus - welcome to Glow Fix!',
        bookingId: null,
      } as Prisma.LoyaltyTransactionUncheckedCreateInput,
    });

    this.logger.log(
      `Awarded signup bonus of ${signupBonus} points to client ${clientId}`,
    );

    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_EARNED',
      title: 'Welcome Bonus! 🎁',
      body: `You received ${signupBonus} bonus points for joining Glow Fix!`,
    });

    return signupBonus;
  }

  // ==================== POINTS REDEMPTION ====================

  /**
   * Calculate potential redemption for a booking
   */
  async calculateRedemption(
    clientId: string,
    totalAmount: number,
    pointsToRedeem?: number,
  ): Promise<RedemptionCalculationResponseDto> {
    const config = await this.getConfig();
    const pointsBalance = await this.getClientPointsBalance(clientId);

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
    const maxPointsForDiscount = Math.floor(
      maxDiscountAmount / config.egp_per_point,
    );
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

  /**
   * Redeem points for a booking discount
   */
  async redeemPointsForBooking(
    clientId: string,
    bookingId: string,
    pointsToRedeem?: number,
  ): Promise<RedemptionResultDto> {
    const config = await this.getConfig();

    // Get booking details
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: { client: { include: { user: true } } },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.vehicle.client.userId !== clientId) {
      throw new ForbiddenException('You do not own this booking');
    }

    // Check booking status (can only redeem for pending or confirmed bookings)
    const bookingStatus = await this.prisma.bookingStatus.findFirst({
      where: { bookingId },
      include: { status: true },
      orderBy: { createdAt: 'desc' },
    });

    const status = bookingStatus?.status?.name || 'PENDING';
    if (status !== 'PENDING' && status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Points can only be redeemed for pending or confirmed bookings',
      );
    }

    // Check if points already redeemed for this booking
    const existingRedemption = await this.prisma.loyaltyTransaction.findFirst({
      where: {
        bookingId,
        type: 'REDEEMED',
      },
    });

    if (existingRedemption) {
      throw new BadRequestException('Points already redeemed for this booking');
    }

    // Calculate redemption
    const calculation = await this.calculateRedemption(
      clientId,
      Number(booking.totalPrice) / 100,
      pointsToRedeem,
    );

    if (
      !calculation.eligible ||
      !calculation.discount_amount ||
      !calculation.suggested_points
    ) {
      throw new BadRequestException(
        calculation.message || 'Not enough points for redemption',
      );
    }

    const pointsBalance = await this.getClientPointsBalance(clientId);
    const discountInCents = Math.floor(calculation.discount_amount * 100);

    // Create redemption transaction
    await this.prisma.loyaltyTransaction.create({
      data: {
        clientId,
        bookingId,
        type: 'REDEEMED',
        points: -calculation.suggested_points,
        reason: `Redeemed ${calculation.suggested_points} points for EGP ${calculation.discount_amount.toFixed(2)} discount`,
      },
    });

    // Update booking with discount
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        discount: {
          increment: discountInCents,
        },
        totalPrice: {
          decrement: discountInCents,
        },
      },
    });

    this.logger.log(
      `Redeemed ${calculation.suggested_points} points for client ${clientId} on booking ${bookingId}`,
    );

    // Send notification
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_REDEEMED',
      title: 'Points Redeemed! 💰',
      body: `You redeemed ${calculation.suggested_points} points and saved EGP ${calculation.discount_amount.toFixed(2)} on your booking.`,
    });

    this.eventEmitter.emit('loyalty.points_redeemed', {
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

  /**
   * Quick redeem for coupon (as shown in UI: Redeem 100 pts → EGP 10)
   */
  async quickRedeem(
    clientId: string,
    pointsToRedeem: number,
  ): Promise<RedemptionResultDto> {
    const config = await this.getConfig();
    const pointsBalance = await this.getClientPointsBalance(clientId);

    // Validate points
    if (pointsToRedeem < config.min_points_to_redeem) {
      throw new BadRequestException(
        `Minimum ${config.min_points_to_redeem} points required for redemption`,
      );
    }

    if (pointsToRedeem > pointsBalance) {
      throw new BadRequestException(
        `Insufficient points. You have ${pointsBalance} points.`,
      );
    }

    const discountAmount = pointsToRedeem * config.egp_per_point;
    const couponCode = `SAVE${discountAmount}_${Date.now()}_${clientId.slice(0, 6)}`;

    // Create redemption transaction
    await this.prisma.loyaltyTransaction.create({
      data: {
        clientId,
        type: 'REDEEMED',
        points: -pointsToRedeem,
        reason: `Redeemed ${pointsToRedeem} points for EGP ${discountAmount.toFixed(2)} off coupon (${couponCode})`,
        bookingId: null,
      } as Prisma.LoyaltyTransactionUncheckedCreateInput,
    });

    this.logger.log(
      `Redeemed ${pointsToRedeem} points for coupon ${couponCode} for client ${clientId}`,
    );

    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_REDEEMED',
      title: 'Coupon Generated! 🎫',
      body: `You redeemed ${pointsToRedeem} points for EGP ${discountAmount.toFixed(2)} off coupon. Code: ${couponCode}`,
    });

    return {
      success: true,
      points_used: pointsToRedeem,
      discount_amount: discountAmount,
      remaining_points: pointsBalance - pointsToRedeem,
      coupon_code: couponCode,
      message: `Successfully redeemed ${pointsToRedeem} points for EGP ${discountAmount.toFixed(2)} off!`,
    };
  }

  // ==================== POINTS BALANCE & HISTORY ====================

  /**
   * Get client's points balance
   */
  async getClientPointsBalance(clientId: string): Promise<number> {
    // Calculate from transactions
    const result = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId },
      _sum: { points: true },
    });

    return result._sum?.points || 0;
  }

  /**
   * Get client's loyalty summary (for UI display)
   */
  async getClientSummary(clientId: string): Promise<LoyaltySummaryResponseDto> {
    const config = await this.getConfig();
    const pointsBalance = await this.getClientPointsBalance(clientId);

    // Get lifetime stats
    const earnedResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId, type: 'EARNED' },
      _sum: { points: true },
    });

    const redeemedResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId, type: 'REDEEMED' },
      _sum: { points: true },
    });

    const pointsEarnedLifetime = earnedResult._sum?.points || 0;
    const pointsRedeemedLifetime = Math.abs(redeemedResult._sum?.points || 0);
    const pointsValueEgp = pointsBalance * Number(config.egp_per_point);

    // Check for expiring points
    let pointsExpiringSoon = 0;
    if (config.points_expiry_days) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - config.points_expiry_days);

      const oldTransactions = await this.prisma.loyaltyTransaction.findMany({
        where: {
          clientId,
          type: 'EARNED',
          createdAt: { lt: expiryDate },
        },
      });

      const oldPointsSum = oldTransactions.reduce(
        (sum, t) => sum + t.points,
        0,
      );
      pointsExpiringSoon = Math.max(0, oldPointsSum - pointsRedeemedLifetime);
    }

    // Tier calculation
    const tiers = [
      { name: 'Bronze', minPoints: 0, discount: 0 },
      { name: 'Silver', minPoints: 1000, discount: 5 },
      { name: 'Gold', minPoints: 5000, discount: 10 },
      { name: 'Platinum', minPoints: 10000, discount: 15 },
    ];

    let currentTier = tiers[0];
    let nextTier: string | undefined;
    let pointsToNextTier: number | undefined;

    for (let i = 0; i < tiers.length; i++) {
      if (pointsBalance >= tiers[i].minPoints) {
        currentTier = tiers[i];
      }
    }

    const nextTierIndex =
      tiers.findIndex((t) => t.name === currentTier.name) + 1;
    if (nextTierIndex < tiers.length) {
      nextTier = tiers[nextTierIndex].name;
      pointsToNextTier = tiers[nextTierIndex].minPoints - pointsBalance;
    }

    return {
      points_balance: pointsBalance,
      points_value_egp: Math.round(pointsValueEgp * 100) / 100,
      points_earned_lifetime: pointsEarnedLifetime,
      points_redeemed_lifetime: pointsRedeemedLifetime,
      points_expiring_soon: pointsExpiringSoon,
      next_tier: nextTier,
      points_to_next_tier: pointsToNextTier,
      tier_name: currentTier.name,
      tier_discount: currentTier.discount,
    };
  }

  /**
   * Get quick redeem options (for UI)
   */
  async getQuickRedeemOptions(): Promise<QuickRedeemResponseDto> {
    const config = await this.getConfig();

    const options = [
      {
        points: 100,
        value_egp: 100 * config.egp_per_point,
        description: 'EGP 10 off',
      },
      {
        points: 250,
        value_egp: 250 * config.egp_per_point,
        description: 'EGP 25 off',
      },
      {
        points: 500,
        value_egp: 500 * config.egp_per_point,
        description: 'EGP 50 off',
      },
      {
        points: 1000,
        value_egp: 1000 * config.egp_per_point,
        description: 'EGP 100 off',
      },
    ];

    return { options };
  }

  /**
   * Get loyalty transaction history
   */
  async getTransactionHistory(
    clientId: string,
    page: number = 1,
    limit: number = 20,
    type?: string,
  ): Promise<{
    data: LoyaltyTransactionResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 50));

    const skip = (safePage - 1) * safeLimit;
    const take = Math.min(safeLimit, 50);

    const where: any = { clientId };
    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.loyaltyTransaction.findMany({
        where,
        include: {
          booking: {
            select: {
              business: { select: { businessName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.loyaltyTransaction.count({ where }),
    ]);

    // Calculate running balance
    let runningBalance = await this.getClientPointsBalance(clientId);
    const transactionsWithBalance = [...transactions]
      .reverse()
      .map((t, idx, arr) => {
        if (idx === 0) {
          return { ...t, balance_after: runningBalance };
        }
        const prevPoints = arr[idx - 1]?.points || 0;
        runningBalance = runningBalance - prevPoints;
        return { ...t, balance_after: runningBalance };
      })
      .reverse();

    return {
      data: transactionsWithBalance.map((t) => ({
        id: t.id,
        client_id: t.clientId,
        booking_id: t.bookingId || undefined,
        type: t.type,
        points: t.points,
        balance_after: t.balance_after,
        reason: t.reason,
        business_name: t.booking?.business?.businessName,
        created_at: t.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get leaderboard (top points earners)
   */
  async getLeaderboard(limit: number = 50): Promise<
    Array<{
      rank: number;
      client_id: string;
      client_name: string;
      total_points: number;
      avatar_url?: string;
    }>
  > {
    const results = await this.prisma.$queryRaw<Array<any>>`
      SELECT 
        lt.client_id,
        SUM(lt.points) as total_points,
        u.full_name as client_name,
        u.avatar_url
      FROM loyalty_transactions lt
      JOIN clients c ON lt.client_id = c.id
      JOIN users u ON c.user_id = u.id
      GROUP BY lt.client_id, u.full_name, u.avatar_url
      HAVING SUM(lt.points) > 0
      ORDER BY total_points DESC
      LIMIT ${limit}
    `;

    return results.map((entry, index) => ({
      rank: index + 1,
      client_id: entry.client_id,
      client_name: entry.client_name,
      total_points: Number(entry.total_points),
      avatar_url: entry.avatar_url || undefined,
    }));
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Manually adjust points (admin only)
   */
  async adjustPoints(
    adminId: string,
    clientId: string,
    points: number,
    reason: string,
  ): Promise<{ success: boolean; new_balance: number; message: string }> {
    const currentBalance = await this.getClientPointsBalance(clientId);
    const newBalance = currentBalance + points;

    await this.prisma.loyaltyTransaction.create({
      data: {
        clientId,
        type: points > 0 ? 'EARNED' : 'REDEEMED',
        points: points,
        reason: `Manual adjustment by admin: ${reason}`,
        bookingId: null,
      } as Prisma.LoyaltyTransactionUncheckedCreateInput,
    });

    this.logger.log(
      `Admin ${adminId} adjusted ${points} points for client ${clientId}: ${reason}`,
    );

    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'SYSTEM_MESSAGE',
      title: points > 0 ? 'Points Added ✨' : 'Points Deducted 📉',
      body:
        points > 0
          ? `${points} points have been added to your account. Reason: ${reason}`
          : `${Math.abs(points)} points have been deducted from your account. Reason: ${reason}`,
    });

    return {
      success: true,
      new_balance: newBalance,
      message: `Successfully adjusted ${points} points for client`,
    };
  }

  /**
   * Get loyalty stats for admin dashboard
   */
  async getAdminStats(): Promise<{
    total_points_issued: number;
    total_points_redeemed: number;
    active_clients_with_points: number;
    average_points_per_client: number;
    total_redemptions: number;
    total_discount_value: number;
  }> {
    const [issuedResult, redeemedResult, activeClients, redemptions] =
      await Promise.all([
        this.prisma.loyaltyTransaction.aggregate({
          where: { type: 'EARNED' },
          _sum: { points: true },
        }),
        this.prisma.loyaltyTransaction.aggregate({
          where: { type: 'REDEEMED' },
          _sum: { points: true },
        }),
        this.prisma.loyaltyTransaction.groupBy({
          by: ['clientId'],
          having: { points: { _sum: { gt: 0 } } },
        }),
        this.prisma.loyaltyTransaction.count({
          where: { type: 'REDEEMED' },
        }),
      ]);

    const totalPointsIssued = issuedResult._sum.points || 0;
    const totalPointsRedeemed = Math.abs(redeemedResult._sum.points || 0);
    const activeClientsCount = activeClients.length;
    const config = await this.getConfig();

    return {
      total_points_issued: totalPointsIssued,
      total_points_redeemed: totalPointsRedeemed,
      active_clients_with_points: activeClientsCount,
      average_points_per_client:
        activeClientsCount > 0
          ? Math.floor(totalPointsIssued / activeClientsCount)
          : 0,
      total_redemptions: redemptions,
      total_discount_value: totalPointsRedeemed * config.egp_per_point,
    };
  }

  // ==================== PRIVATE HELPERS ====================

  formatConfigResponse(config: any): LoyaltyConfigResponseDto {
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
}
