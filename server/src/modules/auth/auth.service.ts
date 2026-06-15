import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  JwtPayload,
  JwtTokenPair,
  UserRole,
  Permission,
} from '@glow-fix/types';

import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { RedisKeys } from '../../core/redis/redis-keys';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { authenticator } from 'otplib';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto, OtpPurpose } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { RegisterManagerDto } from './dto/registerManager.dto';
import { RegisterClientDto } from './dto/registerClient.dto';

authenticator.options = { window: 1 };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly logger: WinstonLoggerService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly storage: StorageService,
  ) {}

  // ─── Registration ───

  // ── Shared pre-registration checks ──────────────────────────────────────────
  private async assertUniqueEmailAndPhone(
    email: string,
    phone?: string,
  ): Promise<void> {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new ConflictException(
          'An account with this phone number already exists',
        );
      }
    }
  }

  // ── Shared post-creation steps (auth provider + OTP) ────────────────────────
  private async finaliseRegistration(
    userId: string,
    email: string,
    phone?: string | null,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    await this.prisma.userAuthProvider.create({
      data: { userId, provider: 'EMAIL', email },
    });

    await this.otpService.sendOtpToEmail(
      userId,
      email,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    if (phone) {
      await this.otpService.sendOtpToPhone(
        userId,
        phone,
        OtpPurpose.PHONE_VERIFICATION,
      );
    }

    return {
      message: phone
        ? 'Registration successful. Verification codes have been sent to your email and phone.'
        : 'Registration successful. A verification code has been sent to your email.',
      requiresOtp: true,
    };
  }

  // ── CLIENT registration (public) ─────────────────────────────────────────────
  async registerClient(
    dto: RegisterClientDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        role: 'CLIENT',
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        phone: dto.phone ?? null,
        passwordHash,
        emailVerified: false,
        phoneVerified: false,
      },
    });

    // CLIENT role → create Client profile row (location starts as NULL — user must set it)
    await this.prisma.client.create({ data: { userId: user.id } });

    this.logger.log('Client registered', 'AuthService', {
      userId: user.id,
      email: user.email,
      ipAddress,
    });

    return this.finaliseRegistration(user.id, user.email, dto.phone);
  }

  // ── MANAGER registration (public — business details and docs created transactionally) ────
  async registerManager(
    dto: RegisterManagerDto,
    files: {
      businessRegistration?: Express.Multer.File[];
      ownerID?: Express.Multer.File[];
      insuranceCertificate?: Express.Multer.File[];
      serviceLicense?: Express.Multer.File[];
    },
    ipAddress: string,
    userAgent: string,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      // 1. Create User
      const u = await tx.user.create({
        data: {
          role: 'MANAGER',
          fullName: dto.fullName,
          email: dto.email.toLowerCase(),
          phone: dto.phone ?? null,
          passwordHash,
          emailVerified: false,
          phoneVerified: false,
        },
      });

      // 2. Create Business
      const businesses = await tx.$queryRaw<Array<{ id: string }>>`
        INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          ${u.id}::uuid,
          ${dto.businessName},
          ${dto.address},
          ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)::geography,
          ${dto.phone || null},
          ${dto.email.toLowerCase()},
          NOW(),
          NOW()
        )
        RETURNING id
      `;

      const businessId = businesses[0]?.id;
      if (!businessId) {
        throw new Error('Failed to create business profile during registration');
      }

      // 3. Create BusinessStatus
      let pendingStatus = await tx.status.findFirst({
        where: { context: 'PENDING_REVIEW' },
      });
      if (!pendingStatus) {
        pendingStatus = await tx.status.create({
          data: { context: 'PENDING_REVIEW' },
        });
      }
      await tx.businessStatus.create({
        data: {
          businessId,
          statusId: pendingStatus.id,
        },
      });

      // 4. Create UserAuthProvider
      await tx.userAuthProvider.create({
        data: { userId: u.id, provider: 'EMAIL', email: dto.email.toLowerCase() },
      });

      // 5. Upload & create documents
      if (files.businessRegistration?.[0]) {
        await this.uploadAndCreateDocument(tx, businessId, files.businessRegistration[0], 'BUSINESS_REGISTRATION');
      }
      if (files.ownerID?.[0]) {
        await this.uploadAndCreateDocument(tx, businessId, files.ownerID[0], 'OWNER_ID');
      }
      if (files.insuranceCertificate?.[0]) {
        await this.uploadAndCreateDocument(tx, businessId, files.insuranceCertificate[0], 'INSURANCE_CERTIFICATE');
      }
      if (files.serviceLicense?.[0]) {
        await this.uploadAndCreateDocument(tx, businessId, files.serviceLicense[0], 'SERVICE_LICENSE');
      }

      return u;
    }, {
      timeout: 30000,
      maxWait: 30000,
    });

    this.logger.log('Manager and business registered', 'AuthService', {
      userId: user.id,
      email: user.email,
      ipAddress,
    });

    // 6. Send OTP *after* transaction commits successfully
    await this.otpService.sendOtpToEmail(
      user.id,
      user.email,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    if (user.phone) {
      await this.otpService.sendOtpToPhone(
        user.id,
        user.phone,
        OtpPurpose.PHONE_VERIFICATION,
      );
    }

    return {
      message: user.phone
        ? 'Registration successful. Verification codes have been sent to your email and phone.'
        : 'Registration successful. A verification code has been sent to your email.',
      requiresOtp: true,
    };
  }

  private async uploadAndCreateDocument(
    tx: any,
    businessId: string,
    file: Express.Multer.File,
    type: string,
  ): Promise<void> {
    const { storageKey, url } = await this.storage.uploadFile(
      file.buffer,
      `businesses/${businessId}/documents`,
      file.mimetype,
      file.originalname,
    );

    let pendingStatus = await tx.status.findFirst({
      where: { context: 'PENDING' },
    });

    if (!pendingStatus) {
      pendingStatus = await tx.status.create({
        data: { context: 'PENDING' },
      });
    }

    await tx.businessDocument.create({
      data: {
        businessId,
        type,
        url,
        statusId: pendingStatus.id,
      },
    });
  }

  // ── ADMIN registration (protected — only existing admins can create admins) ──
  async registerAdmin(
    dto: RegisterAdminDto,
    actorId: string,           // ID of the admin performing the action
    ipAddress: string,
    userAgent: string,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    // Verify the caller is actually an admin
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId, isActive: true },
      select: { role: true },
    });

    if (!actor || actor.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create admin accounts');
    }

    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        role: 'ADMIN',
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        phone: dto.phone ?? null,
        passwordHash,
        emailVerified: false,
        phoneVerified: false,
      },
    });

    // ADMIN role → no profile table needed.

    this.logger.log('Admin registered', 'AuthService', {
      actorId,
      newAdminId: user.id,
      email: user.email,
      ipAddress,
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        entityType: 'USER',
        entityId: user.id,
        action: 'CREATED',
        newData: { role: 'ADMIN', email: user.email },
        ipAddress,
        userAgent,
      },
    });

    return this.finaliseRegistration(user.id, user.email, dto.phone);
  }

  // ─── OTP Verification ───

  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Provide either email or phone');
    }

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
        deletedAt: null,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify OTP from DB
    await this.otpService.verifyOtp(user.id, dto.otp, dto.purpose);

    // Mark appropriate field as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(dto.purpose === OtpPurpose.EMAIL_VERIFICATION && {
          emailVerified: true,
        }),
        ...(dto.purpose === OtpPurpose.PHONE_VERIFICATION && {
          phoneVerified: true,
        }),
      },
    });

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('OTP verified', 'AuthService', {
      userId: user.id,
      purpose: dto.purpose,
    });

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  // ─── Resend OTP ───

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    if ((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
      throw new BadRequestException('Provide either email or phone');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
        deletedAt: null,
      },
    });
    // Generic message to avoid user enumeration
    if (!user) {
      return {
        message: 'If an account exists, a new verification code has been sent.',
      };
    }

    if (
      dto.email &&
      user.emailVerified &&
      dto.purpose === OtpPurpose.EMAIL_VERIFICATION
    ) {
      throw new BadRequestException('Email is already verified');
    }
    if (
      dto.phone &&
      user.phoneVerified &&
      dto.purpose === OtpPurpose.PHONE_VERIFICATION
    ) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Validate purpose
    if (dto.email && dto.purpose === OtpPurpose.PHONE_VERIFICATION) {
      throw new BadRequestException('Invalid purpose for email');
    }

    if (dto.phone && dto.purpose === OtpPurpose.EMAIL_VERIFICATION) {
      throw new BadRequestException('Invalid purpose for phone');
    }

    // Cooldown check
    const existingOtp = await this.prisma.userOtp.findFirst({
      where: {
        userId: user.id,
        purpose: dto.purpose,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingOtp) {
      const diff = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
      if (diff < 60) {
        throw new BadRequestException(
          'Please wait before requesting a new OTP',
        );
      }
    }

    // Invalidate old OTPs
    await this.prisma.userOtp.updateMany({
      where: {
        userId: user.id,
        purpose: dto.purpose,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    // Send OTP
    if (dto.email) {
      if (!user.email) {
        throw new BadRequestException('User email not found');
      }

      await this.otpService.sendOtpToEmail(user.id, user.email, dto.purpose);
    } else {
      if (!user.phone) {
        throw new BadRequestException('User phone not found');
      }

      await this.otpService.sendOtpToPhone(user.id, user.phone, dto.purpose);
    }

    return {
      message: 'If an account exists, a new verification code has been sent.',
    };
  }

  // ─── Login ───

  async login(
    dto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<
    JwtTokenPair & { user: Record<string, unknown>; requiresMfa?: boolean }
  > {
    // First check if the account exists but is deleted or inactive
    const anyUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier.toLowerCase() },
          { phone: dto.identifier },
        ],
      },
    });

    if (anyUser) {
      if (anyUser.deletedAt !== null) {
        await this.checkLoginRateLimit(ipAddress);
        throw new UnauthorizedException(
          'This account has been deleted. If you believe this is a mistake, please contact support.',
        );
      }
      if (!anyUser.isActive) {
        await this.checkLoginRateLimit(ipAddress);
        throw new UnauthorizedException(
          'This account has been deactivated. Please contact support to restore access.',
        );
      }
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier.toLowerCase() },
          { phone: dto.identifier },
        ],
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user || !user.passwordHash) {
      await this.checkLoginRateLimit(ipAddress);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.checkLoginRateLimit(ipAddress);

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      await this.recordFailedLogin(user.id, ipAddress, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Email verification gate — after password check (avoids account enumeration),
    // before session creation (unverified users never get tokens).
    if (!user.emailVerified) {
      // Re-send a fresh OTP; fire-and-forget so mail failures don't block the response.
      this.otpService
        .sendOtpToEmail(user.id, user.email!, OtpPurpose.EMAIL_VERIFICATION)
        .catch(() => {});

      throw new ForbiddenException(
        'Please verify your email before logging in. A new verification code has been sent to your email address.',
      );
    }

    // MFA check
    if (user.twoFactorEnabled) {
      const mfaToken = await this.tokenService.generateMfaToken(user.id);
      return {
        accessToken: mfaToken,
        refreshToken: '',
        expiresIn: 300,
        user: { id: user.id },
        requiresMfa: true,
      };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    });

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    await this.redis.del(RedisKeys.loginAttempts(ipAddress));

    this.logger.log('User logged in', 'AuthService', {
      userId: user.id,
      ipAddress,
    });

    return { ...tokens, user: this.formatUser(user) };
  }

  // ─── MFA Login Completion ───

  async verifyMfaLogin(
    mfaToken: string,
    code: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
    let payload: JwtPayload;
    try {
      payload = await this.tokenService.verifyMfaToken(mfaToken);
    } catch {
      throw new UnauthorizedException('MFA token is invalid or expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
    });

    if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
      throw new BadRequestException('MFA is not enabled for this account');
    }

    // Defensive: MFA token was issued before the email gate existed;
    // guard here too so a pre-existing token cannot bypass verification.
    if (!user.emailVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in.',
      );
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('MFA login completed', 'AuthService', { userId: user.id });

    return { ...tokens, user: this.formatUser(user) };
  }

  // ─── Refresh Tokens ───

  async refreshTokens(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair> {
    const session = await this.sessionService.findByTokenHash(refreshToken);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId, deletedAt: null, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Invalidate old session
    await this.sessionService.invalidateByTokenHash(refreshToken);

    // Create new session
    return this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );
  }

  // ─── Logout ───

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionId);
    this.logger.log('User logged out', 'AuthService', { userId, sessionId });
  }

  async logoutAllSessions(
    userId: string,
  ): Promise<{ sessionsRevoked: number }> {
    // 1. Delete all sessions from DB
    const count = await this.sessionService.invalidateAllSessions(userId);

    // 2. Store a "logged out at" timestamp in Redis
    // Any access token issued BEFORE this timestamp will be rejected by the JWT guard
    const key = RedisKeys.userLogoutTimestamp(userId);
    await this.redis.set(key, Date.now().toString(), 7 * 24 * 60 * 60); // 7d = max token lifetime

    this.logger.log('All sessions revoked', 'AuthService', { userId, count });

    return { sessionsRevoked: count };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier?.toLowerCase() },
          { phone: dto.identifier },
        ],
        deletedAt: null,
      },
    });

    // Always return same message (security)
    if (!user) {
      return {
        message: 'If an account exists, a password reset code has been sent.',
      };
    }

    if (!user.email) {
      throw new BadRequestException('User email not found');
    }

    await this.otpService.sendOtpToEmail(
      user.id,
      user.email,
      OtpPurpose.PASSWORD_RESET,
    );

    return {
      message: 'A password reset code has been sent to your email.',
    };
  }

  // ─── Verify Reset OTP (Step 1: OTP → resetToken) ───

  async verifyResetOtp(dto: {
    email: string;
    otp: string;
  }): Promise<{ resetToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase(), deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException('Invalid OTP or email');
    }

    // Verify OTP but DO NOT consume it yet — resetPassword will consume it
    await this.otpService.verifyOtp(
      user.id,
      dto.otp,
      OtpPurpose.PASSWORD_RESET,
      false, // don't consume
    );

    // Generate a short-lived reset token (10 min)
    const resetToken = await this.tokenService.generateResetToken(
      user.id,
      user.email!,
    );

    this.logger.log('Reset OTP verified, token issued', 'AuthService', {
      userId: user.id,
    });

    return { resetToken };
  }

  // ─── Reset Password (Step 2: resetToken + newPassword) ───

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    // Verify the reset token
    let tokenPayload: { sub: string; email: string };
    try {
      tokenPayload = this.tokenService.verifyResetToken(dto.resetToken);
    } catch {
      throw new BadRequestException(
        'Reset link has expired. Please request a new password reset.',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: tokenPayload.sub, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // confirm password check
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Consume the OTP now (mark as used)
    // We search for the latest unused PASSWORD_RESET OTP for this user
    const otpRecord = await this.prisma.userOtp.findFirst({
      where: {
        userId: user.id,
        purpose: OtpPurpose.PASSWORD_RESET as any,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (otpRecord) {
      await this.prisma.userOtp.update({
        where: { id: otpRecord.id },
        data: { usedAt: new Date() },
      });
    }

    // prevent same password
    if (user.passwordHash) {
      const isSame = await this.passwordService.compare(
        dto.newPassword,
        user.passwordHash,
      );

      if (isSame) {
        throw new BadRequestException('New password must be different');
      }
    }

    // prevent reuse
    const isReused = await this.passwordService.isPasswordReused(
      dto.newPassword,
      user.id,
    );

    if (isReused) {
      throw new BadRequestException('You cannot reuse an old password');
    }

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // store in history
    await this.passwordService.addToHistory(user.id, newPasswordHash);

    // invalidate sessions
    await this.sessionService.invalidateAllSessions(user.id);

    return { message: 'Password reset successfully. Please log in again.' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // confirm password check
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // verify current password if user already has a password
    if (user.passwordHash) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      
      const isCurrentPasswordValid = await this.passwordService.compare(
        dto.currentPassword,
        user.passwordHash,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // prevent same password
      const isSamePassword = await this.passwordService.compare(
        dto.newPassword,
        user.passwordHash,
      );

      if (isSamePassword) {
        throw new BadRequestException(
          'New password must be different from your current password',
        );
      }
    }

    // prevent reuse
    const isReused = await this.passwordService.isPasswordReused(
      dto.newPassword,
      userId,
    );

    if (isReused) {
      throw new BadRequestException('You cannot reuse an old password');
    }

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // store in history
    await this.passwordService.addToHistory(userId, newPasswordHash);

    await this.sessionService.invalidateAllSessions(userId);

    this.logger.log('Password changed', 'AuthService', { userId });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // // ─── Forgot Password ───

  // async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       OR: [
  //         { email: dto.identifier?.toLowerCase() },
  //         { phone: dto.identifier },
  //       ],
  //       deletedAt: null,
  //     },
  //   });

  //   if (!user) {
  //     return {
  //       message: 'If an account exists, a password reset code has been sent.',
  //     };
  //   }

  //   if (!user.email) {
  //     throw new BadRequestException('User email not found');
  //   }

  //   await this.otpService.sendOtpToEmail(
  //     user.id,
  //     user.email,
  //     OtpPurpose.PASSWORD_RESET,
  //   );

  //   return { message: 'A password reset code has been sent to your email.' };
  // }

  // // ─── Reset Password ───

  // async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
  //   const isEmail = dto.identifier.includes('@');

  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       ...(isEmail
  //         ? { email: dto.identifier.toLowerCase() }
  //         : { phone: dto.identifier }),
  //       deletedAt: null,
  //     },
  //   });

  //   if (!user) {
  //     throw new BadRequestException('Invalid OTP or identifier');
  //   }

  //   let isSamePassword = false;

  //   if (user.passwordHash) {
  //     isSamePassword = await this.passwordService.compare(
  //       dto.newPassword,
  //       user.passwordHash,
  //     );
  //   }

  //   if (isSamePassword) {
  //     throw new BadRequestException('New password must be different');
  //   }

  //   await this.prisma.$transaction(async (tx) => {
  //     await this.otpService.verifyOtp(
  //       user.id,
  //       dto.otp,
  //       OtpPurpose.PASSWORD_RESET,
  //     );

  //     const newPasswordHash = await this.passwordService.hash(dto.newPassword);

  //     await tx.user.update({
  //       where: { id: user.id },
  //       data: { passwordHash: newPasswordHash },
  //     });

  //     await this.sessionService.invalidateAllSessions(user.id);
  //   });

  //   return { message: 'Password reset successfully. Please log in again.' };
  // }

  // async changePassword(
  //   userId: string,
  //   dto: ChangePasswordDto,
  // ): Promise<{ message: string }> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId, deletedAt: null },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const isCurrentPasswordValid = await this.passwordService.compare(
  //     dto.currentPassword,
  //     user.passwordHash!,
  //   );

  //   if (!isCurrentPasswordValid) {
  //     throw new UnauthorizedException('Current password is incorrect');
  //   }

  //   const isSamePassword = await this.passwordService.compare(
  //     dto.newPassword,
  //     user.passwordHash!,
  //   );

  //   if (isSamePassword) {
  //     throw new BadRequestException(
  //       'New password must be different from your current password',
  //     );
  //   }

  //   const newPasswordHash = await this.passwordService.hash(dto.newPassword);

  //   await this.prisma.user.update({
  //     where: { id: userId },
  //     data: { passwordHash: newPasswordHash },
  //   });

  //   await this.sessionService.invalidateAllSessions(userId);

  //   this.logger.log('Password changed', 'AuthService', { userId });

  //   return { message: 'Password changed successfully. Please log in again.' };
  // }

  // ─── Google OAuth ───

  async handleGoogleOAuth(
    profile: {
      providerId: string;
      email: string;
      name: string;
      profilePhoto?: string;
    },
    ipAddress: string,
    userAgent: string,
  ): Promise<
    JwtTokenPair & { user: Record<string, unknown>; isNewUser: boolean }
  > {
    let isNewUser = false;

    // Check if provider already linked
    const existingProvider = await this.prisma.userAuthProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider: 'GOOGLE',
          providerUserId: profile.providerId,
        },
      },
      include: { user: true },
    });

    let user = existingProvider?.user ?? null;

    if (!user) {
      // Check by email
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: profile.email.toLowerCase() },
      });

      if (existingByEmail) {
        user = existingByEmail;
        await this.prisma.userAuthProvider.create({
          data: {
            userId: user.id,
            provider: 'GOOGLE',
            providerUserId: profile.providerId,
            email: profile.email.toLowerCase(),
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            role: 'CLIENT',
            fullName: profile.name,
            email: profile.email.toLowerCase(),
            emailVerified: true,
          },
        });

        await this.prisma.client.create({ data: { userId: user.id } });

        // Store the Google profile photo in the polymorphic Image table
        if (profile.profilePhoto) {
          await this.prisma.image.create({
            data: {
              url: profile.profilePhoto,
              entityType: 'USER_AVATAR',
              entityId: user.id,
            },
          });
        }

        await this.prisma.userAuthProvider.create({
          data: {
            userId: user.id,
            provider: 'GOOGLE',
            providerUserId: profile.providerId,
            email: profile.email.toLowerCase(),
            // isPrimary: true,
          },
        });

        isNewUser = true;
      }
    }

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('Google OAuth login', 'AuthService', {
      userId: user.id,
      isNewUser,
    });

    return { ...tokens, user: this.formatUser(user), isNewUser };
  }

  // ─── Private Helpers ───

  // Replace the private createSession() method in auth.service.ts with this:

  private async createSession(
    userId: string,
    role: UserRole,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair> {
    await this.sessionService.enforceSessionLimit(userId);

    // Generate refresh token first
    const refreshToken = this.generateRefreshToken();

    // Create session in DB — this gives us the sessionId
    const session = await this.sessionService.createSession(
      userId,
      refreshToken,
      ipAddress,
      userAgent,
    );

    // Now build the JWT payload with the real sessionId
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      role,
      permissions: this.getPermissionsForRole(role),
      sessionId: session.id, // ← correct session ID, single write
      deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
    };

    const tokens = await this.tokenService.generateTokenPair(payload);

    // generateTokenPair generates its own refreshToken internally — override it
    // with the one we already stored in DB
    return {
      accessToken: tokens.accessToken,
      refreshToken, // ← the one hashed and stored in DB
      expiresIn: tokens.expiresIn,
    };
  }

  private generateRefreshToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(64).toString('hex');
  }
  // private async createSession(
  //   userId: string,
  //   role: UserRole,
  //   ipAddress: string,
  //   userAgent: string,
  // ): Promise<JwtTokenPair> {
  //   await this.sessionService.enforceSessionLimit(userId);

  //   // Generate token pair first so we have the refreshToken to hash
  //   const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
  //     sub: userId,
  //     role,
  //     permissions: this.getPermissionsForRole(role),
  //     sessionId: '', // will be filled below
  //     deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
  //   };

  //   const tokens = await this.tokenService.generateTokenPair(payload);

  //   // Store hashed refresh token in DB
  //   const session = await this.sessionService.createSession(
  //     userId,
  //     tokens.refreshToken,
  //     ipAddress,
  //     userAgent,
  //   );

  //   // Re-sign with actual sessionId
  //   const finalPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
  //     ...payload,
  //     sessionId: session.id,
  //   };

  //   const finalTokens = await this.tokenService.generateTokenPair(finalPayload);

  //   // Update session with correct token hash
  //   await this.sessionService.invalidateSession(session.id);
  //   const finalSession = await this.sessionService.createSession(
  //     userId,
  //     finalTokens.refreshToken,
  //     ipAddress,
  //     userAgent,
  //   );

  //   return finalTokens;
  // }

  private formatUser(user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    role: string;
  }): Record<string, unknown> {
    // avatarUrl is stored in the polymorphic `images` table (entityType = 'USER_AVATAR').
    // Fetch it separately when needed (e.g. in jwt.strategy or profile endpoint).
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      role: user.role,
    };
  }

  private getPermissionsForRole(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.CUSTOMER:
        return [
          Permission.MANAGE_OWN_VEHICLES,
          Permission.CREATE_BOOKING,
          Permission.VIEW_OWN_BOOKINGS,
          Permission.CANCEL_OWN_BOOKING,
          Permission.MANAGE_OWN_PROFILE,
        ];
      case UserRole.STAFF:
        return [
          Permission.VIEW_ASSIGNED_BOOKINGS,
          Permission.UPDATE_BOOKING_STATUS,
          Permission.CREATE_DIVR,
          Permission.UPLOAD_PHOTOS,
          Permission.MANAGE_OWN_AVAILABILITY,
        ];
      case UserRole.ADMIN:
        return [Permission.MANAGE_USERS];
      default:
        return [];
    }
  }

  private generateDeviceFingerprint(
    userAgent: string,
    ipAddress: string,
  ): string {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(`${userAgent}:${ipAddress}`)
      .digest('hex')
      .substring(0, 16);
  }

  private async checkLoginRateLimit(ipAddress: string): Promise<void> {
    const key = RedisKeys.loginAttempts(ipAddress);
    const result = await this.redis.checkRateLimit(key, 5, 60);

    if (!result.allowed) {
      throw new ForbiddenException(
        'Too many login attempts. Please try again in 1 minute.',
      );
    }
  }

  private async recordFailedLogin(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    const key = RedisKeys.loginAttempts(ipAddress);
    await this.redis.incr(key);
    await this.redis.expire(key, 60);

    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        entityType: 'USER',
        entityId: userId,
        action: 'LOGIN',
        ipAddress,
        userAgent,
        newData: { reason: 'Invalid password' },
      },
    });
  }
}

