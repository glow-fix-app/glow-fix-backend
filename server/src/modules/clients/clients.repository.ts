import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { 
    IClientRepository, 
    ClientWithUser, 
    BookingWithPaymentAndStatus, 
    LoyaltyTransactionWithBooking,
    INearbyBusinessRaw
} from './interfaces/client-repository.interface';
import { Client, ClientVehicle, OperatingHour } from '@prisma/client';

@Injectable()
export class ClientsRepository implements IClientRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findClientByUserId(userId: string): Promise<Client | null> {
        return this.prisma.client.findUnique({
            where: { userId },
        });
    }

    async findClientByUserIdWithUser(userId: string): Promise<ClientWithUser | null> {
        return this.prisma.client.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        isActive: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    async findUserById(userId: string): Promise<{ createdAt: Date; updatedAt: Date } | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { createdAt: true, updatedAt: true },
        });
    }

    async updateClientLocation(userId: string, latitude: number, longitude: number, city: string | null): Promise<void> {
        await this.prisma.$executeRaw`
            UPDATE clients 
            SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
                city = ${city},
                updated_at = NOW()
            WHERE user_id = ${userId}::uuid
        `;
    }

    async getClientLocation(userId: string): Promise<{ latitude: number | null; longitude: number | null } | null> {
        const result = await this.prisma.$queryRaw<Array<{ latitude: number | null; longitude: number | null }>>`
            SELECT 
                ST_Y(location::geometry) as latitude,
                ST_X(location::geometry) as longitude
            FROM clients 
            WHERE user_id = ${userId}::uuid
        `;

        if (!result || result.length === 0) {
            return null;
        }

        return result[0];
    }

    async getClientBookingsWithPaymentAndStatus(clientId: string): Promise<BookingWithPaymentAndStatus[]> {
        return this.prisma.booking.findMany({
            where: {
                vehicle: { clientId: clientId },
            },
            include: {
                statusHistory: {
                    include: { status: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                payment: {
                    include: { status: true },
                },
            },
        });
    }

    async getLoyaltyPointsBalance(clientId: string): Promise<number> {
        const result = await this.prisma.loyaltyTransaction.aggregate({
            where: { clientId },
            _sum: { points: true },
        });
        return result._sum.points || 0;
    }

    async getRecentLoyaltyTransactions(clientId: string, take: number): Promise<LoyaltyTransactionWithBooking[]> {
        return this.prisma.loyaltyTransaction.findMany({
            where: { clientId },
            include: {
                booking: {
                    select: {
                        id: true,
                        business: { select: { businessName: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take,
        });
    }

    async countClientVehicles(clientId: string): Promise<number> {
        return this.prisma.clientVehicle.count({
            where: { clientId },
        });
    }

    async getClientVehicles(clientId: string): Promise<ClientVehicle[]> {
        return this.prisma.clientVehicle.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getApprovedBusinessStatusId(): Promise<string | null> {
        const approvedStatus = await this.prisma.status.findFirst({
            where: { context: 'APPROVED' },
        });
        return approvedStatus?.id || null;
    }

    async getNearbyBusinesses(latitude: number, longitude: number, radiusMeters: number, limit: number, skip: number, approvedStatusId: string): Promise<INearbyBusinessRaw[]> {
        return this.prisma.$queryRaw<INearbyBusinessRaw[]>`
            SELECT 
                b.id,
                b.business_name,
                b.address,
                b.contact_phone,
                ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_reviews
            FROM businesses b
            LEFT JOIN bookings bk ON b.id = bk.business_id
            LEFT JOIN reviews r ON bk.id = r.booking_id
            WHERE EXISTS (
                SELECT 1 FROM business_status bs 
                WHERE bs.business_id = b.id 
                AND bs.status_id = ${approvedStatusId}::uuid
            )
            AND ST_DWithin(
                b.location, 
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
                ${radiusMeters}
            )
            GROUP BY b.id
            ORDER BY distance_km
            LIMIT ${limit}
            OFFSET ${skip}
        `;
    }

    async countNearbyBusinesses(latitude: number, longitude: number, radiusMeters: number, approvedStatusId: string): Promise<number> {
        const result = await this.prisma.$queryRaw<Array<{ count: number }>>`
            SELECT COUNT(*)::int as count
            FROM businesses b
            WHERE EXISTS (
                SELECT 1 FROM business_status bs 
                WHERE bs.business_id = b.id 
                AND bs.status_id = ${approvedStatusId}::uuid
            )
            AND ST_DWithin(
                b.location, 
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
                ${radiusMeters}
            )
        `;
        return result[0]?.count || 0;
    }

    async getBusinessOperatingHours(businessId: string, dayOfWeek: number): Promise<OperatingHour | null> {
        return this.prisma.operatingHour.findFirst({
            where: {
                businessId: businessId,
                dayOfWeek: dayOfWeek,
            },
        });
    }
}
