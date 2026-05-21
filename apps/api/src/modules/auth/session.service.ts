import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { SESSION } from '@glow-fix/utils';

import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createSession(
    userId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ id: string }> {
    const parsed = new UAParser(userAgent);
    const browser = parsed.getBrowser();
    const os = parsed.getOS();
    const device = parsed.getDevice();

    const deviceInfo = [
      device.type || 'desktop',
      browser.name ? `${browser.name} ${browser.version || ''}`.trim() : null,
      os.name ? `${os.name} ${os.version || ''}`.trim() : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const expiresAt = new Date(
      Date.now() + SESSION.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000,
    );

    // Store hashed refresh token — never store plain tokens in DB
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt,
        lastUsedAt: new Date(),
      },
    });

    return { id: session.id };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    try {
      await this.prisma.userSession.delete({
        where: { id: sessionId },
      });
    } catch {
      this.logger.debug(
        `Session ${sessionId} not found for deletion`,
        'SessionService',
      );
    }
  }

  async invalidateAllSessions(userId: string): Promise<number> {
    const result = await this.prisma.userSession.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  async invalidateByTokenHash(refreshToken: string): Promise<void> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prisma.userSession.deleteMany({ where: { tokenHash } });
  }

  async findByTokenHash(refreshToken: string): Promise<{ id: string; userId: string } | null> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    return this.prisma.userSession.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true },
    });
  }

  async enforceSessionLimit(userId: string): Promise<void> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'asc' },
    });

    if (sessions.length >= SESSION.MAX_CONCURRENT_DEVICES) {
      const sessionsToRemove = sessions.slice(
        0,
        sessions.length - SESSION.MAX_CONCURRENT_DEVICES + 1,
      );

      await this.prisma.userSession.deleteMany({
        where: { id: { in: sessionsToRemove.map((s) => s.id) } },
      });

      this.logger.debug(
        `Removed ${sessionsToRemove.length} old sessions for user ${userId}`,
        'SessionService',
      );
    }
  }

  async getActiveSessions(userId: string): Promise<
    {
      id: string;
      deviceInfo: string | null;
      ipAddress: string | null;
      lastUsedAt: Date;
      createdAt: Date;
    }[]
  > {
    return this.prisma.userSession.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async updateActivity(sessionId: string): Promise<void> {
    await this.prisma.userSession
      .update({
        where: { id: sessionId },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {
        // Silent fail — non-critical
      });
  }
}


// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';
// import { UAParser } from 'ua-parser-js';
// import { SESSION } from '@glow-fix/utils';
// import { Session } from '@prisma/client';

// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// @Injectable()
// export class SessionService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly logger: WinstonLoggerService,
//   ) {}

//   async createSession(
//     userId: string,
//     userType: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<{ id: string }> {
//     const parsed = new UAParser(userAgent);
//     const browser = parsed.getBrowser();
//     const os = parsed.getOS();
//     const device = parsed.getDevice();

//     const expiresAt = new Date(
//       Date.now() + SESSION.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000,
//     );

//     const session = await this.prisma.session.create({
//       data: {
//         userId,
//         userType,
//         refreshToken: crypto.randomBytes(64).toString('hex'),
//         deviceType: device.type || 'desktop',
//         browser: browser.name
//           ? `${browser.name} ${browser.version || ''}`.trim()
//           : null,
//         os: os.name ? `${os.name} ${os.version || ''}`.trim() : null,
//         ipAddress,
//         userAgent,
//         expiresAt,
//         lastActivityAt: new Date(), // Add this
//       },
//     });

//     return { id: session.id }; // ← Make sure this returns the ID
//   }

//   async invalidateSession(sessionId: string): Promise<void> {
//     try {
//       await this.prisma.session.delete({
//         where: { id: sessionId },
//       });
//     } catch {
//       // Session may already be deleted
//       this.logger.debug(
//         `Session ${sessionId} not found for deletion`,
//         'SessionService',
//       );
//     }
//   }

//   async invalidateAllSessions(userId: string): Promise<number> {
//     const result = await this.prisma.session.deleteMany({
//       where: { userId },
//     });
//     return result.count;
//   }

//   async enforceSessionLimit(userId: string): Promise<void> {
//     const sessions = await this.prisma.session.findMany({
//       where: { userId },
//       orderBy: { lastActivityAt: 'asc' },
//     });

//     if (sessions.length >= SESSION.MAX_CONCURRENT_DEVICES) {
//       // Remove oldest sessions to make room
//       const sessionsToRemove = sessions.slice(
//         0,
//         sessions.length - SESSION.MAX_CONCURRENT_DEVICES + 1,
//       );

//       await this.prisma.session.deleteMany({
//         where: {
//           id: { in: sessionsToRemove.map((session: Session) => session.id) },
//         },
//       });

//       this.logger.debug(
//         `Removed ${sessionsToRemove.length} old sessions for user ${userId}`,
//         'SessionService',
//       );
//     }
//   }

//   async getActiveSessions(userId: string): Promise<
//     {
//       id: string;
//       deviceType: string | null;
//       browser: string | null;
//       os: string | null;
//       ipAddress: string | null;
//       lastActivityAt: Date;
//       createdAt: Date;
//     }[]
//   > {
//     return this.prisma.session.findMany({
//       where: {
//         userId,
//         expiresAt: { gt: new Date() },
//       },
//       select: {
//         id: true,
//         deviceType: true,
//         browser: true,
//         os: true,
//         ipAddress: true,
//         lastActivityAt: true,
//         createdAt: true,
//       },
//       orderBy: { lastActivityAt: 'desc' },
//     });
//   }

//   async updateActivity(sessionId: string): Promise<void> {
//     await this.prisma.session
//       .update({
//         where: { id: sessionId },
//         data: { lastActivityAt: new Date() },
//       })
//       .catch(() => {
//         // Silent fail — non-critical operation
//       });
//   }
// }
