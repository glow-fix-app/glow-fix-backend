import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { ReviewsNotificationService } from './services/reviews-notification.service';
import { ReviewsRepository } from './repositories/reviews.repository';
import { ReviewsMapper } from './mappers/reviews.mapper';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    ReviewsNotificationService,
    ReviewsRepository,
    ReviewsMapper,
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}