// import {
//   Injectable,
//   BadRequestException,
//   UnauthorizedException,
//   ConflictException,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import {
//   JwtPayload,
//   JwtTokenPair,
//   UserRole,
//   Permission,
// } from '@glow-fix/types';

// import { PrismaService } from '../../core/prisma/prisma.service';
// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { TokenService } from './token.service';
// import { OtpService } from './otp.service';
// import { PasswordService } from './password.service';
// import { SessionService } from './session.service';
// import { authenticator } from 'otplib';

// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { VerifyOtpDto, OtpPurpose } from './dto/verify-otp.dto';
// import { ResendOtpDto } from './dto/resend-otp.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';

// authenticator.options = { window: 1 };

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly redis: RedisService,
//     private readonly logger: WinstonLoggerService,
//     private readonly tokenService: TokenService,
//     private readonly otpService: OtpService,
//     private readonly passwordService: PasswordService,
//     private readonly sessionService: SessionService,
//   ) {}

//   // ─── Registration ───

//   async register(
//     dto: RegisterDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<{ message: string; requiresOtp: boolean }> {
//     // Check email uniqueness
//     const existingEmail = await this.prisma.user.findUnique({
//       where: { email: dto.email.toLowerCase() },
//     });
//     if (existingEmail) {
//       throw new ConflictException('An account with this email already exists');
//     }

