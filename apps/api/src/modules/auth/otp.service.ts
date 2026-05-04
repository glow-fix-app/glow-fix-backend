import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';

import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async sendOtp(identifier: string, purpose: string): Promise<void> {
    // Check resend cooldown
    const resendKey = RedisKeys.otpResendCount(identifier);
    const resendCount = await this.redis.get(resendKey);

    if (resendCount && parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS) {
      throw new BadRequestException(
        'Maximum OTP resend attempts reached. Please try again later.',
      );
    }

    // Generate OTP
    const otp = generateOtp(OTP_CONSTANTS.LENGTH);

    // Store OTP in Redis
    const otpKey = RedisKeys.otp(identifier, purpose);
    await this.redis.setJson(
      otpKey,
      { otp, attempts: 0, createdAt: new Date().toISOString() },
      OTP_CONSTANTS.VALIDITY_MINUTES * 60,
    );

    // Track resend count
    await this.redis.incr(resendKey);
    await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);

    // Send OTP via Twilio
    await this.sendViaSms(identifier, otp);

    this.logger.log('OTP sent', 'OtpService', {
      identifier: identifier.slice(-4), // Only log last 4 digits
      purpose,
    });
  }

  async verifyOtp(
    identifier: string,
    otp: string,
    purpose: string,
  ): Promise<boolean> {
    const otpKey = RedisKeys.otp(identifier, purpose);
    const attemptsKey = RedisKeys.otpAttempts(identifier, purpose);

    // Check attempt count
    const attempts = await this.redis.get(attemptsKey);
    if (attempts && parseInt(attempts, 10) >= OTP_CONSTANTS.MAX_ATTEMPTS) {
      // Lock out
      await this.redis.del(otpKey);
      throw new BadRequestException(
        `Too many verification attempts. Please wait ${OTP_CONSTANTS.LOCKOUT_MINUTES} minutes.`,
      );
    }

    // Get stored OTP
    const stored = await this.redis.getJson<{
      otp: string;
      attempts: number;
      createdAt: string;
    }>(otpKey);

    if (!stored) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Verify OTP
    if (stored.otp !== otp) {
      // Increment attempts
      await this.redis.incr(attemptsKey);
      await this.redis.expire(attemptsKey, OTP_CONSTANTS.LOCKOUT_MINUTES * 60);

      const currentAttempts = parseInt(
        (await this.redis.get(attemptsKey)) || '1',
        10,
      );
      const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - currentAttempts;

      throw new BadRequestException(
        `Invalid OTP. ${remaining} attempt(s) remaining.`,
      );
    }

    // OTP verified — clean up
    await this.redis.del(otpKey);
    await this.redis.del(attemptsKey);

    return true;
  }

  private async sendViaSms(phoneNumber: string, otp: string): Promise<void> {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');

    if (nodeEnv === 'development' || nodeEnv === 'test') {
      this.logger.debug(`[DEV] OTP for ${phoneNumber}: ${otp}`, 'OtpService');
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
        to: phoneNumber,
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