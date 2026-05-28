// Handles the full lifecycle of a user avatar:
//   upload  → resize via StorageService → write Image row → bust Redis cache
//   delete  → remove Image row → delete from storage → bust Redis cache
//   resolve → Redis-first read of the avatar URL
//
// The Redis cache is keyed by userId and holds the CDN URL string (or the
// empty string sentinel for "no avatar").  TTL is 1 hour; it is invalidated
// immediately on upload or delete so the next request always reflects reality.

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService }  from '../../core/prisma/prisma.service';
import { RedisService }   from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// ── constants ────────────────────────────────────────────────────────────────
const ENTITY_TYPE      = 'USER_AVATAR';
const AVATAR_FOLDER    = 'avatars';
const CACHE_TTL        = 60 * 60;          // 1 hour in seconds
const NULL_SENTINEL    = '';               // stored in Redis when user has no avatar
const MAX_BYTES        = 5 * 1024 * 1024; // 5 MB hard limit
const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

// ── types ─────────────────────────────────────────────────────────────────────
export interface AvatarUploadFile {
  buffer:   Buffer;
  mimetype: string;
  size:     number;
}

export interface AvatarResult {
  url:        string;
  storageKey: string;
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class AvatarService {
  constructor(
    private readonly prisma:   PrismaService,
    private readonly redis:    RedisService,
    private readonly storage:  StorageService,
    private readonly logger:   WinstonLoggerService,
  ) {}

  // ── Upload / Replace ────────────────────────────────────────────────────────

  /**
   * Upload a new avatar for `userId`, replacing the existing one if present.
   * Steps:
   *   1. Validate mimetype + size
   *   2. Upload resized WebP to storage
   *   3. Delete old Image row + old storage object (if any)
   *   4. Insert new Image row
   *   5. Bust Redis cache
   */
  async upload(userId: string, file: AvatarUploadFile): Promise<AvatarResult> {
    this.validateFile(file);

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where:  { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // 1. Upload new image first — if this fails we haven't touched the DB yet
    const { storageKey, url } = await this.storage.uploadImage(
      file.buffer,
      AVATAR_FOLDER,
      { width: 256, height: 256, quality: 85 },
    );

    // 2. Find and remove the current avatar (if any)
    const existing = await this.prisma.image.findFirst({
      where:   { entityType: ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, storageKey: true },
    });

    if (existing) {
      // Delete DB row first; if storage delete fails it is recoverable by a
      // cleanup job — we don't want to block the user on a storage glitch.
      await this.prisma.image.delete({ where: { id: existing.id } });
      if (existing.storageKey) {
        await this.storage.deleteByKey(existing.storageKey);
      }
    }

    // 3. Persist new Image row
    await this.prisma.image.create({
      data: {
        url,
        storageKey,
        entityType: ENTITY_TYPE,
        entityId:   userId,
      },
    });

    // 4. Update Redis cache
    await this.redis.set(this.cacheKey(userId), url, CACHE_TTL);

    this.logger.log('Avatar uploaded', 'AvatarService', { userId, storageKey });

    return { url, storageKey };
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  /**
   * Remove the user's avatar entirely.
   * Deletes the Image row, the storage object, and the Redis cache entry.
   */
  async delete(userId: string): Promise<void> {
    const existing = await this.prisma.image.findFirst({
      where:   { entityType: ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, storageKey: true },
    });

    if (!existing) {
      throw new NotFoundException('No avatar found for this user');
    }

    await this.prisma.image.delete({ where: { id: existing.id } });

    if (existing.storageKey) {
      await this.storage.deleteByKey(existing.storageKey);
    }

    // Store sentinel so subsequent reads don't hit the DB
    await this.redis.set(this.cacheKey(userId), NULL_SENTINEL, CACHE_TTL);

    this.logger.log('Avatar deleted', 'AvatarService', { userId });
  }

  // ── Resolve (Redis-first) ───────────────────────────────────────────────────

  /**
   * Return the avatar URL for `userId`, or null if none exists.
   * Checks Redis first; falls back to DB and re-populates the cache.
   *
   * Used by:
   *  - jwt.strategy.ts (attaches to req.user on every authenticated request)
   *  - GET /users/me profile endpoint
   */
  async resolve(userId: string): Promise<string | null> {
    const cached = await this.redis.get(this.cacheKey(userId));

    if (cached !== null) {
      // NULL_SENTINEL means "user definitely has no avatar — don't hit DB"
      return cached === NULL_SENTINEL ? null : cached;
    }

    // Cache miss — query DB and repopulate
    const image = await this.prisma.image.findFirst({
      where:   { entityType: ENTITY_TYPE, entityId: userId },
      orderBy: { createdAt: 'desc' },
      select:  { url: true },
    });

    const url = image?.url ?? null;

    // Cache result (empty string sentinel for null)
    await this.redis.set(this.cacheKey(userId), url ?? NULL_SENTINEL, CACHE_TTL);

    return url;
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private cacheKey(userId: string): string {
    return `avatar:${userId}`;
  }

  private validateFile(file: AvatarUploadFile): void {
    if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF',
      );
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException(
        `File too large. Maximum size is ${MAX_BYTES / 1024 / 1024} MB`,
      );
    }
  }
}