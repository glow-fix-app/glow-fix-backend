import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBusinessByManagerId(managerId: string) {
    return this.prisma.business.findFirst({
      where: { managerId },
    });
  }

  async findBusinessById(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
    });
  }

  async getPaidStatus() {
    return this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });
  }

  async findPaymentsInRange(start: Date, end: Date, businessFilter: any, includeRelations: any = {}) {
    return this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        ...businessFilter,
      },
      include: includeRelations,
      orderBy: { paidAt: 'asc' },
    });
  }

  async findPaymentsInRangeByStatus(start: Date, end: Date, statusId: string | undefined, businessFilter: any, includeRelations: any = {}, select?: any) {
    const query: any = {
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        statusId,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
    };
    if (Object.keys(includeRelations).length > 0) {
      query.include = includeRelations;
    }
    if (select) {
      query.select = select;
    }
    if (!select) {
      query.orderBy = { paidAt: 'asc' };
    }
    return this.prisma.payment.findMany(query);
  }

  async findBookingsInRange(start: Date, end: Date, businessFilter: any, includeRelations: any = {}) {
    return this.prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...businessFilter,
      },
      include: includeRelations,
    });
  }

  async countUsers(where: any) {
    return this.prisma.user.count({ where });
  }

  async countBusinesses(where?: any) {
    return this.prisma.business.count({ where });
  }

  async getLoyaltyStats(start: Date, end: Date) {
    const issued = await this.prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        points: { gte: 0 },
      },
      _sum: { points: true },
    });

    const redeemed = await this.prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        points: { lt: 0 },
      },
      _sum: { points: true },
    });

    return {
      issued: issued._sum.points || 0,
      redeemed: redeemed._sum.points || 0,
    };
  }

  async getTopServicesRaw(start: Date, end: Date, businessFilter: any, limit: number) {
    return this.prisma.$queryRaw<Array<any>>`
      SELECT 
        s.id as service_id,
        s.title as service_name,
        c.name as category_name,
        COUNT(*) as booking_count,
        SUM(bi.price) as total_revenue
      FROM booking_items bi
      JOIN bookings b ON bi.booking_id = b.id
      JOIN business_service bs ON bi.business_service_id = bs.id
      JOIN services s ON bs.service_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE b.created_at >= ${start}
        AND b.created_at <= ${end}
        ${businessFilter.businessId ? Prisma.sql`AND b.business_id = ${businessFilter.businessId}::uuid` : Prisma.sql``}
      GROUP BY s.id, s.title, c.name
      ORDER BY booking_count DESC
      LIMIT ${limit}
    `;
  }

  async getPaginatedBusinesses(skip: number, take: number) {
    const total = await this.prisma.business.count();
    const businesses = await this.prisma.business.findMany({
      include: {
        manager: {
          select: { fullName: true, email: true },
        },
      },
      skip,
      take,
    });
    return { total, businesses };
  }

  async countActiveServices(businessId: string) {
    return this.prisma.businessService.count({
      where: { businessId, isActive: true },
    });
  }

  async getBusinessReviews(businessId: string) {
    return this.prisma.review.findMany({
      where: { booking: { businessId } },
    });
  }

  async countReviewsWithComment(businessId: string) {
    return this.prisma.review.count({
      where: { booking: { businessId }, comment: { not: null } },
    });
  }

  async countBookingsInRange(businessId: string, start: Date, end: Date) {
    return this.prisma.booking.count({
      where: {
        businessId,
        createdAt: { gte: start, lt: end },
      },
    });
  }
}
