// // modules/payments/payments.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
//   ConflictException,
//   Logger,
// } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { randomUUID } from 'crypto';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { LoyaltyService } from '../loyalty/loyalty.service';
// import { NotificationsService } from '../notifications/notifications.service';
// import { ProcessPaymentDto, PaymentMethodType, PaymentType } from './dto/process-payment.dto';
// import { CreateDisputeDto, DisputeReason, DesiredOutcome } from './dto/dispute-payment.dto';

// @Injectable()
// export class PaymentsService {
//   private readonly logger = new Logger(PaymentsService.name);
//   private readonly PLATFORM_FEE_PERCENT = 10; // 10% platform fee

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly eventEmitter: EventEmitter2,
//     private readonly loyaltyService: LoyaltyService,
//     private readonly notificationsService: NotificationsService,
//   ) {}

//   /**
//    * Process payment for a booking
//    */
//   async processPayment(userId: string, dto: ProcessPaymentDto) {
//     // Get booking with relations
//     const booking = await this.prisma.booking.findUnique({
//       where: { id: dto.booking_id },
//       include: {
//         client: {
//           include: { user: true },
//         },
//         branch: {
//           include: { manager: true },
//         },
//         payments: true,
//         loyalty_transactions: true,
//       },
//     });

//     if (!booking) {
//       throw new NotFoundException('Booking not found');
//     }

//     // Verify ownership
//     if (booking.client.userId !== userId) {
//       throw new ForbiddenException('You do not own this booking');
//     }

//     // Check if payment already exists and is completed
//     if (booking.payments && booking.payments.status === 'PAID') {
//       throw new BadRequestException('Booking already paid');
//     }

//     // Check if booking is in payable state
//     const payableStatuses = ['READY_FOR_PICKUP', 'COMPLETED'];
//     if (!payableStatuses.includes(booking.status)) {
//       throw new BadRequestException(`Booking cannot be paid in status: ${booking.status}`);
//     }

//     // Calculate total amount
//     let totalAmount = Number(booking.totalPrice);
//     let loyaltyDiscount = 0;

//     // Handle loyalty points redemption
//     if (dto.redeem_points) {
//       const pointsToRedeem = dto.points_to_redeem || null;
//       const redemptionResult = await this.loyaltyService.calculateRedemption(
//         booking.client.userId,
//         totalAmount,
//         pointsToRedeem,
//       );

//       if (redemptionResult.eligible && redemptionResult.discountAmount > 0) {
//         loyaltyDiscount = redemptionResult.discountAmount;
//         totalAmount = totalAmount - loyaltyDiscount;
//       }
//     }

//     // Override with manual amount if provided
//     if (dto.amount && dto.amount > 0) {
//       if (dto.amount > Number(booking.totalPrice)) {
//         throw new BadRequestException('Payment amount cannot exceed booking total');
//       }
//       totalAmount = dto.amount;
//     }

//     if (totalAmount <= 0 && loyaltyDiscount > 0) {
//       // Full loyalty points coverage - mark as paid without actual payment
//       return this.processZeroAmountPayment(booking, loyaltyDiscount, userId);
//     }

//     // Create payment record
//     const payment = await this.prisma.payment.create({
//       data: {
//         bookingId: booking.id,
//         type: PaymentType.SERVICE,
//         provider: dto.provider,
//         amount: totalAmount,
//         currency: 'EGP',
//         status: 'PENDING',
//         idempotency_key: randomUUID(),
//       },
//     });

//     // Process based on payment method
//     let paymentResult;
//     switch (dto.payment_method) {
//       case PaymentMethodType.CARD:
//         paymentResult = await this.processCardPayment(payment, dto.provider_token);
//         break;
//       case PaymentMethodType.CASH:
//         paymentResult = await this.processCashPayment(payment);
//         break;
//       case PaymentMethodType.WALLET:
//         paymentResult = await this.processWalletPayment(booking.client.userId, payment);
//         break;
//       default:
//         throw new BadRequestException('Unsupported payment method');
//     }

//     // Handle payment success
//     if (paymentResult.success) {
//       return this.finalizePayment(payment.id, paymentResult.provider_ref, loyaltyDiscount);
//     }

//     // Payment failed
//     await this.handleFailedPayment(payment.id, paymentResult.error);
//     throw new BadRequestException(paymentResult.error || 'Payment failed');
//   }