//     // Check phone uniqueness if provided
//     if (dto.phone) {
//       const existingPhone = await this.prisma.user.findUnique({
//         where: { phone: dto.phone },
//       });
//       if (existingPhone) {
//         throw new ConflictException(
//           'An account with this phone number already exists',
//         );
//       }
//     }

//     const passwordHash = await this.passwordService.hash(dto.password);

//     // Create user with CLIENT role
//     const user = await this.prisma.user.create({
//       data: {
//         role: 'CLIENT',
//         fullName: dto.fullName,
//         email: dto.email.toLowerCase(),
//         phone: dto.phone || null,
//         passwordHash,
//         emailVerified: false,
//         phoneVerified: false,
//       },
//     });

//     // Create Client profile
//     await this.prisma.client.create({
//       data: { userId: user.id },
//     });

//     // Link email auth provider
//     await this.prisma.userAuthProvider.create({
//       data: {
//         userId: user.id,
//         provider: 'EMAIL',
//         email: user.email,
//         // isPrimary: true,
//       },
//     });

//     // Send email OTP for verification
//     await this.otpService.sendOtpToEmail(
//       user.id,
//       user.email,
//       OtpPurpose.EMAIL_VERIFICATION,
//     );

//     // Optionally send phone OTP if phone provided
//     if (dto.phone) {
//       await this.otpService.sendOtpToPhone(
//         user.id,
//         dto.phone,
//         OtpPurpose.PHONE_VERIFICATION,
//       );
//     }

