import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { AvatarService } from './avatar.service';
import { UserProfile } from './user.types';
import { reverseGeocodeCity } from '../../utils/geocode';

// Shared select matching schema exactly (Prisma uses camelCase)
const USER_SELECT = {
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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly winstonLogger: WinstonLoggerService,
    private readonly avatarService: AvatarService,
  ) {}

  // ─── Get full profile (includes avatar resolution) ───
  async getProfile(userId: string): Promise<UserProfile & { clientLocation: { latitude: number; longitude: number; city: string | null } | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const avatarUrl = await this.avatarService.resolve(userId);
    
    // For CLIENT role: fetch location from clients table. Always explicitly null if not set.
    let clientLocation: { latitude: number; longitude: number; city: string | null } | null = null;
    if (user.role === 'CLIENT') {
      const locResult = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number; city: string | null }>>`
        SELECT 
          ST_Y(location::geometry) as latitude,
          ST_X(location::geometry) as longitude,
          city
        FROM clients 
        WHERE user_id = ${userId}::uuid AND location IS NOT NULL
      `;
      if (locResult && locResult.length > 0) {
        let city = locResult[0].city;
        // If we have coordinates but no city, reverse-geocode and cache it
        if (!city) {
          try {
            city = await reverseGeocodeCity(locResult[0].latitude, locResult[0].longitude);
            if (city) {
              await this.prisma.$executeRaw`UPDATE clients SET city = ${city} WHERE user_id = ${userId}::uuid`;
            }
          } catch (err) {
            this.logger.warn(`Failed to auto-geocode client location: ${err}`);
          }
        }
        clientLocation = {
          latitude: Number(locResult[0].latitude),
          longitude: Number(locResult[0].longitude),
          city: city ?? null,
        };
      }
      // clientLocation stays null if no location row found — this explicitly signals
      // the frontend that the user has not set a location yet.
    }

    return {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      email_verified: user.emailVerified,
      phone_verified: user.phoneVerified,
      two_factor_enabled: user.twoFactorEnabled,
      avatar_url: avatarUrl,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      clientLocation,
    };
  }


  // ─── Get client profile with client-specific data ───
  async getClientProfile(userId: string): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: USER_SELECT,
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    // Parse location if exists
    let location = null;
    const clientLocation = (client as any).location;
    if (clientLocation) {
      const coords = clientLocation.coordinates;
      if (coords && Array.isArray(coords)) {
        location = {
          longitude: coords[0],
          latitude: coords[1],
        };
      }
    }

    const avatarUrl = await this.avatarService.resolve(userId);

    return {
      ...client.user,
      avatar_url: avatarUrl,
      client_id: client.id,
      location,
    };
  }

  // ─── Get single user by ID ───
  async getUser(id: string): Promise<Record<string, unknown>> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarUrl = await this.avatarService.resolve(id);

    return {
      ...user,
      avatar_url: avatarUrl,
    };
  }

  private mapUserToResponse(user: any): Record<string, unknown> {
    return {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      email_verified: user.emailVerified,
      phone_verified: user.phoneVerified,
      two_factor_enabled: user.twoFactorEnabled,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt,
    };
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
      role,
      email_verified,
      phone_verified,
      is_active,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (email_verified !== undefined) where.emailVerified = email_verified;
    if (phone_verified !== undefined) where.phoneVerified = phone_verified;
    if (is_active !== undefined) where.isActive = is_active;
    if (role) where.role = role;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } },
      ];
    }

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

    // Resolve avatars for all users (batch would be better for performance)
    const dataWithAvatars = await Promise.all(
      data.map(async (user) => ({
        ...this.mapUserToResponse(user),
        avatar_url: await this.avatarService.resolve(user.id),
      })),
    );

    return {
      data: dataWithAvatars,
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

    // Uniqueness checks
    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailTaken) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (dto.phone && dto.phone !== existing.phone) {
      const phoneTaken = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (phoneTaken) {
        throw new ConflictException('Phone number is already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.full_name !== undefined && { fullName: dto.full_name }),
        ...(dto.email !== undefined && {
          email: dto.email,
          emailVerified: false, // must re-verify
        }),
        ...(dto.phone !== undefined && {
          phone: dto.phone,
          phoneVerified: false, // must re-verify
        }),
        updatedAt: new Date(),
      },
      select: USER_SELECT,
    });

    this.winstonLogger.log('User updated', 'UsersService', {
      targetId: id,
      requesterId,
      changedFields: Object.keys(dto),
    });

    const avatarUrl = await this.avatarService.resolve(id);

    return {
      ...this.mapUserToResponse(updated),
      avatar_url: avatarUrl,
    };
  }

  // ─── Delete user (soft delete per schema) ───
  async deleteUser(
    id: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<{ message: string }> {
    if (requesterId !== id && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    const existing = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    // Soft delete - set deletedAt and isActive = false
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      },
    });

    // Also invalidate all sessions
    await this.prisma.userSession.deleteMany({
      where: { userId: id },
    });

    this.winstonLogger.log('User soft-deleted', 'UsersService', {
      targetId: id,
      requesterId,
    });

    return { message: 'User deleted successfully' };
  }

  // ─── Get user by email (for auth) ───
  async getUserByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  // ─── Get user by phone ───
  async getUserByPhone(phone: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  // ─── Get manager's business ───
  async getManagerBusiness(managerId: string): Promise<any> {
    return this.prisma.business.findFirst({
      where: { managerId: managerId },
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
}



// import {
//   Injectable,
//   NotFoundException,
//   ConflictException,
//   ForbiddenException,
// } from '@nestjs/common';

// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { GetUsersQueryDto } from './dto/get-users-query.dto';
// import { AvatarService }  from './avatar.service';
// import { UserProfile } from './user.types';

// // Shared select — passwordHash is never included
// const USER_SELECT = {
//   id: true,
//   fullName: true,
//   email: true,
//   mobileNumber: true,
//   profilePhotoUrl: true,
//   emailVerified: true,
//   mobileVerified: true,
//   twoFactorEnabled: true,
//   marketingConsent: true,
//   loyaltyPoints: true,
//   referralCode: true,
//   createdAt: true,
//   updatedAt: true,
//   deletedAt: true,
// } as const;

// @Injectable()
// export class UsersService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly logger: WinstonLoggerService,
//     private readonly avatarService:  AvatarService,
//   ) {}

//   async getProfile(userId: string): Promise<UserProfile> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId, deletedAt: null },
//       select: {
//         id:               true,
//         fullName:         true,
//         email:            true,
//         phone:            true,
//         role:             true,
//         emailVerified:    true,
//         phoneVerified:    true,
//         twoFactorEnabled: true,
//         createdAt:        true,
//       },
//     });
 
//     if (!user) throw new NotFoundException('User not found');
 
//     // avatarUrl resolved here — Redis O(1) on warm cache, one DB query on miss
//     const avatarUrl = await this.avatarService.resolve(userId);
 
//     return { ...user, avatarUrl };
//   }
//   // ─── Get own profile ───

//   async getMe(id: string): Promise<Record<string, unknown>> {
//     return this.getUser(id);
//   }

//   // ─── Get single user by ID ───

//   async getUser(id: string): Promise<Record<string, unknown>> {
//     const customer = await this.prisma.user.findUnique({
//       where: { id, deletedAt: null },
//       select: USER_SELECT,
//     });

//     if (!customer) {
//       throw new NotFoundException('User not found');
//     }

//     return customer;
//   }

//   // ─── Get all users — admin only ───

//   async getAllUsers(query: GetUsersQueryDto): Promise<{
//     data: Record<string, unknown>[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }> {
//     const {
//       page = 1,
//       limit = 20,
//       search,
//       emailVerified,
//       mobileVerified,
//     } = query;
//     const skip = (page - 1) * limit;

//     const where = {
//       deletedAt: null,
//       ...(emailVerified !== undefined && { emailVerified }),
//       ...(mobileVerified !== undefined && { mobileVerified }),
//       ...(search && {
//         OR: [
//           { fullName: { contains: search, mode: 'insensitive' as const } },
//           { email: { contains: search, mode: 'insensitive' as const } },
//           { mobileNumber: { contains: search } },
//         ],
//       }),
//     };

//     const [data, total] = await Promise.all([
//       this.prisma.user.findMany({
//         where,
//         select: USER_SELECT,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limit,
//       }),
//       this.prisma.user.count({ where }),
//     ]);

//     return {
//       data,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   // ─── Update user ───

//   async updateUser(
//     id: string,
//     dto: UpdateUserDto,
//     requesterId: string,
//     requesterRole: string,
//   ): Promise<Record<string, unknown>> {
//     if (requesterId !== id && requesterRole !== 'ADMIN') {
//       throw new ForbiddenException('You are not allowed to update this user');
//     }

//     const existing = await this.prisma.user.findUnique({
//       where: { id, deletedAt: null },
//     });

//     if (!existing) {
//       throw new NotFoundException('User not found');
//     }

//     // Uniqueness checks only when the field is actually changing
//     if (dto.email && dto.email !== existing.email) {
//       const emailTaken = await this.prisma.user.findUnique({
//         where: { email: dto.email },
//       });
//       if (emailTaken) {
//         throw new ConflictException('Email is already in use');
//       }
//     }

//     if (dto.mobileNumber && dto.mobileNumber !== existing.phone) {
//       const mobileTaken = await this.prisma.user.findUnique({
//         where: { phone: dto.mobileNumber },
//       });
//       if (mobileTaken) {
//         throw new ConflictException('Mobile number is already in use');
//       }
//     }

//     const updated = await this.prisma.user.update({
//       where: { id },
//       data: {
//         ...(dto.fullName && { fullName: dto.fullName }),
//         ...(dto.email && {
//           email: dto.email,
//           emailVerified: false, // must re-verify after email change
//         }),
//         ...(dto.mobileNumber && {
//           mobileNumber: dto.mobileNumber,
//           mobileVerified: false, // must re-verify after mobile change
//         }),
//         ...(dto.profilePhotoUrl !== undefined && {
//           profilePhotoUrl: dto.profilePhotoUrl,
//         }),
//         ...(dto.marketingConsent !== undefined && {
//           marketingConsent: dto.marketingConsent,
//         }),
//       },
//       select: USER_SELECT,
//     });

//     this.logger.log('User updated', 'UsersService', {
//       targetId: id,
//       requesterId,
//       changedFields: Object.keys(dto),
//     });

//     return updated;
//   }

//   async deleteUser(
//     id: string,
//     requesterId: string,
//     requesterRole: string,
//   ): Promise<{ message: string }> {
//     // if (requesterId !== id && requesterRole !== 'ADMIN') {
//     //   throw new ForbiddenException('You are not allowed to delete this user');
//     // }

//     const existing = await this.prisma.user.findUnique({
//       where: { id, deletedAt: null },
//     });

//     if (!existing) {
//       throw new NotFoundException('User not found');
//     }

//     // Permanently delete the user and all related data
//     await this.prisma.$transaction([
//       // Delete sessions first (foreign key constraint)
//       this.prisma.userSession.deleteMany({
//         where: { userId: id },
//       }),
//       // // Delete OAuth accounts
//       // this.prisma.oAuthAccount.deleteMany({
//       //   where: { customerId: id },
//       // }),
//       // // Delete security events
//       // this.prisma.securityEvent.deleteMany({
//       //   where: { userId: id },
//       // }),
//       // // Delete referrals
//       // this.prisma.referral.deleteMany({
//       //   where: {
//       //     OR: [{ referrerId: id }, { refereeId: id }],
//       //   },
//       // }),
//       // Finally delete the customer
//       this.prisma.user.delete({
//         where: { id },
//       }),
//     ]);

//     this.logger.log('User permanently deleted', 'UsersService', {
//       targetId: id,
//       requesterId,
//     });

//     return { message: 'User permanently deleted successfully' };
//   }
//   //   // ─── Soft delete ───

//   //   async deleteUser(
//   //     id: string,
//   //     requesterId: string,
//   //     requesterRole: string,
//   //   ): Promise<{ message: string }> {
//   //     if (requesterId !== id && requesterRole !== 'ADMIN') {
//   //       throw new ForbiddenException('You are not allowed to delete this user');
//   //     }

//   //     const existing = await this.prisma.customer.findUnique({
//   //       where: { id, deletedAt: null },
//   //     });

//   //     if (!existing) {
//   //       throw new NotFoundException('User not found');
//   //     }

//   //     await this.prisma.customer.update({
//   //       where: { id },
//   //       data: { deletedAt: new Date() },
//   //     });

//   //     this.logger.log('User soft-deleted', 'UsersService', {
//   //       targetId: id,
//   //       requesterId,
//   //     });

//   //     return { message: 'User deleted successfully' };
//   //   }
// }
