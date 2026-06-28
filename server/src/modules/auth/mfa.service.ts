import { Injectable, BadRequestException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { MfaSetupResponse } from '@glow-fix/types';

import { AuthRepository } from './auth.repository';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// Allow ±1 window (30 s) to account for clock drift
authenticator.options = { window: 1 };

@Injectable()
export class MfaService {
  private readonly APP_NAME = 'GlowFix';
  private readonly BACKUP_CODES_COUNT = 10;

  constructor(
    private readonly repository: AuthRepository,
    private readonly logger: WinstonLoggerService,
  ) {}

  async setupMfa(userId: string): Promise<MfaSetupResponse> {
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }

    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email!, this.APP_NAME, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
    const backupCodes = this.generateBackupCodes();

    await this.repository.updateUser(userId, { twoFactorSecret: secret });

    this.logger.log('MFA setup initiated', 'MfaService', { userId });

    return { secret, qrCodeUrl, backupCodes };
  }

  async verifyAndEnableMfa(userId: string, code: string): Promise<{ enabled: boolean }> {
    const user = await this.repository.findUserById(userId);

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('MFA setup not initiated. Please start setup first.');
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Invalid verification code. Please try again.');
    }

    await this.repository.updateUser(userId, { twoFactorEnabled: true });

    this.logger.log('MFA enabled', 'MfaService', { userId });

    return { enabled: true };
  }

  async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    const user = await this.repository.findUserById(userId);

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('MFA is not enabled for this account.');
    }

    return authenticator.verify({ token: code, secret: user.twoFactorSecret });
  }

  async disableMfa(userId: string, code: string): Promise<void> {
    const user = await this.repository.findUserById(userId);

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('MFA is not set up for this account.');
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Invalid verification code.');
    }

    await this.repository.updateUser(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });

    this.logger.log('MFA disabled', 'MfaService', { userId });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private generateBackupCodes(): string[] {
    return Array.from({ length: this.BACKUP_CODES_COUNT }, () => {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      return `${code.slice(0, 4)}-${code.slice(4, 8)}`;
    });
  }
}
