// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
//   Logger,
// } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { UpdateLoyaltyConfigDto } from './dto/loyalty-config.dto';
// import { RedeemPointsDto, RedemptionResultDto, CalculateRedemptionDto } from './dto/redeem-points.dto';
// import { LoyaltySummaryResponseDto, LoyaltyLeaderboardEntryDto } from './dto/loyalty-transaction.dto';

// interface LoyaltyConfig {
//   id: string;
//   points_per_100_egp: number;
//   egp_per_point: number;
//   max_redeem_pct: number;
//   min_points_to_redeem: number;
//   points_expiry_days: number | null;
//   is_active: boolean;
// }

// @Injectable()
// export class LoyaltyService {
//   private readonly logger = new Logger(LoyaltyService.name);
//   private cachedConfig: LoyaltyConfig | null = null;
//   private configCacheTime: Date | null = null;
//   private readonly CONFIG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly eventEmitter: EventEmitter2,
//     private readonly notificationsService: NotificationsService,
//   ) {}

//   // ==================== CONFIGURATION ====================

//   /**
//    * Get current loyalty configuration (cached)
//    */
//   async getConfig(): Promise<LoyaltyConfig> {
//     // Check cache
//     if (this.cachedConfig && this.configCacheTime && 
//         (Date.now() - this.configCacheTime.getTime()) < this.CONFIG_CACHE_TTL_MS) {
//       return this.cachedConfig;
//     }

//     // Fetch from database
//     let config = await this.prisma.loyaltyConfig.findFirst({
//       where: { isActive: true },
//     });

//     if (!config) {
//       // Create default config if none exists
//       config = await this.prisma.loyaltyConfig.create({
//         data: {
//           pointsPer100Egp: 100,
//           egpPerPoint: 0.1,
//           maxRedeemPct: 50,
//           minPointsToRedeem: 100,
//           isActive: true,
//         },
//       });
//     }

//     this.cachedConfig = {
//       id: config.id,
//       points_per_100_egp: config.pointsPer100Egp,
//       egp_per_point: Number(config.egpPerPoint),
//       max_redeem_pct: config.maxRedeemPct,
//       min_points_to_redeem: 100, // Default, would come from config table
//       points_expiry_days: null,
//       is_active: config.isActive,
//     };
//     this.configCacheTime = new Date();

//     return this.cachedConfig;
//   }

//   /**
//    * Update loyalty configuration (admin only)
//    */
//   async updateConfig(adminId: string, dto: UpdateLoyaltyConfigDto): Promise<LoyaltyConfig> {
//     const config = await this.prisma.loyaltyConfig.findFirst();

//     if (!config) {
//       const newConfig = await this.prisma.loyaltyConfig.create({
//         data: {
//           pointsPer100Egp: dto.points_per_100_egp ?? 100,
//           egpPerPoint: dto.egp_per_point ?? 0.1,
//           maxRedeemPct: dto.max_redeem_pct ?? 50,
//           isActive: dto.is_active ?? true,
//         },
//       });

//       this.cachedConfig = null; // Invalidate cache
//       return this.formatConfig(newConfig);
//     }

//     const updated = await this.prisma.loyaltyConfig.update({
//       where: { id: config.id },
//       data: {
//         points_per_100_egp: dto.points_per_100_egp,
//         egp_per_point: dto.egp_per_point,
//         max_redeem_pct: dto.max_redeem_pct,
//         is_active: dto.is_active,
//       },
//     });

//     this.cachedConfig = null; // Invalidate cache
//     this.logger.log('Loyalty config updated', 'LoyaltyService', { adminId });

//     return this.formatConfig(updated);
//   }

//   // ==================== POINTS EARNING ====================

//   /**
//    * Award points to a client for a completed booking
//    */
//   async awardPoints(
//     clientId: string,
//     bookingId: string,
//     amount: number,
//   ): Promise<number> {
//     const config = await this.getConfig();

//     if (!config.is_active) {
//       return 0;
//     }

//     // Calculate points: (amount / 100) * points_per_100_egp
//     const pointsEarned = Math.floor((amount / 100) * config.points_per_100_egp);

//     if (pointsEarned <= 0) {
//       return 0;
//     }

//     // Check if points already awarded for this booking
//     const existingTransaction = await this.prisma.loyaltyTransaction.findFirst({
//       where: {
//         booking_id: bookingId,
//         type: 'EARNED',
//       },
//     });

//     if (existingTransaction) {
//       this.logger.warn(`Points already awarded for booking ${bookingId}`);
//       return existingTransaction.points;
//     }

//     // Get current balance
//     const currentBalance = await this.getClientPointsBalance(clientId);

