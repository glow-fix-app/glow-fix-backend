import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { User, Prisma, Client, Business } from '@prisma/client';
import { IUserRepository } from './interfaces/user-repository.interface';
import { IUserListOptions, IUserListResult } from './interfaces/user.interface';
import { USER_CONSTANTS } from './constants/user.constants';

@Injectable()
export class UsersRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly userSelect = {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
    } as const;

    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase(), deletedAt: null },
        });
    }

    async findUserByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { phone, deletedAt: null },
        });
    }

    async findUserWithClient(id: string): Promise<User & { client: Client | null } | null> {
        return this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            include: {
                client: true,
            },
        });
    }

    async findUsers(options: IUserListOptions): Promise<IUserListResult> {
        const { page = 1, limit = 20, search, role, emailVerified, phoneVerified, isActive } = options;
        const skip = (page - 1) * limit;
        const take = Math.min(limit, USER_CONSTANTS.MAX_LIMIT);

        const where: Prisma.UserWhereInput = { deletedAt: null };

        if (emailVerified !== undefined) where.emailVerified = emailVerified;
        if (phoneVerified !== undefined) where.phoneVerified = phoneVerified;
        if (isActive !== undefined) where.isActive = isActive;
        if (role) where.role = role as Prisma.EnumUserRoleFilter | undefined;

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: this.userSelect,
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: data as any,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async softDeleteUser(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedAt: new Date(),
            },
        });

        await this.prisma.userSession.deleteMany({
            where: { userId: id },
        });
    }

    async getClientLocation(userId: string): Promise<{ latitude: number; longitude: number; city: string | null } | null> {
        const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number; city: string }>>`
      SELECT 
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude,
        city
      FROM clients 
      WHERE user_id = ${userId}::uuid AND location IS NOT NULL
    `;
        return result[0] || null;
    }

    async getManagerBusiness(managerId: string): Promise<Business | null> {
        return this.prisma.business.findFirst({
            where: { managerId },
            include: {
                operatingHours: true,
                statusHistory: {
                    include: { status: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
    }

    async countUsers(where: Prisma.UserWhereInput): Promise<number> {
        return this.prisma.user.count({ where });
    }

    async findClientById(userId: string): Promise<Client | null> {
        return this.prisma.client.findUnique({
            where: { userId },
        });
    }

    async findUserWithClientById(id: string): Promise<(User & { client: { id: string, createdAt: Date, updatedAt: Date } | null }) | null> {
        return this.prisma.user.findUnique({
            where: { id, deletedAt: null },

            select: {
                ...this.userSelect,
                client: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        }) as unknown as Promise<(User & { client: { id: string, createdAt: Date, updatedAt: Date } | null }) | null>;
    }
}
