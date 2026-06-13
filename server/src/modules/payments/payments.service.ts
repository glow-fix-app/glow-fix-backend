import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import {
  ProcessPaymentDto,
  PaymentMethod,
  ProcessPaymentResponseDto,
} from './dto/process-payment.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { CreateDisputeDto, DisputeReason, DesiredOutcome } from './dto/dispute-payment.dto';
import { ProcessPayoutDto } from './dto/payout.dto';
import { PaymentResponseDto, ReceiptResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly PLATFORM_FEE_PERCENT = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    const payableStatuses = ['READY_FOR_PICKUP', 'COMPLETED'];
    if (!payableStatuses.includes(bookingStatus)) {
      throw new BadRequestException(`Booking cannot be paid in status: ${bookingStatus}`);
    }

    // Calculate total amount and loyalty discount
    let totalAmount = Number(booking.totalPrice);
    let loyaltyDiscount = 0;
    let pointsUsed = 0;

    if (dto.redeem_points) {
      const redemptionResult = await this.calculateLoyaltyRedemption(
        booking.vehicle.client.userId,
        totalAmount,
        dto.points_to_redeem,
      );

      if (redemptionResult.eligible && redemptionResult.discountAmount > 0) {
        loyaltyDiscount = redemptionResult.discountAmount;
        totalAmount = totalAmount - loyaltyDiscount;
        pointsUsed = redemptionResult.pointsUsed;
      }
    }

    // Override with manual amount if provided
    if (dto.amount && dto.amount > 0) {
      if (dto.amount > Number(booking.totalPrice)) {
        throw new BadRequestException('Payment amount cannot exceed booking total');
      }
      totalAmount = dto.amount;
    }

    // Get payment method
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { name: dto.payment_method },
    });

    if (!paymentMethod) {
      throw new BadRequestException('Invalid payment method');
    }

    // Get PENDING status
    const pendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYMENT_PENDING' },
    });

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.booking_id,
        paymentMethodId: paymentMethod.id,
        provider: dto.provider,
        amount: totalAmount,
        currency: 'EGP',
        statusId: pendingStatus?.id || '',
        idempotencyKey: randomUUID(),
      },
    });

    // Process based on payment method
    let paymentResult;
    switch (dto.payment_method) {
      case PaymentMethod.CARD:
        paymentResult = await this.processCardPayment(payment, dto.provider_token);
        break;
      case PaymentMethod.CASH:
        paymentResult = await this.processCashPayment(payment);
        break;
      case PaymentMethod.WALLET:
        paymentResult = await this.processWalletPayment(booking.vehicle.client.userId, payment);
        break;
      default:
        throw new BadRequestException('Unsupported payment method');
    }

    if (paymentResult.success && paymentResult.provider_ref) {
      return this.finalizePayment(
        payment.id,
        paymentResult.provider_ref,
        loyaltyDiscount,
        pointsUsed,
        booking.id,
      );
    }

    await this.handleFailedPayment(payment.id, paymentResult.error ?? 'Payment failed');
    throw new BadRequestException(paymentResult.error || 'Payment failed');
  }

  private async processCardPayment(
    payment: any,
    providerToken?: string,
  ): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
    if (!providerToken) {
      return { success: false, error: 'Card token is required' };
    }

    this.logger.log(`Processing card payment ${payment.id} for ${Number(payment.amount)} EGP`);

    // TODO: Integrate with Stripe/Paymob
    return {
      success: true,
      provider_ref: `txn_${Date.now()}_${payment.id.slice(0, 8)}`,
    };
  }

  private async processCashPayment(payment: any): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
    return {
      success: true,
      provider_ref: `cash_${payment.id.slice(0, 8)}`,
    };
  }

  private async processWalletPayment(
    userId: string,
    payment: any,
  ): Promise<{ success: boolean; provider_ref?: string; error?: string }> {
    // TODO: Implement wallet balance check
    return {
      success: true,
      provider_ref: `wallet_${payment.id.slice(0, 8)}`,
    };
  }

  private async calculateLoyaltyRedemption(
    userId: string,
    totalAmount: number,
    pointsToRedeem?: number,
  ): Promise<{ eligible: boolean; discountAmount: number; pointsUsed: number }> {
    // Get loyalty config
    const config = await this.prisma.loyaltyConfig.findFirst();

    if (!config || !config.isActive) {
      return { eligible: false, discountAmount: 0, pointsUsed: 0 };
    }

    // Get client points balance
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) {
      return { eligible: false, discountAmount: 0, pointsUsed: 0 };
    }

    const balanceResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId: client.id },
      _sum: { points: true },
    });
    const pointsBalance = balanceResult._sum.points || 0;

    const maxDiscountPercent = config.maxRedeemPct;
    const maxDiscountAmount = (totalAmount * maxDiscountPercent) / 100;
    const pointsPerEGP = 1 / Number(config.egpPerPoint);
    const maxPointsForDiscount = maxDiscountAmount * pointsPerEGP;

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
  ): Promise<ProcessPaymentResponseDto> {
    const paidStatus = await this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        providerRef,
        statusId: paidStatus?.id || '',
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
          },
        },
      },
    });

    let pointsEarned = 0;
    const clientId = payment.booking.vehicle.client.id;

    // Award loyalty points
    if (Number(payment.amount) > 0) {
      const config = await this.prisma.loyaltyConfig.findFirst();
      if (config && config.isActive) {
        pointsEarned = Math.floor((Number(payment.amount) / 100) * config.pointsPer100Egp);
        await this.prisma.loyaltyTransaction.create({
          data: {
            clientId,
            bookingId,
            type: 'EARNED',
            points: pointsEarned,
            reason: `Earned ${pointsEarned} points from booking`,
          },
        });
      }
    }

    // Record points redemption
    if (pointsUsed > 0) {
      await this.prisma.loyaltyTransaction.create({
        data: {
          clientId,
          bookingId,
          type: 'REDEEMED',
          points: -pointsUsed,
          reason: `Redeemed ${pointsUsed} points for EGP ${loyaltyDiscount.toFixed(2)} discount`,
        },
      });
    }

    // Update booking status to COMPLETED
    const completedStatus = await this.prisma.status.findFirst({
      where: { context: 'COMPLETED' },
    });

    if (completedStatus) {
      await this.prisma.bookingStatus.create({
        data: {
          bookingId,
          statusId: completedStatus.id,
        },
      });
    }

    // Create payout for provider
    const grossAmount = Number(payment.booking.totalPrice);
    const platformFee = (grossAmount * this.PLATFORM_FEE_PERCENT) / 100;
    const netAmount = grossAmount - platformFee;

    const payoutPendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYOUT_PENDING' },
    });

    const payout = await this.prisma.payout.create({
      data: {
        businessId: payment.booking.business.id,
        amount: netAmount,
        statusId: payoutPendingStatus?.id || '',
      },
    });

    await this.prisma.payoutBooking.create({
      data: {
        payoutId: payout.id,
        bookingId,
      },
    });

    this.logger.log(`Payment finalized: ${paymentId}, payout created: ${payout.id}`);

    this.eventEmitter.emit('payment.completed', {
      bookingId,
      paymentId,
      amount: Number(payment.amount),
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsUsed: pointsUsed,
    });

    return {
      success: true,
      payment_id: payment.id,
      amount: Number(payment.amount),
      loyalty_points_used: pointsUsed,
      loyalty_points_earned: pointsEarned,
      receipt_url: `/api/v1/payments/${payment.id}/receipt`,
      message: 'Payment processed successfully',
    };
  }

  private async handleFailedPayment(paymentId: string, reason: string): Promise<void> {
    const failedStatus = await this.prisma.status.findFirst({
      where: { context: 'FAILED' },
    });

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        statusId: failedStatus?.id || '',
      },
    });
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
      paid_at: payment.status.context === 'PAID' ? payment.updatedAt : undefined,
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
      paid_at: payment.status.context === 'PAID' ? payment.updatedAt : undefined,
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
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status.context,
        provider_ref: p.providerRef || undefined,
        paid_at: p.status.context === 'PAID' ? p.updatedAt : undefined,
        created_at: p.createdAt,
        booking: {
          business: {
            businessName: p.booking.business.businessName,
          },
        },
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
      date: payment.status.context === 'PAID' ? payment.updatedAt : payment.createdAt,
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

  // ==================== WEBHOOK HANDLING ====================

  async handleWebhook(provider: string, payload: any): Promise<{ received: boolean }> {
    this.logger.log(`Webhook received from ${provider}`);

    let providerRef: string;
    let status: string;

    switch (provider) {
      case 'stripe':
        providerRef = payload.data.object.id;
        status = payload.type === 'payment_intent.succeeded' ? 'PAID' : 'FAILED';
        break;
      default:
        this.logger.warn(`Unknown provider: ${provider}`);
        return { received: true };
    }

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef },
      include: { status: true },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for provider_ref: ${providerRef}`);
      return { received: true };
    }

    if (status === 'PAID' && payment.status?.context !== 'PAID') {
      await this.finalizePayment(payment.id, providerRef, 0, 0, payment.bookingId);
    }

    return { received: true };
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
    const dispute = await this.prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO disputes (id, payment_id, booking_id, reason, description, photo_urls, desired_outcome, suggested_amount, status, created_at)
      VALUES (gen_random_uuid(), ${dto.payment_id}::uuid, ${payment.bookingId}::uuid, ${dto.reason}, ${dto.description}, ${dto.photo_urls}, ${dto.desired_outcome}, ${dto.suggested_amount}, 'PENDING', NOW())
      RETURNING id
    `;

    this.eventEmitter.emit('payment.dispute_created', {
      paymentId: dto.payment_id,
      bookingId: payment.bookingId,
      disputeId: dispute[0]?.id,
    });

    return {
      success: true,
      dispute_id: dispute[0]?.id,
    };
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