//     this.logger.log('User registered', 'AuthService', {
//       userId: user.id,
//       email: user.email,
//       ipAddress,
//     });

//     return {
//       message: dto.phone
//         ? 'Registration successful. Verification codes have been sent to your email and phone.'
//         : 'Registration successful. A verification code has been sent to your email.',
//       requiresOtp: true,
//     };
//   }

//   // ─── OTP Verification ───
//   async verifyOtp(
//     dto: VerifyOtpDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
//     if (!dto.email && !dto.phone) {
//       throw new BadRequestException('Provide either email or phone');
//     }

//     // 1. Find user
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//           ...(dto.phone ? [{ phone: dto.phone }] : []),
//         ],
//         deletedAt: null,
//       },
//     });

//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     // Prevent re-verification
//     if (dto.purpose === OtpPurpose.EMAIL_VERIFICATION && user.emailVerified) {
//       throw new BadRequestException('Email is already verified');
//     }

//     // 2. Verify OTP
//     await this.otpService.verifyOtp(user.id, dto.otp, dto.purpose);

//     // 3. Update user and GET UPDATED RECORD
//     const updatedUser = await this.prisma.user.update({
//       where: { id: user.id },
//       data: {
//         ...(dto.purpose === OtpPurpose.EMAIL_VERIFICATION && {
//           emailVerified: true,
//           emailVerifiedAt: new Date(), // optional
//         }),
//         ...(dto.purpose === OtpPurpose.PHONE_VERIFICATION && {
//           phoneVerified: true,
//         }),
//       },
//     });

