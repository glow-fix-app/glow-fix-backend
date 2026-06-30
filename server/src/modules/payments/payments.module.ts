import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { StripeProvider } from './providers/stripe.provider';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentsService } from './services/payments.service';
import { PaymentWebhookService } from './services/payment-webhook.service';
import { PaymentNotificationService } from './services/payment-notification.service';
import { PaymentLoyaltyService } from './services/payment-loyalty.service';
import { PaymentPayoutService } from './services/payment-payout.service';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    PaymentsRepository,
    PaymentsService,
    PaymentWebhookService,
    PaymentNotificationService,
    PaymentLoyaltyService,
    PaymentPayoutService,
    StripeProvider,
  ],
  exports: [PaymentsService, PaymentPayoutService, StripeProvider],
})
export class PaymentsModule {}