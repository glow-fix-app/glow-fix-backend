import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@glow-fix/types';

import { TokenService } from '../token.service';
import { SessionService } from '../session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Check if token is blacklisted
    if (payload.sessionId) {
      const isBlacklisted = await this.tokenService.isTokenBlacklisted(
        payload.sessionId,
      );
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    // Update session activity (fire and forget)
    if (payload.sessionId) {
      this.sessionService.updateActivity(payload.sessionId).catch(() => {});
    }

    return payload;
  }
}