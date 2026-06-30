import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { RedisKeys } from '../../../core/redis/redis-keys';
import { JwtPayload, AuthUser  } from '../types/auth.types';
import { AvatarService } from '../../users/services/avatar.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma:        PrismaService,
    private readonly redis:         RedisService,
  ) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:      configService.get<string>('jwt.accessSecret'),
    });
  }
 
  async validate(payload: JwtPayload) {
    // 1. Verify user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, isActive: true },
      select: {
        id:               true,
        email:            true,
        fullName:         true,
        role:             true,
        emailVerified:    true,
        phoneVerified:    true,
        isActive:         true,
      },
    });
 
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }
 
    // 2. Verify session still exists in DB
    const session = await this.prisma.userSession.findUnique({
      where: { id: payload.sessionId },
    });
 
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }
 
    // 3. Check if logout-all was called after this token was issued
    const logoutTimestamp = await this.redis.get(
      RedisKeys.userLogoutTimestamp(payload.sub),
    );
 
    if (logoutTimestamp) {
      const loggedOutAt   = parseInt(logoutTimestamp, 10);
      const tokenIssuedAt = payload.iat * 1000;
      if (tokenIssuedAt < loggedOutAt) {
        throw new UnauthorizedException('Session expired');
      }
    }
 
    // 4. Update last activity (fire and forget — non-critical)
    this.prisma.userSession
      .update({ where: { id: payload.sessionId }, data: { lastUsedAt: new Date() } })
      .catch(() => {});
 
    // req.user contains only identity data — no profile, no avatar.
    // Call GET /v1/users/me to get the full profile.
    return {
      ...user,
      sub: user.id,
      sessionId: payload.sessionId,
    };
  }
}
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prisma: PrismaService,
//     private readonly redis: RedisService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('jwt.accessSecret'),
//     });
//   }

//   async validate(payload: JwtPayload): Promise<AuthUser> {
//     const user = await this.prisma.user.findFirst({
//       where: {
//         id: payload.sub,
//         isActive: true,
//         deletedAt: null,
//       },
//       select: {
//         id: true,
//         email: true,
//         fullName: true,
//         role: true,
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found or inactive');
//     }

//     const session = await this.prisma.userSession.findUnique({
//       where: { id: payload.sessionId },
//     });

//     if (!session || session.expiresAt < new Date()) {
//       throw new UnauthorizedException('Session expired');
//     }

//     return {
//       id: user.id,
//       email: user.email,
//       fullName: user.fullName,
//       role: user.role,
//       sessionId: payload.sessionId,
//     };
//   }
// }
  // async validate(payload: any) {
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       id: payload.sub,
  //       isActive: true,
  //       deletedAt: null,
  //     },
  //     select: {
  //       id: true,
  //       email: true,
  //       fullName: true,
  //       role: true,
  //       emailVerified: true,
  //       phoneVerified: true,
  //       isActive: true,
  //     },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('User not found or inactive');
  //   }

  //   // Check session
  //   const session = await this.prisma.userSession.findUnique({
  //     where: { id: payload.sessionId },
  //   });

  //   if (!session || session.expiresAt < new Date()) {
  //     throw new UnauthorizedException('Session expired');
  //   }

  //   // Logout-all check
  //   const logoutTimestamp = await this.redis.get(
  //     `user:${payload.sub}:logout`,
  //   );

  //   if (logoutTimestamp) {
  //     const loggedOutAt = parseInt(logoutTimestamp, 10);
  //     const tokenIssuedAt = payload.iat * 1000;

  //     if (tokenIssuedAt < loggedOutAt) {
  //       throw new UnauthorizedException('Session expired');
  //     }
  //   }

  //   // Attach user to request (THIS is what controller receives)
  //   return {
  //     id: user.id, // ALWAYS USE THIS
  //     email: user.email,
  //     fullName: user.fullName,
  //     role: user.role,
  //     sessionId: payload.sessionId,
  //   };
  // }


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prisma: PrismaService,
//     private readonly redis: RedisService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('jwt.accessSecret'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     // 1. Verify user still exists and is active
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub, isActive: true },
//       select: {
//         id: true,
//         email: true,
//         fullName: true,
//         role: true,
//         emailVerified: true,
//         phoneVerified: true,
//         isActive: true,
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found or inactive');
//     }

