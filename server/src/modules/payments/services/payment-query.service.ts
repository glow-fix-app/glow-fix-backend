import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentResponseDto, ReceiptResponseDto } from '../dto/response/payment-response.dto';
import { PaymentNotFoundException, AccessDeniedException } from '../exceptions/payment.exceptions';

@Injectable()
export class PaymentQueryService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

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