//     // 4. Create session
//     const tokens = await this.createSession(
//       updatedUser.id,
//       updatedUser.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );

//     this.logger.log('OTP verified', 'AuthService', {
//       userId: updatedUser.id,
//       purpose: dto.purpose,
//     });

//     // 5. RETURN UPDATED USER
//     return {
//       ...tokens,
//       user: this.formatUser(updatedUser),
//     };
//   }

//   // ─── Resend OTP ───

//   async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
//     if ((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
//       throw new BadRequestException('Provide either email or phone');
//     }

//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//           ...(dto.phone ? [{ phone: dto.phone }] : []),
//         ],
//         deletedAt: null,
//       },
//     });
//     // Generic message to avoid user enumeration
//     if (!user) {
//       return {
//         message: 'If an account exists, a new verification code has been sent.',
//       };
//     }

//     if (
//       dto.email &&
//       user.emailVerified &&
//       dto.purpose === OtpPurpose.EMAIL_VERIFICATION
//     ) {
//       throw new BadRequestException('Email is already verified');
//     }
//     if (
//       dto.phone &&
//       user.phoneVerified &&
//       dto.purpose === OtpPurpose.PHONE_VERIFICATION
//     ) {
//       throw new BadRequestException('Phone number is already verified');
//     }

//     // Validate purpose
//     if (dto.email && dto.purpose === OtpPurpose.PHONE_VERIFICATION) {
//       throw new BadRequestException('Invalid purpose for email');
//     }

