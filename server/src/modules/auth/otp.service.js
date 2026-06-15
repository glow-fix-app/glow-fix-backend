"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OtpService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcryptjs"));
var utils_1 = require("@glow-fix/utils");
var redis_keys_1 = require("../../core/redis/redis-keys");
var email_templates_1 = require("./email.templates");
var OtpService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OtpService = _classThis = /** @class */ (function () {
        function OtpService_1(prisma, redis, configService, logger, emailService) {
            this.prisma = prisma;
            this.redis = redis;
            this.configService = configService;
            this.logger = logger;
            this.emailService = emailService;
        }
        // ─── Send OTP via Email ───
        OtpService_1.prototype.sendOtpToEmail = function (userId, email, purpose) {
            return __awaiter(this, void 0, void 0, function () {
                var otp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkResendCooldown(email)];
                        case 1:
                            _a.sent();
                            otp = (0, utils_1.generateOtp)(utils_1.OTP.LENGTH);
                            // Store hashed OTP in DB (UserOtp model)
                            return [4 /*yield*/, this.storeOtp(userId, purpose, otp)];
                        case 2:
                            // Store hashed OTP in DB (UserOtp model)
                            _a.sent();
                            return [4 /*yield*/, this.emailService.sendEmail({
                                    to: email,
                                    subject: 'Your Glow Fix verification code',
                                    html: (0, email_templates_1.otpEmailTemplate)(otp, purpose, utils_1.OTP.VALIDITY_MINUTES),
                                    text: "Your Glow Fix verification code is: ".concat(otp, ". Valid for ").concat(utils_1.OTP.VALIDITY_MINUTES, " minutes. Do not share this code."),
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log('OTP sent via email', 'OtpService', {
                                identifier: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                                purpose: purpose,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Send OTP via SMS (mobile) ───
        OtpService_1.prototype.sendOtpToPhone = function (userId, phone, purpose) {
            return __awaiter(this, void 0, void 0, function () {
                var otp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkResendCooldown(phone)];
                        case 1:
                            _a.sent();
                            otp = (0, utils_1.generateOtp)(utils_1.OTP.LENGTH);
                            // Store hashed OTP in DB
                            return [4 /*yield*/, this.storeOtp(userId, purpose, otp)];
                        case 2:
                            // Store hashed OTP in DB
                            _a.sent();
                            // Send via Twilio (dev: just log)
                            return [4 /*yield*/, this.sendViaSms(phone, otp)];
                        case 3:
                            // Send via Twilio (dev: just log)
                            _a.sent();
                            this.logger.log('OTP sent via SMS', 'OtpService', {
                                identifier: phone.slice(-4),
                                purpose: purpose,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Verify OTP ───
        OtpService_1.prototype.verifyOtp = function (userId_1, otp_1, purpose_1) {
            return __awaiter(this, arguments, void 0, function (userId, otp, purpose, consume) {
                var record, isValid, remaining;
                if (consume === void 0) { consume = true; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userOtp.findFirst({
                                where: {
                                    userId: userId,
                                    purpose: purpose,
                                    usedAt: null,
                                    expiresAt: { gt: new Date() },
                                },
                                orderBy: { createdAt: 'desc' },
                            })];
                        case 1:
                            record = _a.sent();
                            if (!record) {
                                throw new common_1.BadRequestException('OTP has expired. Please request a new one.');
                            }
                            if (!(record.attempts >= utils_1.OTP.MAX_ATTEMPTS)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.userOtp.delete({ where: { id: record.id } })];
                        case 2:
                            _a.sent();
                            throw new common_1.BadRequestException("Too many verification attempts. Please request a new code.");
                        case 3: return [4 /*yield*/, bcrypt.compare(otp, record.codeHash)];
                        case 4:
                            isValid = _a.sent();
                            if (!!isValid) return [3 /*break*/, 6];
                            // Increment attempts
                            return [4 /*yield*/, this.prisma.userOtp.update({
                                    where: { id: record.id },
                                    data: { attempts: { increment: 1 } },
                                })];
                        case 5:
                            // Increment attempts
                            _a.sent();
                            remaining = utils_1.OTP.MAX_ATTEMPTS - (record.attempts + 1);
                            throw new common_1.BadRequestException("Invalid OTP. ".concat(remaining, " attempt(s) remaining."));
                        case 6:
                            if (!consume) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.userOtp.update({
                                    where: { id: record.id },
                                    data: { usedAt: new Date() },
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/, true];
                    }
                });
            });
        };
        // ─── Private Helpers ───
        OtpService_1.prototype.storeOtp = function (userId, purpose, otp) {
            return __awaiter(this, void 0, void 0, function () {
                var codeHash, expiresAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Invalidate any previous unused OTPs for same user+purpose
                        return [4 /*yield*/, this.prisma.userOtp.updateMany({
                                where: {
                                    userId: userId,
                                    purpose: purpose,
                                    usedAt: null,
                                },
                                data: { usedAt: new Date() }, // mark old ones as used
                            })];
                        case 1:
                            // Invalidate any previous unused OTPs for same user+purpose
                            _a.sent();
                            return [4 /*yield*/, bcrypt.hash(otp, 10)];
                        case 2:
                            codeHash = _a.sent();
                            expiresAt = new Date(Date.now() + utils_1.OTP.VALIDITY_MINUTES * 60 * 1000);
                            return [4 /*yield*/, this.prisma.userOtp.create({
                                    data: {
                                        userId: userId,
                                        purpose: purpose,
                                        codeHash: codeHash,
                                        expiresAt: expiresAt,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OtpService_1.prototype.checkResendCooldown = function (identifier) {
            return __awaiter(this, void 0, void 0, function () {
                var resendKey, resendCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            resendKey = redis_keys_1.RedisKeys.otpResendCount(identifier);
                            return [4 /*yield*/, this.redis.get(resendKey)];
                        case 1:
                            resendCount = _a.sent();
                            if (resendCount &&
                                parseInt(resendCount, 10) >= utils_1.OTP.MAX_RESEND_ATTEMPTS) {
                                throw new common_1.BadRequestException('Maximum OTP resend attempts reached. Please try again later.');
                            }
                            return [4 /*yield*/, this.redis.incr(resendKey)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.redis.expire(resendKey, utils_1.OTP.RESEND_COOLDOWN_SECONDS)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OtpService_1.prototype.sendViaSms = function (phone, otp) {
            return __awaiter(this, void 0, void 0, function () {
                var nodeEnv, twilio, client, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nodeEnv = this.configService.get('app.nodeEnv');
                            if (nodeEnv === 'development' || nodeEnv === 'test') {
                                this.logger.debug("[DEV] OTP for ".concat(phone, ": ").concat(otp), 'OtpService');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            twilio = require('twilio');
                            client = twilio(this.configService.get('twilio.accountSid'), this.configService.get('twilio.authToken'));
                            return [4 /*yield*/, client.messages.create({
                                    body: "Your Glow Fix verification code is: ".concat(otp, ". Valid for ").concat(utils_1.OTP.VALIDITY_MINUTES, " minutes. Do not share this code."),
                                    from: this.configService.get('twilio.phoneNumber'),
                                    to: phone,
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Failed to send OTP via SMS: ".concat(error_1.message), error_1.stack, 'OtpService');
                            throw new common_1.BadRequestException('Failed to send verification code. Please try again.');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return OtpService_1;
    }());
    __setFunctionName(_classThis, "OtpService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OtpService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OtpService = _classThis;
}();
exports.OtpService = OtpService;
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';
// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { OtpPurpose } from './dto/verify-otp.dto';
// import { EmailService } from './email.service';
// import { otpEmailTemplate } from './email.templates';
// @Injectable()
// export class OtpService {
//   constructor(
//     private readonly redis: RedisService,
//     private readonly configService: ConfigService,
//     private readonly logger: WinstonLoggerService,
//     private readonly emailService: EmailService, // ← injected
//   ) {}
//   // ─── Send OTP via SMS (mobile) ───
//   async sendOtp(identifier: string, purpose: string): Promise<void> {
//     // Check resend cooldown
//     const resendKey = RedisKeys.otpResendCount(identifier);
//     const resendCount = await this.redis.get(resendKey);
//     if (
//       resendCount &&
//       parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS
//     ) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }
//     // Generate OTP
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);
//     // Store OTP in Redis
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );
//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
//     // Send OTP via Twilio
//     await this.sendViaSms(identifier, otp);
//     this.logger.log('OTP sent via SMS', 'OtpService', {
//       identifier: identifier.slice(-4), // Only log last 4 digits
//       purpose,
//     });
//   }
//   // ─── Send OTP via Email ───
//   async sendOtpToEmail(email: string, purpose: OtpPurpose): Promise<void> {
//     // Check resend cooldown (same pattern as SMS)
//     const resendKey = RedisKeys.otpResendCount(email);
//     const resendCount = await this.redis.get(resendKey);
//     if (
//       resendCount &&
//       parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS
//     ) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }
//     // Generate OTP using shared util (replaces the private generateOtp())
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);
//     // Store in Redis with the same shape as the SMS path so verifyOtp() works for both
//     const otpKey = RedisKeys.otp(email, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );
//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
//     const expiryMinutes = OTP_CONSTANTS.VALIDITY_MINUTES;
//     await this.emailService.sendEmail({
//       to: email,
//       subject: `Your Glow Fix verification code`,
//       html: otpEmailTemplate(otp, purpose, expiryMinutes),
//       text: `Your Glow Fix verification code is: ${otp}. Valid for ${expiryMinutes} minutes. Do not share this code.`,
//     });
//     this.logger.log('OTP sent via email', 'OtpService', {
//       identifier: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // mask: jo***@example.com
//       purpose,
//     });
//   }
//   // ─── Verify OTP (works for both email and mobile identifiers) ───
//   async verifyOtp(
//     identifier: string,
//     otp: string,
//     purpose: string,
//   ): Promise<boolean> {
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     const attemptsKey = RedisKeys.otpAttempts(identifier, purpose);
//     // Check attempt count
//     const attempts = await this.redis.get(attemptsKey);
//     if (attempts && parseInt(attempts, 10) >= OTP_CONSTANTS.MAX_ATTEMPTS) {
//       // Lock out and delete the OTP
//       await this.redis.del(otpKey);
//       throw new BadRequestException(
//         `Too many verification attempts. Please wait ${OTP_CONSTANTS.LOCKOUT_MINUTES} minutes.`,
//       );
//     }
//     // Get stored OTP
//     const stored = await this.redis.getJson<{
//       otp: string;
//       attempts: number;
//       createdAt: string;
//     }>(otpKey);
//     if (!stored) {
//       throw new BadRequestException('OTP has expired. Please request a new one.');
//     }
//     // Verify OTP
//     if (stored.otp !== otp) {
//       await this.redis.incr(attemptsKey);
//       await this.redis.expire(attemptsKey, OTP_CONSTANTS.LOCKOUT_MINUTES * 60);
//       const currentAttempts = parseInt(
//         (await this.redis.get(attemptsKey)) || '1',
//         10,
//       );
//       const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - currentAttempts;
//       throw new BadRequestException(
//         `Invalid OTP. ${remaining} attempt(s) remaining.`,
//       );
//     }
//     // OTP verified — clean up
//     await this.redis.del(otpKey);
//     await this.redis.del(attemptsKey);
//     return true;
//   }
//   // ─── Private: SMS via Twilio ───
//   private async sendViaSms(phoneNumber: string, otp: string): Promise<void> {
//     const nodeEnv = this.configService.get<string>('app.nodeEnv');
//     if (nodeEnv === 'development' || nodeEnv === 'test') {
//       this.logger.debug(`[DEV] OTP for ${phoneNumber}: ${otp}`, 'OtpService');
//       return;
//     }
//     try {
//       const twilio = require('twilio');
//       const client = twilio(
//         this.configService.get<string>('twilio.accountSid'),
//         this.configService.get<string>('twilio.authToken'),
//       );
//       await client.messages.create({
//         body: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
//         from: this.configService.get<string>('twilio.phoneNumber'),
//         to: phoneNumber,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to send OTP via SMS: ${(error as Error).message}`,
//         (error as Error).stack,
//         'OtpService',
//       );
//       throw new BadRequestException(
//         'Failed to send verification code. Please try again.',
//       );
//     }
//   }
//   // NOTE: private generateOtp() removed — use generateOtp() from @glow-fix/utils everywhere
// }
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { generateOtp, OTP as OTP_CONSTANTS } from '@glow-fix/utils';
// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { OtpPurpose } from './dto/verify-otp.dto';
// @Injectable()
// export class OtpService {
//   constructor(
//     private readonly redis: RedisService,
//     private readonly configService: ConfigService,
//     private readonly logger: WinstonLoggerService,
//   ) {}
//   async sendOtp(identifier: string, purpose: string): Promise<void> {
//     // Check resend cooldown
//     const resendKey = RedisKeys.otpResendCount(identifier);
//     const resendCount = await this.redis.get(resendKey);
//     if (resendCount && parseInt(resendCount, 10) >= OTP_CONSTANTS.MAX_RESEND_ATTEMPTS) {
//       throw new BadRequestException(
//         'Maximum OTP resend attempts reached. Please try again later.',
//       );
//     }
//     // Generate OTP
//     const otp = generateOtp(OTP_CONSTANTS.LENGTH);
//     // Store OTP in Redis
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     await this.redis.setJson(
//       otpKey,
//       { otp, attempts: 0, createdAt: new Date().toISOString() },
//       OTP_CONSTANTS.VALIDITY_MINUTES * 60,
//     );
//     // Track resend count
//     await this.redis.incr(resendKey);
//     await this.redis.expire(resendKey, OTP_CONSTANTS.RESEND_COOLDOWN_SECONDS);
//     // Send OTP via Twilio
//     await this.sendViaSms(identifier, otp);
//     this.logger.log('OTP sent', 'OtpService', {
//       identifier: identifier.slice(-4), // Only log last 4 digits
//       purpose,
//     });
//   }
//   async verifyOtp(
//     identifier: string,
//     otp: string,
//     purpose: string,
//   ): Promise<boolean> {
//     const otpKey = RedisKeys.otp(identifier, purpose);
//     const attemptsKey = RedisKeys.otpAttempts(identifier, purpose);
//     // Check attempt count
//     const attempts = await this.redis.get(attemptsKey);
//     if (attempts && parseInt(attempts, 10) >= OTP_CONSTANTS.MAX_ATTEMPTS) {
//       // Lock out
//       await this.redis.del(otpKey);
//       throw new BadRequestException(
//         `Too many verification attempts. Please wait ${OTP_CONSTANTS.LOCKOUT_MINUTES} minutes.`,
//       );
//     }
//     // Get stored OTP
//     const stored = await this.redis.getJson<{
//       otp: string;
//       attempts: number;
//       createdAt: string;
//     }>(otpKey);
//     if (!stored) {
//       throw new BadRequestException('OTP has expired. Please request a new one.');
//     }
//     // Verify OTP
//     if (stored.otp !== otp) {
//       // Increment attempts
//       await this.redis.incr(attemptsKey);
//       await this.redis.expire(attemptsKey, OTP_CONSTANTS.LOCKOUT_MINUTES * 60);
//       const currentAttempts = parseInt(
//         (await this.redis.get(attemptsKey)) || '1',
//         10,
//       );
//       const remaining = OTP_CONSTANTS.MAX_ATTEMPTS - currentAttempts;
//       throw new BadRequestException(
//         `Invalid OTP. ${remaining} attempt(s) remaining.`,
//       );
//     }
//     // OTP verified — clean up
//     await this.redis.del(otpKey);
//     await this.redis.del(attemptsKey);
//     return true;
//   }
//   private async sendViaSms(phoneNumber: string, otp: string): Promise<void> {
//     const nodeEnv = this.configService.get<string>('app.nodeEnv');
//     if (nodeEnv === 'development' || nodeEnv === 'test') {
//       this.logger.debug(`[DEV] OTP for ${phoneNumber}: ${otp}`, 'OtpService');
//       return;
//     }
//     try {
//       const twilio = require('twilio');
//       const client = twilio(
//         this.configService.get<string>('twilio.accountSid'),
//         this.configService.get<string>('twilio.authToken'),
//       );
//       await client.messages.create({
//         body: `Your Glow Fix verification code is: ${otp}. Valid for ${OTP_CONSTANTS.VALIDITY_MINUTES} minutes. Do not share this code.`,
//         from: this.configService.get<string>('twilio.phoneNumber'),
//         to: phoneNumber,
//       });
//     } catch (error) {
//       this.logger.error(
//         `Failed to send OTP via SMS: ${(error as Error).message}`,
//         (error as Error).stack,
//         'OtpService',
//       );
//       throw new BadRequestException('Failed to send verification code. Please try again.');
//     }
//   }
//   private generateOtp(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }
// }
