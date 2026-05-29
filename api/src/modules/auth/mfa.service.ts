import { Injectable, BadRequestException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { MfaSetupResponse } from '@glow-fix/types';

import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

authenticator.options = { window: 1 };

@Injectable()
export class MfaService {
  private readonly APP_NAME = 'GlowFix';
  private readonly BACKUP_CODES_COUNT = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async setupMfa(userId: string): Promise<MfaSetupResponse> {
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new BadRequestException('User not found');
    }

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, this.APP_NAME, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
    const backupCodes = this.generateBackupCodes();

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    this.logger.log('MFA setup initiated', 'MfaService', { userId });

    return { secret, qrCodeUrl, backupCodes };
  }

  async verifyAndEnableMfa(
    userId: string,
    code: string,
  ): Promise<{ enabled: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!user?.twoFactorSecret) {
      throw new BadRequestException(
        'MFA setup not initiated. Please start setup first.',
      );
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException(
        'Invalid verification code. Please try again.',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    this.logger.log('MFA enabled', 'MfaService', { userId });

    return { enabled: true };
  }

  async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('MFA is not enabled for this account.');
    }

    return authenticator.verify({ token: code, secret: user.twoFactorSecret });
  }

  async disableMfa(userId: string, code: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('MFA is not set up for this account.');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    this.logger.log('MFA disabled', 'MfaService', { userId });
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
  }
}

// import { Injectable, BadRequestException } from '@nestjs/common';
// import { authenticator } from 'otplib';
// import * as QRCode from 'qrcode';
// import * as crypto from 'crypto';
// import { MfaSetupResponse } from '@glow-fix/types';

// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// // Allow ±1 window (30s) to account for clock drift
// authenticator.options = { window: 1 };

// @Injectable()
// export class MfaService {
//   private readonly APP_NAME = 'GlowFix';
//   private readonly BACKUP_CODES_COUNT = 10;

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly logger: WinstonLoggerService,
//   ) {}

//   async setupMfa(userId: string): Promise<MfaSetupResponse> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { email: true },
//     });

//     if (!customer) {
//       throw new BadRequestException('Customer not found');
//     }

//     const secret = authenticator.generateSecret();
//     const otpAuthUrl = authenticator.keyuri(
//       customer.email,
//       this.APP_NAME,
//       secret,
//     );
//     const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
//     const backupCodes = this.generateBackupCodes();

//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: { twoFactorSecret: secret },
//     });

//     this.logger.log('MFA setup initiated', 'MfaService', { userId });

//     return { secret, qrCodeUrl, backupCodes };
//   }

//   async verifyAndEnableMfa(
//     userId: string,
//     code: string,
//   ): Promise<{ enabled: boolean }> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true },
//     });

//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException(
//         'MFA setup not initiated. Please start setup first.',
//       );
//     }

//     const isValid = authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });

//     if (!isValid) {
//       throw new BadRequestException(
//         'Invalid verification code. Please try again.',
//       );
//     }

//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: { twoFactorEnabled: true },
//     });

//     this.logger.log('MFA enabled', 'MfaService', { userId });

//     return { enabled: true };
//   }

//   async verifyMfaCode(userId: string, code: string): Promise<boolean> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true, twoFactorEnabled: true },
//     });

//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not enabled for this account.');
//     }

//     return authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });
//   }

//   async disableMfa(userId: string, code: string): Promise<void> {
//     // Check secret directly — works even if twoFactorEnabled is still false
//     // (e.g. user set up MFA but never called mfa/verify to enable it)
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true },
//     });

//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not set up for this account.');
//     }

//     const isValid = authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });

//     if (!isValid) {
//       throw new BadRequestException('Invalid verification code.');
//     }

//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: {
//         twoFactorEnabled: false,
//         twoFactorSecret: null,
//       },
//     });

//     this.logger.log('MFA disabled', 'MfaService', { userId });
//   }

//   private generateBackupCodes(): string[] {
//     const codes: string[] = [];
//     for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
//       const code = crypto.randomBytes(4).toString('hex').toUpperCase();
//       codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
//     }
//     return codes;
//   }
// }