//     if (dto.phone && dto.purpose === OtpPurpose.EMAIL_VERIFICATION) {
//       throw new BadRequestException('Invalid purpose for phone');
//     }

//     // Cooldown check
//     const existingOtp = await this.prisma.userOtp.findFirst({
//       where: {
//         userId: user.id,
//         purpose: dto.purpose,
//         expiresAt: { gt: new Date() },
//       },
//       orderBy: { createdAt: 'desc' },
//     });

//     if (existingOtp) {
//       const diff = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
//       if (diff < 60) {
//         throw new BadRequestException(
//           'Please wait before requesting a new OTP',
//         );
//       }
//     }

//     // Invalidate old OTPs
//     await this.prisma.userOtp.updateMany({
//       where: {
//         userId: user.id,
//         purpose: dto.purpose,
//         usedAt: null,
//       },
//       data: { usedAt: new Date() },
//     });

//     // Send OTP
//     if (dto.email) {
//       if (!user.email) {
//         throw new BadRequestException('User email not found');
//       }

//       await this.otpService.sendOtpToEmail(user.id, user.email, dto.purpose);
//     } else {
//       if (!user.phone) {
//         throw new BadRequestException('User phone not found');
//       }

//       await this.otpService.sendOtpToPhone(user.id, user.phone, dto.purpose);
//     }

//     return {
//       message: 'If an account exists, a new verification code has been sent.',
//     };
//   }

//   // async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
//   //   if (!dto.email && !dto.phone) {
//   //     throw new BadRequestException('Provide either email or phone');
//   //   }

//   //   const user = await this.prisma.user.findFirst({
//   //     where: {
//   //       OR: [
//   //         ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//   //         ...(dto.phone ? [{ phone: dto.phone }] : []),
//   //       ],
//   //       deletedAt: null,
//   //     },
//   //   });

//   //   // Generic message to avoid user enumeration
//   //   if (!user) {
//   //     return { message: 'If an account exists, a new verification code has been sent.' };
//   //   }

//   //   if (dto.email) {
//   //     if (user.emailVerified && dto.purpose === OtpPurpose.EMAIL_VERIFICATION) {
//   //       throw new BadRequestException('Email is already verified');
//   //     }
//   //     await this.otpService.sendOtpToEmail(user.id, dto.email.toLowerCase(), dto.purpose);
//   //   }

//   //   if (dto.phone) {
//   //     if (user.phoneVerified && dto.purpose === OtpPurpose.PHONE_VERIFICATION) {
//   //       throw new BadRequestException('Phone number is already verified');
//   //     }
//   //     await this.otpService.sendOtpToPhone(user.id, dto.phone, dto.purpose);
//   //   }

//   //   return { message: 'A new verification code has been sent.' };
//   // }

//   // ─── Login ───

//   async login(
//     dto: LoginDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<
//     JwtTokenPair & { user: Record<string, unknown>; requiresMfa?: boolean }
//   > {
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: dto.identifier.toLowerCase() },
//           { phone: dto.identifier },
//         ],
//         deletedAt: null,
//         isActive: true,
//       },
//     });

//     if (!user || !user.passwordHash) {
//       await this.checkLoginRateLimit(ipAddress);
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     await this.checkLoginRateLimit(ipAddress);

//     const isPasswordValid = await this.passwordService.compare(
//       dto.password,
//       user.passwordHash,
//     );

//     if (!isPasswordValid) {
//       await this.recordFailedLogin(user.id, ipAddress, userAgent);
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // MFA check
//     if (user.twoFactorEnabled) {
//       const mfaToken = await this.tokenService.generateMfaToken(user.id);
//       return {
//         accessToken: mfaToken,
//         refreshToken: '',
//         expiresIn: 300,
//         user: { id: user.id },
//         requiresMfa: true,
//       };
//     }

//     await this.prisma.user.update({
//       where: { id: user.id },
//       data: { updatedAt: new Date() },
//     });

//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );

//     await this.redis.del(RedisKeys.loginAttempts(ipAddress));

//     this.logger.log('User logged in', 'AuthService', {
//       userId: user.id,
//       ipAddress,
//     });

//     return { ...tokens, user: this.formatUser(user) };
//   }

//   // ─── MFA Login Completion ───

//   async verifyMfaLogin(
//     mfaToken: string,
//     code: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
//     let payload: JwtPayload;
//     try {
//       payload = await this.tokenService.verifyMfaToken(mfaToken);
//     } catch {
//       throw new UnauthorizedException('MFA token is invalid or expired');
//     }

//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub, deletedAt: null },
//     });

//     if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not enabled for this account');
//     }

//     const isValid = authenticator.verify({
//       token: code,
//       secret: user.twoFactorSecret,
//     });

//     if (!isValid) {
//       throw new UnauthorizedException('Invalid MFA code');
//     }

//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );

//     this.logger.log('MFA login completed', 'AuthService', { userId: user.id });

//     return { ...tokens, user: this.formatUser(user) };
//   }

//   // ─── Refresh Tokens ───

//   async refreshTokens(
//     refreshToken: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair> {
//     const session = await this.sessionService.findByTokenHash(refreshToken);

//     if (!session) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }

//     const user = await this.prisma.user.findUnique({
//       where: { id: session.userId, deletedAt: null, isActive: true },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found or inactive');
//     }

//     // Invalidate old session
//     await this.sessionService.invalidateByTokenHash(refreshToken);

//     // Create new session
//     return this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//   }

//   // ─── Logout ───

//   async logout(userId: string, sessionId: string): Promise<void> {
//     await this.sessionService.invalidateSession(sessionId);
//     this.logger.log('User logged out', 'AuthService', { userId, sessionId });
//   }

