import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

// Shared select — passwordHash is never included
const USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  mobileNumber: true,
  profilePhotoUrl: true,
  emailVerified: true,
  mobileVerified: true,
  twoFactorEnabled: true,
  marketingConsent: true,
  loyaltyPoints: true,
  referralCode: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // ─── Get own profile ───

  async getMe(id: string): Promise<Record<string, unknown>> {
    return this.getUser(id);
  }

  // ─── Get single user by ID ───

  async getUser(id: string): Promise<Record<string, unknown>> {
    const customer = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: USER_SELECT,
    });

    if (!customer) {
      throw new NotFoundException('User not found');
    }

    return customer;
  }

  // ─── Get all users — admin only ───

  async getAllUsers(query: GetUsersQueryDto): Promise<{
    data: Record<string, unknown>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      emailVerified,
      mobileVerified,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(emailVerified !== undefined && { emailVerified }),
      ...(mobileVerified !== undefined && { mobileVerified }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { mobileNumber: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── Update user ───

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    requesterId: string,
    requesterRole: string,
  ): Promise<Record<string, unknown>> {
    if (requesterId !== id && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    const existing = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    // Uniqueness checks only when the field is actually changing
    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailTaken) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (dto.mobileNumber && dto.mobileNumber !== existing.phone) {
      const mobileTaken = await this.prisma.user.findUnique({
        where: { phone: dto.mobileNumber },
      });
      if (mobileTaken) {
        throw new ConflictException('Mobile number is already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.email && {
          email: dto.email,
          emailVerified: false, // must re-verify after email change
        }),
        ...(dto.mobileNumber && {
          mobileNumber: dto.mobileNumber,
          mobileVerified: false, // must re-verify after mobile change
        }),
        ...(dto.profilePhotoUrl !== undefined && {
          profilePhotoUrl: dto.profilePhotoUrl,
        }),
        ...(dto.marketingConsent !== undefined && {
          marketingConsent: dto.marketingConsent,
        }),
      },
      select: USER_SELECT,
    });

    this.logger.log('User updated', 'UsersService', {
      targetId: id,
      requesterId,
      changedFields: Object.keys(dto),
    });

    return updated;
  }

  async deleteUser(
    id: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<{ message: string }> {
    // if (requesterId !== id && requesterRole !== 'ADMIN') {
    //   throw new ForbiddenException('You are not allowed to delete this user');
    // }

    const existing = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    // Permanently delete the user and all related data
    await this.prisma.$transaction([
      // Delete sessions first (foreign key constraint)
      this.prisma.userSession.deleteMany({
        where: { userId: id },
      }),
      // // Delete OAuth accounts
      // this.prisma.oAuthAccount.deleteMany({
      //   where: { customerId: id },
      // }),
      // // Delete security events
      // this.prisma.securityEvent.deleteMany({
      //   where: { userId: id },
      // }),
      // // Delete referrals
      // this.prisma.referral.deleteMany({
      //   where: {
      //     OR: [{ referrerId: id }, { refereeId: id }],
      //   },
      // }),
      // Finally delete the customer
      this.prisma.user.delete({
        where: { id },
      }),
    ]);

    this.logger.log('User permanently deleted', 'UsersService', {
      targetId: id,
      requesterId,
    });

    return { message: 'User permanently deleted successfully' };
  }
  //   // ─── Soft delete ───

  //   async deleteUser(
  //     id: string,
  //     requesterId: string,
  //     requesterRole: string,
  //   ): Promise<{ message: string }> {
  //     if (requesterId !== id && requesterRole !== 'ADMIN') {
  //       throw new ForbiddenException('You are not allowed to delete this user');
  //     }

  //     const existing = await this.prisma.customer.findUnique({
  //       where: { id, deletedAt: null },
  //     });

  //     if (!existing) {
  //       throw new NotFoundException('User not found');
  //     }

  //     await this.prisma.customer.update({
  //       where: { id },
  //       data: { deletedAt: new Date() },
  //     });

  //     this.logger.log('User soft-deleted', 'UsersService', {
  //       targetId: id,
  //       requesterId,
  //     });

  //     return { message: 'User deleted successfully' };
  //   }
}
