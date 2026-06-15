import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsManagerController } from './bookings-manager.controller';
import { BookingsAdminController } from './bookings-admin.controller';
import { BookingsService } from './bookings.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BookingsController, BookingsManagerController, BookingsAdminController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
