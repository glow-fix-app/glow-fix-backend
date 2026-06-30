import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { ReviewsRepository } from '../repositories/reviews.repository';

@Injectable()
export class ReviewsNotificationService {
  private readonly logger = new Logger(ReviewsNotificationService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  async notifyNewReview(
    managerId: string,
    actorId: string,
    rating: number,
  ): Promise<void> {
    try {
      await this.notificationsService.createNotification({
        recipientUserId: managerId,
        actorUserId: actorId,
        typeCode: 'NEW_REVIEW',
        title: 'New Review Received',
        body: `You received a ${rating}-star review for a completed booking.`,
        actionUrl: '/provider/reviews',
      });
    } catch (err) {
      this.logger.error(`Failed to send new review notification: ${(err as Error).message}`);
    }
  }

  async notifyReviewReply(
    clientId: string,
    managerId: string,
    businessName: string,
    replyText: string,
    bookingId: string,
  ): Promise<void> {
    try {
      // Ensure the notification type exists
      await this.reviewsRepository.upsertNotificationTypeForReviewReply();

      await this.notificationsService.createNotification({
        recipientUserId: clientId,
        actorUserId: managerId,
        typeCode: 'NEW_REVIEW_REPLY',
        title: 'New reply to your review',
        body: `${businessName} replied: "${replyText}"`,
        actionUrl: `/client/bookings/${bookingId}`,
      });
    } catch (err) {
      this.logger.error(`Failed to send review reply notification: ${(err as Error).message}`);
    }
  }
}
