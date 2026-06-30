import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsManagerController } from './controllers/bookings-manager.controller';
import { BookingsAdminController } from './controllers/bookings-admin.controller';
import { BookingsService } from './bookings.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { BookingsRepository } from './repositories/bookings.repository';
import { BookingMapper } from './mappers/booking.mapper';
import { BookingStateMachineService } from './services/booking-state-machine.service';
import { BookingFinancialsService } from './services/booking-financials.service';
import { BookingClientService } from './services/booking-client.service';
import { BookingManagerService } from './services/booking-manager.service';
import { BookingAdminService } from './services/booking-admin.service';

@Module({
  imports: [NotificationsModule, PaymentsModule],
  controllers: [BookingsController, BookingsManagerController, BookingsAdminController],
  providers: [
    BookingsRepository,
    BookingMapper,
    BookingStateMachineService,
    BookingFinancialsService,
    BookingClientService,
    BookingManagerService,
    BookingAdminService,
    BookingsService
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