//   /**
//    * Process card payment via provider (Stripe/Paymob)
//    */
//   private async processCardPayment(payment: any, providerToken?: string): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
//     // TODO: Integrate with actual payment provider (Stripe, Paymob, etc.)
//     // This is a mock implementation
    
//     if (!providerToken) {
//       return { success: false, error: 'Card token is required' };
//     }

//     this.logger.log(`Processing card payment ${payment.id} for ${payment.amount} EGP`);

//     // Mock successful payment
//     // In production: call payment provider API
//     const mockSuccess = true;
    
//     if (mockSuccess) {
//       return {
//         success: true,
//         provider_ref: `txn_${Date.now()}_${payment.id.substring(0, 8)}`,
//       };
//     }

//     return { success: false, error: 'Card payment declined' };
//   }

//   /**
//    * Process cash payment (mark as pending collection)
//    */
//   private async processCashPayment(payment: any): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
//     // Cash payment is marked as paid, but provider will collect cash
//     // The platform fee is still tracked for payout
//     return {
//       success: true,
//       provider_ref: `cash_${payment.id.substring(0, 8)}`,
//     };
//   }

//   /**
//    * Process wallet payment
//    */
//   private async processWalletPayment(userId: string, payment: any): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       return { success: false, error: 'Client not found' };
//     }

//     // Check wallet balance (you would have a wallet table)
//     // For now, assume wallet payment is successful
//     return {
//       success: true,
//       provider_ref: `wallet_${payment.id.substring(0, 8)}`,
//     };
//   }

//   /**
//    * Handle zero-amount payment (fully covered by loyalty points)
//    */
//   private async processZeroAmountPayment(booking: any, loyaltyDiscount: number, userId: string) {
//     const payment = await this.prisma.payment.create({
//       data: {
//         bookingId: booking.id,
//         type: PaymentType.SERVICE,
//         amount: 0,
//         currency: 'EGP',
//         status: 'PAID',
//         provider_ref: 'loyalty_full_coverage',
//         paid_at: new Date(),
//         idempotency_key: randomUUID(),
//       },
//     });

//     // Record loyalty points redemption
//     const pointsUsed = await this.loyaltyService.redeemPoints(userId, booking.id, loyaltyDiscount);

//     // Update booking status to COMPLETED
//     await this.prisma.booking.update({
//       where: { id: booking.id },
//       data: { status: 'COMPLETED', completed_at: new Date() },
//     });

//     // Create payout record (zero amount)
//     const grossAmount = Number(booking.total_price);
//     const platformFee = Math.floor(grossAmount * (this.PLATFORM_FEE_PERCENT / 100));
    
//     await this.prisma.payout.create({
//       data: {
//         bookingId: booking.id,
//         branchId: booking.branch.id,
//         paymentId: payment.id,
//         grossCents: grossAmount,
//         platformFeePctSnapshot: this.PLATFORM_FEE_PERCENT,
//         platformFeeCents: platformFee,
//         netCents: grossAmount - platformFee,
//         status: 'PROCESSED',
//         processed_at: new Date(),
//       },
//     });

//     // Send notifications
//     await this.notificationsService.send({
//       user_id: userId,
//       type: 'PAYMENT_RECEIVED',
//       title: 'Payment Successful',
//       body: `Your payment of EGP ${(grossAmount - loyaltyDiscount).toFixed(2)} (${pointsUsed} points redeemed) was successful.`,
//       metadata: { booking_id: booking.id, loyalty_points_used: pointsUsed },
//     });

//     await this.notificationsService.send({
//       user_id: booking.branch.manager_id,
//       type: 'PAYMENT_RECEIVED',
//       title: 'Payment Received',
//       body: `Payment of EGP ${grossAmount} received for booking ${booking.booking_code}`,
//       metadata: { booking_id: booking.id },
//     });

//     this.eventEmitter.emit('payment.completed', {
//       bookingId: booking.id,
//       paymentId: payment.id,
//       amount: grossAmount - loyaltyDiscount,
//       loyaltyPointsUsed: pointsUsed,
//     });

//     return this.formatPaymentResponse(payment, booking, pointsUsed, loyaltyDiscount);
//   }

//   /**
//    * Finalize successful payment
//    */
//   async finalizePayment(paymentId: string, providerRef: string, loyaltyDiscount: number = 0) {
//     const payment = await this.prisma.payment.update({
//       where: { id: paymentId },
//       data: {
//         status: 'PAID',
//         provider_ref: providerRef,
//         paid_at: new Date(),
//       },
//       include: {
//         booking: {
//           include: {
//             client: { include: { user: true } },
//             branch: { include: { manager: true } },
//           },
//         },
//       },
//     });

