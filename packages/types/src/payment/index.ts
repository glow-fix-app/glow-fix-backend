import { BaseEntity } from '../common/index';

export interface Payment extends BaseEntity {
  bookingId: string;
  paymentMethodId: string;
  statusId: string;
  amount: number;
  transactionRef: string | null;
  providerDetails: Record<string, any> | null;
}

export interface Payout extends BaseEntity {
  businessId: string;
  statusId: string;
  amount: number;
  providerRef: string | null;
}

export interface ProcessPaymentRequest {
  bookingId: string;
  paymentMethodId: string;
}

export interface RefundRequest {
  bookingId: string;
  amount?: number;
  reason: string;
}