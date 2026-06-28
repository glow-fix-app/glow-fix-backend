import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserRole, Permission } from '@glow-fix/types';
import { authenticator } from 'otplib';
import { OtpPurpose } from '@prisma/client';

import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';

import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { AuthRepository } from './auth.repository';
import { RegistrationService, ManagerRegistrationFiles } from './registration.service';

import {
  LoginDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/request';

import { RegisterClientDto } from './dto/request/register-client.dto';
import { RegisterManagerDto } from './dto/request/register-manager.dto';
import { RegisterAdminDto } from './dto/request/register-admin.dto';

import {
  IAuthService,
  RegistrationResult,
  AuthResult,
  LoginResult,
  TokenResult,
  GoogleAuthResult,
  GoogleOAuthProfile,
  FormattedUser,
} from './interfaces/auth.interface';

import {
  InvalidCredentialsException,
  UserNotFoundException,
  EmailNotVerifiedException,
  AccountDeletedException,
  AccountDeactivatedException,
  MfaNotEnabledException,
  InvalidMfaCodeException,
  TooManyLoginAttemptsException,
  InvalidRefreshTokenException,
  ResetTokenExpiredException,
  SamePasswordException,
  PasswordReusedException,
  CurrentPasswordIncorrectException,
} from './exceptions/auth.exceptions';

import { AUTH_CONSTANTS, ROLE_PERMISSIONS } from './constants/auth.constants';

authenticator.options = { window: 1 };

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly registrationService: RegistrationService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // ─── Registration (delegates to RegistrationService) ──────────────────────

  registerClient(
    dto: RegisterClientDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<RegistrationResult> {
    return this.registrationService.registerClient(dto, ipAddress);
  }

  registerManager(
    dto: RegisterManagerDto,
    files: ManagerRegistrationFiles,
    ipAddress: string,
    userAgent: string,
  ): Promise<RegistrationResult> {
    return this.registrationService.registerManager(dto, files, ipAddress);
  }

  registerAdmin(
    dto: RegisterAdminDto,
    actorId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<RegistrationResult> {
    return this.registrationService.registerAdmin(dto, actorId, ipAddress, userAgent);
  }

  // ─── OTP ──────────────────────────────────────────────────────────────────

  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResult> {
    const identifier = dto.email ?? dto.phone;
    if (!identifier) throw new InvalidCredentialsException();

    const user = await this.repository.findUserByIdentifier(identifier);
    if (!user) throw new UserNotFoundException();

    await this.otpService.verifyOtp(user.id, dto.otp, dto.purpose);

    const updatedUser = await this.repository.updateUser(user.id, {
      ...(dto.purpose === 'EMAIL_VERIFICATION' && { emailVerified: true }),
      ...(dto.purpose === 'PHONE_VERIFICATION' && { phoneVerified: true }),
    });

    const tokens = await this.createSession(
      updatedUser.id,
      updatedUser.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('OTP verified', 'AuthService', {
      userId: user.id,
      purpose: dto.purpose,
    });

    return { ...tokens, user: this.formatUser(updatedUser) };
  }

  async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
    const identifier = dto.email ?? dto.phone;
    if (!identifier) throw new InvalidCredentialsException();

    const user = await this.repository.findUserByIdentifier(identifier);
    if (!user) {
      return { message: 'If an account exists, a new verification code has been sent.' };
    }

    await this.validateResendOtp(user, dto);
    await this.sendVerificationOtp(user.id, identifier, dto.purpose);

    return { message: 'If an account exists, a new verification code has been sent.' };
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  async login(
    dto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<LoginResult> {
    const anyUser = await this.repository.findUserWithDeletedStatus(dto.identifier);

    if (anyUser?.deletedAt) throw new AccountDeletedException();
    if (anyUser && !anyUser.isActive) throw new AccountDeactivatedException();

    const user = await this.repository.findUserByIdentifier(dto.identifier);
    if (!user || !user.passwordHash) {
      await this.checkLoginRateLimit(ipAddress);
      throw new InvalidCredentialsException();
    }

    await this.checkLoginRateLimit(ipAddress);

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.recordFailedLogin(user.id, ipAddress, userAgent);
      throw new InvalidCredentialsException();
    }

    if (!user.emailVerified) {
      this.otpService
        .sendOtpToEmail(user.id, user.email!, 'EMAIL_VERIFICATION')
        .catch(() => {});
      throw new EmailNotVerifiedException();
    }

    if (user.twoFactorEnabled) {
      const mfaToken = await this.tokenService.generateMfaToken(user.id);
      return {
        accessToken: mfaToken,
        refreshToken: '',
        expiresIn: AUTH_CONSTANTS.MFA_TOKEN_EXPIRY,
        user: this.formatUser(user),
        requiresMfa: true,
      };
    }

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    await this.clearLoginAttempts(ipAddress);

    this.logger.log('User logged in', 'AuthService', { userId: user.id, ipAddress });

    return { ...tokens, user: this.formatUser(user) };
  }

  async verifyMfaLogin(
    mfaToken: string,
    code: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResult> {
    let payload: { sub: string };
    try {
      payload = await this.tokenService.verifyMfaToken(mfaToken);
    } catch {
      throw new InvalidCredentialsException();
    }

    const user = await this.repository.findUserById(payload.sub);
    if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
      throw new MfaNotEnabledException();
    }
    if (!user.emailVerified) throw new EmailNotVerifiedException();

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) throw new InvalidMfaCodeException();

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('MFA login completed', 'AuthService', { userId: user.id });

    return { ...tokens, user: this.formatUser(user) };
  }

  // ─── Tokens ─────────────────────────────────────────────────────────────────

  async refreshTokens(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenResult> {
    const session = await this.sessionService.findByTokenHash(refreshToken);
    if (!session) throw new InvalidRefreshTokenException();

    const user = await this.repository.findUserById(session.userId);
    if (!user) throw new UserNotFoundException();

    await this.sessionService.invalidateByTokenHash(refreshToken);

    return this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );
  }

  // ─── Sessions ───────────────────────────────────────────────────────────────

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.invalidateSession(sessionId);
    this.logger.log('User logged out', 'AuthService', { userId, sessionId });
  }

  async logoutAllSessions(userId: string): Promise<{ sessionsRevoked: number }> {
    const count = await this.sessionService.invalidateAllSessions(userId);
    await this.redisService.set(
      RedisKeys.userLogoutTimestamp(userId),
      Date.now().toString(),
      7 * 24 * 60 * 60,
    );
    this.logger.log('All sessions revoked', 'AuthService', { userId, count });
    return { sessionsRevoked: count };
  }

  // ─── Password ───────────────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.repository.findUserByIdentifier(dto.identifier);
    if (!user) {
      return { message: 'If an account exists, a password reset code has been sent.' };
    }
    if (!user.email) throw new UserNotFoundException();

    await this.otpService.sendOtpToEmail(user.id, user.email, 'PASSWORD_RESET');
    return { message: 'A password reset code has been sent to your email.' };
  }

  async verifyResetOtp(dto: { email: string; otp: string }): Promise<{ resetToken: string }> {
    const user = await this.repository.findUserByEmail(dto.email);
    if (!user) throw new InvalidCredentialsException();

    await this.otpService.verifyOtp(user.id, dto.otp, 'PASSWORD_RESET', false);

    const resetToken = await this.tokenService.generateResetToken(user.id, user.email!);
    this.logger.log('Reset OTP verified, token issued', 'AuthService', { userId: user.id });

    return { resetToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    let tokenPayload: { sub: string; email: string };
    try {
      tokenPayload = this.tokenService.verifyResetToken(dto.resetToken);
    } catch {
      throw new ResetTokenExpiredException();
    }

    const user = await this.repository.findUserById(tokenPayload.sub);
    if (!user) throw new UserNotFoundException();

    if (user.passwordHash) {
      const isSame = await this.passwordService.compare(dto.newPassword, user.passwordHash);
      if (isSame) throw new SamePasswordException();
    }

    const isReused = await this.passwordService.isPasswordReused(dto.newPassword, user.id);
    if (isReused) throw new PasswordReusedException();

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);
    await this.repository.updateUser(user.id, { passwordHash: newPasswordHash });
    await this.passwordService.addToHistory(user.id, newPasswordHash);
    await this.sessionService.invalidateAllSessions(user.id);

    const otpRecord = await this.repository.findLatestOtp(user.id, 'PASSWORD_RESET');
    if (otpRecord) await this.repository.markOtpAsUsed(otpRecord.id);

    return { message: 'Password reset successfully. Please log in again.' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.repository.findUserById(userId);
    if (!user) throw new UserNotFoundException();

    if (user.passwordHash) {
      if (!dto.currentPassword) throw new CurrentPasswordIncorrectException();

      const isValid = await this.passwordService.compare(
        dto.currentPassword,
        user.passwordHash,
      );
      if (!isValid) throw new CurrentPasswordIncorrectException();

      const isSame = await this.passwordService.compare(dto.newPassword, user.passwordHash);
      if (isSame) throw new SamePasswordException();
    }

    const isReused = await this.passwordService.isPasswordReused(dto.newPassword, userId);
    if (isReused) throw new PasswordReusedException();

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);
    await this.repository.updateUser(userId, { passwordHash: newPasswordHash });
    await this.passwordService.addToHistory(userId, newPasswordHash);
    await this.sessionService.invalidateAllSessions(userId);

    this.logger.log('Password changed', 'AuthService', { userId });

    return { message: 'Password changed successfully. Please log in again.' };
  }

  // ─── Google OAuth ────────────────────────────────────────────────────────────

  async handleGoogleOAuth(
    profile: GoogleOAuthProfile,
    ipAddress: string,
    userAgent: string,
  ): Promise<GoogleAuthResult> {
    let isNewUser = false;

    const existingProvider = await this.repository.findOAuthProvider('GOOGLE', profile.providerId);
    let user = existingProvider?.user;

    if (!user) {
      const existingByEmail = await this.repository.findUserByEmail(profile.email);
      if (existingByEmail) {
        user = existingByEmail;
        await this.repository.createOAuthProvider({
          userId: user.id,
          provider: 'GOOGLE',
          providerUserId: profile.providerId,
          email: profile.email.toLowerCase(),
        });
      } else {
        user = await this.repository.createUser({
          role: 'CLIENT',
          fullName: profile.name,
          email: profile.email.toLowerCase(),
          emailVerified: true,
        });
        await this.repository.createClient(user.id);
        await this.repository.createOAuthProvider({
          userId: user.id,
          provider: 'GOOGLE',
          providerUserId: profile.providerId,
          email: profile.email.toLowerCase(),
        });
        if (profile.profilePhoto) {
          await this.repository.createImage({
            url: profile.profilePhoto,
            entityType: 'USER_AVATAR',
            entityId: user.id,
          });
        }
        isNewUser = true;
      }
    }

    const tokens = await this.createSession(
      user.id,
      user.role as unknown as UserRole,
      ipAddress,
      userAgent,
    );

    this.logger.log('Google OAuth login', 'AuthService', { userId: user.id, isNewUser });

    return { ...tokens, user: this.formatUser(user), isNewUser };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async createSession(
    userId: string,
    role: UserRole,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenResult> {
    await this.sessionService.enforceSessionLimit(userId);

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const session = await this.sessionService.createSession(
      userId,
      refreshToken,
      ipAddress,
      userAgent,
    );

    const payload = {
      sub: userId,
      role,
      permissions: ROLE_PERMISSIONS[role] ?? [],
      sessionId: session.id,
      deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
    };

    const tokens = await this.tokenService.generateTokenPair(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  private generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}:${ipAddress}`)
      .digest('hex')
      .substring(0, AUTH_CONSTANTS.DEVICE_FINGERPRINT_LENGTH);
  }

  private async checkLoginRateLimit(ipAddress: string): Promise<void> {
    const key = RedisKeys.loginAttempts(ipAddress);
    const result = await this.redisService.checkRateLimit(
      key,
      AUTH_CONSTANTS.LOGIN_ATTEMPTS_LIMIT,
      AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW,
    );
    if (!result.allowed) throw new TooManyLoginAttemptsException();
  }

  private async recordFailedLogin(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    try {
      const key = RedisKeys.loginAttempts(ipAddress);
      await this.redisService.incr(key);
      await this.redisService.expire(key, AUTH_CONSTANTS.LOGIN_ATTEMPTS_WINDOW);
    } catch (error) {
      this.logger.warn(
        `Redis unavailable for failed login recording: ${(error as Error).message}`,
        'AuthService',
      );
    }

    await this.repository.createAuditLog({
      actorId: userId,
      entityType: 'USER',
      entityId: userId,
      action: 'LOGIN',
      ipAddress,
      userAgent,
      newData: { reason: 'Invalid password' },
    });
  }

  private async clearLoginAttempts(ipAddress: string): Promise<void> {
    try {
      await this.redisService.del(RedisKeys.loginAttempts(ipAddress));
    } catch (error) {
      this.logger.warn(
        `Redis unavailable for clearing login attempts: ${(error as Error).message}`,
        'AuthService',
      );
    }
  }

  private async validateResendOtp(user: { id: string; emailVerified: boolean; phoneVerified: boolean }, dto: ResendOtpDto): Promise<void> {
    if (dto.email && user.emailVerified && dto.purpose === 'EMAIL_VERIFICATION') {
      throw new BadRequestException('Email is already verified');
    }
    if (dto.phone && user.phoneVerified && dto.purpose === 'PHONE_VERIFICATION') {
      throw new BadRequestException('Phone number is already verified');
    }

    const latestOtp = await this.repository.findLatestOtp(user.id, dto.purpose);
    if (latestOtp) {
      const diffSeconds = (Date.now() - latestOtp.createdAt.getTime()) / 1000;
      if (diffSeconds < 60) {
        throw new BadRequestException('Please wait before requesting a new OTP');
      }
    }

    await this.repository.invalidateOldOtps(user.id, dto.purpose);
  }

  private async sendVerificationOtp(
    userId: string,
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const isEmail = identifier.includes('@');
    if (isEmail) {
      await this.otpService.sendOtpToEmail(userId, identifier, purpose);
    } else {
      await this.otpService.sendOtpToPhone(userId, identifier, purpose);
    }
  }

  private formatUser(user: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    role: string;
  }): FormattedUser {
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
}
