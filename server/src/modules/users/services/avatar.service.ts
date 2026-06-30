import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { StorageService } from '../../../core/storage/storage.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';
import {
  AvatarNotFoundException,
  UnsupportedFileTypeException,
  FileTooLargeException,
} from '../exceptions/user.exceptions';
import { USER_CONSTANTS } from '../constants/user.constants';

export interface AvatarUploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface AvatarResult {
  url: string;
  storageKey: string;
}

@Injectable()
export class AvatarService {
  private readonly ENTITY_TYPE = USER_CONSTANTS.AVATAR_ENTITY_TYPE;
  private readonly AVATAR_FOLDER = USER_CONSTANTS.AVATAR_FOLDER;
  private readonly CACHE_TTL = USER_CONSTANTS.AVATAR_CACHE_TTL;
  private readonly NULL_SENTINEL = '';
  private readonly MAX_BYTES = USER_CONSTANTS.AVATAR_MAX_SIZE;
  private readonly ALLOWED_MIMETYPES = new Set(USER_CONSTANTS.ALLOWED_AVATAR_TYPES);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
    private readonly logger: WinstonLoggerService,
  ) { }

  async upload(userId: string, file: AvatarUploadFile): Promise<AvatarResult> {
    this.validateFile(file);

    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Upload new image
    const { storageKey, url } = await this.storage.uploadImage(
      file.buffer,
      this.AVATAR_FOLDER,
      { width: 256, height: 256, quality: 85 },
    );

    // Find and remove current avatar
    const existing = await this.prisma.image.findFirst({
      where: { entityType: this.ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, storageKey: true },
    });

    if (existing) {
      await this.prisma.image.delete({ where: { id: existing.id } });
      if (existing.storageKey) {
        await this.storage.deleteByKey(existing.storageKey);
      }
    }

    // Persist new image
    await this.prisma.image.create({
      data: {
        url,
        storageKey,
        entityType: this.ENTITY_TYPE,
        entityId: userId,
      },
    });

    // Update Redis cache
    await this.redis.set(this.cacheKey(userId), url, this.CACHE_TTL);

    this.logger.log('Avatar uploaded', 'AvatarService', { userId, storageKey });

    return { url, storageKey };
  }

  async delete(userId: string): Promise<void> {
    const existing = await this.prisma.image.findFirst({
      where: { entityType: this.ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, storageKey: true },
    });

    if (!existing) {
      throw new AvatarNotFoundException();
    }

    await this.prisma.image.delete({ where: { id: existing.id } });

    if (existing.storageKey) {
      await this.storage.deleteByKey(existing.storageKey);
    }

    await this.redis.set(this.cacheKey(userId), this.NULL_SENTINEL, this.CACHE_TTL);

    this.logger.log('Avatar deleted', 'AvatarService', { userId });
  }

  async resolve(userId: string): Promise<string | null> {
    const cached = await this.redis.get(this.cacheKey(userId));

    if (cached !== null) {
      return cached === this.NULL_SENTINEL ? null : cached;
    }

    const image = await this.prisma.image.findFirst({
      where: { entityType: this.ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select: { url: true },
    });

    const url = image?.url ?? null;
    await this.redis.set(this.cacheKey(userId), url ?? this.NULL_SENTINEL, this.CACHE_TTL);

    return url;
  }

  private cacheKey(userId: string): string {
    return `avatar:${userId}`;
  }

    private validateFile(file: AvatarUploadFile): void {
        if (!this.ALLOWED_MIMETYPES.has(file.mimetype as any)) {
            throw new UnsupportedFileTypeException();
        }
        if (file.size > this.MAX_BYTES) {
            throw new FileTooLargeException();
        }
    }
}