//     let pointsEarned = 0;
//     let pointsUsed = 0;

//     // Award loyalty points (if payment amount > 0)
//     if (payment.amount > 0) {
//       pointsEarned = await this.loyaltyService.awardPoints(
//         payment.booking.client.user_id,
//         payment.booking.id,
//         payment.amount,
//       );
//     }

//     // Record loyalty points redemption
//     if (loyaltyDiscount > 0) {
//       pointsUsed = await this.loyaltyService.redeemPoints(
//         payment.booking.client.user_id,
//         payment.booking.id,
//         loyaltyDiscount,
//       );
//     }

//     // Update booking status to COMPLETED
//     await this.prisma.booking.update({
//       where: { id: payment.booking.id },
//       data: { status: 'COMPLETED', completed_at: new Date() },
//     });

//     // Create payout record for provider
//     const grossAmount = Number(payment.booking.total_price);
//     const platformFee = Math.floor(grossAmount * (this.PLATFORM_FEE_PERCENT / 100));
//     const netAmount = grossAmount - platformFee;

//     await this.prisma.payout.create({
//       data: {
//         bookingId: payment.booking.id,
//         branchId: payment.booking.branch.id,
//         paymentId: payment.id,
//         grossCents: grossAmount,
//         platformFeePctSnapshot: this.PLATFORM_FEE_PERCENT,
//         platformFeeCents: platformFee,
//         netCents: netAmount,
//         status: 'PENDING',
//       },
//     });

//     // Send notifications
//     await this.notificationsService.send({
//       user_id: payment.booking.client.userId,
//       type: 'PAYMENT_RECEIVED',
//       title: 'Payment Successful',
//       body: `Your payment of EGP ${payment.amount.toFixed(2)} has been confirmed.${pointsEarned > 0 ? ` You earned ${pointsEarned} loyalty points!` : ''}`,
//       metadata: { booking_id: payment.booking.id, loyalty_points_earned: pointsEarned, loyalty_points_used: pointsUsed },
//     });

//     await this.notificationsService.send({
//       user_id: payment.booking.branch.managerId,
//       type: 'PAYOUT_PROCESSED',
//       title: 'Payout Initiated',
//       body: `Payout of EGP ${netAmount.toFixed(2)} initiated for booking ${payment.booking.booking_code}`,
//       metadata: { booking_id: payment.booking.id, amount: netAmount },
//     });

//     this.eventEmitter.emit('payment.completed', {
//       bookingId: payment.booking.id,
//       paymentId: payment.id,
//       amount: payment.amount,
//       loyaltyPointsEarned: pointsEarned,
//       loyaltyPointsUsed: pointsUsed,
//     });

//     return this.formatPaymentResponse(payment, payment.booking, pointsUsed, loyaltyDiscount, pointsEarned);
//   }

//   /**
//    * Handle failed payment
//    */
//   private async handleFailedPayment(paymentId: string, reason: string) {
//     await this.prisma.payment.update({
//       where: { id: paymentId },
//       data: {
//         status: 'FAILED',
//         failure_reason: reason,
//       },
//     });
//   }

//   /**
//    * Get payment by ID
//    */
//   async getPayment(paymentId: string, userId: string, userRole: string) {
//     const payment = await this.prisma.payment.findUnique({
//       where: { id: paymentId },
//       include: {
//         booking: {
//           include: {
//             client: { include: { user: true } },
//             branch: true,
//           },
//         },
//         payouts: true,
//       },
//     });

//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     // Check authorization
//     const isClient = payment.booking.client.userId === userId;
//     const isBranchManager = payment.booking.branch.managerId === userId;
//     const isAdmin = userRole === 'ADMIN';

//     if (!isClient && !isBranchManager && !isAdmin) {
//       throw new ForbiddenException('You do not have access to this payment');
//     }

//     return payment;
//   }

//   /**
//    * Get booking payment
//    */
//   async getBookingPayment(bookingId: string, userId: string) {
//     const payment = await this.prisma.payment.findUnique({
//       where: { bookingId: bookingId },
//       include: {
//         booking: {
//           include: {
//             client: { include: { user: true } },
//             branch: true,
//           },
//         },
//       },
//     });

//     if (!payment) {
//       throw new NotFoundException('Payment not found for this booking');
//     }

//     const booking = await this.prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { client: { include: { user: true } }, branch: true },
//     });

