import { BaseEntity } from '../common/index';
import { PaymentMethod, PaymentStatus } from '../enums';

export interface PaymentRecord extends BaseEntity {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId: string | null;
  paypalOrderId: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: Date | null;
  refundedBy: string | null;
  metadata: Record<string, unknown>;
}

export interface SavedPaymentMethod extends BaseEntity {
  customerId: string;
  provider: 'stripe' | 'paypal';
  token: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface ProcessPaymentRequest {
  bookingId: string;
  paymentMethodId?: string;
  savePaymentMethod?: boolean;
  idempotencyKey: string;
}

export interface RefundRequest {
  bookingId: string;
  amount?: number;
  reason: string;
}

export interface SplitPayment extends BaseEntity {
  bookingId: string;
  totalAmount: number;
  splits: SplitPaymentItem[];
  expiresAt: Date;
}

export interface SplitPaymentItem {
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'paid' | 'failed';
}