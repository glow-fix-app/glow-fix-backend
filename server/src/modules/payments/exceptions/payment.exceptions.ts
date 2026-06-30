import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  constructor() { super('Payment not found'); }
}

export class BookingNotFoundException extends NotFoundException {
  constructor(message: string = 'Booking not found') { super(message); }
}

export class PaymentAlreadyPaidException extends BadRequestException {
  constructor() { super('Booking already paid'); }
}

export class BookingNotPayableException extends BadRequestException {
  constructor(status: string) { super(`Booking cannot be paid in status: ${status}`); }
}

export class PaymentOwnershipException extends ForbiddenException {
  constructor(message: string = 'You do not own this booking') { super(message); }
}

export class InsufficientAmountException extends BadRequestException {
  constructor(message: string = 'Amount must be at least 30 EGP to meet minimum Stripe requirements.') { super(message); }
}

export class UnsupportedPaymentMethodException extends BadRequestException {
  constructor() { super('Unsupported payment method'); }
}

export class WebhookSignatureException extends BadRequestException {
  constructor() { super('Invalid webhook signature'); }
}

export class DisputeNotAllowedException extends BadRequestException {
  constructor(message: string = 'Only paid payments can be disputed') { super(message); }
}

export class PayoutOwnershipException extends ForbiddenException {
  constructor() { super('You do not own this business'); }
}

export class AccessDeniedException extends ForbiddenException {
  constructor() { super('Access denied'); }
}
