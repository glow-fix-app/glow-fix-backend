// Wraps AWS S3 (or any S3-compatible store like Cloudflare R2).
// All avatar images are resized and converted to WebP before upload
// so storage and delivery are lean regardless of what the client sends.
//
// Required env vars:
//   STORAGE_ENDPOINT   – https://… for R2/MinIO; omit for native AWS S3
//   STORAGE_REGION     – e.g. "auto" (R2) or "us-east-1" (S3)
//   STORAGE_BUCKET     – bucket name
//   STORAGE_KEY_ID     – access key id
//   STORAGE_KEY_SECRET – secret access key
//   STORAGE_CDN_BASE   – public CDN base URL, e.g. https://cdn.glowfix.io
//                        (no trailing slash)

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { randomBytes } from 'crypto';

export interface UploadResult {
  /** Stable key in the bucket — store this in DB, not the URL */
  storageKey: string;
  /** Public CDN URL ready to serve */
  url: string;
}

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdnBase: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = config.get<string>('storage.endpoint'); // undefined = native S3

    this.s3 = new S3Client({
      region: config.getOrThrow<string>('storage.region'),
      credentials: {
        accessKeyId:     config.getOrThrow<string>('storage.keyId'),
        secretAccessKey: config.getOrThrow<string>('storage.keySecret'),
      },
      ...(endpoint ? { endpoint, forcePathStyle: false } : {}),
    });

    this.bucket  = config.getOrThrow<string>('storage.bucket');
    this.cdnBase = config.getOrThrow<string>('storage.cdnBase').replace(/\/$/, '');
  }

  // ── Upload ──────────────────────────────────────────────────────────────────

  /**
   * Upload a raw image buffer. Automatically resizes + converts to WebP.
   *
   * @param buffer   Raw image bytes from multer / multipart
   * @param folder   Logical folder prefix, e.g. "avatars"
   * @param options  Resize options (default: 256×256, fit cover)
   */
  async uploadImage(
    buffer: Buffer,
    folder: string,
    options: { width?: number; height?: number; quality?: number } = {},
  ): Promise<UploadResult> {
    const { width = 256, height = 256, quality = 85 } = options;

    // Resize and convert to WebP — consistent format, small footprint
    let processed: Buffer;
    try {
      processed = await sharp(buffer)
        .resize(width, height, { fit: 'cover', position: 'centre' })
        .webp({ quality })
        .toBuffer();
    } catch {
      throw new InternalServerErrorException('Image processing failed');
    }

    const storageKey = `${folder}/${this.generateKey()}.webp`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket:      this.bucket,
          Key:         storageKey,
          Body:        processed,
          ContentType: 'image/webp',
          // Public read — avatars are not sensitive. Remove if using signed URLs.
          ACL:         'public-read',
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException('File upload failed');
    }

    return {
      storageKey,
      url: `${this.cdnBase}/${storageKey}`,
    };
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  /**
   * Delete an object from storage by its storageKey.
   * Never throws — a failed delete should not break the user-facing response;
   * log and move on (a cleanup job can handle orphans later).
   */
  async deleteByKey(storageKey: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }),
      );
    } catch {
      // intentionally swallowed — caller decides whether to log
    }
  }

  // ── Presigned URL (private buckets) ─────────────────────────────────────────

  /**
   * Generate a short-lived presigned GET URL for private bucket objects.
   * Not needed for public-read buckets but included for completeness.
   */
  async getPresignedUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: storageKey }),
      { expiresIn: expiresInSeconds },
    );
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private generateKey(): string {
    // 16 random bytes → 32 hex chars — collision probability negligible
    return randomBytes(16).toString('hex');
  }
}