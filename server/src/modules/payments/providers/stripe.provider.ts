import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface StripePaymentIntentDto {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  bookingId: string;
  metadata?: Record<string, string>;
}

export interface StripeRefundDto {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

@Injectable()
export class StripeProvider {
  private readonly logger = new Logger(StripeProvider.name);
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not configured');
    } else {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2024-06-20',
        maxNetworkRetries: 3,
        timeout: 30000,
      });
      this.logger.log('Stripe provider initialized');
    }
  }

  /**
   * Create a Payment Intent
   */
  async createPaymentIntent(dto: StripePaymentIntentDto): Promise<{
    client_secret: string;
    payment_intent_id: string;
    amount: number;
    currency: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(dto.amount * 100), // Convert to cents
        currency: dto.currency.toLowerCase(),
        description: `Booking ${dto.bookingId}`,
        receipt_email: dto.customerEmail,
        metadata: {
          booking_id: dto.bookingId,
          customer_name: dto.customerName,
          customer_email: dto.customerEmail,
          ...dto.metadata,
        },
        statement_descriptor: 'GlowFix Booking',
        statement_descriptor_suffix: 'Car Service',
      });

      this.logger.log(`Payment Intent created: ${paymentIntent.id} for booking ${dto.bookingId}`);

      return {
        client_secret: paymentIntent.client_secret!,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create Payment Intent: ${message}`);
      throw new HttpException(
        `Payment processing failed: ${message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieve a Payment Intent
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to retrieve Payment Intent: ${message}`);
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Confirm a Payment Intent
   */
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to confirm Payment Intent: ${message}`);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Cancel a Payment Intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to cancel Payment Intent: ${message}`);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Process refund
   */
  async createRefund(dto: StripeRefundDto): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: dto.paymentIntentId,
        reason: dto.reason || 'requested_by_customer',
      };

      if (dto.amount) {
        refundParams.amount = Math.round(dto.amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);

      this.logger.log(`Refund created for Payment Intent: ${dto.paymentIntentId}`);

      return refund;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create refund: ${message}`);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create a Customer
   */
  async createCustomer(email: string, name: string, phone?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
        metadata: {
          source: 'glowfix',
        },
      });

      this.logger.log(`Customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create customer: ${message}`);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Attach Payment Method to Customer
   */
  async attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to attach payment method: ${message}`);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * List Payment Methods for Customer
   */
  async listCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      this.logger.error(`Failed to list payment methods: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.warn('STRIPE_WEBHOOK_SECRET is not configured');
      return JSON.parse(payload.toString()) as Stripe.Event;
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook signature verification failed: ${message}`);
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }
  }
}