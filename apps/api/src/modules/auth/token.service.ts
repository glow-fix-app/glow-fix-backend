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
): Promise<JwtTokenPair> {
  const accessToken = this.jwtService.sign(
    { ...payload },
    {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiry'),
    },
  );

  const refreshToken = this.generateRefreshToken(); // This should return a string
  const expiresIn = this.parseExpiry(
    this.configService.get<string>('jwt.accessExpiry') || '15m',
  );

  return { accessToken, refreshToken, expiresIn };
}

  // async generateTokenPair(
  //   payload: Omit<JwtPayload, 'iat' | 'exp'>,
  // ): Promise<JwtTokenPair> {
  //   const accessToken = this.jwtService.sign(
  //     { ...payload },
  //     {
  //       secret: this.configService.get<string>('jwt.accessSecret'),
  //       expiresIn: this.configService.get<string>('jwt.accessExpiry'),
  //     },
  //   );

  //   const refreshToken = this.generateRefreshToken();

  //   const expiresIn = this.parseExpiry(
  //     this.configService.get<string>('jwt.accessExpiry') || '15m',
  //   );

  //   return { accessToken, refreshToken, expiresIn };
  // }

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

  async blacklistToken(jti: string, expiresInSeconds: number): Promise<void> {
    await this.redis.set(
      RedisKeys.tokenBlacklist(jti),
      '1',
      expiresInSeconds,
    );
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
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }
}