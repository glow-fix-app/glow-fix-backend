import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveConfig() {
    return this.prisma.loyaltyConfig.findFirst({
      where: { isActive: true },
    });
  }

  async findConfig() {
    return this.prisma.loyaltyConfig.findFirst();
  }

  async createConfig(data: any) {
    return this.prisma.loyaltyConfig.create({ data });
  }

  async updateConfig(id: string, data: any) {
    return this.prisma.loyaltyConfig.update({
      where: { id },
      data,
    });
  }

  async findTransactionForBooking(bookingId: string, type: 'EARNED' | 'REDEEMED') {
    return this.prisma.loyaltyTransaction.findFirst({
      where: { bookingId, type },
    });
  }

  async findExistingBonusTransaction(clientId: string, reasonMatch: string) {
    return this.prisma.loyaltyTransaction.findFirst({
      where: {
        clientId,
        reason: { contains: reasonMatch },
      },
    });
  }

  async createTransaction(data: Prisma.LoyaltyTransactionUncheckedCreateInput) {
    return this.prisma.loyaltyTransaction.create({ data });
  }

  async aggregatePoints(clientId: string, type?: 'EARNED' | 'REDEEMED') {
    const where: any = { clientId };
    if (type) {
      where.type = type;
    }
    const result = await this.prisma.loyaltyTransaction.aggregate({
      where,
      _sum: { points: true },
    });
    return result._sum?.points || 0;
  }

  async findOldTransactions(clientId: string, date: Date) {
    return this.prisma.loyaltyTransaction.findMany({
      where: {
        clientId,
        type: 'EARNED',
        createdAt: { lt: date },
      },
    });
  }

  async findBookingWithClient(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: { client: { include: { user: true } } },
        },
      },
    });
  }

  async findBookingStatus(bookingId: string) {
    return this.prisma.bookingStatus.findFirst({
      where: { bookingId },
      include: { status: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBookingDiscount(bookingId: string, discountInCents: number) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        discount: {
          increment: discountInCents,
        },
        totalPrice: {
          decrement: discountInCents,
        },
      },
    });
  }

  async findTransactionsPaginated(clientId: string, skip: number, take: number, type?: string) {
    const where: any = { clientId };
    if (type) {
      where.type = type;
    }

    return Promise.all([
      this.prisma.loyaltyTransaction.findMany({
        where,
        include: {
          booking: {
            select: {
              business: { select: { businessName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.loyaltyTransaction.count({ where }),
    ]);
  }

  async getLeaderboardRaw(limit: number): Promise<Array<any>> {
    return this.prisma.$queryRaw<Array<any>>`
      SELECT 
        lt.client_id,
        SUM(lt.points) as total_points,
        u.full_name as client_name,
        u.avatar_url
      FROM loyalty_transactions lt
      JOIN clients c ON lt.client_id = c.id
      JOIN users u ON c.user_id = u.id
      GROUP BY lt.client_id, u.full_name, u.avatar_url
      HAVING SUM(lt.points) > 0
      ORDER BY total_points DESC
      LIMIT ${limit}
    `;
  }

  async getAdminStatsAggregates() {
    return Promise.all([
      this.prisma.loyaltyTransaction.aggregate({
        where: { type: 'EARNED' },
        _sum: { points: true },
      }),
      this.prisma.loyaltyTransaction.aggregate({
        where: { type: 'REDEEMED' },
        _sum: { points: true },
      }),
      this.prisma.loyaltyTransaction.groupBy({
        by: ['clientId'],
        having: { points: { _sum: { gt: 0 } } },
      }),
      this.prisma.loyaltyTransaction.count({
        where: { type: 'REDEEMED' },
      }),
    ]);
  }

  async findClientByUserId(userId: string) {
    return this.prisma.client.findUnique({
      where: { userId },
      select: { id: true },
    });
  }
}
