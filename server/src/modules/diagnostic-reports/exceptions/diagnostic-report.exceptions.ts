import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

export class ReportNotFoundException extends NotFoundException {
  constructor(message: string = 'Diagnostic report not found') {
    super(message);
  }
}

export class BookingNotFoundException extends NotFoundException {
  constructor(message: string = 'Booking not found') {
    super(message);
  }
}

export class ClientNotFoundException extends NotFoundException {
  constructor(message: string = 'Client not found') {
    super(message);
  }
}

export class ReportAccessDeniedException extends ForbiddenException {
  constructor(message: string = 'You do not have access to this report') {
    super(message);
  }
}

export class BusinessOwnershipException extends ForbiddenException {
  constructor(message: string = 'You do not own this business') {
    super(message);
  }
}

export class ReportAlreadyRespondedException extends BadRequestException {
  constructor(message: string = 'Cannot update report after client has responded') {
    super(message);
  }
}