//     // Create transaction
//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         clientId: clientId,
//         bookingId: bookingId,
//         type: 'EARNED',
//         points: pointsEarned,
//         reason: `Earned ${pointsEarned} points from booking (${amount} EGP)`,
//       },
//     });

//     // Update client's total points (if you have a balance field)
//     await this.updateClientPointsBalance(clientId, currentBalance + pointsEarned);

//     this.logger.log(`Awarded ${pointsEarned} points to client ${clientId} for booking ${bookingId}`);

//     // Send notification
//     await this.notificationsService.send({
//       user_id: clientId,
//       type: 'LOYALTY_POINTS_EARNED',
//       title: 'Loyalty Points Earned!',
//       body: `You earned ${pointsEarned} points from your recent booking. Keep earning!`,
//       metadata: { booking_id: bookingId, points: pointsEarned, total: amount },
//     });

//     this.eventEmitter.emit('loyalty.points_earned', {
//       clientId,
//       bookingId,
//       points: pointsEarned,
//       amount,
//     });

//     return pointsEarned;
//   }

//   /**
//    * Award signup bonus points
//    */
//   async awardSignupBonus(clientId: string): Promise<number> {
//     const config = await this.getConfig();
//     const signupBonus = 500; // 500 points for new users

//     const existingBonus = await this.prisma.loyaltyTransaction.findFirst({
//       where: {
//         clientId: clientId,
//         reason: { contains: 'Signup bonus' },
//       },
//     });

//     if (existingBonus) {
//       return 0;
//     }

//     const currentBalance = await this.getClientPointsBalance(clientId);

//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         clientId: clientId,
//         type: 'EARNED',
//         points: signupBonus,
//         reason: 'Signup bonus - welcome to Glow Fix!',
//       },
//     });

//     await this.updateClientPointsBalance(clientId, currentBalance + signupBonus);

//     this.logger.log(`Awarded signup bonus of ${signupBonus} points to client ${clientId}`);

//     return signupBonus;
//   }

//   // ==================== POINTS REDEMPTION ====================

//   /**
//    * Calculate potential redemption for a booking
//    */
//   async calculateRedemption(
//     clientId: string,
//     totalAmount: number,
//     pointsToRedeem?: number,
//   ): Promise<{
//     eligible: boolean;
//     pointsAvailable: number;
//     maxPointsToRedeem: number;
//     maxDiscountAmount: number;
//     discountAmount?: number;
//     pointsToUse?: number;
//   }> {
//     const config = await this.getConfig();
//     const pointsBalance = await this.getClientPointsBalance(clientId);

//     if (!config.is_active || pointsBalance < config.min_points_to_redeem) {
//       return {
//         eligible: false,
//         pointsAvailable: pointsBalance,
//         maxPointsToRedeem: 0,
//         maxDiscountAmount: 0,
//       };
//     }

//     const maxDiscountAmount = (totalAmount * config.max_redeem_pct) / 100;
//     const maxPointsForDiscount = Math.floor(maxDiscountAmount / config.egp_per_point);
//     const maxPointsToRedeem = Math.min(pointsBalance, maxPointsForDiscount);

//     let pointsToUse = pointsToRedeem || maxPointsToRedeem;
//     pointsToUse = Math.min(pointsToUse, maxPointsToRedeem);
    
//     if (pointsToUse < config.min_points_to_redeem && pointsToRedeem) {
//       return {
//         eligible: false,
//         pointsAvailable: pointsBalance,
//         maxPointsToRedeem,
//         maxDiscountAmount,
//       };
//     }

//     const discountAmount = pointsToUse * config.egp_per_point;

//     return {
//       eligible: true,
//       pointsAvailable: pointsBalance,
//       maxPointsToRedeem,
//       maxDiscountAmount,
//       discountAmount,
//       pointsToUse,
//     };
//   }

//   /**
//    * Redeem points for a booking discount
//    */
//   async redeemPointsForBooking(
//     clientId: string,
//     bookingId: string,
//     pointsToRedeem?: number,
//   ): Promise<RedemptionResultDto> {
//     const config = await this.getConfig();

//     // Get booking details
//     const booking = await this.prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { client: true },
//     });

//     if (!booking) {
//       throw new NotFoundException('Booking not found');
//     }

//     if (booking.client.userId !== clientId) {
//       throw new ForbiddenException('You do not own this booking');
//     }

//     if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
//       throw new BadRequestException('Points can only be redeemed for pending or confirmed bookings');
//     }