//     if (!booking || (booking.client.userId !== userId && booking.branch.managerId !== userId)) {
//       throw new ForbiddenException('Access denied');
//     }

//     return payment;
//   }

//   /**
//    * Get user payments
//    */
//   async getUserPayments(userId: string, page: number = 1, limit: number = 20) {
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     const [payments, total] = await Promise.all([
//       this.prisma.payment.findMany({
//         where: {
//           booking: {
//             client: { userId: userId },
//           },
//         },
//         include: {
//           booking: {
//             include: {
//               branch: {
//                 select: { businessName: true },
//               },
//             },
//           },
//         },
//         orderBy: { paidAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.payment.count({
//         where: {
//           booking: {
//             client: { userId: userId },
//           },
//         },
//       }),
//     ]);

//     return {
//       data: payments,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   /**
//    * Handle payment webhook from provider
//    */
//   async handleWebhook(provider: string, payload: any) {
//     this.logger.log(`Webhook received from ${provider}`);

//     // Verify webhook signature (implement based on provider)
//     // Extract payment reference
//     let providerRef: string;
//     let status: string;
//     let amount: number;

//     // Provider-specific parsing
//     switch (provider) {
//       case 'stripe':
//         providerRef = payload.data.object.id;
//         status = payload.type === 'payment_intent.succeeded' ? 'PAID' : 'FAILED';
//         amount = payload.data.object.amount / 100;
//         break;
//       case 'paymob':
//         providerRef = payload.obj.id;
//         status = payload.obj.success === true ? 'PAID' : 'FAILED';
//         amount = payload.obj.amount_cents / 100;
//         break;
//       default:
//         this.logger.warn(`Unknown provider: ${provider}`);
//         return { received: true };
//     }

//     // Find payment by provider_ref
//     const payment = await this.prisma.payment.findFirst({
//       where: { providerRef: providerRef },
//     });

//     if (!payment) {
//       this.logger.warn(`Payment not found for provider_ref: ${providerRef}`);
//       return { received: true };
//     }

//     if (status === 'PAID' && payment.status !== 'PAID') {
//       await this.finalizePayment(payment.id, providerRef, 0);
//     } else if (status === 'FAILED') {
//       await this.handleFailedPayment(payment.id, payload.failure_reason || 'Provider reported failure');
//     }

//     return { received: true };
//   }

//   /**
//    * Get payment receipt
//    */
//   async getReceipt(paymentId: string, userId: string) {
//     const payment = await this.getPayment(paymentId, userId, 'CLIENT');
    
//     const receipt = {
//       id: payment.id,
//       booking_code: payment.booking.bookingCode,
//       date: payment.paidAt || payment.createdAt,
//       from: {
//         name: payment.booking.branch.businessName,
//         address: payment.booking.branch.address,
//       },
//       billed_to: {
//         name: payment.booking.client.user.fullName,
//         email: payment.booking.client.user.email,
//         phone: payment.booking.client.user.phone,
//       },
//       items: payment.booking.bookingItems || [],
//       subtotal: Number(payment.booking.totalPrice),
//       loyalty_discount: Number(payment.booking.loyaltyDiscountCents),
//       total: Number(payment.amount),
//       payment_method: payment.provider?.toUpperCase() || 'CASH',
//       provider_ref: payment.providerRef,
//       receipt_number: `${payment.id.substring(0, 8).toUpperCase()}`,
//     };

//     return receipt;
//   }

//   // ==================== DISPUTES ====================

//   /**
//    * Create a dispute for a payment
//    */
//   async createDispute(userId: string, dto: CreateDisputeDto) {
//     const payment = await this.prisma.payment.findUnique({
//       where: { id: dto.payment_id },
//       include: {
//         booking: {
//           include: {
//             client: { include: { user: true } },
//           },
//         },
//       },
//     });

//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     if (payment.booking.client.userId !== userId) {
//       throw new ForbiddenException('You cannot dispute this payment');
//     }

//     if (payment.status !== 'PAID') {
//       throw new BadRequestException('Only paid payments can be disputed');
//     }

//     // Check if dispute already exists
//     const existingDispute = await this.prisma.$queryRaw`
//       SELECT * FROM disputes WHERE payment_id = ${dto.payment_id}
//     `;
    
//     if (existingDispute && Array.isArray(existingDispute) && existingDispute.length > 0) {
//       throw new ConflictException('A dispute already exists for this payment');
//     }

//     // Freeze payment amount (mark as disputed)
//     await this.prisma.payment.update({
//       where: { id: payment.id },
//       data: { status: 'PENDING' }, // Freeze the payment
//     });

//     // Create dispute record (assuming disputes table exists)
//     const dispute = await this.prisma.$executeRaw`
//       INSERT INTO disputes (id, payment_id, booking_id, reason, description, photo_urls, desired_outcome, suggested_amount, status, created_at)
//       VALUES (gen_random_uuid(), ${dto.payment_id}, ${payment.booking.id}, ${dto.reason}, ${dto.description}, ${dto.photo_urls}, ${dto.desired_outcome}, ${dto.suggested_amount}, 'PENDING', NOW())
//       RETURNING *
//     `;

//     // Notify admin
//     await this.notificationsService.send({
//       user_id: null, // Admin notification
//       type: 'SYSTEM_MESSAGE',
//       title: 'New Payment Dispute',
//       body: `Booking ${payment.booking.bookingCode} has been disputed. Reason: ${dto.reason}`,
//       metadata: { payment_id: payment.id, booking_id: payment.booking.id },
//       is_admin: true,
//     });

//     this.eventEmitter.emit('payment.dispute_created', {
//       paymentId: payment.id,
//       bookingId: payment.booking.id,
//       reason: dto.reason,
//     });

//     return {
//       message: 'Dispute created successfully. Our team will review within 48 hours.',
//       dispute_id: (dispute as any)[0]?.id,
//     };
//   }

//   /**
//    * Resolve dispute (admin only)
//    */
//   async resolveDispute(disputeId: string, resolution: string, outcome: 'refund' | 'reject', refundAmount?: number) {
//     // Update dispute
//     await this.prisma.$executeRaw`
//       UPDATE disputes 
//       SET status = 'RESOLVED', resolution = ${resolution}, resolved_at = NOW()
//       WHERE id = ${disputeId}
//     `;

//     const dispute = await this.prisma.$queryRaw`
//       SELECT * FROM disputes WHERE id = ${disputeId}
//     `;

//     const disputeData = (dispute as any)[0];

//     if (outcome === 'refund' && disputeData) {
//       // Process refund
//       await this.processRefund(disputeData.payment_id, refundAmount || disputeData.suggested_amount);
//     }

//     return { message: `Dispute resolved: ${resolution}` };
//   }

//   /**
//    * Process refund
//    */
//   private async processRefund(paymentId: string, amount: number) {
//     const payment = await this.prisma.payment.findUnique({
//       where: { id: paymentId },
//       include: { booking: true },
//     });

//     if (!payment) {
//       throw new NotFoundException('Payment not found');
//     }

//     // Mark payment as refunded
//     await this.prisma.payment.update({
//       where: { id: paymentId },
//       data: {
//         status: 'FAILED',
//         failure_reason: `Refunded: ${amount} EGP`,
//       },
//     });

//     // Reverse loyalty points
//     await this.loyaltyService.reversePoints(payment.booking.client.userId, payment.booking.id);

//     // Notify user
//     await this.notificationsService.send({
//       user_id: payment.booking.client.userId,
//       type: 'PAYMENT_FAILED',
//       title: 'Payment Refunded',
//       body: `A refund of EGP ${amount.toFixed(2)} has been processed for your booking ${payment.booking.bookingCode}`,
//       metadata: { payment_id: paymentId, amount },
//     });

//     this.eventEmitter.emit('payment.refunded', {
//       paymentId,
//       bookingId: payment.booking.id,
//       amount,
//     });
//   }

//   // ==================== HELPERS ====================

//   private formatPaymentResponse(payment: any, booking: any, pointsUsed: number = 0, loyaltyDiscount: number = 0, pointsEarned: number = 0) {
//     return {
//       success: true,
//       payment: {
//         id: payment.id,
//         booking_id: payment.booking_id,
//         amount: payment.amount,
//         currency: payment.currency,
//         status: payment.status,
//         provider_ref: payment.providerRef,
//         paid_at: payment.paid_at,
//       },
//       booking: {
//         id: booking.id,
//         code: booking.bookingCode,
//         total: Number(booking.totalPrice),
//         loyalty_discount: loyaltyDiscount,
//         final_amount: payment.amount,
//       },
//       loyalty: {
//         points_used: pointsUsed,
//         points_earned: pointsEarned,
//       },
//       receipt_url: `/api/v1/payments/${payment.id}/receipt`,
//     };
//   }
// }