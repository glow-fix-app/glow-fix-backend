import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto, ReviewWithUserDto, BusinessReviewsResponseDto, RatingSummaryDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a review for a completed booking
   */
  async createReview(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    // Get booking with relations
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.booking_id },
      include: {
        vehicle: {
          include: {
            client: { include: { user: true } },
          },
        },
        business: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify user owns this booking
    if (booking.vehicle.client.userId !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Check if booking is completed (can only review completed bookings)
    const latestStatus = booking.statusHistory[0]?.status?.context;
    if (latestStatus !== 'COMPLETED') {
      throw new BadRequestException(
        'You can only review completed bookings. Current status: ' + latestStatus,
      );
    }

    // Check if review already exists for this booking
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId: dto.booking_id },
    });

    if (existingReview) {
      throw new ConflictException('A review already exists for this booking');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.booking_id,
        rating: dto.rating,
        qualityRating: dto.quality_rating ?? undefined,
        punctualityRating: dto.punctuality_rating ?? undefined,
        communicationRating: dto.communication_rating ?? undefined,
        comment: dto.comment,
      },
    });

    this.logger.log(`Review created for booking ${dto.booking_id} by user ${userId}`);

    // Send notification to business
    this.eventEmitter.emit('review.created', {
      bookingId: dto.booking_id,
      businessId: booking.businessId,
      businessName: booking.business.businessName,
      rating: dto.rating,
    });

    return {
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
    };
  }

  /**
   * Get review by booking ID
   */
  async getReviewByBookingId(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<ReviewWithUserDto | null> {
    const review = await this.prisma.review.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
      },
    });

    if (!review) {
      return null;
    }

    // Check authorization
    const isClient = review.booking.vehicle.client.userId === userId;
    const isBusinessManager = review.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isBusinessManager && !isAdmin) {
      throw new ForbiddenException('You do not have access to this review');
    }

    return {
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      client_id: review.booking.vehicle.client.userId,
      client_name: review.booking.vehicle.client.user.fullName,
      business_id: review.booking.businessId,
      business_name: review.booking.business.businessName,
    };
  }

  /**
   * Get review by ID
   */
  async getReviewById(
    reviewId: string,
    userId: string,
    userRole: string,
  ): Promise<ReviewWithUserDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check authorization
    const isClient = review.booking.vehicle.client.userId === userId;
    const isBusinessManager = review.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isBusinessManager && !isAdmin) {
      throw new ForbiddenException('You do not have access to this review');
    }

    return {
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      client_id: review.booking.vehicle.client.userId,
      client_name: review.booking.vehicle.client.user.fullName,

      business_id: review.booking.businessId,
      business_name: review.booking.business.businessName,
    };
  }

  /**
   * Get all reviews for a business (public)
   */
  async getBusinessReviews(
    businessId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<BusinessReviewsResponseDto> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [reviews, totalReviews, ratingSummary] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          booking: { businessId },
        },
        include: {
          booking: {
            include: {
              vehicle: {
                include: {
                  client: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.review.count({
        where: { booking: { businessId } },
      }),
      this.getBusinessRatingSummary(businessId),
    ]);

    const formattedReviews: ReviewWithUserDto[] = reviews.map((review) => ({
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      client_id: review.booking.vehicle.client.userId,
      client_name: review.booking.vehicle.client.user.fullName,

      business_id: businessId,
      business_name: business.businessName,
    }));

    return {
      business_id: businessId,
      business_name: business.businessName,
      average_rating: ratingSummary.average_rating,
      total_reviews: totalReviews,
      reviews: formattedReviews,
    };
  }

  /**
   * Get rating summary for a business
   */
  async getBusinessRatingSummary(businessId: string): Promise<RatingSummaryDto> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        booking: { businessId },
      },
      select: {
        rating: true,
        qualityRating: true,
        punctualityRating: true,
        communicationRating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    // Calculate average ratings
    const totalRating = reviews.reduce((sum: number, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const review of reviews) {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    }

    // Calculate average sub-ratings (only if they exist)
    const qualityRatings = reviews.filter((r): r is typeof r & { qualityRating: number } => r.qualityRating !== null);
    const punctualityRatings = reviews.filter((r): r is typeof r & { punctualityRating: number } => r.punctualityRating !== null);
    const communicationRatings = reviews.filter((r): r is typeof r & { communicationRating: number } => r.communicationRating !== null);

    const result: RatingSummaryDto = {
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length,
      rating_distribution: distribution,
    };

    if (qualityRatings.length > 0) {
      const avgQuality = qualityRatings.reduce((sum: number, r) => sum + r.qualityRating, 0) / qualityRatings.length;
      result.average_quality = Math.round(avgQuality * 10) / 10;
    }

    if (punctualityRatings.length > 0) {
      const avgPunctuality = punctualityRatings.reduce((sum: number, r) => sum + r.punctualityRating, 0) / punctualityRatings.length;
      result.average_punctuality = Math.round(avgPunctuality * 10) / 10;
    }

    if (communicationRatings.length > 0) {
      const avgCommunication = communicationRatings.reduce((sum: number, r) => sum + r.communicationRating, 0) / communicationRatings.length;
      result.average_communication = Math.round(avgCommunication * 10) / 10;
    }

    return result;
  }

  /**
   * Get user's reviews (all reviews by client)
   */
  async getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: ReviewWithUserDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          booking: {
            vehicle: {
              client: { userId },
            },
          },
        },
        include: {
          booking: {
            include: {
              vehicle: {
                include: {
                  client: { include: { user: true } },
                },
              },
              business: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.review.count({
        where: {
          booking: {
            vehicle: {
              client: { userId },
            },
          },
        },
      }),
    ]);

    const formattedReviews: ReviewWithUserDto[] = reviews.map((review) => ({
      id: review.id,
      booking_id: review.bookingId,
      rating: review.rating,
      quality_rating: review.qualityRating ?? undefined,
      punctuality_rating: review.punctualityRating ?? undefined,
      communication_rating: review.communicationRating ?? undefined,
      comment: review.comment ?? undefined,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      client_id: review.booking.vehicle.client.userId,
      client_name: review.booking.vehicle.client.user.fullName,

      business_id: review.booking.businessId,
      business_name: review.booking.business.businessName,
    }));

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

  /**
   * Update a review (client only, within 30 days)
   */
  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: { client: { include: { user: true } } },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Verify ownership
    if (review.booking.vehicle.client.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Check if review is older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (review.createdAt < thirtyDaysAgo) {
      throw new BadRequestException('Reviews can only be updated within 30 days of creation');
    }

    // Update review
    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        qualityRating: dto.quality_rating ?? undefined,
        punctualityRating: dto.punctuality_rating ?? undefined,
        communicationRating: dto.communication_rating ?? undefined,
        comment: dto.comment,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Review ${reviewId} updated by user ${userId}`);

    return {
      id: updatedReview.id,
      booking_id: updatedReview.bookingId,
      rating: updatedReview.rating,
      quality_rating: updatedReview.qualityRating ?? undefined,
      punctuality_rating: updatedReview.punctualityRating ?? undefined,
      communication_rating: updatedReview.communicationRating ?? undefined,
      comment: updatedReview.comment ?? undefined,
      created_at: updatedReview.createdAt,
      updated_at: updatedReview.updatedAt,
    };
  }

  /**
   * Delete a review (client or admin)
   */
  async deleteReview(
    userId: string,
    userRole: string,
    reviewId: string,
  ): Promise<{ message: string }> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: { client: { include: { user: true } } },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isOwner = review.booking.vehicle.client.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not authorized to delete this review');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    this.logger.log(`Review ${reviewId} deleted by user ${userId}`);

    this.eventEmitter.emit('review.deleted', {
      reviewId,
      businessId: review.booking.businessId,
    });

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get top rated businesses (for discovery)
   */
  async getTopRatedBusinesses(
    limit: number = 10,
    minReviews: number = 5,
  ): Promise<Array<{
    business_id: string;
    business_name: string;
    average_rating: number;
    total_reviews: number;
    address: string;
  }>> {
    const results = await this.prisma.$queryRaw`
      SELECT 
        b.id as business_id,
        b.business_name,
        b.address,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM businesses b
      LEFT JOIN bookings bk ON b.id = bk.business_id
      LEFT JOIN reviews r ON bk.id = r.booking_id
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = (SELECT id FROM statuses WHERE context = 'APPROVED')
      )
      GROUP BY b.id
      HAVING COUNT(r.id) >= ${minReviews}
      ORDER BY average_rating DESC, total_reviews DESC
      LIMIT ${limit}
    `;

    return (results as any[]).map(r => ({
      business_id: r.business_id,
      business_name: r.business_name,
      average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
      total_reviews: parseInt(r.total_reviews, 10),
      address: r.address,
    }));
  }

  /**
   * Check if user can review a booking
   */
  async canReview(userId: string, bookingId: string): Promise<{
    can_review: boolean;
    reason?: string;
  }> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: { client: { include: { user: true } } },
        },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        review: true,
      },
    });

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
}