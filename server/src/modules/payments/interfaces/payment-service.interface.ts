import { ProcessPaymentDto, ConfirmPaymentDto } from '../dto/request/process-payment.dto';
import { ProcessPaymentResponseDto } from '../dto/response/process-payment-response.dto';
import { PaymentResponseDto, ReceiptResponseDto } from '../dto/response/payment-response.dto';

export interface IPaymentService {
  processPayment(userId: string, dto: ProcessPaymentDto): Promise<ProcessPaymentResponseDto>;
  confirmPayment(userId: string, dto: ConfirmPaymentDto): Promise<ProcessPaymentResponseDto>;
  getPayment(paymentId: string, userId: string, userRole: string): Promise<PaymentResponseDto>;
  getBookingPayment(bookingId: string, userId: string): Promise<PaymentResponseDto | null>;
  getUserPayments(userId: string, page: number, limit: number): Promise<{ data: PaymentResponseDto[]; meta: any }>;
  getReceipt(paymentId: string, userId: string): Promise<ReceiptResponseDto>;
}