//     // Check if points already redeemed for this booking
//     const existingRedemption = await this.prisma.loyaltyTransaction.findFirst({
//       where: {
//         bookingId: bookingId,
//         type: 'REDEEMED',
//       },
//     });

//     if (existingRedemption) {
//       throw new BadRequestException('Points already redeemed for this booking');
//     }

//     // Calculate redemption
//     const calculation = await this.calculateRedemption(
//       clientId,
//       Number(booking.totalPrice),
//       pointsToRedeem,
//     );

//     if (!calculation.eligible || !calculation.discountAmount || !calculation.pointsToUse) {
//       throw new BadRequestException('Not enough points for redemption');
//     }

//     const pointsBalance = await this.getClientPointsBalance(clientId);

//     // Create redemption transaction
//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         clientId: clientId,
//         bookingId: bookingId,
//         type: 'REDEEMED',
//         points: -calculation.pointsToUse,
//         reason: `Redeemed ${calculation.pointsToUse} points for EGP ${calculation.discountAmount.toFixed(2)} discount`,
//       },
//     });

//     // Update client points balance
//     await this.updateClientPointsBalance(clientId, pointsBalance - calculation.pointsToUse);

//     // Update booking with discount
//     await this.prisma.booking.update({
//       where: { id: bookingId },
//       data: {
//         loyaltyDiscountCents: Math.floor(calculation.discountAmount * 100),
//         totalPrice: Math.max(0, Number(booking.totalPrice) - calculation.discountAmount),
//       },
//     });

//     this.logger.log(`Redeemed ${calculation.pointsToUse} points for client ${clientId} on booking ${bookingId}`);

//     // Send notification
//     await this.notificationsService.send({
//       user_id: clientId,
//       type: 'LOYALTY_POINTS_REDEEMED',
//       title: 'Points Redeemed!',
//       body: `You redeemed ${calculation.pointsToUse} points and saved EGP ${calculation.discountAmount.toFixed(2)} on your booking.`,
//       metadata: { booking_id: bookingId, points: calculation.pointsToUse, discount: calculation.discountAmount },
//     });

//     this.eventEmitter.emit('loyalty.points_redeemed', {
//       clientId,
//       bookingId,
//       points: calculation.pointsToUse,
//       discount: calculation.discountAmount,
//     });

//     return {
//       success: true,
//       points_used: calculation.pointsToUse,
//       discount_amount: calculation.discountAmount,
//       remaining_points: pointsBalance - calculation.pointsToUse,
//       message: `Successfully redeemed ${calculation.pointsToUse} points for EGP ${calculation.discountAmount.toFixed(2)} discount!`,
//     };
//   }

//   /**
//    * Redeem points for a coupon
//    */
//   async redeemPointsForCoupon(
//     clientId: string,
//     pointsToRedeem?: number,
//   ): Promise<RedemptionResultDto> {
//     const config = await this.getConfig();
//     const pointsBalance = await this.getClientPointsBalance(clientId);

//     // Define coupon tiers
//     const couponTiers = [
//       { points: 100, discount: 10, code: 'SAVE10' },
//       { points: 250, discount: 25, code: 'SAVE25' },
//       { points: 500, discount: 50, code: 'SAVE50' },
//       { points: 1000, discount: 100, code: 'SAVE100' },
//     ];

//     // Determine which coupon to give
//     let selectedTier = couponTiers[couponTiers.length - 1];
//     let pointsToUse = pointsToRedeem || pointsBalance;

//     for (const tier of couponTiers.reverse()) {
//       if (pointsToUse >= tier.points) {
//         selectedTier = tier;
//         pointsToUse = tier.points;
//         break;
//       }
//     }

//     if (pointsToUse < config.min_points_to_redeem) {
//       throw new BadRequestException(`Minimum ${config.min_points_to_redeem} points required for redemption`);
//     }

//     // Generate unique coupon code
//     const couponCode = `${selectedTier.code}_${Date.now()}_${clientId.slice(0, 6)}`;

//     // Store coupon in Redis
//     const couponKey = `coupon:${couponCode}`;
//     const redis = this.prisma.$queryRaw; // Placeholder - use actual Redis service
//     // await this.redis.setJson(couponKey, {
//     //   client_id: clientId,
//     //   discount: selectedTier.discount,
//     //   min_purchase: 0,
//     //   expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//     // }, 30 * 24 * 60 * 60);

//     // Create redemption transaction
//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         clientId: clientId,
//         type: 'REDEEMED',
//         points: -pointsToUse,
//         reason: `Redeemed ${pointsToUse} points for ${selectedTier.discount} EGP off coupon (${couponCode})`,
//       },
//     });

