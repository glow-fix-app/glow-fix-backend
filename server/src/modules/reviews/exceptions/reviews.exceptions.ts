import { NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';

export class BookingNotFoundException extends NotFoundException {
  constructor(message: string = 'Booking not found') {
    super(message);
  }
}

export class ReviewNotFoundException extends NotFoundException {
  constructor(message: string = 'Review not found') {
    super(message);
  }
}

export class ReviewOwnershipException extends ForbiddenException {
  constructor(message: string = 'You are not authorized to access or modify this review') {
    super(message);
  }
}

export class InvalidBookingStatusException extends BadRequestException {
  constructor(message: string = 'Only completed bookings can be reviewed') {
    super(message);
  }
}

export class ReviewAlreadyExistsException extends ConflictException {
  constructor(message: string = 'A review already exists for this booking') {
    super(message);
  }
}

export class ReviewTimeoutException extends BadRequestException {
  constructor(message: string = 'Reviews can only be updated within 30 days of creation') {
    super(message);
  }
}
