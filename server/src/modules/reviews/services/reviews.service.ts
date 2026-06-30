import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateReviewDto } from '../dto/request/create-review.dto';
import { UpdateReviewDto } from '../dto/request/update-review.dto';
import { ReviewResponseDto, ReviewWithUserDto, BusinessReviewsResponseDto, RatingSummaryDto } from '../dto/response/review-response.dto';
import { TopRatedBusinessResponseDto } from '../dto/response/top-rated-business-response.dto';
import { ReviewsRepository } from '../repositories/reviews.repository';
import { ReviewsMapper } from '../mappers/reviews.mapper';
import { ReviewsNotificationService } from './reviews-notification.service';
import {
  BookingNotFoundException,
  ReviewOwnershipException,
  InvalidBookingStatusException,
  ReviewAlreadyExistsException,
  ReviewNotFoundException,
  ReviewTimeoutException,
} from '../exceptions/reviews.exceptions';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly reviewsMapper: ReviewsMapper,
    private readonly reviewsNotificationService: ReviewsNotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReview(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const booking = await this.reviewsRepository.findBookingWithRelations(dto.booking_id);

    if (!booking) {
      throw new BookingNotFoundException();
    }

    if (booking.vehicle.client.userId !== userId) {
      throw new ReviewOwnershipException('You can only review your own bookings');
    }

    const latestStatus = booking.statusHistory[0]?.status?.context;
    if (latestStatus !== 'COMPLETED') {
      throw new InvalidBookingStatusException(
        'You can only review completed bookings. Current status: ' + latestStatus,
      );
    }

    if (booking.review) {
      throw new ReviewAlreadyExistsException();
    }

    const review = await this.reviewsRepository.createReview({
      bookingId: dto.booking_id,
      rating: dto.rating,
      qualityRating: dto.quality_rating ?? undefined,
      punctualityRating: dto.punctuality_rating ?? undefined,
      communicationRating: dto.communication_rating ?? undefined,
      comment: dto.comment,
    });

    this.logger.log(`Review created for booking ${dto.booking_id} by user ${userId}`);

    this.eventEmitter.emit('review.created', {
      bookingId: dto.booking_id,
      businessId: booking.businessId,
      businessName: booking.business.businessName,
      rating: dto.rating,
    });

    if (booking.business.managerId) {
      await this.reviewsNotificationService.notifyNewReview(
        booking.business.managerId,
        userId,
        dto.rating,
      );
    }

    return this.reviewsMapper.toReviewResponseDto(review as any);
  }

  async getReviewByBookingId(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<ReviewWithUserDto | null> {
    const review = await this.reviewsRepository.findReviewByBookingId(bookingId);

    if (!review) {
      return null;
    }

    const isClient = review.booking.vehicle.client.userId === userId;
    const isBusinessManager = review.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isBusinessManager && !isAdmin) {
      throw new ReviewOwnershipException('You do not have access to this review');
    }

    return this.reviewsMapper.toReviewWithUserDto(
      review as any,
      review.booking.vehicle.client.userId,
      review.booking.vehicle.client.user.fullName,
      review.booking.businessId,
      review.booking.business.businessName,
    );
  }

  async getReviewById(
    reviewId: string,
    userId: string,
    userRole: string,
  ): Promise<ReviewWithUserDto> {
    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const isClient = review.booking.vehicle.client.userId === userId;
    const isBusinessManager = review.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isBusinessManager && !isAdmin) {
      throw new ReviewOwnershipException('You do not have access to this review');
    }

    return this.reviewsMapper.toReviewWithUserDto(
      review as any,
      review.booking.vehicle.client.userId,
      review.booking.vehicle.client.user.fullName,
      review.booking.businessId,
      review.booking.business.businessName,
    );
  }

  async getBusinessReviews(
    businessId: string,
    page: number = 1,
    limit: number = 20,
    rating?: number,
    sortBy?: string,
  ): Promise<BusinessReviewsResponseDto> {
    const business = await this.reviewsRepository.findBusinessById(businessId);

    if (!business) {
      throw new BookingNotFoundException('Business not found'); // Reuse or create BusinessNotFoundException
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating_desc') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'rating_asc') {
      orderBy = { rating: 'asc' };
    } else if (sortBy === 'createdAt_asc') {
      orderBy = { createdAt: 'asc' };
    }

    const [reviews, totalReviews, ratingSummary] = await Promise.all([
      this.reviewsRepository.findBusinessReviewsPaginated(businessId, skip, take, rating, orderBy),
      this.reviewsRepository.countBusinessReviews(businessId, rating),
      this.getBusinessRatingSummary(businessId),
    ]);

    const formattedReviews = reviews.map((review: any) =>
      this.reviewsMapper.toReviewWithUserDto(
        review,
        review.booking.vehicle.client.userId,
        review.booking.vehicle.client.user.fullName,
        businessId,
        business.businessName,
      ),
    );

    return {
      business_id: businessId,
      business_name: business.businessName,
      average_rating: ratingSummary.average_rating,
      total_reviews: totalReviews,
      reviews: formattedReviews,
    };
  }

  async getBusinessRatingSummary(businessId: string): Promise<RatingSummaryDto> {
    const business = await this.reviewsRepository.findBusinessById(businessId);

    if (!business) {
      throw new BookingNotFoundException('Business not found');
    }

    const reviews = await this.reviewsRepository.findReviewsByBusinessIdForSummary(businessId);

    if (reviews.length === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const review of reviews) {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    }

    const qualityRatings = reviews.filter((r: any): r is typeof r & { qualityRating: number } => r.qualityRating !== null);
    const punctualityRatings = reviews.filter((r: any): r is typeof r & { punctualityRating: number } => r.punctualityRating !== null);
    const communicationRatings = reviews.filter((r: any): r is typeof r & { communicationRating: number } => r.communicationRating !== null);

    const result: RatingSummaryDto = {
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length,
      rating_distribution: distribution,
    };

    if (qualityRatings.length > 0) {
      const avgQuality = qualityRatings.reduce((sum: number, r: any) => sum + r.qualityRating, 0) / qualityRatings.length;
      result.average_quality = Math.round(avgQuality * 10) / 10;
    }

    if (punctualityRatings.length > 0) {
      const avgPunctuality = punctualityRatings.reduce((sum: number, r: any) => sum + r.punctualityRating, 0) / punctualityRatings.length;
      result.average_punctuality = Math.round(avgPunctuality * 10) / 10;
    }

    if (communicationRatings.length > 0) {
      const avgCommunication = communicationRatings.reduce((sum: number, r: any) => sum + r.communicationRating, 0) / communicationRatings.length;
      result.average_communication = Math.round(avgCommunication * 10) / 10;
    }

    return result;
  }

  async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: ReviewWithUserDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [reviews, total] = await Promise.all([
      this.reviewsRepository.findUserReviewsPaginated(userId, skip, take),
      this.reviewsRepository.countUserReviews(userId),
    ]);

    const formattedReviews = reviews.map((review: any) =>
      this.reviewsMapper.toReviewWithUserDto(
        review,
        review.booking.vehicle.client.userId,
        review.booking.vehicle.client.user.fullName,
        review.booking.businessId,
        review.booking.business.businessName,
      ),
    );

    return {
      data: formattedReviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    if (review.booking.vehicle.client.userId !== userId) {
      throw new ReviewOwnershipException('You can only update your own reviews');
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (review.createdAt < thirtyDaysAgo) {
      throw new ReviewTimeoutException();
    }

    const updatedReview = await this.reviewsRepository.updateReview(reviewId, {
      rating: dto.rating,
      qualityRating: dto.quality_rating ?? undefined,
      punctualityRating: dto.punctuality_rating ?? undefined,
      communicationRating: dto.communication_rating ?? undefined,
      comment: dto.comment,
      updatedAt: new Date(),
    });

    this.logger.log(`Review ${reviewId} updated by user ${userId}`);

    return this.reviewsMapper.toReviewResponseDto(updatedReview as any);
  }

  async deleteReview(
    userId: string,
    userRole: string,
    reviewId: string,
  ): Promise<{ message: string }> {
    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const isOwner = review.booking.vehicle.client.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ReviewOwnershipException('You are not authorized to delete this review');
    }

    await this.reviewsRepository.deleteReview(reviewId);

    this.logger.log(`Review ${reviewId} deleted by user ${userId}`);

    this.eventEmitter.emit('review.deleted', {
      reviewId,
      businessId: review.booking.businessId,
    });

    return { message: 'Review deleted successfully' };
  }

  async getTopRatedBusinesses(
    limit: number = 10,
    minReviews: number = 5,
  ): Promise<TopRatedBusinessResponseDto[]> {
    const results = await this.reviewsRepository.getTopRatedBusinessesRaw(limit, minReviews);

    return (results as any[]).map(r => ({
      business_id: r.business_id,
      business_name: r.business_name,
      average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
      total_reviews: parseInt(r.total_reviews, 10),
      address: r.address,
    }));
  }

  async canReview(userId: string, bookingId: string): Promise<{
    can_review: boolean;
    reason?: string;
  }> {
    const booking = await this.reviewsRepository.findBookingWithRelations(bookingId);

    if (!booking) {
      return { can_review: false, reason: 'Booking not found' };
    }

    if (booking.vehicle.client.userId !== userId) {
      return { can_review: false, reason: 'You can only review your own bookings' };
    }

    const latestStatus = booking.statusHistory[0]?.status?.context;
    if (latestStatus !== 'COMPLETED') {
      return { can_review: false, reason: 'Only completed bookings can be reviewed' };
    }

    if (booking.review) {
      return { can_review: false, reason: 'You have already reviewed this booking' };
    }

    return { can_review: true };
  }

  async addReviewReply(
    managerUserId: string,
    reviewId: string,
    replyText: string,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    if (review.booking.business.managerId !== managerUserId) {
      throw new ReviewOwnershipException('You can only reply to reviews for bookings on your own business');
    }

    const updatedReview = await this.reviewsRepository.updateReview(reviewId, {
      reply: replyText,
      repliedAt: new Date(),
      updatedAt: new Date(),
    });

    this.logger.log(`Manager ${managerUserId} replied to review ${reviewId}`);

    await this.reviewsNotificationService.notifyReviewReply(
      review.booking.vehicle.client.userId,
      managerUserId,
      review.booking.business.businessName,
      replyText,
      review.bookingId,
    );

    return this.reviewsMapper.toReviewResponseDto(updatedReview as any);
  }
}
