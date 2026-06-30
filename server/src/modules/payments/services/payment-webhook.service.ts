import { Injectable, Logger } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { StripeProvider } from '../providers/stripe.provider';
import { PaymentNotificationService } from './payment-notification.service';
import { PAYMENT_STATUS_CONTEXTS } from '../constants/payment.constants';
import { WebhookSignatureException } from '../exceptions/payment.exceptions';
import { PaymentWithFullBooking } from '../interfaces/payment-repository.interface';

@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly stripeProvider: StripeProvider,
    private readonly notificationService: PaymentNotificationService,
  ) {}

  async handleStripeWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    let event;

    try {
      event = this.stripeProvider.verifyWebhookSignature(payload, signature);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Webhook signature verification failed: ${message}`);
      throw new WebhookSignatureException();
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
    const payment = await this.paymentsRepository.findPaymentByProviderRef(paymentIntent.id);

    // The actual finalization is handled by the main orchestrator (PaymentsService)
    // We only log here because PaymentsService.finalizePayment should handle the success case.
    if (payment && payment.status?.context !== PAYMENT_STATUS_CONTEXTS.PAID) {
      this.logger.log(`Payment succeeded for booking: ${payment.bookingId} - Pending finalization.`);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
    const payment = await this.paymentsRepository.findPaymentByProviderRef(paymentIntent.id);

    if (payment) {
      const reason = paymentIntent.last_payment_error?.message || 'Payment failed';
      
      const failedStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.FAILED);
      
      const updatedPayment = await this.paymentsRepository.updatePayment(payment.id, {
        statusId: failedStatus.id,
        failureReason: reason,
      }) as PaymentWithFullBooking;

      if (updatedPayment) {
        const clientUser = updatedPayment.booking.vehicle.client.user;
        await this.notificationService.sendPaymentFailureNotification(clientUser.id, reason);
      }
      
      this.logger.warn(`Payment failed for booking: ${payment.bookingId}`);
    }
  }

  private async handleChargeRefunded(charge: any): Promise<void> {
    const payment = await this.paymentsRepository.findPaymentByProviderRef(charge.payment_intent);

    if (payment) {
      const refundedStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.REFUNDED);

      const updatedPayment = await this.paymentsRepository.updatePayment(payment.id, {
        statusId: refundedStatus.id,
      }) as PaymentWithFullBooking;

      if (updatedPayment) {
        const clientUser = updatedPayment.booking.vehicle.client.user;
        await this.notificationService.sendRefundNotification(clientUser.id, Number(payment.amount));
      }

      this.logger.log(`Payment refunded: ${payment.id}`);
    }
  }
}
