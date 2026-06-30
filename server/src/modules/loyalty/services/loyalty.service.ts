import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoyaltyRepository } from '../repositories/loyalty.repository';
import { LoyaltyConfigService } from './loyalty-config.service';
import { LoyaltyNotificationService } from './loyalty-notification.service';
import { LoyaltyMapper } from '../mappers/loyalty.mapper';
import { LoyaltySummaryResponseDto } from '../dto/response/loyalty-summary-response.dto';
import { LoyaltyTransactionResponseDto } from '../dto/response/loyalty-transaction-response.dto';
import { AdminLoyaltyStatsResponseDto } from '../dto/response/admin-stats-response.dto';
import { SIGNUP_BONUS_POINTS, LoyaltyTier, LOYALTY_EVENTS } from '../constants/loyalty.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(
    private readonly repository: LoyaltyRepository,
    private readonly configService: LoyaltyConfigService,
    private readonly notificationService: LoyaltyNotificationService,
    private readonly mapper: LoyaltyMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async awardPoints(clientId: string, bookingId: string, amount: number): Promise<number> {
    const config = await this.configService.getConfig();

    if (!config.is_active) {
      return 0;
    }

    const pointsEarned = Math.floor((amount / 100) * config.points_per_100_egp);

    if (pointsEarned <= 0) {
      return 0;
    }

    const existingTransaction = await this.repository.findTransactionForBooking(bookingId, 'EARNED');

    if (existingTransaction) {
      this.logger.warn(`Points already awarded for booking ${bookingId}`);
      return existingTransaction.points;
    }

    await this.repository.createTransaction({
      clientId,
      bookingId,
      type: 'EARNED',
      points: pointsEarned,
      reason: `Earned ${pointsEarned} points from booking (${amount} EGP)`,
    } as Prisma.LoyaltyTransactionUncheckedCreateInput);

    this.logger.log(`Awarded ${pointsEarned} points to client ${clientId} for booking ${bookingId}`);

    await this.notificationService.notifyPointsEarned(clientId, pointsEarned);

    this.eventEmitter.emit(LOYALTY_EVENTS.POINTS_EARNED, {
      clientId,
      bookingId,
      points: pointsEarned,
      amount,
    });

    return pointsEarned;
  }

  async awardSignupBonus(clientId: string): Promise<number> {
    const existingBonus = await this.repository.findExistingBonusTransaction(clientId, 'Signup bonus');

    if (existingBonus) {
      return 0;
    }

    await this.repository.createTransaction({
      clientId,
      type: 'EARNED',
      points: SIGNUP_BONUS_POINTS,
      reason: 'Signup bonus - welcome to Glow Fix!',
      bookingId: null,
    } as Prisma.LoyaltyTransactionUncheckedCreateInput);

    this.logger.log(`Awarded signup bonus of ${SIGNUP_BONUS_POINTS} points to client ${clientId}`);

    await this.notificationService.notifySignupBonus(clientId, SIGNUP_BONUS_POINTS);

    return SIGNUP_BONUS_POINTS;
  }

  async getClientSummary(clientId: string): Promise<LoyaltySummaryResponseDto> {
    const config = await this.configService.getConfig();
    const pointsBalance = await this.repository.aggregatePoints(clientId);

    const pointsEarnedLifetime = await this.repository.aggregatePoints(clientId, 'EARNED');
    const pointsRedeemedLifetimeRaw = await this.repository.aggregatePoints(clientId, 'REDEEMED');
    const pointsRedeemedLifetime = Math.abs(pointsRedeemedLifetimeRaw);

    const pointsValueEgp = pointsBalance * Number(config.egp_per_point);

    let pointsExpiringSoon = 0;
    if (config.points_expiry_days) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - config.points_expiry_days);

      const oldTransactions = await this.repository.findOldTransactions(clientId, expiryDate);

      const oldPointsSum = oldTransactions.reduce((sum, t) => sum + t.points, 0);
      pointsExpiringSoon = Math.max(0, oldPointsSum - pointsRedeemedLifetime);
    }

    let currentTier: (typeof LoyaltyTier)[number] = LoyaltyTier[0];
    let nextTier: string | undefined;
    let pointsToNextTier: number | undefined;

    for (let i = 0; i < LoyaltyTier.length; i++) {
      if (pointsBalance >= LoyaltyTier[i].minPoints) {
        currentTier = LoyaltyTier[i];
      }
    }

    const nextTierIndex = LoyaltyTier.findIndex((t) => t.name === currentTier.name) + 1;
    if (nextTierIndex < LoyaltyTier.length) {
      nextTier = LoyaltyTier[nextTierIndex].name;
      pointsToNextTier = LoyaltyTier[nextTierIndex].minPoints - pointsBalance;
    }

    return this.mapper.toSummaryResponse({
      pointsBalance,
      pointsValueEgp,
      pointsEarnedLifetime,
      pointsRedeemedLifetime,
      pointsExpiringSoon,
      nextTier,
      pointsToNextTier,
      currentTierName: currentTier.name,
      currentTierDiscount: currentTier.discount,
    });
  }

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

    const [transactions, total] = await this.repository.findTransactionsPaginated(clientId, skip, take, type);

    let runningBalance = await this.repository.aggregatePoints(clientId);
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
      data: transactionsWithBalance.map((t) => this.mapper.toTransactionResponse(t)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLeaderboard(limit: number = 50): Promise<Array<{
    rank: number;
    client_id: string;
    client_name: string;
    total_points: number;
    avatar_url?: string;
  }>> {
    const results = await this.repository.getLeaderboardRaw(limit);
    
    return results.map((entry, index) => ({
      rank: index + 1,
      client_id: entry.client_id,
      client_name: entry.client_name,
      total_points: Number(entry.total_points),
      avatar_url: entry.avatar_url || undefined,
    }));
  }

  async adjustPoints(
    adminId: string,
    clientId: string,
    points: number,
    reason: string,
  ): Promise<{ success: boolean; new_balance: number; message: string }> {
    const currentBalance = await this.repository.aggregatePoints(clientId);
    const newBalance = currentBalance + points;

    await this.repository.createTransaction({
      clientId,
      type: points > 0 ? 'EARNED' : 'REDEEMED',
      points: points,
      reason: `Manual adjustment by admin: ${reason}`,
      bookingId: null,
    } as Prisma.LoyaltyTransactionUncheckedCreateInput);

    this.logger.log(`Admin ${adminId} adjusted ${points} points for client ${clientId}: ${reason}`);

    await this.notificationService.notifyAdminAdjustment(clientId, points, reason);

    return {
      success: true,
      new_balance: newBalance,
      message: `Successfully adjusted ${points} points for client`,
    };
  }

  async getAdminStats(): Promise<AdminLoyaltyStatsResponseDto> {
    const [issuedResult, redeemedResult, activeClients, redemptions] = await this.repository.getAdminStatsAggregates();

    const totalPointsIssued = issuedResult._sum.points || 0;
    const totalPointsRedeemed = Math.abs(redeemedResult._sum.points || 0);
    const activeClientsCount = activeClients.length;
    const config = await this.configService.getConfig();

    return {
      total_points_issued: totalPointsIssued,
      total_points_redeemed: totalPointsRedeemed,
      active_clients_with_points: activeClientsCount,
      average_points_per_client: activeClientsCount > 0 ? Math.floor(totalPointsIssued / activeClientsCount) : 0,
      total_redemptions: redemptions,
      total_discount_value: totalPointsRedeemed * config.egp_per_point,
    };
  }
}
