import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtTokenPair } from '@glow-fix/types';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async generateTokenPair(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
    existingRefreshToken?: string, // ← optional — pass when already stored in DB
  ): Promise<JwtTokenPair> {
    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiry'),
      },
    );

    // Use the provided refresh token (already hashed in DB) or generate a new one
    const refreshToken = existingRefreshToken ?? this.generateRefreshToken();

    const expiresIn = this.parseExpiry(
      this.configService.get<string>('jwt.accessExpiry') || '15m',
    );

    return { accessToken, refreshToken, expiresIn };
  }

  async generateMfaToken(userId: string): Promise<string> {
    return this.jwtService.sign(
      { sub: userId, type: 'mfa_pending' },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: '5m',
      },
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.get<string>('jwt.accessSecret'),
    });
  }

  async verifyMfaToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify<JwtPayload & { type?: string }>(
        token,
        {
          secret: this.configService.get<string>('jwt.accessSecret'),
        },
      );

      // Additional validation to ensure it's an MFA token
      if (payload.type !== 'mfa_pending') {
        throw new Error('Not an MFA token');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired MFA token');
    }
  }

  /**
   * Generate a short-lived reset token after OTP verification.
   * This token proves the user verified their OTP and can proceed to set a new password.
   */
  async generateResetToken(userId: string, email: string): Promise<string> {
    return this.jwtService.sign(
      { sub: userId, email, type: 'password_reset' },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: '10m', // 10 minutes to complete password reset
      },
    );
  }

  /**
   * Verify a reset token and return the payload.
   * Throws if expired or invalid.
   */
  verifyResetToken(token: string): { sub: string; email: string } {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; type?: string }>(
        token,
        { secret: this.configService.get<string>('jwt.accessSecret') },
      );

      if (payload.type !== 'password_reset') {
        throw new Error('Not a reset token');
      }

      return { sub: payload.sub, email: payload.email };
    } catch {
      throw new Error('Invalid or expired reset token');
    }
  }

  async blacklistToken(jti: string, expiresInSeconds: number): Promise<void> {
    await this.redis.set(RedisKeys.tokenBlacklist(jti), '1', expiresInSeconds);
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    return this.redis.exists(RedisKeys.tokenBlacklist(jti));
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900;
    }
  }
}