//   async logoutAllSessions(
//     userId: string,
//   ): Promise<{ sessionsRevoked: number }> {
//     // 1. Delete all sessions from DB
//     const count = await this.sessionService.invalidateAllSessions(userId);

//     // 2. Store a "logged out at" timestamp in Redis
//     // Any access token issued BEFORE this timestamp will be rejected by the JWT guard
//     const key = RedisKeys.userLogoutTimestamp(userId);
//     await this.redis.set(key, Date.now().toString(), 7 * 24 * 60 * 60); // 7d = max token lifetime

//     this.logger.log('All sessions revoked', 'AuthService', { userId, count });

//     return { sessionsRevoked: count };
//   }

//   // ─── Forgot Password ───

//   async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: dto.identifier?.toLowerCase() },
//           { phone: dto.identifier },
//         ],
//         deletedAt: null,
//       },
//     });

//     if (!user) {
//       return {
//         message: 'If an account exists, a password reset code has been sent.',
//       };
//     }

//     if (!user.email) {
//       throw new BadRequestException('User email not found');
//     }

//     await this.otpService.sendOtpToEmail(
//       user.id,
//       user.email,
//       OtpPurpose.PASSWORD_RESET,
//     );

//     return { message: 'A password reset code has been sent to your email.' };
//   }

//   // ─── Reset Password ───

//   async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
//     const isEmail = dto.identifier.includes('@');

//     const user = await this.prisma.user.findFirst({
//       where: {
//         ...(isEmail
//           ? { email: dto.identifier.toLowerCase() }
//           : { phone: dto.identifier }),
//         deletedAt: null,
//       },
//     });

//     if (!user) {
//       throw new BadRequestException('Invalid OTP or identifier');
//     }

//     let isSamePassword = false;

//     if (user.passwordHash) {
//       isSamePassword = await this.passwordService.compare(
//         dto.newPassword,
//         user.passwordHash,
//       );
//     }

//     if (isSamePassword) {
//       throw new BadRequestException('New password must be different');
//     }

//     await this.prisma.$transaction(async (tx) => {
//       await this.otpService.verifyOtp(
//         user.id,
//         dto.otp,
//         OtpPurpose.PASSWORD_RESET,
//       );

//       const newPasswordHash = await this.passwordService.hash(dto.newPassword);

//       await tx.user.update({
//         where: { id: user.id },
//         data: { passwordHash: newPasswordHash },
//       });

//       await this.sessionService.invalidateAllSessions(user.id);
//     });

//     return { message: 'Password reset successfully. Please log in again.' };
//   }

//   // async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
//   //   const user = await this.prisma.user.findFirst({
//   //     where: {
//   //       OR: [
//   //         { email: dto.identifier?.toLowerCase() },
//   //         { phone: dto.identifier },
//   //       ],
//   //       deletedAt: null,
//   //     },
//   //   });

//   //   if (!user) {
//   //     throw new BadRequestException('User not found');
//   //   }

//   //   await this.otpService.verifyOtp(
//   //     user.id,
//   //     dto.otp,
//   //     OtpPurpose.PASSWORD_RESET,
//   //   );

//   //   const newPasswordHash = await this.passwordService.hash(dto.newPassword);

//   //   await this.prisma.user.update({
//   //     where: { id: user.id },
//   //     data: { passwordHash: newPasswordHash },
//   //   });

//   //   // Invalidate all sessions for security
//   //   await this.sessionService.invalidateAllSessions(user.id);

//   //   this.logger.log('Password reset', 'AuthService', { userId: user.id });

//   //   return { message: 'Password reset successfully. Please log in again.' };
//   // }

//   // ─── Change Password ───

//   async changePassword(
//     userId: string,
//     dto: ChangePasswordDto,
//   ): Promise<{ message: string }> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId, deletedAt: null },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const isCurrentPasswordValid = await this.passwordService.compare(
//       dto.currentPassword,
//       user.passwordHash!,
//     );

//     if (!isCurrentPasswordValid) {
//       throw new UnauthorizedException('Current password is incorrect');
//     }

//     const isSamePassword = await this.passwordService.compare(
//       dto.newPassword,
//       user.passwordHash!,
//     );

//     if (isSamePassword) {
//       throw new BadRequestException(
//         'New password must be different from your current password',
//       );
//     }

//     const newPasswordHash = await this.passwordService.hash(dto.newPassword);

//     await this.prisma.user.update({
//       where: { id: userId },
//       data: { passwordHash: newPasswordHash },
//     });

//     await this.sessionService.invalidateAllSessions(userId);

//     this.logger.log('Password changed', 'AuthService', { userId });

//     return { message: 'Password changed successfully. Please log in again.' };
//   }

//   // ─── Google OAuth ───

//   async handleGoogleOAuth(
//     profile: {
//       providerId: string;
//       email: string;
//       name: string;
//       profilePhoto?: string;
//     },
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<
//     JwtTokenPair & { user: Record<string, unknown>; isNewUser: boolean }
//   > {
//     let isNewUser = false;

//     // Check if provider already linked
//     const existingProvider = await this.prisma.userAuthProvider.findUnique({
//       where: {
//         provider_providerUserId: {
//           provider: 'GOOGLE',
//           providerUserId: profile.providerId,
//         },
//       },
//       include: { user: true },
//     });

//     let user = existingProvider?.user ?? null;

//     if (!user) {
//       // Check by email
//       const existingByEmail = await this.prisma.user.findUnique({
//         where: { email: profile.email.toLowerCase() },
//       });

//       if (existingByEmail) {
//         user = existingByEmail;
//         await this.prisma.userAuthProvider.create({
//           data: {
//             userId: user.id,
//             provider: 'GOOGLE',
//             providerUserId: profile.providerId,
//             email: profile.email.toLowerCase(),
//           },
//         });
//       } else {
//         user = await this.prisma.user.create({
//           data: {
//             role: 'CLIENT',
//             fullName: profile.name,
//             email: profile.email.toLowerCase(),
//             emailVerified: true,
//           },
//         });

//         await this.prisma.client.create({ data: { userId: user.id } });