//     // 2. Verify session still exists in DB
//     const session = await this.prisma.userSession.findUnique({
//       where: { id: payload.sessionId },
//     });

//     if (!session || session.expiresAt < new Date()) {
//       throw new UnauthorizedException('Session expired');
//     }

//     // 3. Check if logout-all was called after this token was issued
//     const logoutTimestamp = await this.redis.get(
//       RedisKeys.userLogoutTimestamp(payload.sub),
//     );

//     if (logoutTimestamp) {
//       const loggedOutAt = parseInt(logoutTimestamp, 10);
//       const tokenIssuedAt = payload.iat * 1000; // iat is in seconds, convert to ms

//       if (tokenIssuedAt < loggedOutAt) {
//         throw new UnauthorizedException('Session expired');
//       }
//     }

//     // 4. Fetch current avatar URL from the polymorphic images table.
//     //    avatarUrl is NOT a column on users — it lives in images
//     //    (entityType = 'USER_AVATAR', entityId = user.id).
//     //    We attach it here so every guard-protected route has it on req.user
//     //    without needing a separate profile endpoint call.
//     const avatarImage = await this.prisma.image.findFirst({
//       where: { entityType: 'USER_AVATAR', entityId: user.id },
//       orderBy: { createdAt: 'desc' },
//       select: { url: true },
//     });

//     // 5. Update last activity (fire and forget — non-critical)
//     this.prisma.userSession
//       .update({
//         where: { id: payload.sessionId },
//         data: { lastUsedAt: new Date() },
//       })
//       .catch(() => {});

//     return {
//       ...user,
//       avatarUrl: avatarImage?.url ?? null,
//       sessionId: payload.sessionId,
//     };
//   }
// }

// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// import { PrismaService } from '../../../core/prisma/prisma.service';
// import { RedisService } from '../../../core/redis/redis.service';
// import { RedisKeys } from '../../../core/redis/redis-keys';

// interface JwtPayload {
//   sub: string;
//   email: string;
//   role: string;
//   sessionId: string;
//   iat: number;
//   exp: number;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prisma: PrismaService,
//     private readonly redis: RedisService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('jwt.accessSecret'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     // 1. Verify user still exists and is active
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub, isActive: true },
//       select: {
//         id: true,
//         email: true,
//         fullName: true,
//         role: true,
//         avatarUrl: true,
//         emailVerified: true,
//         phoneVerified: true,
//         isActive: true,
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found or inactive');
//     }

//     // 2. Verify session still exists in DB
//     const session = await this.prisma.userSession.findUnique({
//       where: { id: payload.sessionId },
//     });

//     if (!session || session.expiresAt < new Date()) {
//       throw new UnauthorizedException('Session expired');
//     }

//     // 3. Check if logout-all was called after this token was issued
//     const logoutTimestamp = await this.redis.get(
//       RedisKeys.userLogoutTimestamp(payload.sub),
//     );

//     if (logoutTimestamp) {
//       const loggedOutAt = parseInt(logoutTimestamp, 10);
//       const tokenIssuedAt = payload.iat * 1000; // iat is in seconds, convert to ms

//       if (tokenIssuedAt < loggedOutAt) {
//         throw new UnauthorizedException('Session expired');
//       }
//     }

//     // 4. Update last activity (fire and forget — non-critical)
//     this.prisma.userSession
//       .update({
//         where: { id: payload.sessionId },
//         data: { lastUsedAt: new Date() },
//       })
//       .catch(() => {});

//     return {
//       ...user,
//       sessionId: payload.sessionId,
//     };
//   }
// }
