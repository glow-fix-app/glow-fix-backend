import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBookingWithRelations(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
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
        review: true,
      },
    });
  }

  async findReviewByBookingId(bookingId: string) {
    return this.prisma.review.findUnique({
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
  }

  async findReviewById(reviewId: string) {
    return this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: {
          include: {
            business: true,
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });
  }

  async findBusinessById(businessId: string) {
    return this.prisma.business.findUnique({
      where: { id: businessId },
    });
  }

  async findBusinessReviewsPaginated(
    businessId: string,
    skip: number,
    take: number,
    rating?: number,
    orderBy?: any,
  ) {
    const where: any = {
      booking: { businessId },
    };

    if (rating !== undefined) {
      where.rating = rating;
    }

    return this.prisma.review.findMany({
      where,
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
      orderBy,
      skip,
      take,
    });
  }

  async countBusinessReviews(businessId: string, rating?: number) {
    const where: any = {
      booking: { businessId },
    };

    if (rating !== undefined) {
      where.rating = rating;
    }

    return this.prisma.review.count({ where });
  }

  async findReviewsByBusinessIdForSummary(businessId: string) {
    return this.prisma.review.findMany({
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
  }

  async findUserReviewsPaginated(userId: string, skip: number, take: number) {
    return this.prisma.review.findMany({
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
    });
  }

  async countUserReviews(userId: string) {
    return this.prisma.review.count({
      where: {
        booking: {
          vehicle: {
            client: { userId },
          },
        },
      },
    });
  }

  async createReview(data: any) {
    return this.prisma.review.create({
      data,
    });
  }

  async updateReview(reviewId: string, data: any) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data,
    });
  }

  async deleteReview(reviewId: string) {
    return this.prisma.review.delete({
      where: { id: reviewId },
    });
  }

  async getTopRatedBusinessesRaw(limit: number, minReviews: number) {
    return this.prisma.$queryRaw`
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
  }

  async upsertNotificationTypeForReviewReply() {
    return this.prisma.notificationType.upsert({
      where: { code: 'NEW_REVIEW_REPLY' },
      update: {},
      create: {
        code: 'NEW_REVIEW_REPLY',
        label: 'Manager Replied to Review',
      },
    });
  }
}
