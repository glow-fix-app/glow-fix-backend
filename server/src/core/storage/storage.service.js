"use strict";
// Wraps AWS S3 (or any S3-compatible store like Cloudflare R2).
// All avatar images are resized and converted to WebP before upload
// so storage and delivery are lean regardless of what the client sends.
//
// Required env vars:
//   STORAGE_ENDPOINT   – https://… for R2; omit for native AWS S3
//   STORAGE_REGION     – e.g. "auto" (R2) or "us-east-1" (S3)
//   STORAGE_BUCKET     – bucket name
//   STORAGE_KEY_ID     – access key id
//   STORAGE_KEY_SECRET – secret access key
//   STORAGE_CDN_BASE   – public CDN base URL, e.g. https://pub-xxx.r2.dev
//                        (no trailing slash)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
var common_1 = require("@nestjs/common");
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var sharp_1 = __importDefault(require("sharp"));
var crypto_1 = require("crypto");
var StorageService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StorageService = _classThis = /** @class */ (function () {
        function StorageService_1(config) {
            this.config = config;
            var endpoint = config.get('storage.endpoint'); // undefined = native S3
            this.s3 = new client_s3_1.S3Client(__assign({ region: config.getOrThrow('storage.region'), credentials: {
                    accessKeyId: config.getOrThrow('storage.keyId'),
                    secretAccessKey: config.getOrThrow('storage.keySecret'),
                } }, (endpoint ? { endpoint: endpoint, forcePathStyle: false } : {})));
            this.bucket = config.getOrThrow('storage.bucket');
            this.cdnBase = config.getOrThrow('storage.cdnBase').replace(/\/$/, '');
        }
        // ── Upload ──────────────────────────────────────────────────────────────────
        /**
         * Upload a raw image buffer. Automatically resizes + converts to WebP.
         *
         * @param buffer   Raw image bytes from multer / multipart
         * @param folder   Logical folder prefix, e.g. "avatars"
         * @param options  Resize options (default: 256×256, fit cover)
         */
        StorageService_1.prototype.uploadImage = function (buffer_1, folder_1) {
            return __awaiter(this, arguments, void 0, function (buffer, folder, options) {
                var _a, width, _b, height, _c, quality, processed, _d, storageKey, err_1;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = options.width, width = _a === void 0 ? 256 : _a, _b = options.height, height = _b === void 0 ? 256 : _b, _c = options.quality, quality = _c === void 0 ? 85 : _c;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, sharp_1.default)(buffer)
                                    .resize(width, height, { fit: 'cover', position: 'centre' })
                                    .webp({ quality: quality })
                                    .toBuffer()];
                        case 2:
                            processed = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _d = _e.sent();
                            throw new common_1.InternalServerErrorException('Image processing failed');
                        case 4:
                            storageKey = "".concat(folder, "/").concat(this.generateKey(), ".webp");
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.s3.send(new client_s3_1.PutObjectCommand({
                                    Bucket: this.bucket,
                                    Key: storageKey,
                                    Body: processed,
                                    ContentType: 'image/webp',
                                    // Public read — avatars are not sensitive. Remove if using signed URLs.
                                    ACL: 'public-read',
                                    CacheControl: 'public, max-age=31536000, immutable',
                                }))];
                        case 6:
                            _e.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            err_1 = _e.sent();
                            throw new common_1.InternalServerErrorException('File upload failed');
                        case 8: return [2 /*return*/, {
                                storageKey: storageKey,
                                url: "".concat(this.cdnBase, "/").concat(storageKey),
                            }];
                    }
                });
            });
        };
        /**
         * Upload a raw file buffer without any image processing/WebP conversion.
         * Useful for documents, PDFs, Tax Cards, etc.
         *
         * @param buffer       Raw file bytes
         * @param folder       Logical folder prefix, e.g. "businesses/documents"
         * @param mimetype     File mimetype
         * @param originalName Original file name to extract file extension
         */
        StorageService_1.prototype.uploadFile = function (buffer, folder, mimetype, originalName) {
            return __awaiter(this, void 0, void 0, function () {
                var ext, storageKey, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ext = originalName.split('.').pop() || 'bin';
                            storageKey = "".concat(folder, "/").concat(this.generateKey(), ".").concat(ext);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.s3.send(new client_s3_1.PutObjectCommand({
                                    Bucket: this.bucket,
                                    Key: storageKey,
                                    Body: buffer,
                                    ContentType: mimetype,
                                    ACL: 'public-read',
                                    CacheControl: 'public, max-age=31536000, immutable',
                                }))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            throw new common_1.InternalServerErrorException('File upload failed');
                        case 4: return [2 /*return*/, {
                                storageKey: storageKey,
                                url: "".concat(this.cdnBase, "/").concat(storageKey),
                            }];
                    }
                });
            });
        };
        // ── Delete ──────────────────────────────────────────────────────────────────
        /**
         * Delete an object from storage by its storageKey.
         * Never throws — a failed delete should not break the user-facing response;
         * log and move on (a cleanup job can handle orphans later).
         */
        StorageService_1.prototype.deleteByKey = function (storageKey) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }))];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ── Presigned URL (private buckets) ─────────────────────────────────────────
        /**
         * Generate a short-lived presigned GET URL for private bucket objects.
         * Not needed for public-read buckets but included for completeness.
         */
        StorageService_1.prototype.getPresignedUrl = function (storageKey_1) {
            return __awaiter(this, arguments, void 0, function (storageKey, expiresInSeconds) {
                if (expiresInSeconds === void 0) { expiresInSeconds = 3600; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: storageKey }), { expiresIn: expiresInSeconds })];
                });
            });
        };
        // ── Private ─────────────────────────────────────────────────────────────────
        StorageService_1.prototype.generateKey = function () {
            // 16 random bytes → 32 hex chars — collision probability negligible
            return (0, crypto_1.randomBytes)(16).toString('hex');
        };
        return StorageService_1;
    }());
    __setFunctionName(_classThis, "StorageService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StorageService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StorageService = _classThis;
}();
exports.StorageService = StorageService;
