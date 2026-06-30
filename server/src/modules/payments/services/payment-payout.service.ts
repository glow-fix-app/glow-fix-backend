import { Injectable, Logger } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentNotificationService } from './payment-notification.service';
import { PAYMENT_STATUS_CONTEXTS, DEFAULT_PLATFORM_FEE_PCT } from '../constants/payment.constants';
import { BookingNotFoundException, PayoutOwnershipException } from '../exceptions/payment.exceptions';
import { PayoutWithRelations } from '../interfaces/payment-repository.interface';

@Injectable()
export class PaymentPayoutService {
  private readonly logger = new Logger(PaymentPayoutService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly notificationService: PaymentNotificationService,
  ) {}

  async createPayoutForCompletedBooking(bookingId: string): Promise<void> {
    const existingPayoutBooking = await this.paymentsRepository.findPayoutBookingByBookingId(bookingId);

    if (existingPayoutBooking) {
      this.logger.log(`Payout already exists for completed booking: ${bookingId}. Skipping.`);
      return;
    }

    const booking = await this.paymentsRepository.findBookingWithRelations(bookingId);

    if (!booking) {
      throw new BookingNotFoundException(`Booking ${bookingId} not found`);
    }

    if (!booking.payment || booking.payment.status?.context !== PAYMENT_STATUS_CONTEXTS.PAID) {
      this.logger.warn(`Booking ${bookingId} has no PAID payment. Skipping payout creation.`);
      return;
    }

    const settings = await this.paymentsRepository.getSettings();
    const platformFeePercent = settings?.businessFeePct ? Number(settings.businessFeePct) : DEFAULT_PLATFORM_FEE_PCT;

    const grossAmount = Number(booking.totalPrice);
    const platformFee = (grossAmount * platformFeePercent) / 100;
    const netAmount = grossAmount - platformFee;

    const payoutPendingStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.PAYOUT_PENDING);

    await this.paymentsRepository.createPayoutWithBooking({
      businessId: booking.business.id,
      amount: netAmount,
      statusId: payoutPendingStatus.id,
      bookingId,
    });

    this.logger.log(`Payout created for completed booking: ${bookingId}`);

    const bookingCode = `BK-${bookingId.slice(0, 8).toUpperCase()}`;

    if (booking.business.managerId) {
      await this.notificationService.sendPaymentReceivedNotification(
        booking.business.managerId,
        bookingCode,
        Number(booking.payment.amount),
        platformFee,
        netAmount,
      );
    }
  }

  async getBusinessPayouts(
    managerId: string,
    businessId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    const business = await this.paymentsRepository.findBusinessByIdAndManager(businessId, managerId);

    if (!business) {
      throw new PayoutOwnershipException();
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const payouts = await this.paymentsRepository.findBusinessPayouts(businessId, skip, take);
    const total = await this.paymentsRepository.countBusinessPayouts(businessId);

    return {
      data: payouts.map((p: PayoutWithRelations) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status.context,
        processed_at: p.processedAt,
        created_at: p.createdAt,
        bookings: p.payoutBookings.map((pb) => ({
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
}
