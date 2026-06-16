import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { StripeProvider } from './providers/stripe.provider';
import {
  ProcessPaymentDto,
  PaymentMethod,
  ProcessPaymentResponseDto,
  ConfirmPaymentDto,
} from './dto/process-payment.dto';
import { CreateDisputeDto } from './dto/dispute-payment.dto';
import { PaymentResponseDto, ReceiptResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly stripeProvider: StripeProvider,
  ) {}

  // Helper to generate booking code
  private generateBookingCode(bookingId: string): string {
    return `BK-${bookingId.slice(0, 8).toUpperCase()}`;
  }

  // ==================== PAYMENT PROCESSING ====================

  async processPayment(
    userId: string,
    dto: ProcessPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    // Get booking with relations
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.booking_id },
      include: {
        business: {
          include: { manager: true },
        },
        vehicle: {
          include: {
            client: { include: { user: true } },
          },
        },
        payment: {
          include: { status: true },
        },
        items: {
          include: {
            businessService: {
              include: { service: true },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify ownership
    if (booking.vehicle.client.userId !== userId) {
      throw new ForbiddenException('You do not own this booking');
    }

    // Check if payment already exists and is completed
    if (booking.payment?.status?.context === 'PAID') {
      throw new BadRequestException('Booking already paid');
    }

    // Check if booking is in payable state
    const bookingStatus = await this.getBookingStatus(booking.id);
    const payableStatuses = ['ACCEPTED'];
    if (!payableStatuses.includes(bookingStatus)) {
      throw new BadRequestException(`Booking cannot be paid in status: ${bookingStatus}`);
    }

    // Get client loyalty points balance
    const clientId = booking.vehicle.client.id;
    const pointsBalance = await this.getClientPointsBalance(clientId);
    const loyaltyConfig = await this.prisma.loyaltyConfig.findFirst();

    // Calculate total amount and loyalty discount
    let totalAmount = Number(booking.totalPrice);
    let loyaltyDiscount = 0;
    let pointsUsed = 0;

    // Check if client wants to redeem points and has enough points
    if (dto.redeem_points && pointsBalance >= 100 && loyaltyConfig?.isActive) {
      const redemptionDetails = await this.calculateLoyaltyRedemption(
        userId,
        totalAmount,
        dto.points_to_redeem,
        pointsBalance,
        loyaltyConfig,
      );

      if (redemptionDetails.eligible && redemptionDetails.discountAmount > 0) {
        loyaltyDiscount = redemptionDetails.discountAmount;
        totalAmount = totalAmount - loyaltyDiscount;
        pointsUsed = redemptionDetails.pointsUsed;
      }
    }

    // Ensure total amount is not negative
    if (totalAmount < 0) {
      totalAmount = 0;
    }

    // Override with manual amount if provided
    if (dto.amount && dto.amount > 0) {
      if (dto.amount > Number(booking.totalPrice)) {
        throw new BadRequestException('Payment amount cannot exceed booking total');
      }
      totalAmount = dto.amount;
    }

    // Get payment method or create if doesn't exist
    let paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { name: dto.payment_method },
    });

    if (!paymentMethod) {
      paymentMethod = await this.prisma.paymentMethod.create({
        data: { name: dto.payment_method, isEnabled: true },
      });
    }

    // Get PENDING status
    const pendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYMENT_PENDING' },
    });

    // Create or update payment record
    const payment = await this.prisma.payment.upsert({
      where: { bookingId: dto.booking_id },
      create: {
        bookingId: dto.booking_id,
        paymentMethodId: paymentMethod.id,
        provider: 'stripe',
        amount: totalAmount,
        currency: 'EGP',
        statusId: pendingStatus?.id || '',
        idempotencyKey: randomUUID(),
      },
      update: {
        paymentMethodId: paymentMethod.id,
        provider: 'stripe',
        amount: totalAmount,
        currency: 'EGP',
        statusId: pendingStatus?.id || '',
        idempotencyKey: randomUUID(),
      }
    });

    const customerName = booking.vehicle.client.user.fullName;
    const customerEmail = booking.vehicle.client.user.email;
    const customerPhone = booking.vehicle.client.user.phone || '';

    // Process based on payment method
    switch (dto.payment_method) {
      case PaymentMethod.CARD:
        return this.processCardPayment(payment, {
          amount: totalAmount,
          currency: 'EGP',
          customerEmail,
          customerName,
          customerPhone,
          bookingId: booking.id,
          savePaymentMethod: dto.save_payment_method,
          paymentMethodId: dto.payment_method_id,
          pointsUsed,
          loyaltyDiscount,
        });

      case PaymentMethod.CASH:
        return this.processCashPayment(payment, booking.id, loyaltyDiscount, pointsUsed, totalAmount);

      default:
        throw new BadRequestException('Unsupported payment method');
    }
  }

  private async processCardPayment(
    payment: any,
    options: {
      amount: number;
      currency: string;
      customerEmail: string;
      customerName: string;
      customerPhone: string;
      bookingId: string;
      savePaymentMethod?: boolean;
      paymentMethodId?: string;
      pointsUsed: number;
      loyaltyDiscount: number;
    },
  ): Promise<ProcessPaymentResponseDto> {
    try {
      if (options.amount === 0) {
        return this.finalizePayment(
          payment.id,
          'free_or_points',
          options.loyaltyDiscount,
          options.pointsUsed,
          options.bookingId,
          options.amount,
        );
      }

      if (options.amount < 30) {
        throw new BadRequestException('Amount must be at least 30 EGP to meet minimum Stripe requirements.');
      }

      const paymentIntent = await this.stripeProvider.createPaymentIntent({
        amount: options.amount,
        currency: options.currency,
        customerEmail: options.customerEmail,
        customerName: options.customerName,
        customerPhone: options.customerPhone,
        bookingId: options.bookingId,
        metadata: {
          payment_id: payment.id,
          points_used: options.pointsUsed.toString(),
          loyalty_discount: options.loyaltyDiscount.toString(),
        },
        idempotencyKey: payment.idempotencyKey,
      });

      // Update payment with Stripe intent ID
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          providerRef: paymentIntent.payment_intent_id,
        },
      });

      return {
        success: true,
        payment_id: payment.id,
        amount: options.amount,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.payment_intent_id,
        loyalty_points_used: options.pointsUsed,
        loyalty_points_earned: 0,
        message: 'Payment intent created. Confirm payment on client side.',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      await this.handleFailedPayment(payment.id, message);
      throw new BadRequestException(message);
    }
  }

  private async processCashPayment(
    payment: any,
    bookingId: string,
    loyaltyDiscount: number,
    pointsUsed: number,
    totalAmount: number,
  ): Promise<ProcessPaymentResponseDto> {
    return this.finalizePayment(
      payment.id,
      `cash_${payment.id.slice(0, 8)}`,
      loyaltyDiscount,
      pointsUsed,
      bookingId,
      totalAmount,
    );
  }

  async confirmPayment(
    userId: string,
    dto: ConfirmPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    const paymentIntent = await this.stripeProvider.retrievePaymentIntent(
      dto.payment_intent_id,
    );

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: dto.payment_intent_id },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.booking.vehicle.client.userId !== userId) {
      throw new ForbiddenException('You do not own this booking');
    }

    if (paymentIntent.status === 'succeeded') {
      const amount = Number(payment.amount);
      return this.finalizePayment(
        payment.id,
        dto.payment_intent_id,
        0,
        0,
        payment.bookingId,
        amount,
      );
    } else if (paymentIntent.status === 'requires_payment_method') {
      throw new BadRequestException('Payment requires payment method');
    } else if (paymentIntent.status === 'requires_confirmation') {
      throw new BadRequestException('Payment requires confirmation');
    } else {
      throw new BadRequestException(`Payment status: ${paymentIntent.status}`);
    }
  }

  private async getClientPointsBalance(clientId: string): Promise<number> {
    const balanceResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId },
      _sum: { points: true },
    });
    return balanceResult._sum.points || 0;
  }

  private async calculateLoyaltyRedemption(
    userId: string,
    totalAmount: number,
    pointsToRedeem: number | undefined,
    pointsBalance: number,
    config: any,
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

  private async finalizePayment(
    paymentId: string,
    providerRef: string,
    loyaltyDiscount: number,
    pointsUsed: number,
    bookingId: string,
    amount: number,
  ): Promise<ProcessPaymentResponseDto> {
    const [paidStatus, confirmedStatus, payoutPendingStatus, config] = await Promise.all([
      this.prisma.status.findFirst({ where: { context: 'PAID' } }),
      this.prisma.status.findFirst({ where: { context: 'CONFIRMED' } }),
      this.prisma.status.findFirst({ where: { context: 'PAYOUT_PENDING' } }),
      this.prisma.loyaltyConfig.findFirst(),
    ]);

    return this.prisma.$transaction(async (tx) => {
      // 1. Concurrency Lock: Lock the row and check status to prevent duplicate webhook processing
      const paymentRows = await tx.$queryRaw<any[]>`
        SELECT id, status_id FROM payments WHERE id = ${paymentId}::uuid FOR UPDATE
      `;
      if (!paymentRows || paymentRows.length === 0) {
        throw new NotFoundException('Payment not found');
      }
      if (paidStatus && paymentRows[0].status_id === paidStatus.id) {
        this.logger.warn(`Payment ${paymentId} was already finalized.`);
        return {
          success: true,
          payment_id: paymentId,
          amount,
          loyalty_points_used: pointsUsed,
          loyalty_points_earned: 0,
          message: 'Payment already finalized',
        };
      }

      // Fetch dynamic settings for Platform Fee
      const settings = await tx.setting.findFirst();
      const platformFeePercent = settings?.businessFeePct ? Number(settings.businessFeePct) : 10;

      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          providerRef,
          statusId: paidStatus?.id || '',
          paidAt: new Date(),
        },
        include: {
          booking: {
            include: {
              business: true,
              vehicle: {
                include: {
                  client: { include: { user: true } },
                },
              },
              items: {
                include: {
                  businessService: {
                    include: { service: true },
                  },
                },
              },
            },
          },
        },
      });

      let pointsEarned = 0;
      const clientId = payment.booking.vehicle.client.id;
      const clientUser = payment.booking.vehicle.client.user;
      const bookingCode = this.generateBookingCode(bookingId);

      // Record points redemption
      if (pointsUsed > 0) {
        await tx.loyaltyTransaction.create({
          data: {
            clientId,
            bookingId,
            type: 'REDEEMED',
            points: -pointsUsed,
            reason: `Redeemed ${pointsUsed} points for EGP ${loyaltyDiscount.toFixed(2)} discount`,
          },
        });
      }

      // Update booking status to CONFIRMED
      if (confirmedStatus) {
        await tx.bookingStatus.create({
          data: {
            bookingId,
            statusId: confirmedStatus.id,
          },
        });

        // Send booking confirmed notification to client
        let confNotifType = await tx.notificationType.findFirst({ where: { code: 'BOOKING_CONFIRMED' } });
        if (!confNotifType) {
          confNotifType = await tx.notificationType.create({
            data: { code: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' }
          });
        }
        await tx.notification.create({
          data: {
            recipientUserId: clientUser.id,
            typeId: confNotifType.id,
            title: 'Booking Confirmed!',
            body: `Your payment was successful and your booking ${bookingCode} has been officially confirmed!`,
            actionUrl: `/client/bookings/${bookingId}`,
            sentAt: new Date(),
          }
        });
      }

      this.logger.log(`Payment finalized: ${paymentId}`);

      // Send notifications
      await this.sendPaymentSuccessNotification(
        payment.id,
        clientUser.id,
        clientUser.fullName,
        bookingCode,
        amount,
        pointsEarned,
        pointsUsed,
        loyaltyDiscount,
      );

      this.eventEmitter.emit('payment.completed', {
        bookingId,
        paymentId,
        amount,
        loyaltyPointsEarned: pointsEarned,
        loyaltyPointsUsed: pointsUsed,
        customerEmail: clientUser.email,
        customerName: clientUser.fullName,
        businessId: payment.booking.business.id,
        businessName: payment.booking.business.businessName,
      });

      return {
        success: true,
        payment_id: payment.id,
        amount,
        loyalty_points_used: pointsUsed,
        loyalty_points_earned: pointsEarned,
        receipt_url: `/api/v1/payments/${payment.id}/receipt`,
        message: this.getSuccessMessage(pointsUsed, pointsEarned, loyaltyDiscount),
      };
    }, { maxWait: 5000, timeout: 20000 });
  }

  private async sendPaymentSuccessNotification(
    paymentId: string,
    userId: string,
    userName: string,
    bookingCode: string,
    amount: number,
    pointsEarned: number,
    pointsUsed: number,
    discountAmount: number,
  ): Promise<void> {
    try {
      let notificationType = await this.prisma.notificationType.findFirst({
        where: { code: 'PAYMENT_RECEIVED' },
      });

      if (!notificationType) {
        notificationType = await this.prisma.notificationType.create({
          data: {
            code: 'PAYMENT_RECEIVED',
            label: 'Payment Received',
          },
        });
      }

      let message = `Your payment of EGP ${amount.toFixed(2)} for booking ${bookingCode} was successful.`;
      
      if (pointsUsed > 0) {
        message += ` You redeemed ${pointsUsed} points and saved EGP ${discountAmount.toFixed(2)}!`;
      }
      
      if (pointsEarned > 0) {
        message += ` You earned ${pointsEarned} loyalty points.`;
      }

      await this.prisma.notification.create({
        data: {
          recipientUserId: userId,
          typeId: notificationType.id,
          title: 'Payment Successful! 💰',
          body: message,
          actionUrl: `/payments/${paymentId}`,
          sentAt: new Date(),
        },
      });

      this.logger.log(`Payment success notification sent to user ${userId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send payment notification: ${errorMessage}`);
    }
  }

  async createPayoutForCompletedBooking(bookingId: string): Promise<void> {
    const existingPayoutBooking = await this.prisma.payoutBooking.findFirst({
      where: { bookingId },
    });

    if (existingPayoutBooking) {
      this.logger.log(`Payout already exists for completed booking: ${bookingId}. Skipping.`);
      return;
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        business: {
          include: {
            manager: true,
          },
        },
        payment: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    if (!booking.payment || booking.payment.status.context !== 'PAID') {
      this.logger.warn(`Booking ${bookingId} has no PAID payment. Skipping payout creation.`);
      return;
    }

    const settings = await this.prisma.setting.findFirst();
    const platformFeePercent = settings?.businessFeePct ? Number(settings.businessFeePct) : 10;

    const grossAmount = Number(booking.totalPrice);
    const platformFee = (grossAmount * platformFeePercent) / 100;
    const netAmount = grossAmount - platformFee;

    let payoutPendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYOUT_PENDING' },
    });

    if (!payoutPendingStatus) {
      payoutPendingStatus = await this.prisma.status.findFirst({
        where: { context: 'PENDING' },
      });
      if (!payoutPendingStatus) {
        payoutPendingStatus = await this.prisma.status.create({
          data: { context: 'PENDING' },
        });
      }
    }

    await this.prisma.$transaction(async (tx) => {
      const payout = await tx.payout.create({
        data: {
          businessId: booking.business.id,
          amount: netAmount,
          statusId: payoutPendingStatus.id,
        },
      });

      await tx.payoutBooking.create({
        data: {
          payoutId: payout.id,
          bookingId,
        },
      });

      this.logger.log(`Payout created for completed booking: ${bookingId}, payout: ${payout.id}`);
    });

    const bookingCode = `BK-${bookingId.slice(0, 8).toUpperCase()}`;

    await this.sendPaymentReceivedNotification(
      booking.business.managerId,
      booking.business.businessName,
      bookingCode,
      Number(booking.payment.amount),
      platformFee,
      netAmount,
    );
  }

  private async sendPaymentReceivedNotification(
    managerId: string,
    businessName: string,
    bookingCode: string,
    amount: number,
    platformFee: number,
    netAmount: number,
  ): Promise<void> {
    try {
      let notificationType = await this.prisma.notificationType.findFirst({
        where: { code: 'PAYOUT_PROCESSED' },
      });

      if (!notificationType) {
        notificationType = await this.prisma.notificationType.create({
          data: {
            code: 'PAYOUT_PROCESSED',
            label: 'Payout Processed',
          },
        });
      }

      await this.prisma.notification.create({
        data: {
          recipientUserId: managerId,
          typeId: notificationType.id,
          title: 'Payment Received! ≡ƒÆ╡',
          body: `You received EGP ${amount.toFixed(2)} for booking ${bookingCode}. Platform fee: EGP ${platformFee.toFixed(2)}. Net: EGP ${netAmount.toFixed(2)}`,
          actionUrl: `/business/dashboard/payments`,
          sentAt: new Date(),
        },
      });

      this.logger.log(`Payment received notification sent to manager ${managerId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send business payment notification: ${errorMessage}`);
    }
  }

  private getSuccessMessage(pointsUsed: number, pointsEarned: number, discountAmount: number): string {
    if (pointsUsed > 0 && pointsEarned > 0) {
      return `Payment successful! You redeemed ${pointsUsed} points (saved EGP ${discountAmount.toFixed(2)}) and earned ${pointsEarned} new points!`;
    } else if (pointsUsed > 0) {
      return `Payment successful! You redeemed ${pointsUsed} points and saved EGP ${discountAmount.toFixed(2)}!`;
    } else if (pointsEarned > 0) {
      return `Payment successful! You earned ${pointsEarned} loyalty points!`;
    }
    return 'Payment processed successfully!';
  }

  private async handleFailedPayment(paymentId: string, reason: string): Promise<void> {
    const failedStatus = await this.prisma.status.findFirst({
      where: { context: 'FAILED' },
    });

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        statusId: failedStatus?.id || '',
        failureReason: reason,
      },
    });

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (payment) {
      const clientUser = payment.booking.vehicle.client.user;
      await this.sendPaymentFailureNotification(clientUser.id, reason);
    }
  }

  private async sendPaymentFailureNotification(userId: string, reason: string): Promise<void> {
    try {
      let notificationType = await this.prisma.notificationType.findFirst({
        where: { code: 'PAYMENT_FAILED' },
      });

      if (!notificationType) {
        notificationType = await this.prisma.notificationType.create({
          data: {
            code: 'PAYMENT_FAILED',
            label: 'Payment Failed',
          },
        });
      }

      await this.prisma.notification.create({
        data: {
          recipientUserId: userId,
          typeId: notificationType.id,
          title: 'Payment Failed Γ¥î',
          body: `Your payment could not be processed. Reason: ${reason}. Please try again or contact support.`,
          actionUrl: `/payments/retry`,
          sentAt: new Date(),
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send payment failure notification: ${errorMessage}`);
    }
  }

  // ==================== STRIPE WEBHOOK ====================

  async handleStripeWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    let event;

    try {
      event = this.stripeProvider.verifyWebhookSignature(payload, signature);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Webhook signature verification failed: ${message}`);
      return { received: false };
    }

    this.logger.log(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
      include: { status: true },
    });

    if (payment && payment.status?.context !== 'PAID') {
      const amount = Number(payment.amount);
      await this.finalizePayment(payment.id, paymentIntent.id, 0, 0, payment.bookingId, amount);
      this.logger.log(`Payment succeeded for booking: ${payment.bookingId}`);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
    });

    if (payment) {
      await this.handleFailedPayment(payment.id, paymentIntent.last_payment_error?.message || 'Payment failed');
      this.logger.warn(`Payment failed for booking: ${payment.bookingId}`);
    }
  }

  private async handleChargeRefunded(charge: any): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: charge.payment_intent },
    });

    if (payment) {
      const refundedStatus = await this.prisma.status.findFirst({
        where: { context: 'REFUNDED' },
      });

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { statusId: refundedStatus?.id || '' },
      });

      const updatedPayment = await this.prisma.payment.findUnique({
        where: { id: payment.id },
        include: {
          booking: {
            include: {
              vehicle: {
                include: {
                  client: { include: { user: true } },
                },
              },
            },
          },
        },
      });

      if (updatedPayment) {
        const clientUser = updatedPayment.booking.vehicle.client.user;
        await this.sendRefundNotification(clientUser.id, Number(payment.amount));
      }

      this.logger.log(`Payment refunded: ${payment.id}`);
    }
  }

  private async sendRefundNotification(userId: string, amount: number): Promise<void> {
    try {
      let notificationType = await this.prisma.notificationType.findFirst({
        where: { code: 'REFUND_PROCESSED' },
      });

      if (!notificationType) {
        notificationType = await this.prisma.notificationType.create({
          data: {
            code: 'REFUND_PROCESSED',
            label: 'Refund Processed',
          },
        });
      }

      await this.prisma.notification.create({
        data: {
          recipientUserId: userId,
          typeId: notificationType.id,
          title: 'Refund Processed ≡ƒÆ╕',
          body: `A refund of EGP ${amount.toFixed(2)} has been processed to your original payment method.`,
          actionUrl: `/payments/refunds`,
          sentAt: new Date(),
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send refund notification: ${errorMessage}`);
    }
  }

  // ==================== DISPUTES ====================

  async createDispute(userId: string, dto: CreateDisputeDto): Promise<{ success: boolean; dispute_id: string }> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.payment_id },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
        status: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.booking.vehicle.client.userId !== userId) {
      throw new ForbiddenException('You cannot dispute this payment');
    }

    if (payment.status?.context !== 'PAID') {
      throw new BadRequestException('Only paid payments can be disputed');
    }

    // Freeze payment
    const pendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYMENT_PENDING' },
    });

    await this.prisma.payment.update({
      where: { id: dto.payment_id },
      data: { statusId: pendingStatus?.id },
    });

    // Create dispute record
    const dispute = await this.prisma.dispute.create({
      data: {
        paymentId: dto.payment_id,
        bookingId: payment.bookingId,
        reason: dto.reason,
        description: dto.description,
        photoUrls: dto.photo_urls || [],
        desiredOutcome: dto.desired_outcome,
        suggestedAmount: dto.suggested_amount ?? null,
        status: 'PENDING',
      },
    });

    // Send dispute notification
    await this.sendDisputeNotification(payment.booking.business.managerId, dispute.id, dto.reason);

    this.eventEmitter.emit('payment.dispute_created', {
      paymentId: dto.payment_id,
      bookingId: payment.bookingId,
      disputeId: dispute.id,
    });

    return {
      success: true,
      dispute_id: dispute.id,
    };
  }

  private async sendDisputeNotification(managerId: string, disputeId: string, reason: string): Promise<void> {
    try {
      let notificationType = await this.prisma.notificationType.findFirst({
        where: { code: 'DISPUTE_CREATED' },
      });

      if (!notificationType) {
        notificationType = await this.prisma.notificationType.create({
          data: {
            code: 'DISPUTE_CREATED',
            label: 'Dispute Created',
          },
        });
      }

      await this.prisma.notification.create({
        data: {
          recipientUserId: managerId,
          typeId: notificationType.id,
          title: 'Payment Dispute ΓÜá∩╕Å',
          body: `A dispute has been filed for payment. Reason: ${reason}. Please review.`,
          actionUrl: `/admin/disputes/${disputeId}`,
          sentAt: new Date(),
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send dispute notification: ${errorMessage}`);
    }
  }

  // ==================== PAYOUT MANAGEMENT ====================

  async getBusinessPayouts(
    managerId: string,
    businessId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, managerId },
    });

    if (!business) {
      throw new ForbiddenException('You do not own this business');
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        where: { businessId },
        include: {
          status: true,
          payoutBookings: {
            include: {
              booking: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payout.count({ where: { businessId } }),
    ]);

    return {
      data: payouts.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status.context,
        processed_at: p.processedAt,
        created_at: p.createdAt,
        bookings: p.payoutBookings.map(pb => ({
          id: pb.booking.id,
          booking_code: `BK-${pb.booking.id.slice(0, 8).toUpperCase()}`,
          amount: Number(pb.booking.totalPrice),
        })),
      })),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== PAYMENT QUERIES ====================

  async getPayment(paymentId: string, userId: string, userRole: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
        status: true,
        paymentMethod: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const isClient = payment.booking.vehicle.client.userId === userId;
    const isManager = payment.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: payment.id,
      booking_id: payment.bookingId,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status.context,
      provider_ref: payment.providerRef || undefined,
      paid_at: payment.paidAt || undefined,
      created_at: payment.createdAt,
    };
  }

  async getBookingPayment(bookingId: string, userId: string): Promise<PaymentResponseDto | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
        status: true,
      },
    });

    if (!payment) {
      return null;
    }

    const isClient = payment.booking.vehicle.client.userId === userId;
    const isManager = payment.booking.business.managerId === userId;

    if (!isClient && !isManager) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: payment.id,
      booking_id: payment.bookingId,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status.context,
      provider_ref: payment.providerRef || undefined,
      paid_at: payment.paidAt || undefined,
      created_at: payment.createdAt,
    };
  }

  async getUserPayments(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: PaymentResponseDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) {
      return { data: [], meta: { total: 0, page, limit, total_pages: 0 } };
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: {
          booking: {
            vehicle: { clientId: client.id },
          },
        },
        include: {
          status: true,
          booking: {
            include: {
              business: true,
              statusHistory: {
                include: { status: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payment.count({
        where: {
          booking: {
            vehicle: { clientId: client.id },
          },
        },
      }),
    ]);

    return {
      data: payments.map(p => ({
        id: p.id,
        booking_id: p.bookingId,
        booking_code: p.bookingId.substring(0, 8).toUpperCase(),
        booking_status: p.booking?.statusHistory?.[0]?.status?.context || 'UNKNOWN',
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status.context,
        provider_ref: p.providerRef || undefined,
        paid_at: p.paidAt || undefined,
        created_at: p.createdAt,
        booking: {
          id: p.bookingId,
          business: p.booking?.business ? {
            id: p.booking.business.id,
            businessName: p.booking.business.businessName,
          } : undefined,
        }
      })),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getReceipt(paymentId: string, userId: string): Promise<ReceiptResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            business: true,
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            items: {
              include: {
                businessService: {
                  include: { service: true },
                },
              },
            },
          },
        },
        paymentMethod: true,
        status: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const isClient = payment.booking.vehicle.client.userId === userId;
    if (!isClient) {
      throw new ForbiddenException('Access denied');
    }

    const items = payment.booking.items.map(item => ({
      description: item.businessService?.service?.title || 'Service',
      quantity: 1,
      unit_price: Number(item.price),
      total: Number(item.price),
    }));

    return {
      receipt_number: `RCP-${payment.id.slice(0, 8).toUpperCase()}`,
      booking_code: `BK-${payment.bookingId.slice(0, 8).toUpperCase()}`,
      date: payment.paidAt || payment.createdAt,
      from: {
        name: payment.booking.business.businessName,
        address: payment.booking.business.address,
        phone: payment.booking.business.contactPhone || undefined,
        email: payment.booking.business.contactEmail || undefined,
      },
      billed_to: {
        name: payment.booking.vehicle.client.user.fullName,
        email: payment.booking.vehicle.client.user.email,
        phone: payment.booking.vehicle.client.user.phone || undefined,
      },
      subtotal: Number(payment.booking.subTotal),
      discount: Number(payment.booking.discount),
      total: Number(payment.amount),
      payment_method: payment.paymentMethod.name,
      provider_ref: payment.providerRef || undefined,
      status: payment.status.context,
    };
  }

  // ==================== PRIVATE HELPERS ====================

  private async getBookingStatus(bookingId: string): Promise<string> {
    const status = await this.prisma.bookingStatus.findFirst({
      where: { bookingId },
      include: { status: true },
      orderBy: { createdAt: 'desc' },
    });
    return status?.status?.context || 'PENDING';
  }
}
