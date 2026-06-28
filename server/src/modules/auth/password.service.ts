import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PASSWORD } from '@glow-fix/utils';
import { RedisService } from '../../core/redis/redis.service';

@Injectable()
export class PasswordService {
  private readonly HISTORY_PREFIX = 'password-history:';

  constructor(private readonly redis: RedisService) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD.BCRYPT_COST_FACTOR);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async isPasswordReused(newPassword: string, userId: string): Promise<boolean> {
    const historyKey = `${this.HISTORY_PREFIX}${userId}`;
    const history = await this.redis.getJson<string[]>(historyKey);

    if (!history || history.length === 0) return false;

    for (const oldHash of history) {
      const matches = await bcrypt.compare(newPassword, oldHash);
      if (matches) return true;
    }

    return false;
  }

  async addToHistory(userId: string, passwordHash: string): Promise<void> {
    const historyKey = `${this.HISTORY_PREFIX}${userId}`;
    let history = (await this.redis.getJson<string[]>(historyKey)) ?? [];

    history.unshift(passwordHash);

    if (history.length > PASSWORD.HISTORY_COUNT) {
      history = history.slice(0, PASSWORD.HISTORY_COUNT);
    }

    // No expiry — password history persists
    await this.redis.setJson(historyKey, history);
  }
}