//     // Update client points balance
//     await this.updateClientPointsBalance(clientId, pointsBalance - pointsToUse);

//     this.logger.log(`Redeemed ${pointsToUse} points for coupon ${couponCode} for client ${clientId}`);

//     await this.notificationsService.send({
//       user_id: clientId,
//       type: 'LOYALTY_POINTS_REDEEMED',
//       title: 'Coupon Generated!',
//       body: `You redeemed ${pointsToUse} points for a ${selectedTier.discount} EGP off coupon. Code: ${couponCode}`,
//       metadata: { coupon_code: couponCode, discount: selectedTier.discount },
//     });

//     return {
//       success: true,
//       points_used: pointsToUse,
//       discount_amount: selectedTier.discount,
//       remaining_points: pointsBalance - pointsToUse,
//       coupon_code: couponCode,
//       message: `Successfully redeemed ${pointsToUse} points for ${selectedTier.discount} EGP off coupon: ${couponCode}`,
//     };
//   }

//   // ==================== POINTS BALANCE & HISTORY ====================

//   /**
//    * Get client's points balance
//    */
//   async getClientPointsBalance(clientId: string): Promise<number> {
//     // Calculate from transactions
//     const result = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: { points: true },
//     });

//     return result._sum.points || 0;
//   }

//   /**
//    * Get client's loyalty summary
//    */
//   async getClientSummary(clientId: string): Promise<LoyaltySummaryResponseDto> {
//     const config = await this.getConfig();
//     const pointsBalance = await this.getClientPointsBalance(clientId);

//     // Get lifetime stats
//     const stats = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: {
//         points: true,
//       },
//       _count: true,
//     });

//     // Separate earned vs redeemed
//     const earnedResult = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId, type: 'EARNED' },
//       _sum: { points: true },
//     });

//     const redeemedResult = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId, type: 'REDEEMED' },
//       _sum: { points: true },
//     });

//     const pointsEarnedLifetime = earnedResult._sum.points || 0;
//     const pointsRedeemedLifetime = Math.abs(redeemedResult._sum.points || 0);

//     const pointsValueEgp = pointsBalance * Number(config.egp_per_point);

//     // Check for expiring points (if expiry configured)
//     let pointsExpiringSoon = 0;
//     if (config.points_expiry_days) {
//       const expiryDate = new Date();
//       expiryDate.setDate(expiryDate.getDate() + config.points_expiry_days);
      
//       const oldTransactions = await this.prisma.loyaltyTransaction.findMany({
//         where: {
//           clientId: clientId,
//           type: 'EARNED',
//           createdAt: { lt: expiryDate },
//         },
//       });
      
//       const oldPointsSum = oldTransactions.reduce((sum: any, t: { points: any; }) => sum + t.points, 0);
//       pointsExpiringSoon = Math.max(0, oldPointsSum - pointsRedeemedLifetime);
//     }

//     // Tier calculation
//     let nextTier: string | undefined;
//     let pointsToNextTier: number | undefined;

//     const tiers = [
//       { name: 'Bronze', minPoints: 0, maxPoints: 999 },
//       { name: 'Silver', minPoints: 1000, maxPoints: 4999 },
//       { name: 'Gold', minPoints: 5000, maxPoints: 9999 },
//       { name: 'Platinum', minPoints: 10000, maxPoints: Infinity },
//     ];

//     let currentTier = tiers[0];
//     for (let i = 0; i < tiers.length; i++) {
//       if (pointsBalance >= tiers[i].minPoints) {
//         currentTier = tiers[i];
//       }
//     }

//     const nextTierIndex = tiers.findIndex(t => t.name === currentTier.name) + 1;
//     if (nextTierIndex < tiers.length) {
//       nextTier = tiers[nextTierIndex].name;
//       pointsToNextTier = tiers[nextTierIndex].minPoints - pointsBalance;
//     }

//     return {
//       total_points: pointsBalance,
//       points_value_egp: pointsValueEgp,
//       points_earned_lifetime: pointsEarnedLifetime,
//       points_redeemed_lifetime: pointsRedeemedLifetime,
//       points_expiring_soon: pointsExpiringSoon,
//       next_tier: nextTier,
//       points_to_next_tier: pointsToNextTier,
//     };
//   }

//   /**
//    * Get loyalty transaction history
//    */
//   async getTransactionHistory(
//     clientId: string,
//     page: number = 1,
//     limit: number = 20,
//     type?: string,
//   ): Promise<{ data: any[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     const where: any = { clientId: clientId };
//     if (type) {
//       where.type = type;
//     }

