import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { PaymentsRepository } from '../repositories/payments.repository';
import { StripeProvider } from '../providers/stripe.provider';
import { PaymentLoyaltyService } from './payment-loyalty.service';
import { PaymentNotificationService } from './payment-notification.service';
import { IPaymentService } from '../interfaces/payment-service.interface';
import { ProcessPaymentDto, ConfirmPaymentDto } from '../dto/request/process-payment.dto';
import { CreateDisputeDto } from '../dto/request/create-dispute.dto';
import { ProcessPaymentResponseDto } from '../dto/response/process-payment-response.dto';
import { PaymentResponseDto, ReceiptResponseDto } from '../dto/response/payment-response.dto';
import {
  BookingNotFoundException,
  PaymentOwnershipException,
  PaymentAlreadyPaidException,
  BookingNotPayableException,
  InsufficientAmountException,
  UnsupportedPaymentMethodException,
  PaymentNotFoundException,
  DisputeNotAllowedException,
  AccessDeniedException,
} from '../exceptions/payment.exceptions';
import { PaymentMethod, PAYMENT_STATUS_CONTEXTS } from '../constants/payment.constants';
import { PaymentWithFullBooking } from '../interfaces/payment-repository.interface';

@Injectable()
export class PaymentsService implements IPaymentService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly stripeProvider: StripeProvider,
    private readonly loyaltyService: PaymentLoyaltyService,
    private readonly notificationService: PaymentNotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private generateBookingCode(bookingId: string): string {
    return `BK-${bookingId.slice(0, 8).toUpperCase()}`;
  }

  // ==================== PAYMENT PROCESSING ====================

  async processPayment(userId: string, dto: ProcessPaymentDto): Promise<ProcessPaymentResponseDto> {
    const booking = await this.paymentsRepository.findBookingWithRelations(dto.booking_id);

    if (!booking) {
      throw new BookingNotFoundException();
    }

    if (booking.vehicle.client.userId !== userId) {
      throw new PaymentOwnershipException();
    }

    if (booking.payment?.status?.context === PAYMENT_STATUS_CONTEXTS.PAID) {
      throw new PaymentAlreadyPaidException();
    }

    const bookingStatus = await this.paymentsRepository.getBookingStatus(booking.id);
    const payableStatuses = ['ACCEPTED'];
    if (!payableStatuses.includes(bookingStatus)) {
      throw new BookingNotPayableException(bookingStatus);
    }

    const clientId = booking.vehicle.client.id;
    const pointsBalance = await this.loyaltyService.getPointsBalance(clientId);
    const loyaltyConfig = await this.paymentsRepository.getLoyaltyConfig();

    let totalAmount = Number(booking.totalPrice);
    let loyaltyDiscount = 0;
    let pointsUsed = 0;

    if (dto.redeem_points && pointsBalance >= 100) {
      const redemptionDetails = await this.loyaltyService.calculateRedemption(
        totalAmount,
        dto.points_to_redeem,
        pointsBalance,
        loyaltyConfig,
      );

      if (redemptionDetails.eligible && redemptionDetails.discountAmount > 0) {
        loyaltyDiscount = redemptionDetails.discountAmount;
        totalAmount = Math.max(0, totalAmount - loyaltyDiscount);
        pointsUsed = redemptionDetails.pointsUsed;
      }
    }

    if (dto.amount && dto.amount > 0) {
      if (dto.amount > Number(booking.totalPrice)) {
        throw new InsufficientAmountException('Payment amount cannot exceed booking total');
      }
      totalAmount = dto.amount;
    }

    const paymentMethod = await this.paymentsRepository.findOrCreatePaymentMethod(dto.payment_method);
    const pendingStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.PENDING);

    const paymentData = {
      bookingId: dto.booking_id,
      paymentMethodId: paymentMethod.id,
      provider: 'stripe',
      amount: totalAmount,
      currency: 'EGP',
      statusId: pendingStatus.id,
      idempotencyKey: randomUUID(),
    };

    const payment = await this.paymentsRepository.upsertPayment(dto.booking_id, paymentData);

    const customerName = booking.vehicle.client.user.fullName;
    const customerEmail = booking.vehicle.client.user.email;
    const customerPhone = booking.vehicle.client.user.phone || '';

    switch (dto.payment_method) {
      case PaymentMethod.CARD:
        return this.processCardPayment(payment, {
          amount: totalAmount,
          currency: 'EGP',
          customerEmail,
          customerName,
          customerPhone,
          bookingId: booking.id,
          pointsUsed,
          loyaltyDiscount,
        });

      case PaymentMethod.CASH:
        return this.processCashPayment(payment, booking.id, loyaltyDiscount, pointsUsed, totalAmount);

      default:
        throw new UnsupportedPaymentMethodException();
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
        throw new InsufficientAmountException();
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

      await this.paymentsRepository.updatePayment(payment.id, {
        providerRef: paymentIntent.payment_intent_id,
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
      throw new InsufficientAmountException(message);
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

  async confirmPayment(userId: string, dto: ConfirmPaymentDto): Promise<ProcessPaymentResponseDto> {
    const paymentIntent = await this.stripeProvider.retrievePaymentIntent(dto.payment_intent_id);

    const payment = await this.paymentsRepository.findPaymentByProviderRef(dto.payment_intent_id);

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    const fullPayment = await this.paymentsRepository.findPaymentById(payment.id) as PaymentWithFullBooking;
    if (fullPayment.booking.vehicle.client.userId !== userId) {
      throw new PaymentOwnershipException();
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
      throw new InsufficientAmountException('Payment requires payment method');
    } else if (paymentIntent.status === 'requires_confirmation') {
      throw new InsufficientAmountException('Payment requires confirmation');
    } else {
      throw new InsufficientAmountException(`Payment status: ${paymentIntent.status}`);
    }
  }

  async finalizePayment(
    paymentId: string,
    providerRef: string,
    loyaltyDiscount: number,
    pointsUsed: number,
    bookingId: string,
    amount: number,
  ): Promise<ProcessPaymentResponseDto> {
    const lockedPayment = await this.paymentsRepository.lockPaymentRow(paymentId);
    if (!lockedPayment) {
      throw new PaymentNotFoundException();
    }

    const paidStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.PAID);
    const confirmedStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.CONFIRMED);

    if (lockedPayment.status_id === paidStatus.id) {
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

    const updatedPayment = await this.paymentsRepository.updatePayment(paymentId, {
      providerRef,
      statusId: paidStatus.id,
      paidAt: new Date(),
    }) as PaymentWithFullBooking;

    let pointsEarned = 0;
    const clientUser = updatedPayment.booking.vehicle.client.user;
    const clientId = updatedPayment.booking.vehicle.client.id;
    const bookingCode = this.generateBookingCode(bookingId);

    await this.loyaltyService.recordPointsRedemption(clientId, bookingId, pointsUsed, loyaltyDiscount);

    await this.paymentsRepository.createBookingStatus(bookingId, confirmedStatus.id);

    await this.notificationService.sendBookingConfirmedNotification(clientUser.id, bookingId, bookingCode);

    this.logger.log(`Payment finalized: ${paymentId}`);

    await this.notificationService.sendPaymentSuccessNotification(
      updatedPayment.id,
      clientUser.id,
      amount,
      bookingCode,
      pointsUsed,
      pointsEarned,
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
      businessId: updatedPayment.booking.business.id,
      businessName: updatedPayment.booking.business.businessName,
    });

    return {
      success: true,
      payment_id: updatedPayment.id,
      amount,
      loyalty_points_used: pointsUsed,
      loyalty_points_earned: pointsEarned,
      receipt_url: `/api/v1/payments/${updatedPayment.id}/receipt`,
      message: this.loyaltyService.getSuccessMessage(pointsUsed, pointsEarned, loyaltyDiscount),
    };
  }

  private async handleFailedPayment(paymentId: string, reason: string): Promise<void> {
    const failedStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.FAILED);

    const payment = await this.paymentsRepository.updatePayment(paymentId, {
      statusId: failedStatus.id,
      failureReason: reason,
    }) as PaymentWithFullBooking;

    if (payment) {
      const clientUser = payment.booking.vehicle.client.user;
      await this.notificationService.sendPaymentFailureNotification(clientUser.id, reason);
    }
  }

  // ==================== DISPUTES ====================

  async createDispute(userId: string, dto: CreateDisputeDto): Promise<{ success: boolean; dispute_id: string }> {
    const payment = await this.paymentsRepository.findPaymentById(dto.payment_id) as PaymentWithFullBooking & { status: { context: string } };

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    if (payment.booking.vehicle.client.userId !== userId) {
      throw new PaymentOwnershipException('You cannot dispute this payment');
    }

    if (payment.status?.context !== PAYMENT_STATUS_CONTEXTS.PAID) {
      throw new DisputeNotAllowedException();
    }

    const pendingStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.PENDING);

    await this.paymentsRepository.updatePayment(dto.payment_id, { statusId: pendingStatus.id });

    const dispute = await this.paymentsRepository.createDispute({
      paymentId: dto.payment_id,
      bookingId: payment.bookingId,
      reason: dto.reason,
      description: dto.description,
      photoUrls: dto.photo_urls || [],
      desiredOutcome: dto.desired_outcome,
      suggestedAmount: dto.suggested_amount ?? null,
      status: 'PENDING',
    });

    if (payment.booking.business.managerId) {
      await this.notificationService.sendDisputeNotification(payment.booking.business.managerId, dispute.id, dto.reason);
    }

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

  // ==================== PAYMENT QUERIES ====================

  async getPayment(paymentId: string, userId: string, userRole: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.findPaymentById(paymentId);

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    const isClient = payment.booking.vehicle.client.userId === userId;
    const isManager = payment.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new AccessDeniedException();
    }

    return this.mapToPaymentResponse(payment);
  }

  async getBookingPayment(bookingId: string, userId: string): Promise<PaymentResponseDto | null> {
    const payment = await this.paymentsRepository.findPaymentByBookingId(bookingId);

    if (!payment) return null;

    const isClient = payment.booking.vehicle.client.userId === userId;
    const isManager = payment.booking.business.managerId === userId;

    if (!isClient && !isManager) {
      throw new AccessDeniedException();
    }

    return this.mapToPaymentResponse(payment);
  }

  async getUserPayments(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: PaymentResponseDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const client = await this.paymentsRepository.findClientByUserId(userId);

    if (!client) {
      return { data: [], meta: { total: 0, page, limit, total_pages: 0 } };
    }

    const payments = await this.paymentsRepository.findPaymentsByClientId(client.id, skip, take);
    const total = await this.paymentsRepository.countPaymentsByClientId(client.id);

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
    const payment = await this.paymentsRepository.findPaymentById(paymentId);

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    const isClient = payment.booking.vehicle.client.userId === userId;
    if (!isClient) {
      throw new AccessDeniedException();
    }

    const items = payment.booking.items.map((item: any) => ({
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

  private mapToPaymentResponse(payment: any): PaymentResponseDto {
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
}
