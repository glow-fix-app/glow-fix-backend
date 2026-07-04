import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentNotificationService } from './payment-notification.service';
import { CreateDisputeDto } from '../dto/request/create-dispute.dto';
import {
  PaymentNotFoundException,
  PaymentOwnershipException,
  DisputeNotAllowedException,
} from '../exceptions/payment.exceptions';
import { PAYMENT_STATUS_CONTEXTS } from '../constants/payment.constants';
import { PaymentWithFullBooking } from '../interfaces/payment-repository.interface';

@Injectable()
export class PaymentDisputeService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly notificationService: PaymentNotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createDispute(userId: string, dto: CreateDisputeDto): Promise<{ success: boolean; dispute_id: string }> {
    const payment = await this.paymentsRepository.findPaymentById(dto.payment_id) as PaymentWithFullBooking & { status: { context: string } };

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    if (payment.booking.vehicle.client.userId !== userId) {
      throw new PaymentOwnershipException('You cannot dispute this payment');
    }

    if (payment.status?.context !== PAYMENT_STATUS_CONTEXTS.PAID) {
      throw new DisputeNotAllowedException();
    }

    const pendingStatus = await this.paymentsRepository.findOrCreateStatus(PAYMENT_STATUS_CONTEXTS.PENDING);

    await this.paymentsRepository.updatePayment(dto.payment_id, { statusId: pendingStatus.id });

    const dispute = await this.paymentsRepository.createDispute({
      paymentId: dto.payment_id,
      bookingId: payment.bookingId,
      reason: dto.reason,
      description: dto.description,
      photoUrls: dto.photo_urls || [],
      desiredOutcome: dto.desired_outcome,
      suggestedAmount: dto.suggested_amount ?? null,
      status: 'PENDING',
    });

    if (payment.booking.business.managerId) {
      await this.notificationService.sendDisputeNotification(payment.booking.business.managerId, dispute.id, dto.reason);
    }

    this.eventEmitter.emit('payment.dispute_created', {
      paymentId: dto.payment_id,
      bookingId: payment.bookingId,
      disputeId: dispute.id,
    });

    return {
      success: true,
      dispute_id: dispute.id,
    };
  }
}
