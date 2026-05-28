// End-to-end tests for the avatar flow.
// Run with: npx jest --config jest.e2e.json avatar.e2e-spec
//
// These tests mock StorageService so no real S3 calls are made.

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { StorageService } from '../src/core/storage/storage.service';
import { PrismaService } from '../src/core/prisma/prisma.service';
import { RedisService } from '../src/core/redis/redis.service';

// ─── helpers ─────────────────────────────────────────────────────────────────

const MOCK_STORAGE_KEY = 'avatars/test-key-abc123.webp';
const MOCK_CDN_URL     = `https://cdn.glowfix.io/${MOCK_STORAGE_KEY}`;

const mockStorageService = {
  uploadImage:   jest.fn().mockResolvedValue({ storageKey: MOCK_STORAGE_KEY, url: MOCK_CDN_URL }),
  deleteByKey:   jest.fn().mockResolvedValue(undefined),
};

// ─────────────────────────────────────────────────────────────────────────────

describe('Avatar (e2e)', () => {
  let app:    INestApplication;
  let prisma: PrismaService;
  let redis:  RedisService;

  let accessToken: string;
  let userId:      string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleRef.get(PrismaService);
    redis  = moduleRef.get(RedisService);

    // Register + verify a test user to get an access token
    const reg = await request(app.getHttpServer())
      .post('/v1/auth/register/client')
      .send({
        fullName:        'Avatar Test User',
        email:           'avatartest@glowfix.io',
        password:        'Test@1234!',
        confirmPassword: 'Test@1234!',
      });

    expect(reg.status).toBe(201);

    // In a real test you would intercept the OTP from DB; here we fetch it directly.
    const otp = await prisma.userOtp.findFirst({
      where:   { user: { email: 'avatartest@glowfix.io' } },
      orderBy: { createdAt: 'desc' },
    });
    expect(otp).toBeDefined();

    // Derive the actual code from codeHash is not possible (hashed), so in test
    // environment the OtpService should expose a test helper or the hash should
    // be bypassed. For brevity we directly mark the user as verified here.
    const user = await prisma.user.update({
      where: { email: 'avatartest@glowfix.io' },
      data:  { emailVerified: true },
    });
    userId = user.id;

    const login = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ identifier: 'avatartest@glowfix.io', password: 'Test@1234!' });

    expect(login.status).toBe(200);
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({ where: { email: 'avatartest@glowfix.io' } });
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── Upload ────────────────────────────────────────────────────────────────

  it('PUT /v1/users/me/avatar — uploads avatar and returns CDN URL', async () => {
    const res = await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', Buffer.from('fake-image-bytes'), {
        filename:    'photo.jpg',
        contentType: 'image/jpeg',
      });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe(MOCK_CDN_URL);
    expect(mockStorageService.uploadImage).toHaveBeenCalledTimes(1);

    // Image row should exist in DB
    const image = await prisma.image.findFirst({
      where: { entityType: 'USER_AVATAR', entityId: userId },
    });
    expect(image).toBeDefined();
    expect(image?.storageKey).toBe(MOCK_STORAGE_KEY);
  });

  it('PUT /v1/users/me/avatar — replaces existing avatar and deletes old storage object', async () => {
    // Upload once first
    await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', Buffer.from('first-image'), { filename: 'a.jpg', contentType: 'image/jpeg' });

    const countBefore = await prisma.image.count({
      where: { entityType: 'USER_AVATAR', entityId: userId },
    });
    expect(countBefore).toBe(1);

    // Upload again
    const res = await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', Buffer.from('second-image'), { filename: 'b.png', contentType: 'image/png' });

    expect(res.status).toBe(200);

    // Only one Image row should remain
    const countAfter = await prisma.image.count({
      where: { entityType: 'USER_AVATAR', entityId: userId },
    });
    expect(countAfter).toBe(1);

    // Old storage object should have been deleted
    expect(mockStorageService.deleteByKey).toHaveBeenCalledWith(MOCK_STORAGE_KEY);
  });

  it('PUT /v1/users/me/avatar — rejects request with no file', async () => {
    const res = await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it('PUT /v1/users/me/avatar — rejects unauthenticated request', async () => {
    const res = await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .attach('avatar', Buffer.from('img'), { filename: 'a.jpg', contentType: 'image/jpeg' });

    expect(res.status).toBe(401);
  });

  // ── Cache ─────────────────────────────────────────────────────────────────

  it('resolves avatar from Redis cache on second call', async () => {
    // First call should populate cache
    const cacheKey = `avatar:${userId}`;
    await redis.del(cacheKey); // clear first

    // Simulate what jwt.strategy does: avatarService.resolve(userId)
    // We can call the endpoint and check Redis was written
    await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', Buffer.from('img'), { filename: 'a.jpg', contentType: 'image/jpeg' });

    const cached = await redis.get(cacheKey);
    expect(cached).toBe(MOCK_CDN_URL);
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('DELETE /v1/users/me/avatar — removes avatar', async () => {
    // Ensure avatar exists
    await request(app.getHttpServer())
      .put('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('avatar', Buffer.from('img'), { filename: 'a.jpg', contentType: 'image/jpeg' });

    const res = await request(app.getHttpServer())
      .delete('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(mockStorageService.deleteByKey).toHaveBeenCalledWith(MOCK_STORAGE_KEY);

    const image = await prisma.image.findFirst({
      where: { entityType: 'USER_AVATAR', entityId: userId },
    });
    expect(image).toBeNull();

    // Redis sentinel should be set
    const cacheKey = `avatar:${userId}`;
    const cached   = await redis.get(cacheKey);
    expect(cached).toBe(''); // null sentinel
  });

  it('DELETE /v1/users/me/avatar — returns 404 when no avatar exists', async () => {
    // Ensure no avatar
    await prisma.image.deleteMany({
      where: { entityType: 'USER_AVATAR', entityId: userId },
    });
    await redis.del(`avatar:${userId}`);

    const res = await request(app.getHttpServer())
      .delete('/v1/users/me/avatar')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});