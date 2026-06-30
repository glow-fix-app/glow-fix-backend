import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

export class BookingNotFoundException extends NotFoundException {
  constructor(message: string = 'Booking not found') {
    super(message);
  }
}

export class BookingOwnershipException extends ForbiddenException {
  constructor(message: string = 'You do not own this booking') {
    super(message);
  }
}

export class InvalidBookingStatusException extends BadRequestException {
  constructor(message: string = 'Points can only be redeemed for pending or confirmed bookings') {
    super(message);
  }
}

export class PointsAlreadyRedeemedException extends BadRequestException {
  constructor(message: string = 'Points already redeemed for this booking') {
    super(message);
  }
}

export class InsufficientPointsException extends BadRequestException {
  constructor(message: string = 'Insufficient points') {
    super(message);
  }
}

export class MinimumPointsException extends BadRequestException {
  constructor(message: string = 'Minimum points required for redemption not met') {
    super(message);
  }
}

export class LoyaltyInactiveException extends BadRequestException {
  constructor(message: string = 'Loyalty program is currently inactive') {
    super(message);
  }
}
