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
import { generateReferralCode, OTP as OTP_CONSTANTS } from '@glow-fix/utils';

import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OtpPurpose, VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
  ) {}

  // ─── Registration ───

  async register(
    dto: RegisterDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    // Check if email already exists
    const existingEmail = await this.prisma.customer.findUnique({
      where: {
        email: dto.email.toLowerCase(),
        deletedAt: null,
      },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email already exists');
    }

    // Check if mobile number already exists
    const existingMobile = await this.prisma.customer.findUnique({
      where: {
        mobileNumber: dto.mobileNumber,
        deletedAt: null,
      },
    });
    if (existingMobile) {
      throw new ConflictException(
        'An account with this mobile number already exists',
      );
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(dto.password);

    // Generate unique referral code
    let referralCode: string;
    let isUnique = false;
    do {
      referralCode = generateReferralCode('GF');
      const existing = await this.prisma.customer.findUnique({
        where: { referralCode },
      });
      isUnique = !existing;
    } while (!isUnique);

    // Handle referral
    let referredBy: string | null = null;
    if (dto.referralCode) {
      const referrer = await this.prisma.customer.findUnique({
        where: { referralCode: dto.referralCode },
      });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Create customer
    await this.prisma.customer.create({
      data: {
        fullName: dto.fullName,
        mobileNumber: dto.mobileNumber,
        email: dto.email.toLowerCase(),
        passwordHash,
        referralCode,
        referredBy,
        marketingConsent: dto.marketingConsent || false,
        mobileVerified: false,
        emailVerified: false,
      },
    });

    // Send OTP to both mobile and email in parallel
    await Promise.all([
      this.otpService.sendOtp(dto.mobileNumber, OtpPurpose.REGISTRATION),
      this.otpService.sendOtpToEmail(
        dto.email.toLowerCase(),
        OtpPurpose.REGISTRATION,
      ),
    ]);

    this.logger.log('Customer registered', 'AuthService', {
      email: dto.email,
      mobile: dto.mobileNumber,
      ipAddress,
    });

    return {
      message:
        'Registration successful. Verification codes have been sent to your mobile number and email.',
      requiresOtp: true,
    };
  }
  // async register(
  //   dto: RegisterDto,
  //   ipAddress: string,
  //   userAgent: string,
  // ): Promise<{ message: string; requiresOtp: boolean }> {
  //   // Check if email already exists
  //   const existingEmail = await this.prisma.customer.findUnique({
  //     where: { email: dto.email.toLowerCase() },
  //   });
  //   if (existingEmail) {
  //     throw new ConflictException('An account with this email already exists');
  //   }

  //   // Check if mobile number already exists
  //   const existingMobile = await this.prisma.customer.findUnique({
  //     where: { mobileNumber: dto.mobileNumber },
  //   });
  //   if (existingMobile) {
  //     throw new ConflictException(
  //       'An account with this mobile number already exists',
  //     );
  //   }

  //   // Hash password
  //   const passwordHash = await this.passwordService.hash(dto.password);

  //   // Generate unique referral code
  //   let referralCode: string;
  //   let isUnique = false;
  //   do {
  //     referralCode = generateReferralCode('GF');
  //     const existing = await this.prisma.customer.findUnique({
  //       where: { referralCode },
  //     });
  //     isUnique = !existing;
  //   } while (!isUnique);

  //   // Handle referral
  //   let referredBy: string | null = null;
  //   if (dto.referralCode) {
  //     const referrer = await this.prisma.customer.findUnique({
  //       where: { referralCode: dto.referralCode },
  //     });
  //     if (referrer) {
  //       referredBy = referrer.id;
  //     }
  //   }

  //   // Create customer
  //   await this.prisma.customer.create({
  //     data: {
  //       fullName: dto.fullName,
  //       mobileNumber: dto.mobileNumber,
  //       email: dto.email.toLowerCase(),
  //       passwordHash,
  //       referralCode,
  //       referredBy,
  //       marketingConsent: dto.marketingConsent || false,
  //       mobileVerified: false,
  //       emailVerified: false,
  //     },
  //   });

  //   // Send OTP for mobile verification
  //   await this.otpService.sendOtp(dto.mobileNumber, 'REGISTRATION');

  //   this.logger.log('Customer registered', 'AuthService', {
  //     email: dto.email,
  //     mobile: dto.mobileNumber,
  //     ipAddress,
  //   });

  //   return {
  //     message:
  //       'Registration successful. Please verify your mobile number with the OTP sent.',
  //     requiresOtp: true,
  //   };
  // }

  // ─── OTP Verification ───

  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair & { customer: Record<string, unknown> }> {
    // Resolve which identifier and channel was used
    const identifier = dto.email ?? dto.mobileNumber;

    if (!identifier) {
      throw new BadRequestException('Provide either email or mobileNumber');
    }

    // Verify OTP against whichever identifier was provided
    const isValid = await this.otpService.verifyOtp(
      identifier,
      dto.otp,
      dto.purpose,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Find customer — support lookup by either email or mobile
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
          ...(dto.mobileNumber ? [{ mobileNumber: dto.mobileNumber }] : []),
        ],
        deletedAt: null,
      },
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    // Mark the appropriate channel as verified
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        ...(dto.email && !customer.emailVerified && { emailVerified: true }),
        ...(dto.mobileNumber &&
          !customer.mobileVerified && { mobileVerified: true }),
      },
    });

    // Handle referral activation for new registrations
    if (dto.purpose === OtpPurpose.REGISTRATION && customer.referredBy) {
      await this.activateReferral(customer.id, customer.referredBy);
    }

    // Generate tokens and create session
    const tokens = await this.createSession(
      customer.id,
      UserRole.CUSTOMER,
      ipAddress,
      userAgent,
    );

    this.logger.log('OTP verified successfully', 'AuthService', {
      customerId: customer.id,
      purpose: dto.purpose,
      channel: dto.email ? 'email' : 'mobile',
    });

    return {
      ...tokens,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        loyaltyPoints: customer.loyaltyPoints,
        mobileVerified: dto.mobileNumber ? true : customer.mobileVerified,
        emailVerified: dto.email ? true : customer.emailVerified,
      },
    };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    if (!dto.email && !dto.mobileNumber) {
      throw new BadRequestException('Provide either email or mobileNumber');
    }

    // Verify the customer exists
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
          ...(dto.mobileNumber ? [{ mobileNumber: dto.mobileNumber }] : []),
        ],
        deletedAt: null,
      },
    });

    if (!customer) {
      // Return a generic message to avoid user enumeration
      return {
        message: 'If an account exists, a new verification code has been sent.',
      };
    }

    if (dto.email) {
      // Skip if already verified
      if (customer.emailVerified && dto.purpose === OtpPurpose.REGISTRATION) {
        throw new BadRequestException('Email is already verified');
      }
      await this.otpService.sendOtpToEmail(
        dto.email.toLowerCase(),
        dto.purpose,
      );
    }

    if (dto.mobileNumber) {
      // Skip if already verified
      if (customer.mobileVerified && dto.purpose === OtpPurpose.REGISTRATION) {
        throw new BadRequestException('Mobile number is already verified');
      }
      await this.otpService.sendOtp(dto.mobileNumber, dto.purpose);
    }

    this.logger.log('OTP resent', 'AuthService', {
      channel: dto.email ? 'email' : 'mobile',
      purpose: dto.purpose,
    });

    return { message: 'A new verification code has been sent.' };
  }
  // async verifyOtp(
  //   dto: VerifyOtpDto,
  //   ipAddress: string,
  //   userAgent: string,
  // ): Promise<JwtTokenPair & { customer: Record<string, unknown> }> {
  //   // Verify OTP
  //   const isValid = await this.otpService.verifyOtp(
  //     dto.mobileNumber,
  //     dto.otp,
  //     dto.purpose,
  //   );

  //   if (!isValid) {
  //     throw new BadRequestException('Invalid or expired OTP');
  //   }

  //   // Find customer
  //   const customer = await this.prisma.customer.findUnique({
  //     where: { mobileNumber: dto.mobileNumber },
  //   });

  //   if (!customer) {
  //     throw new BadRequestException('Customer not found');
  //   }

  //   // Mark mobile as verified
  //   if (!customer.mobileVerified) {
  //     await this.prisma.customer.update({
  //       where: { id: customer.id },
  //       data: { mobileVerified: true },
  //     });
  //   }

  //   // Handle referral activation for new registrations
  //   if (dto.purpose === 'REGISTRATION' && customer.referredBy) {
  //     await this.activateReferral(customer.id, customer.referredBy);
  //   }

  //   // Generate tokens and create session
  //   const tokens = await this.createSession(
  //     customer.id,
  //     UserRole.CUSTOMER,
  //     ipAddress,
  //     userAgent,
  //   );

  //   this.logger.log('OTP verified successfully', 'AuthService', {
  //     customerId: customer.id,
  //     purpose: dto.purpose,
  //   });

  //   return {
  //     ...tokens,
  //     customer: {
  //       id: customer.id,
  //       fullName: customer.fullName,
  //       email: customer.email,
  //       mobileNumber: customer.mobileNumber,
  //       loyaltyPoints: customer.loyaltyPoints,
  //       mobileVerified: true,
  //       emailVerified: customer.emailVerified,
  //     },
  //   };
  // }

  // ─── Login ───

  async login(
    dto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<
    JwtTokenPair & { customer: Record<string, unknown>; requiresMfa?: boolean }
  > {
    // Find customer by email or mobile
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { email: dto.identifier.toLowerCase() },
          { mobileNumber: dto.identifier },
        ],
        deletedAt: null,
      },
    });

    if (!customer || !customer.passwordHash) {
      await this.checkLoginRateLimit(ipAddress);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.checkLoginRateLimit(ipAddress);

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      customer.passwordHash,
    );

    if (!isPasswordValid) {
      await this.recordFailedLogin(customer.id, ipAddress, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (customer.twoFactorEnabled) {
      const mfaToken = await this.tokenService.generateMfaToken(customer.id);
      return {
        accessToken: mfaToken,
        refreshToken: '', // ← This is empty, causing your issue
        expiresIn: 300,
        customer: { id: customer.id },
        requiresMfa: true,
      };
    }

    // Update last active
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { lastActiveAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.createSession(
      customer.id,
      UserRole.CUSTOMER,
      ipAddress,
      userAgent,
    );

    // Clear failed login attempts
    await this.redis.del(RedisKeys.loginAttempts(ipAddress));

    this.logger.log('Customer logged in', 'AuthService', {
      customerId: customer.id,
      ipAddress,
    });

    return {
      accessToken: tokens.accessToken, // ← Make sure these are included
      refreshToken: tokens.refreshToken, // ← This should be included
      expiresIn: tokens.expiresIn,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        loyaltyPoints: customer.loyaltyPoints,
        profilePhotoUrl: customer.profilePhotoUrl,
        mobileVerified: customer.mobileVerified,
        emailVerified: customer.emailVerified,
        twoFactorEnabled: customer.twoFactorEnabled,
      },
    };
  }
  // // ─── Login ───

  // async login(
  //   dto: LoginDto,
  //   ipAddress: string,
  //   userAgent: string,
  // ): Promise<
  //   JwtTokenPair & { customer: Record<string, unknown>; requiresMfa?: boolean }
  // > {
  //   // Find customer by email or mobile
  //   const customer = await this.prisma.customer.findFirst({
  //     where: {
  //       OR: [
  //         { email: dto.identifier.toLowerCase() },
  //         { mobileNumber: dto.identifier },
  //       ],
  //       deletedAt: null,
  //     },
  //   });

  //   if (!customer || !customer.passwordHash) {
  //     // Check rate limit before revealing info
  //     await this.checkLoginRateLimit(ipAddress);
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Check rate limit
  //   await this.checkLoginRateLimit(ipAddress);

  //   // Verify password
  //   const isPasswordValid = await this.passwordService.compare(
  //     dto.password,
  //     customer.passwordHash,
  //   );

  //   if (!isPasswordValid) {
  //     await this.recordFailedLogin(customer.id, ipAddress, userAgent);
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Check if MFA is enabled
  //   if (customer.twoFactorEnabled) {
  //     // Return a temporary token that requires MFA verification
  //     const mfaToken = await this.tokenService.generateMfaToken(customer.id);
  //     return {
  //       accessToken: mfaToken,
  //       refreshToken: '',
  //       expiresIn: 300, // 5 minutes to complete MFA
  //       customer: { id: customer.id },
  //       requiresMfa: true,
  //     };
  //   }

  //   // Update last active
  //   await this.prisma.customer.update({
  //     where: { id: customer.id },
  //     data: { lastActiveAt: new Date() },
  //   });

  //   // Generate tokens
  //   const tokens = await this.createSession(
  //     customer.id,
  //     UserRole.CUSTOMER,
  //     ipAddress,
  //     userAgent,
  //   );

  //   // Clear failed login attempts
  //   await this.redis.del(RedisKeys.loginAttempts(ipAddress));

  //   this.logger.log('Customer logged in', 'AuthService', {
  //     customerId: customer.id,
  //     ipAddress,
  //   });

  //   return {
  //     ...tokens,
  //     customer: {
  //       id: customer.id,
  //       fullName: customer.fullName,
  //       email: customer.email,
  //       mobileNumber: customer.mobileNumber,
  //       loyaltyPoints: customer.loyaltyPoints,
  //       profilePhotoUrl: customer.profilePhotoUrl,
  //       mobileVerified: customer.mobileVerified,
  //       emailVerified: customer.emailVerified,
  //       twoFactorEnabled: customer.twoFactorEnabled,
  //     },
  //   };
  // }

  // ─── Refresh Token ───

  async refreshTokens(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair> {
    // Find session by refresh token
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Verify user still exists and is active
    const customer = await this.prisma.customer.findFirst({
      where: { id: session.userId, deletedAt: null },
    });

    if (!customer) {
      // Invalidate session
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Account not found or deactivated');
    }

    // Rotate refresh token (invalidate old, create new)
    const newTokens = await this.tokenService.generateTokenPair({
      sub: customer.id,
      role: UserRole.CUSTOMER,
      permissions: this.getCustomerPermissions(),
      sessionId: session.id,
      deviceFingerprint: '',
    });

    // Update session with new refresh token
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newTokens.refreshToken,
        lastActivityAt: new Date(),
        ipAddress,
        userAgent,
      },
    });

    this.logger.debug('Token refreshed', 'AuthService', {
      customerId: customer.id,
      sessionId: session.id,
    });

    return newTokens;
  }

  // ─── Logout ───

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionId);

    this.logger.log('User logged out', 'AuthService', {
      userId,
      sessionId,
    });
  }

  async logoutAllSessions(
    userId: string,
  ): Promise<{ sessionsRevoked: number }> {
    const count = await this.sessionService.invalidateAllSessions(userId);

    this.logger.log('All sessions revoked', 'AuthService', {
      userId,
      sessionsRevoked: count,
    });

    return { sessionsRevoked: count };
  }

  // ─── Forgot Password ───

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { email: dto.identifier.toLowerCase() },
          { mobileNumber: dto.identifier },
        ],
        deletedAt: null,
      },
    });

    // Always return success to prevent user enumeration
    if (!customer) {
      return {
        message: 'If an account exists, a password reset link has been sent.',
      };
    }

    // Check rate limit
    const rateLimitKey = RedisKeys.rateLimit('password-reset', customer.id);
    const rateCheck = await this.redis.checkRateLimit(rateLimitKey, 3, 3600);
    if (!rateCheck.allowed) {
      return {
        message: 'If an account exists, a password reset link has been sent.',
      };
    }

    // Send OTP to mobile or email
    if (customer.mobileNumber) {
      await this.otpService.sendOtp(customer.mobileNumber, 'PASSWORD_RESET');
    }

    this.logger.log('Password reset requested', 'AuthService', {
      customerId: customer.id,
    });

    return {
      message: 'If an account exists, a password reset link has been sent.',
    };
  }

  // ─── Reset Password ───

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    // Verify OTP
    const isValid = await this.otpService.verifyOtp(
      dto.mobileNumber,
      dto.otp,
      'PASSWORD_RESET',
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { mobileNumber: dto.mobileNumber },
    });

    if (!customer) {
      throw new BadRequestException('Account not found');
    }

    // Check password history
    const isReused = await this.passwordService.isPasswordReused(
      dto.newPassword,
      customer.id,
    );
    if (isReused) {
      throw new BadRequestException(
        'Cannot reuse any of your last 5 passwords',
      );
    }

    // Hash new password
    const passwordHash = await this.passwordService.hash(dto.newPassword);

    // Update password
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash },
    });

    // Save to password history
    await this.passwordService.addToHistory(customer.id, passwordHash);

    // Invalidate all sessions
    await this.sessionService.invalidateAllSessions(customer.id);

    this.logger.log('Password reset successful', 'AuthService', {
      customerId: customer.id,
    });

    return {
      message:
        'Password has been reset successfully. Please log in with your new password.',
    };
  }

  async changePassword(
    customerId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Fetch customer with password hash
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    
    if (!customer.passwordHash) {
      throw new BadRequestException('Password is not set for this account');
    }

    // Verify current password is correct
    const isCurrentPasswordValid = await this.passwordService.compare(
      dto.currentPassword,
      customer.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }


    // Prevent reusing the same password
    const isSamePassword = await this.passwordService.compare(
      dto.newPassword,
      customer.passwordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from your current password',
      );
    }

    // Hash and save the new password
    const newPasswordHash = await this.passwordService.hash(dto.newPassword);

    await this.prisma.customer.update({
      where: { id: customerId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all other sessions for security — force re-login on other devices
    await this.sessionService.invalidateAllSessions(customerId);

    this.logger.log('Password changed', 'AuthService', { customerId });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // ─── Google OAuth ───

  async handleGoogleOAuth(
    profile: {
      email: string;
      name: string;
      providerId: string;
      profilePhoto?: string;
    },
    ipAddress: string,
    userAgent: string,
  ): Promise<
    JwtTokenPair & { customer: Record<string, unknown>; isNewUser: boolean }
  > {
    // Check if OAuth account exists
    const oauthAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: 'google',
          providerId: profile.providerId,
        },
      },
      include: { customer: true },
    });

    let customer;
    let isNewUser = false;

    if (oauthAccount) {
      // Existing user
      customer = oauthAccount.customer;
    } else {
      // Check if email matches existing customer
      customer = await this.prisma.customer.findUnique({
        where: { email: profile.email.toLowerCase() },
      });

      if (customer) {
        // Link OAuth to existing account
        await this.prisma.oAuthAccount.create({
          data: {
            customerId: customer.id,
            provider: 'google',
            providerId: profile.providerId,
          },
        });
      } else {
        // Create new customer
        let referralCode: string;
        let isUnique = false;
        do {
          referralCode = generateReferralCode('GF');
          const existing = await this.prisma.customer.findUnique({
            where: { referralCode },
          });
          isUnique = !existing;
        } while (!isUnique);

        customer = await this.prisma.customer.create({
          data: {
            fullName: profile.name,
            email: profile.email.toLowerCase(),
            mobileNumber: '', // Will need to add mobile later
            passwordHash: null, // OAuth users don't need password
            referralCode,
            emailVerified: true, // Google verified
            profilePhotoUrl: profile.profilePhoto || null,
          },
        });

        await this.prisma.oAuthAccount.create({
          data: {
            customerId: customer.id,
            provider: 'google',
            providerId: profile.providerId,
          },
        });

        isNewUser = true;
      }
    }

    // Generate tokens
    const tokens = await this.createSession(
      customer.id,
      UserRole.CUSTOMER,
      ipAddress,
      userAgent,
    );

    this.logger.log('Google OAuth login', 'AuthService', {
      customerId: customer.id,
      isNewUser,
    });

    return {
      ...tokens,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        loyaltyPoints: customer.loyaltyPoints,
        profilePhotoUrl: customer.profilePhotoUrl,
        mobileVerified: customer.mobileVerified,
        emailVerified: customer.emailVerified,
      },
      isNewUser,
    };
  }

  // ─── Private Helpers ───

  private async createSession(
    userId: string,
    role: UserRole,
    ipAddress: string,
    userAgent: string,
  ): Promise<JwtTokenPair> {
    // Check concurrent session limit
    await this.sessionService.enforceSessionLimit(userId);

    // Create session record
    const session = await this.sessionService.createSession(
      userId,
      role === UserRole.CUSTOMER
        ? 'CUSTOMER'
        : role === UserRole.STAFF
          ? 'STAFF'
          : 'ADMIN',
      ipAddress,
      userAgent,
    );

    // Generate token pair
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      role,
      permissions: this.getPermissionsForRole(role),
      sessionId: session.id, // ← Make sure session.id exists
      deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
    };

    const tokens = await this.tokenService.generateTokenPair(payload);

    // Update session with refresh token
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens; // ← This returns { accessToken, refreshToken, expiresIn }
  }
  // private async createSession(
  //   userId: string,
  //   role: UserRole,
  //   ipAddress: string,
  //   userAgent: string,
  // ): Promise<JwtTokenPair> {
  //   // Check concurrent session limit
  //   await this.sessionService.enforceSessionLimit(userId);

  //   // Create session record
  //   const session = await this.sessionService.createSession(
  //     userId,
  //     role === UserRole.CUSTOMER
  //       ? 'CUSTOMER'
  //       : role === UserRole.STAFF
  //         ? 'STAFF'
  //         : 'ADMIN',
  //     ipAddress,
  //     userAgent,
  //   );

  //   // Generate token pair
  //   const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
  //     sub: userId,
  //     role,
  //     permissions: this.getPermissionsForRole(role),
  //     sessionId: session.id,
  //     deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
  //   };

  //   const tokens = await this.tokenService.generateTokenPair(payload);

  //   // Update session with refresh token
  //   await this.prisma.session.update({
  //     where: { id: session.id },
  //     data: { refreshToken: tokens.refreshToken },
  //   });

  //   return tokens;
  // }

  private getPermissionsForRole(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.CUSTOMER:
        return this.getCustomerPermissions();
      case UserRole.STAFF:
        return this.getStaffPermissions();
      case UserRole.ADMIN:
        return [Permission.MANAGE_USERS]; // Admin gets specific permissions from DB
      default:
        return [];
    }
  }

  private getCustomerPermissions(): Permission[] {
    return [
      Permission.MANAGE_OWN_VEHICLES,
      Permission.CREATE_BOOKING,
      Permission.VIEW_OWN_BOOKINGS,
      Permission.CANCEL_OWN_BOOKING,
      Permission.MANAGE_OWN_PROFILE,
    ];
  }

  private getStaffPermissions(): Permission[] {
    return [
      Permission.VIEW_ASSIGNED_BOOKINGS,
      Permission.UPDATE_BOOKING_STATUS,
      Permission.CREATE_DIVR,
      Permission.UPLOAD_PHOTOS,
      Permission.MANAGE_OWN_AVAILABILITY,
    ];
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
    const result = await this.redis.checkRateLimit(key, 5, 900); // 5 attempts per 15 min

    if (!result.allowed) {
      throw new ForbiddenException(
        'Too many login attempts. Please try again in 15 minutes.',
      );
    }
  }

  private async recordFailedLogin(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    // Increment rate limit counter
    const key = RedisKeys.loginAttempts(ipAddress);
    await this.redis.incr(key);
    await this.redis.expire(key, 900);

    // Log security event
    await this.prisma.securityEvent.create({
      data: {
        eventType: 'FAILED_LOGIN',
        severity: 'MEDIUM',
        userId,
        ipAddress,
        userAgent,
        metadata: { reason: 'Invalid password' },
      },
    });
  }

  private async activateReferral(
    refereeId: string,
    referrerId: string,
  ): Promise<void> {
    try {
      const referral = await this.prisma.referral.findFirst({
        where: {
          refereeId,
          referrerId,
          status: 'PENDING',
        },
      });

      if (!referral) {
        // Create referral record
        await this.prisma.referral.create({
          data: {
            referrerId,
            refereeId,
            referralCode: '', // Will be filled from referrer
            status: 'ACTIVATED',
            bonusPoints: 500,
            activatedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      } else {
        await this.prisma.referral.update({
          where: { id: referral.id },
          data: { status: 'ACTIVATED', activatedAt: new Date() },
        });
      }

      // Award points to referrer (will be handled by loyalty module)
      this.logger.log('Referral activated', 'AuthService', {
        referrerId,
        refereeId,
      });
    } catch (error) {
      this.logger.warn('Failed to activate referral', 'AuthService', {
        referrerId,
        refereeId,
        error: (error as Error).message,
      });
    }
  }
}
