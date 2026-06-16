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
import { OtpPurpose } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
    private readonly emailService: EmailService,
  ) {}

  // ─── Send OTP via Email ───

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

  // ─── Send OTP via SMS (mobile) ───

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

  // ─── Verify OTP ───

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
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }

    // Check attempt count
    if (record.attempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
      await this.prisma.userOtp.delete({ where: { id: record.id } });
      throw new BadRequestException(
        `Too many verification attempts. Please request a new code.`,
      );
    }

    // Verify against hashed code
    const isValid = await bcrypt.compare(otp, record.codeHash);

    if (!isValid) {
      // Increment attempts
      await this.prisma.userOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - (record.attempts + 1);
      throw new BadRequestException(
        `Invalid OTP. ${remaining} attempt(s) remaining.`,
      );
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

  // ─── Private Helpers ───

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
      data: { usedAt: new Date() }, // mark old ones as used
    });

    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(
      Date.now() + OTP_CONSTANTS.VALIDITY_MINUTES * 60 * 1000,
    );

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

      if (
        resendCount &&
        parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS
      ) {
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
      throw new BadRequestException(
        'Failed to send verification code. Please try again.',
      );
    }
  }
}

// import { Injectable, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';

// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { OtpPurpose } from './dto/verify-otp.dto';
// import { EmailService } from './email.service';
// import { otpEmailTemplate } from './email.templates';

// @Injectable()
// export class OtpService {
//   constructor(
//     private readonly redis: RedisService,
//     private readonly configService: ConfigService,
//     private readonly logger: WinstonLoggerService,
//     private readonly emailService: EmailService, // ← injected
//   ) {}

//   // ─── Send OTP via SMS (mobile) ───

//   async sendOtp(identifier: string, purpose: string): Promise<void> {
//     // Check resend cooldown
//     const resendKey = RedisKeys.otpResendCount(identifier);
//     const resendCount = await this.redis.get(resendKey);

//     if (
//       resendCount &&
//       parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS
//     ) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }

//     // Generate OTP
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);

//     // Store OTP in Redis
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );

//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);

//     // Send OTP via Twilio
//     await this.sendViaSms(identifier, otp);

//     this.logger.log('OTP sent via SMS', 'OtpService', {
//       identifier: identifier.slice(-4), // Only log last 4 digits
//       purpose,
//     });
//   }

//   // ─── Send OTP via Email ───

//   async sendOtpToEmail(email: string, purpose: OtpPurpose): Promise<void> {
//     // Check resend cooldown (same pattern as SMS)
//     const resendKey = RedisKeys.otpResendCount(email);
//     const resendCount = await this.redis.get(resendKey);

//     if (
//       resendCount &&
//       parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS
//     ) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }

//     // Generate OTP using shared util (replaces the private generateOtp())
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);

//     // Store in Redis with the same shape as the SMS path so verifyOtp() works for both
//     const otpKey = RedisKeys.otp(email, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );

//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);

//     const expiryMinutes = OTP_CONSTANTS.VALIDITY_MINUTES;

//     await this.emailService.sendEmail({
//       to: email,
//       subject: `Your Glow Fix verification code`,
//       html: otpEmailTemplate(otp, purpose, expiryMinutes),
//       text: `Your Glow Fix verification code is: ${otp}. Valid for ${expiryMinutes} minutes. Do not share this code.`,
//     });

//     this.logger.log('OTP sent via email', 'OtpService', {
//       identifier: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // mask: jo***@example.com
//       purpose,
//     });
//   }

//   // ─── Verify OTP (works for both email and mobile identifiers) ───

//   async verifyOtp(
//     identifier: string,
//     otp: string,
//     purpose: string,
//   ): Promise<boolean> {
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     const attemptsKey = RedisKeys.otpAttempts(identifier, purpose);

//     // Check attempt count
//     const attempts = await this.redis.get(attemptsKey);
//     if (attempts && parseInt(attempts, 10) >= OTP_CONSTANTS.MAX_ATTEMPTS) {
//       // Lock out and delete the OTP
//       await this.redis.del(otpKey);
//       throw new BadRequestException(
//         `Too many verification attempts. Please wait ${OTP_CONSTANTS.LOCKOUT_MINUTES} minutes.`,
//       );
//     }

//     // Get stored OTP
//     const stored = await this.redis.getJson<{
//       otp: string;
//       attempts: number;
//       createdAt: string;
//     }>(otpKey);

//     if (!stored) {
//       throw new BadRequestException('OTP has expired. Please request a new one.');
//     }

//     // Verify OTP
//     if (stored.otp !== otp) {
//       await this.redis.incr(attemptsKey);
//       await this.redis.expire(attemptsKey, OTP_CONSTANTS.LOCKOUT_MINUTES * 60);

//       const currentAttempts = parseInt(
//         (await this.redis.get(attemptsKey)) || '1',
//         10,
//       );
//       const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - currentAttempts;

