"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarService = void 0;
// avatar.service.ts
var common_1 = require("@nestjs/common");
var ENTITY_TYPE = 'USER_AVATAR';
var AVATAR_FOLDER = 'avatars';
var CACHE_TTL = 60 * 60; // 1 hour in seconds
var NULL_SENTINEL = '';
var MAX_BYTES = 5 * 1024 * 1024; // 5 MB
var ALLOWED_MIMETYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);
var AvatarService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AvatarService = _classThis = /** @class */ (function () {
        function AvatarService_1(prisma, redis, storage, logger) {
            this.prisma = prisma;
            this.redis = redis;
            this.storage = storage;
            this.logger = logger;
        }
        AvatarService_1.prototype.upload = function (userId, file) {
            return __awaiter(this, void 0, void 0, function () {
                var user, _a, storageKey, url, existing;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.validateFile(file);
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: userId, deletedAt: null },
                                    select: { id: true },
                                })];
                        case 1:
                            user = _b.sent();
                            if (!user)
                                throw new common_1.NotFoundException('User not found');
                            return [4 /*yield*/, this.storage.uploadImage(file.buffer, AVATAR_FOLDER, { width: 256, height: 256, quality: 85 })];
                        case 2:
                            _a = _b.sent(), storageKey = _a.storageKey, url = _a.url;
                            return [4 /*yield*/, this.prisma.image.findFirst({
                                    where: { entityType: ENTITY_TYPE, entityId: userId },
                                    orderBy: { createdAt: 'desc' },
                                    select: { id: true, storageKey: true },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (!existing) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.image.delete({ where: { id: existing.id } })];
                        case 4:
                            _b.sent();
                            if (!existing.storageKey) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.storage.deleteByKey(existing.storageKey)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: 
                        // Persist new image
                        return [4 /*yield*/, this.prisma.image.create({
                                data: {
                                    url: url,
                                    storageKey: storageKey,
                                    entityType: ENTITY_TYPE,
                                    entityId: userId,
                                },
                            })];
                        case 7:
                            // Persist new image
                            _b.sent();
                            // Update Redis cache
                            return [4 /*yield*/, this.redis.set(this.cacheKey(userId), url, CACHE_TTL)];
                        case 8:
                            // Update Redis cache
                            _b.sent();
                            this.logger.log('Avatar uploaded', 'AvatarService', { userId: userId, storageKey: storageKey });
                            return [2 /*return*/, { url: url, storageKey: storageKey }];
                    }
                });
            });
        };
        AvatarService_1.prototype.delete = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.image.findFirst({
                                where: { entityType: ENTITY_TYPE, entityId: userId },
                                orderBy: { createdAt: 'desc' },
                                select: { id: true, storageKey: true },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('No avatar found for this user');
                            }
                            return [4 /*yield*/, this.prisma.image.delete({ where: { id: existing.id } })];
                        case 2:
                            _a.sent();
                            if (!existing.storageKey) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.storage.deleteByKey(existing.storageKey)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: 
                        // Store sentinel in Redis
                        return [4 /*yield*/, this.redis.set(this.cacheKey(userId), NULL_SENTINEL, CACHE_TTL)];
                        case 5:
                            // Store sentinel in Redis
                            _a.sent();
                            this.logger.log('Avatar deleted', 'AvatarService', { userId: userId });
                            return [2 /*return*/];
                    }
                });
            });
        };
        AvatarService_1.prototype.resolve = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, image, url;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.redis.get(this.cacheKey(userId))];
                        case 1:
                            cached = _b.sent();
                            if (cached !== null) {
                                return [2 /*return*/, cached === NULL_SENTINEL ? null : cached];
                            }
                            return [4 /*yield*/, this.prisma.image.findFirst({
                                    where: { entityType: ENTITY_TYPE, entityId: userId },
                                    orderBy: { createdAt: 'desc' },
                                    select: { url: true },
                                })];
                        case 2:
                            image = _b.sent();
                            url = (_a = image === null || image === void 0 ? void 0 : image.url) !== null && _a !== void 0 ? _a : null;
                            return [4 /*yield*/, this.redis.set(this.cacheKey(userId), url !== null && url !== void 0 ? url : NULL_SENTINEL, CACHE_TTL)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, url];
                    }
                });
            });
        };
        AvatarService_1.prototype.cacheKey = function (userId) {
            return "avatar:".concat(userId);
        };
        AvatarService_1.prototype.validateFile = function (file) {
            if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
                throw new common_1.BadRequestException('Unsupported file type. Allowed: JPEG, PNG, WebP, GIF');
            }
            if (file.size > MAX_BYTES) {
                throw new common_1.BadRequestException("File too large. Maximum size is ".concat(MAX_BYTES / 1024 / 1024, " MB"));
            }
        };
        return AvatarService_1;
    }());
    __setFunctionName(_classThis, "AvatarService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AvatarService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AvatarService = _classThis;
}();
exports.AvatarService = AvatarService;
// // Handles the full lifecycle of a user avatar:
// //   upload  → resize via StorageService → write Image row → bust Redis cache
// //   delete  → remove Image row → delete from storage → bust Redis cache
// //   resolve → Redis-first read of the avatar URL
// //
// // The Redis cache is keyed by userId and holds the CDN URL string (or the
// // empty string sentinel for "no avatar").  TTL is 1 hour; it is invalidated
// // immediately on upload or delete so the next request always reflects reality.
// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
// } from '@nestjs/common';
// import { PrismaService }  from '../../core/prisma/prisma.service';
// import { RedisService }   from '../../core/redis/redis.service';
// import { StorageService } from '../../core/storage/storage.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// // ── constants ────────────────────────────────────────────────────────────────
// const ENTITY_TYPE      = 'USER_AVATAR';
// const AVATAR_FOLDER    = 'avatars';
// const CACHE_TTL        = 60 * 60;          // 1 hour in seconds
// const NULL_SENTINEL    = '';               // stored in Redis when user has no avatar
// const MAX_BYTES        = 5 * 1024 * 1024; // 5 MB hard limit
// const ALLOWED_MIMETYPES = new Set([
//   'image/jpeg',
//   'image/png',
//   'image/webp',
//   'image/gif',
// ]);
// // ── types ─────────────────────────────────────────────────────────────────────
// export interface AvatarUploadFile {
//   buffer:   Buffer;
//   mimetype: string;
//   size:     number;
// }
// export interface AvatarResult {
//   url:        string;
//   storageKey: string;
// }
// // ─────────────────────────────────────────────────────────────────────────────
// @Injectable()
// export class AvatarService {
//   constructor(
//     private readonly prisma:   PrismaService,
//     private readonly redis:    RedisService,
//     private readonly storage:  StorageService,
//     private readonly logger:   WinstonLoggerService,
//   ) {}
//   // ── Upload / Replace ────────────────────────────────────────────────────────
//   /**
//    * Upload a new avatar for `userId`, replacing the existing one if present.
//    * Steps:
//    *   1. Validate mimetype + size
//    *   2. Upload resized WebP to storage
//    *   3. Delete old Image row + old storage object (if any)
//    *   4. Insert new Image row
//    *   5. Bust Redis cache
//    */
//   async upload(userId: string, file: AvatarUploadFile): Promise<AvatarResult> {
//     this.validateFile(file);
//     // Verify user exists
//     const user = await this.prisma.user.findUnique({
//       where:  { id: userId, deletedAt: null },
//       select: { id: true },
//     });
//     if (!user) throw new NotFoundException('User not found');
//     // 1. Upload new image first — if this fails we haven't touched the DB yet
//     const { storageKey, url } = await this.storage.uploadImage(
//       file.buffer,
//       AVATAR_FOLDER,
//       { width: 256, height: 256, quality: 85 },
//     );
//     // 2. Find and remove the current avatar (if any)
//     const existing = await this.prisma.image.findFirst({
//       where:   { entityType: ENTITY_TYPE, entityId: userId },
//       orderBy: { createdAt: 'desc' },
//       select:  { id: true, storageKey: true },
//     });
//     if (existing) {
//       // Delete DB row first; if storage delete fails it is recoverable by a
//       // cleanup job — we don't want to block the user on a storage glitch.
//       await this.prisma.image.delete({ where: { id: existing.id } });
//       if (existing.storageKey) {
//         await this.storage.deleteByKey(existing.storageKey);
//       }
//     }
//     // 3. Persist new Image row
//     await this.prisma.image.create({
//       data: {
//         url,
//         storageKey,
//         entityType: ENTITY_TYPE,
//         entityId:   userId,
//       },
//     });
//     // 4. Update Redis cache
//     await this.redis.set(this.cacheKey(userId), url, CACHE_TTL);
//     this.logger.log('Avatar uploaded', 'AvatarService', { userId, storageKey });
//     return { url, storageKey };
//   }
//   // ── Delete ──────────────────────────────────────────────────────────────────
//   /**
//    * Remove the user's avatar entirely.
//    * Deletes the Image row, the storage object, and the Redis cache entry.
//    */
//   async delete(userId: string): Promise<void> {
//     const existing = await this.prisma.image.findFirst({
//       where:   { entityType: ENTITY_TYPE, entityId: userId },
//       orderBy: { createdAt: 'desc' },
//       select:  { id: true, storageKey: true },
//     });
//     if (!existing) {
//       throw new NotFoundException('No avatar found for this user');
//     }
//     await this.prisma.image.delete({ where: { id: existing.id } });
//     if (existing.storageKey) {
//       await this.storage.deleteByKey(existing.storageKey);
//     }
//     // Store sentinel so subsequent reads don't hit the DB
//     await this.redis.set(this.cacheKey(userId), NULL_SENTINEL, CACHE_TTL);
//     this.logger.log('Avatar deleted', 'AvatarService', { userId });
//   }
//   // ── Resolve (Redis-first) ───────────────────────────────────────────────────
//   /**
//    * Return the avatar URL for `userId`, or null if none exists.
//    * Checks Redis first; falls back to DB and re-populates the cache.
//    *
//    * Used by:
//    *  - jwt.strategy.ts (attaches to req.user on every authenticated request)
//    *  - GET /users/me profile endpoint
//    */
//   async resolve(userId: string): Promise<string | null> {
//     const cached = await this.redis.get(this.cacheKey(userId));
//     if (cached !== null) {
//       // NULL_SENTINEL means "user definitely has no avatar — don't hit DB"
//       return cached === NULL_SENTINEL ? null : cached;
//     }
//     // Cache miss — query DB and repopulate
//     const image = await this.prisma.image.findFirst({
//       where:   { entityType: ENTITY_TYPE, entityId: userId },
//       orderBy: { createdAt: 'desc' },
//       select:  { url: true },
//     });
//     const url = image?.url ?? null;
//     // Cache result (empty string sentinel for null)
//     await this.redis.set(this.cacheKey(userId), url ?? NULL_SENTINEL, CACHE_TTL);
//     return url;
//   }
//   // ── Private helpers ─────────────────────────────────────────────────────────
//   private cacheKey(userId: string): string {
//     return `avatar:${userId}`;
//   }
//   private validateFile(file: AvatarUploadFile): void {
//     if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
//       throw new BadRequestException(
//         'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF',
//       );
//     }
//     if (file.size > MAX_BYTES) {
//       throw new BadRequestException(
//         `File too large. Maximum size is ${MAX_BYTES / 1024 / 1024} MB`,
//       );
//     }
//   }
// }