//     const [transactions, total] = await Promise.all([
//       this.prisma.loyaltyTransaction.findMany({
//         where,
//         include: {
//           booking: {
//             select: {
//               booking_code: true,
//               branch: { select: { businessName: true } },
//             },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.loyaltyTransaction.count({ where }),
//     ]);

//     let runningBalance = await this.getClientPointsBalance(clientId);
//     const transactionsWithBalance = [...transactions].reverse().map((t, idx, arr) => {
//       if (idx === 0) {
//         return { ...t, balance_after: runningBalance };
//       }
//       const prevPoints = arr[idx - 1]?.points || 0;
//       runningBalance = runningBalance - prevPoints;
//       return { ...t, balance_after: runningBalance };
//     }).reverse();

//     return {
//       data: transactionsWithBalance,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // ==================== POINTS REVERSAL ====================

//   /**
//    * Reverse points for a cancelled booking
//    */
//   async reversePoints(clientId: string, bookingId: string): Promise<number> {
//     // Find earned points for this booking
//     const earnedTransaction = await this.prisma.loyaltyTransaction.findFirst({
//       where: {
//         clientId: clientId,
//         bookingId: bookingId,
//         type: 'EARNED',
//       },
//     });

//     if (!earnedTransaction) {
//       return 0;
//     }

//     const pointsToReverse = earnedTransaction.points;
//     const currentBalance = await this.getClientPointsBalance(clientId);

//     // Create reversal transaction
//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         client_id: clientId,
//         booking_id: bookingId,
//         type: 'ADJUSTED',
//         points: -pointsToReverse,
//         reason: `Points reversed due to booking cancellation`,
//       },
//     });

//     await this.updateClientPointsBalance(clientId, currentBalance - pointsToReverse);

//     this.logger.log(`Reversed ${pointsToReverse} points for client ${clientId} due to cancelled booking ${bookingId}`);

//     return pointsToReverse;
//   }

//   /**
//    * Adjust points manually (admin)
//    */
//   async adjustPoints(
//     adminId: string,
//     clientId: string,
//     points: number,
//     reason: string,
//   ): Promise<number> {
//     const currentBalance = await this.getClientPointsBalance(clientId);

//     await this.prisma.loyaltyTransaction.create({
//       data: {
//         client_id: clientId,
//         type: 'ADJUSTED',
//         points,
//         reason,
//       },
//     });

//     await this.updateClientPointsBalance(clientId, currentBalance + points);

//     this.logger.log(`Admin ${adminId} adjusted ${points} points for client ${clientId}: ${reason}`);

//     await this.notificationsService.send({
//       user_id: clientId,
//       type: 'SYSTEM_MESSAGE',
//       title: 'Points Adjustment',
//       body: points > 0 
//         ? `${points} points have been added to your account. Reason: ${reason}`
//         : `${Math.abs(points)} points have been deducted from your account. Reason: ${reason}`,
//       metadata: { points, reason },
//     });

//     return points;
//   }

//   // ==================== LEADERBOARD ====================

//   /**
//    * Get loyalty leaderboard
//    */
//   async getLeaderboard(limit: number = 50): Promise<LoyaltyLeaderboardEntryDto[]> {
//     const leaders = await this.prisma.$queryRaw`
//       SELECT 
//         l.client_id,
//         SUM(l.points) as total_points,
//         c.full_name as client_name,
//         c.avatar_url
//       FROM loyalty_transactions l
//       JOIN customers c ON l.client_id = c.id
//       GROUP BY l.client_id, c.full_name, c.avatar_url
//       ORDER BY total_points DESC
//       LIMIT ${limit}
//     `;

//     return (leaders as any[]).map((entry, index) => ({
//       rank: index + 1,
//       client_id: entry.client_id,
//       client_name: entry.client_name,
//       total_points: Number(entry.total_points),
//       avatar_url: entry.avatar_url,
//     }));
//   }

//   // ==================== PRIVATE HELPERS ====================

//   private async updateClientPointsBalance(clientId: string, newBalance: number): Promise<void> {
//     // Update client record if you have a balance field
//     // This is optional - we can calculate on the fly from transactions
//     await this.prisma.client.update({
//       where: { userId: clientId },
//       data: { updatedAt: new Date() },
//     }).catch(() => {
//       // Client might not exist yet
//     });
//   }

//   private formatConfig(config: any): LoyaltyConfig {
//     return {
//       id: config.id,
//       points_per_100_egp: config.points_per_100_egp,
//       egp_per_point: Number(config.egp_per_point),
//       max_redeem_pct: config.max_redeem_pct,
//       min_points_to_redeem: 100,
//       points_expiry_days: null,
//       is_active: config.is_active,
//     };
//   }
// }