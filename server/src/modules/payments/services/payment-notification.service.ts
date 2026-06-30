import { Injectable, Logger } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { NOTIFICATION_CODES } from '../constants/payment.constants';

@Injectable()
export class PaymentNotificationService {
  private readonly logger = new Logger(PaymentNotificationService.name);

  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async sendPaymentSuccessNotification(
    paymentId: string,
    userId: string,
    amount: number,
    bookingCode: string,
    pointsUsed: number,
    pointsEarned: number,
    discountAmount: number,
  ): Promise<void> {
    try {
      const notificationType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.PAYMENT_RECEIVED,
        'Payment Received',
      );

      let message = `Your payment of EGP ${amount.toFixed(2)} for booking ${bookingCode} was successful.`;
      
      if (pointsUsed > 0) {
        message += ` You redeemed ${pointsUsed} points and saved EGP ${discountAmount.toFixed(2)}!`;
      }
      if (pointsEarned > 0) {
        message += ` You earned ${pointsEarned} loyalty points.`;
      }

      await this.paymentsRepository.createNotification({
        recipientUserId: userId,
        typeId: notificationType.id,
        title: 'Payment Successful! 💰',
        body: message,
        actionUrl: `/payments/${paymentId}`,
        sentAt: new Date(),
      });

      this.logger.log(`Payment success notification sent to user ${userId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send payment notification: ${errorMessage}`);
    }
  }

  async sendPaymentFailureNotification(userId: string, reason: string): Promise<void> {
    try {
      const notificationType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.PAYMENT_FAILED,
        'Payment Failed',
      );

      await this.paymentsRepository.createNotification({
        recipientUserId: userId,
        typeId: notificationType.id,
        title: 'Payment Failed ❌',
        body: `Your payment could not be processed. Reason: ${reason}. Please try again or contact support.`,
        actionUrl: `/payments/retry`,
        sentAt: new Date(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send payment failure notification: ${errorMessage}`);
    }
  }

  async sendPaymentReceivedNotification(
    managerId: string,
    bookingCode: string,
    amount: number,
    platformFee: number,
    netAmount: number,
  ): Promise<void> {
    try {
      const notificationType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.PAYOUT_PROCESSED,
        'Payout Processed',
      );

      await this.paymentsRepository.createNotification({
        recipientUserId: managerId,
        typeId: notificationType.id,
        title: 'Payment Received! 💵',
        body: `You received EGP ${amount.toFixed(2)} for booking ${bookingCode}. Platform fee: EGP ${platformFee.toFixed(2)}. Net: EGP ${netAmount.toFixed(2)}`,
        actionUrl: `/business/dashboard/payments`,
        sentAt: new Date(),
      });

      this.logger.log(`Payment received notification sent to manager ${managerId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send business payment notification: ${errorMessage}`);
    }
  }

  async sendRefundNotification(userId: string, amount: number): Promise<void> {
    try {
      const notificationType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.REFUND_PROCESSED,
        'Refund Processed',
      );

      await this.paymentsRepository.createNotification({
        recipientUserId: userId,
        typeId: notificationType.id,
        title: 'Refund Processed 💸',
        body: `A refund of EGP ${amount.toFixed(2)} has been processed to your original payment method.`,
        actionUrl: `/payments/refunds`,
        sentAt: new Date(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send refund notification: ${errorMessage}`);
    }
  }

  async sendDisputeNotification(managerId: string, disputeId: string, reason: string): Promise<void> {
    try {
      const notificationType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.DISPUTE_CREATED,
        'Dispute Created',
      );

      await this.paymentsRepository.createNotification({
        recipientUserId: managerId,
        typeId: notificationType.id,
        title: 'Payment Dispute ⚠️',
        body: `A dispute has been filed for payment. Reason: ${reason}. Please review.`,
        actionUrl: `/admin/disputes/${disputeId}`,
        sentAt: new Date(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send dispute notification: ${errorMessage}`);
    }
  }

  async sendBookingConfirmedNotification(userId: string, bookingId: string, bookingCode: string): Promise<void> {
    try {
      const confNotifType = await this.paymentsRepository.findOrCreateNotificationType(
        NOTIFICATION_CODES.BOOKING_CONFIRMED,
        'Booking Confirmed',
      );

      await this.paymentsRepository.createNotification({
        recipientUserId: userId,
        typeId: confNotifType.id,
        title: 'Booking Confirmed!',
        body: `Your payment was successful and your booking ${bookingCode} has been officially confirmed!`,
        actionUrl: `/client/bookings/${bookingId}`,
        sentAt: new Date(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send booking confirmed notification: ${errorMessage}`);
    }
  }
}