//       throw new BadRequestException(
//         `Invalid OTP. ${remaining} attempt(s) remaining.`,
//       );
//     }

//     // OTP verified — clean up
//     await this.redis.del(otpKey);
//     await this.redis.del(attemptsKey);

//     return true;
//   }

//   // ─── Private: SMS via Twilio ───

//   private async sendViaSms(phoneNumber: string, otp: string): Promise<void> {
//     const nodeEnv = this.configService.get<string>('app.nodeEnv');

//     if (nodeEnv === 'development' || nodeEnv === 'test') {
//       this.logger.debug(`[DEV] OTP for ${phoneNumber}: ${otp}`, 'OtpService');
//       return;
//     }

//     try {
//       const twilio = require('twilio');
//       const client = twilio(
//         this.configService.get<string>('twilio.accountSid'),
//         this.configService.get<string>('twilio.authToken'),
//       );

//       await client.messages.create({
//         body: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
//         from: this.configService.get<string>('twilio.phoneNumber'),
//         to: phoneNumber,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to send OTP via SMS: ${(error as Error).message}`,
//         (error as Error).stack,
//         'OtpService',
//       );
//       throw new BadRequestException(
//         'Failed to send verification code. Please try again.',
//       );
//     }
//   }

//   // NOTE: private generateOtp() removed — use generateOtp() from @glow-fix/utils everywhere
// }

// import { Injectable, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';

// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { OtpPurpose } from './dto/verify-otp.dto';

// @Injectable()
// export class OtpService {
//   constructor(
//     private readonly redis: RedisService,
//     private readonly configService: ConfigService,
//     private readonly logger: WinstonLoggerService,
//   ) {}

//   async sendOtp(identifier: string, purpose: string): Promise<void> {
//     // Check resend cooldown
//     const resendKey = RedisKeys.otpResendCount(identifier);
//     const resendCount = await this.redis.get(resendKey);

//     if (resendCount && parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }

//     // Generate OTP
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);

//     // Store OTP in Redis
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );

//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);

//     // Send OTP via Twilio
//     await this.sendViaSms(identifier, otp);

//     this.logger.log('OTP sent', 'OtpService', {
//       identifier: identifier.slice(-4), // Only log last 4 digits
//       purpose,
//     });
//   }

//   async verifyOtp(
//     identifier: string,
//     otp: string,
//     purpose: string,
//   ): Promise<boolean> {
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     const attemptsKey = RedisKeys.otpAttempts(identifier, purpose);

//     // Check attempt count
//     const attempts = await this.redis.get(attemptsKey);
//     if (attempts && parseInt(attempts, 10) >= OTP_CONSTANTS.MAX_ATTEMPTS) {
//       // Lock out
//       await this.redis.del(otpKey);
//       throw new BadRequestException(
//         `Too many verification attempts. Please wait ${OTP_CONSTANTS.LOCKOUT_MINUTES} minutes.`,
//       );
//     }

//     // Get stored OTP
//     const stored = await this.redis.getJson<{
//       otp: string;
//       attempts: number;
//       createdAt: string;
//     }>(otpKey);

//     if (!stored) {
//       throw new BadRequestException('OTP has expired. Please request a new one.');
//     }

//     // Verify OTP
//     if (stored.otp !== otp) {
//       // Increment attempts
//       await this.redis.incr(attemptsKey);
//       await this.redis.expire(attemptsKey, OTP_CONSTANTS.LOCKOUT_MINUTES * 60);

//       const currentAttempts = parseInt(
//         (await this.redis.get(attemptsKey)) || '1',
//         10,
//       );
//       const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - currentAttempts;

//       throw new BadRequestException(
//         `Invalid OTP. ${remaining} attempt(s) remaining.`,
//       );
//     }

//     // OTP verified — clean up
//     await this.redis.del(otpKey);
//     await this.redis.del(attemptsKey);

//     return true;
//   }

//   private async sendViaSms(phoneNumber: string, otp: string): Promise<void> {
//     const nodeEnv = this.configService.get<string>('app.nodeEnv');

//     if (nodeEnv === 'development' || nodeEnv === 'test') {
//       this.logger.debug(`[DEV] OTP for ${phoneNumber}: ${otp}`, 'OtpService');
//       return;
//     }

//     try {
//       const twilio = require('twilio');
//       const client = twilio(
//         this.configService.get<string>('twilio.accountSid'),
//         this.configService.get<string>('twilio.authToken'),
//       );

//       await client.messages.create({
//         body: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
//         from: this.configService.get<string>('twilio.phoneNumber'),
//         to: phoneNumber,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to send OTP via SMS: ${(error as Error).message}`,
//         (error as Error).stack,
//         'OtpService',
//       );
//       throw new BadRequestException('Failed to send verification code. Please try again.');
//     }
//   }
//   private generateOtp(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }
// }
