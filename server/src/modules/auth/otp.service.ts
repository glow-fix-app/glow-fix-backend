import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';
import { OtpPurpose as PrismaOtpPurpose } from '@prisma/client';

import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { EmailService } from './email.service';
import { otpEmailTemplate } from './email.templates';
import { OtpPurpose } from './dto/request/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
    private readonly emailService: EmailService,
  ) {}

  // ─── Send OTP via Email ───────────────────────────────────────────────────

  async sendOtpToEmail(
    userId: string,
    email: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    await this.checkResendCooldown(email);

    const otp = generateOtp(OTP_CONSTANTS.LENGTH);

    // Store hashed OTP in DB (UserOtp model)
    await this.storeOtp(userId, purpose, otp);

    await this.emailService.sendEmail({
      to: email,
      subject: 'Your Glow Fix verification code',
      html: otpEmailTemplate(otp, purpose, OTP_CONSTANTS.VALIDITY_MINUTES),
      text: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
    });

    this.logger.log('OTP sent via email', 'OtpService', {
      identifier: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      purpose,
    });
  }

  // ─── Send OTP via SMS ─────────────────────────────────────────────────────

  async sendOtpToPhone(
    userId: string,
    phone: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    await this.checkResendCooldown(phone);

    const otp = generateOtp(OTP_CONSTANTS.LENGTH);

    // Store hashed OTP in DB
    await this.storeOtp(userId, purpose, otp);

    // Send via Twilio (dev: just log)
    await this.sendViaSms(phone, otp);

    this.logger.log('OTP sent via SMS', 'OtpService', {
      identifier: phone.slice(-4),
      purpose,
    });
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────

  async verifyOtp(
    userId: string,
    otp: string,
    purpose: OtpPurpose,
    consume: boolean = true,
  ): Promise<boolean> {
    // Fetch the latest unused OTP for this user+purpose
    const record = await this.prisma.userOtp.findFirst({
      where: {
        userId,
        purpose: purpose as unknown as PrismaOtpPurpose,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Check attempt count
    if (record.attempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
      await this.prisma.userOtp.delete({ where: { id: record.id } });
      throw new BadRequestException(
        'Too many verification attempts. Please request a new code.',
      );
    }

    // Verify against hashed code
    const isValid = await bcrypt.compare(otp, record.codeHash);

    if (!isValid) {
      await this.prisma.userOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - (record.attempts + 1);
      throw new BadRequestException(`Invalid OTP. ${remaining} attempt(s) remaining.`);
    }

    // Mark as used if consume is true
    if (consume) {
      await this.prisma.userOtp.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
    }

    return true;
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async storeOtp(
    userId: string,
    purpose: OtpPurpose,
    otp: string,
  ): Promise<void> {
    // Invalidate any previous unused OTPs for same user+purpose
    await this.prisma.userOtp.updateMany({
      where: {
        userId,
        purpose: purpose as unknown as PrismaOtpPurpose,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_CONSTANTS.VALIDITY_MINUTES * 60 * 1000);

    await this.prisma.userOtp.create({
      data: {
        userId,
        purpose: purpose as unknown as PrismaOtpPurpose,
        codeHash,
        expiresAt,
      },
    });
  }

  private async checkResendCooldown(identifier: string): Promise<void> {
    try {
      const resendKey = RedisKeys.otpResendCount(identifier);
      const resendCount = await this.redis.get(resendKey);

      if (resendCount && parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS) {
        throw new BadRequestException(
          'Maximum OTP resend attempts reached. Please try again later.',
        );
      }

      await this.redis.incr(resendKey);
      await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.warn(
        `Redis is unavailable for OTP cooldown check: ${(error as Error).message}. Proceeding without cooldown check.`,
        'OtpService',
      );
    }
  }

  private async sendViaSms(phone: string, otp: string): Promise<void> {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');

    if (nodeEnv === 'development' || nodeEnv === 'test') {
      this.logger.debug(`[DEV] OTP for ${phone}: ${otp}`, 'OtpService');
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const twilio = require('twilio');
      const client = twilio(
        this.configService.get<string>('twilio.accountSid'),
        this.configService.get<string>('twilio.authToken'),
      );

      await client.messages.create({
        body: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
        from: this.configService.get<string>('twilio.phoneNumber'),
        to: phone,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send OTP via SMS: ${(error as Error).message}`,
        (error as Error).stack,
        'OtpService',
      );
      throw new BadRequestException('Failed to send verification code. Please try again.');
    }
  }
}