//         // Store the Google profile photo in the polymorphic Image table
//         if (profile.profilePhoto) {
//           await this.prisma.image.create({
//             data: {
//               url: profile.profilePhoto,
//               entityType: 'USER_AVATAR',
//               entityId: user.id,
//             },
//           });
//         }

//         await this.prisma.userAuthProvider.create({
//           data: {
//             userId: user.id,
//             provider: 'GOOGLE',
//             providerUserId: profile.providerId,
//             email: profile.email.toLowerCase(),
//             // isPrimary: true,
//           },
//         });

//         isNewUser = true;
//       }
//     }

//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );

//     this.logger.log('Google OAuth login', 'AuthService', {
//       userId: user.id,
//       isNewUser,
//     });

//     return { ...tokens, user: this.formatUser(user), isNewUser };
//   }

//   // ─── Private Helpers ───

//   // Replace the private createSession() method in auth.service.ts with this:

//   private async createSession(
//     userId: string,
//     role: UserRole,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair> {
//     await this.sessionService.enforceSessionLimit(userId);

//     // Generate refresh token first
//     const refreshToken = this.generateRefreshToken();

//     // Create session in DB — this gives us the sessionId
//     const session = await this.sessionService.createSession(
//       userId,
//       refreshToken,
//       ipAddress,
//       userAgent,
//     );

//     // Now build the JWT payload with the real sessionId
//     const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
//       sub: userId,
//       role,
//       permissions: this.getPermissionsForRole(role),
//       sessionId: session.id, // ← correct session ID, single write
//       deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
//     };

//     const tokens = await this.tokenService.generateTokenPair(payload);

//     // generateTokenPair generates its own refreshToken internally — override it
//     // with the one we already stored in DB
//     return {
//       accessToken: tokens.accessToken,
//       refreshToken, // ← the one hashed and stored in DB
//       expiresIn: tokens.expiresIn,
//     };
//   }

//   private generateRefreshToken(): string {
//     const crypto = require('crypto');
//     return crypto.randomBytes(64).toString('hex');
//   }
//   // private async createSession(
//   //   userId: string,
//   //   role: UserRole,
//   //   ipAddress: string,
//   //   userAgent: string,
//   // ): Promise<JwtTokenPair> {
//   //   await this.sessionService.enforceSessionLimit(userId);

//   //   // Generate token pair first so we have the refreshToken to hash
//   //   const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
//   //     sub: userId,
//   //     role,
//   //     permissions: this.getPermissionsForRole(role),
//   //     sessionId: '', // will be filled below
//   //     deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
//   //   };

//   //   const tokens = await this.tokenService.generateTokenPair(payload);

//   //   // Store hashed refresh token in DB
//   //   const session = await this.sessionService.createSession(
//   //     userId,
//   //     tokens.refreshToken,
//   //     ipAddress,
//   //     userAgent,
//   //   );

//   //   // Re-sign with actual sessionId
//   //   const finalPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
//   //     ...payload,
//   //     sessionId: session.id,
//   //   };

//   //   const finalTokens = await this.tokenService.generateTokenPair(finalPayload);

//   //   // Update session with correct token hash
//   //   await this.sessionService.invalidateSession(session.id);
//   //   const finalSession = await this.sessionService.createSession(
//   //     userId,
//   //     finalTokens.refreshToken,
//   //     ipAddress,
//   //     userAgent,
//   //   );

//   //   return finalTokens;
//   // }

//   private formatUser(user: {
//     id: string;
//     fullName: string;
//     email: string;
//     phone?: string | null;
//     emailVerified: boolean;
//     phoneVerified: boolean;
//     twoFactorEnabled: boolean;
//     role: string;
//   }): Record<string, unknown> {
//     // avatarUrl is stored in the polymorphic `images` table (entityType = 'USER_AVATAR').
//     // Callers that need the avatar should query Image separately; here we omit it
//     // to keep auth responses lean. Add an avatarUrl field to the return type and
//     // pass it in as a second argument if you need it in token responses.
//     return {
//       id: user.id,
//       fullName: user.fullName,
//       email: user.email,
//       phone: user.phone,
//       emailVerified: user.emailVerified,
//       phoneVerified: user.phoneVerified,
//       twoFactorEnabled: user.twoFactorEnabled,
//       role: user.role,
//     };
//   }

//   private getPermissionsForRole(role: UserRole): Permission[] {
//     switch (role) {
//       case UserRole.CUSTOMER:
//         return [
//           Permission.MANAGE_OWN_VEHICLES,
//           Permission.CREATE_BOOKING,
//           Permission.VIEW_OWN_BOOKINGS,
//           Permission.CANCEL_OWN_BOOKING,
//           Permission.MANAGE_OWN_PROFILE,
//         ];
//       case UserRole.STAFF:
//         return [
//           Permission.VIEW_ASSIGNED_BOOKINGS,
//           Permission.UPDATE_BOOKING_STATUS,
//           Permission.CREATE_DIVR,
//           Permission.UPLOAD_PHOTOS,
//           Permission.MANAGE_OWN_AVAILABILITY,
//         ];
//       case UserRole.ADMIN:
//         return [Permission.MANAGE_USERS];
//       default:
//         return [];
//     }
//   }

//   private generateDeviceFingerprint(
//     userAgent: string,
//     ipAddress: string,
//   ): string {
//     const crypto = require('crypto');
//     return crypto
//       .createHash('sha256')
//       .update(`${userAgent}:${ipAddress}`)
//       .digest('hex')
//       .substring(0, 16);
//   }

//   private async checkLoginRateLimit(ipAddress: string): Promise<void> {
//     const key = RedisKeys.loginAttempts(ipAddress);
//     const result = await this.redis.checkRateLimit(key, 5, 900);

//     if (!result.allowed) {
//       throw new ForbiddenException(
//         'Too many login attempts. Please try again in 15 minutes.',
//       );
//     }
//   }

//   private async recordFailedLogin(
//     userId: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<void> {
//     const key = RedisKeys.loginAttempts(ipAddress);
//     await this.redis.incr(key);
//     await this.redis.expire(key, 900);

//     await this.prisma.auditLog.create({
//       data: {
//         actorId: userId,
//         entityType: 'USER',
//         entityId: userId,
//         action: 'LOGIN',
//         ipAddress,
//         userAgent,
//         newData: { reason: 'Invalid password' },
//       },
//     });
//   }
// }
