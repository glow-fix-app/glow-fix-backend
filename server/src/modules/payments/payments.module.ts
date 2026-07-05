import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { StripeProvider } from './providers/stripe.provider';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentProcessingService } from './services/payment-processing.service';
import { PaymentQueryService } from './services/payment-query.service';
import { PaymentDisputeService } from './services/payment-dispute.service';
import { PaymentWebhookService } from './services/payment-webhook.service';
import { PaymentNotificationService } from './services/payment-notification.service';
import { PaymentLoyaltyService } from './services/payment-loyalty.service';
import { PaymentPayoutService } from './services/payment-payout.service';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    PaymentsRepository,
    PaymentProcessingService,
    PaymentQueryService,
    PaymentDisputeService,
    PaymentWebhookService,
    PaymentNotificationService,
    PaymentLoyaltyService,
    PaymentPayoutService,
    StripeProvider,
  ],
  exports: [
    PaymentProcessingService,
    PaymentQueryService,
    PaymentPayoutService,
    StripeProvider,
  ],
})
export class PaymentsModule {}