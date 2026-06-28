import { Injectable } from '@nestjs/common';
import { User, AuthProvider, OtpPurpose, Prisma, UserRole, LogEntityType, LogAction } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  IAuthRepository,
  CreateUserData,
  CreateBusinessData,
  CreateOAuthProviderData,
  CreateUserAuthProviderData,
  CreateBusinessDocumentData,
  CreateAuditLogData,
  CreateImageData,
} from './interfaces/auth.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── User lookups ──────────────────────────────────────────────────────────

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    const isEmail = identifier.includes('@');
    return isEmail
      ? this.findUserByEmail(identifier)
      : this.findUserByPhone(identifier);
  }

  async findUserWithDeletedStatus(identifier: string): Promise<User | null> {
    const isEmail = identifier.includes('@');
    return this.prisma.user.findFirst({
      where: {
        OR: [
          ...(isEmail ? [{ email: identifier.toLowerCase() }] : []),
          ...(!isEmail ? [{ phone: identifier }] : []),
        ],
      },
    });
  }

  async getUserWithRelations(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        client: true,
        authProviders: true,
        sessions: true,
      },
    });
  }

  // ─── User mutations ────────────────────────────────────────────────────────

  async createUser(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role as UserRole,
      },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  // ─── Role-specific setup ───────────────────────────────────────────────────

  async createClient(userId: string): Promise<void> {
    await this.prisma.client.create({ data: { userId } });
  }

  async createUserAuthProvider(data: CreateUserAuthProviderData): Promise<void> {
    await this.prisma.userAuthProvider.create({
      data: {
        ...data,
        provider: data.provider as AuthProvider,
      },
    });
  }

  // ─── Business ─────────────────────────────────────────────────────────────

  async createBusiness(data: CreateBusinessData): Promise<{ id: string }> {
    const result = await this.prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${data.managerId}::uuid,
        ${data.businessName},
        ${data.address},
        ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)::geography,
        ${data.contactPhone ?? null},
        ${data.contactEmail},
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    return { id: result[0].id };
  }

  async createBusinessStatus(data: {
    businessId: string;
    statusId: string;
  }): Promise<void> {
    await this.prisma.businessStatus.create({ data });
  }

  async createBusinessDocument(data: CreateBusinessDocumentData): Promise<void> {
    await this.prisma.businessDocument.create({ data });
  }

  // ─── Status ───────────────────────────────────────────────────────────────

  async findStatus(context: string): Promise<{ id: string } | null> {
    return this.prisma.status.findFirst({ where: { context } });
  }

  async findOrCreateStatus(context: string): Promise<{ id: string }> {
    const existing = await this.findStatus(context);
    if (existing) return existing;
    return this.prisma.status.create({ data: { context } });
  }

  // ─── OTP ──────────────────────────────────────────────────────────────────

  async findLatestOtp(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<{ id: string; createdAt: Date } | null> {
    return this.prisma.userOtp.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });
  }

  async invalidateOldOtps(userId: string, purpose: OtpPurpose): Promise<void> {
    await this.prisma.userOtp.updateMany({
      where: { userId, purpose, usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  async createOtp(data: Record<string, unknown>): Promise<void> {
    await this.prisma.userOtp.create({ data: data as Prisma.UserOtpCreateInput });
  }

  async markOtpAsUsed(otpId: string): Promise<void> {
    await this.prisma.userOtp.update({
      where: { id: otpId },
      data: { usedAt: new Date() },
    });
  }

  // ─── OAuth ────────────────────────────────────────────────────────────────

  async findOAuthProvider(
    provider: AuthProvider,
    providerUserId: string,
  ): Promise<{ user: User } | null> {
    return this.prisma.userAuthProvider.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
      include: { user: true },
    });
  }

  async createOAuthProvider(data: CreateOAuthProviderData): Promise<void> {
    await this.prisma.userAuthProvider.create({
      data: {
        ...data,
        provider: data.provider as AuthProvider,
      },
    });
  }

  // ─── Audit & Images ───────────────────────────────────────────────────────

  async createAuditLog(data: CreateAuditLogData): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        ...data,
        entityType: data.entityType as LogEntityType,
        action: data.action as LogAction,
      },
    });
  }

  async createImage(data: CreateImageData): Promise<void> {
    await this.prisma.image.create({ data });
  }
}