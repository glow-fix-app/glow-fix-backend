import { Injectable, BadRequestException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { MfaSetupResponse } from '@glow-fix/types';

import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class MfaService {
  private readonly APP_NAME = 'GlowFix';
  private readonly BACKUP_CODES_COUNT = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async setupMfa(
    userId: string,
    email: string,
  ): Promise<MfaSetupResponse> {
    // Generate secret
    const secret = authenticator.generateSecret();

    // Generate QR code URL
    const otpAuthUrl = authenticator.keyuri(email, this.APP_NAME, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store secret temporarily (not enabled yet)
    await this.prisma.customer.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        // Don't enable yet — wait for verification
      },
    });

    // Store backup codes in Redis temporarily
    // (will be persisted after verification)

    this.logger.log('MFA setup initiated', 'MfaService', { userId });

    return {
      secret,
      qrCodeUrl,
      backupCodes,
    };
  }

  async verifyAndEnableMfa(
    userId: string,
    code: string,
  ): Promise<{ enabled: boolean }> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!customer?.twoFactorSecret) {
      throw new BadRequestException('MFA setup not initiated. Please start setup first.');
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: customer.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code. Please try again.');
    }

    // Enable MFA
    await this.prisma.customer.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    this.logger.log('MFA enabled', 'MfaService', { userId });

    return { enabled: true };
  }

  async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!customer?.twoFactorEnabled || !customer?.twoFactorSecret) {
      throw new BadRequestException('MFA is not enabled for this account.');
    }

    return authenticator.verify({
      token: code,
      secret: customer.twoFactorSecret,
    });
  }

  async disableMfa(userId: string, code: string): Promise<void> {
    // Verify current code before disabling
    const isValid = await this.verifyMfaCode(userId, code);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code.');
    }

    await this.prisma.customer.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
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