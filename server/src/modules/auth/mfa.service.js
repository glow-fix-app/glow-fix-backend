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
exports.MfaService = void 0;
var common_1 = require("@nestjs/common");
var otplib_1 = require("otplib");
var QRCode = __importStar(require("qrcode"));
var crypto = __importStar(require("crypto"));
otplib_1.authenticator.options = { window: 1 };
var MfaService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MfaService = _classThis = /** @class */ (function () {
        function MfaService_1(prisma, logger) {
            this.prisma = prisma;
            this.logger = logger;
            this.APP_NAME = 'GlowFix';
            this.BACKUP_CODES_COUNT = 10;
        }
        MfaService_1.prototype.setupMfa = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, secret, otpAuthUrl, qrCodeUrl, backupCodes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!userId) {
                                throw new common_1.BadRequestException('Invalid user');
                            }
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { id: userId, deletedAt: null },
                                    select: { email: true },
                                })];
                        case 1:
                            user = _a.sent();
                            console.log('JWT payload:', user);
                            if (!user) {
                                throw new common_1.BadRequestException('User not found');
                            }
                            secret = otplib_1.authenticator.generateSecret();
                            otpAuthUrl = otplib_1.authenticator.keyuri(user.email, this.APP_NAME, secret);
                            return [4 /*yield*/, QRCode.toDataURL(otpAuthUrl)];
                        case 2:
                            qrCodeUrl = _a.sent();
                            backupCodes = this.generateBackupCodes();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { twoFactorSecret: secret },
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log('MFA setup initiated', 'MfaService', { userId: userId });
                            return [2 /*return*/, { secret: secret, qrCodeUrl: qrCodeUrl, backupCodes: backupCodes }];
                    }
                });
            });
        };
        MfaService_1.prototype.verifyAndEnableMfa = function (userId, code) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                select: { twoFactorSecret: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!(user === null || user === void 0 ? void 0 : user.twoFactorSecret)) {
                                throw new common_1.BadRequestException('MFA setup not initiated. Please start setup first.');
                            }
                            isValid = otplib_1.authenticator.verify({
                                token: code,
                                secret: user.twoFactorSecret,
                            });
                            if (!isValid) {
                                throw new common_1.BadRequestException('Invalid verification code. Please try again.');
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { twoFactorEnabled: true },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log('MFA enabled', 'MfaService', { userId: userId });
                            return [2 /*return*/, { enabled: true }];
                    }
                });
            });
        };
        MfaService_1.prototype.verifyMfaCode = function (userId, code) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                select: { twoFactorSecret: true, twoFactorEnabled: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!(user === null || user === void 0 ? void 0 : user.twoFactorSecret)) {
                                throw new common_1.BadRequestException('MFA is not enabled for this account.');
                            }
                            return [2 /*return*/, otplib_1.authenticator.verify({ token: code, secret: user.twoFactorSecret })];
                    }
                });
            });
        };
        MfaService_1.prototype.disableMfa = function (userId, code) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                select: { twoFactorSecret: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!(user === null || user === void 0 ? void 0 : user.twoFactorSecret)) {
                                throw new common_1.BadRequestException('MFA is not set up for this account.');
                            }
                            isValid = otplib_1.authenticator.verify({
                                token: code,
                                secret: user.twoFactorSecret,
                            });
                            if (!isValid) {
                                throw new common_1.BadRequestException('Invalid verification code.');
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { twoFactorEnabled: false, twoFactorSecret: null },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log('MFA disabled', 'MfaService', { userId: userId });
                            return [2 /*return*/];
                    }
                });
            });
        };
        MfaService_1.prototype.generateBackupCodes = function () {
            var codes = [];
            for (var i = 0; i < this.BACKUP_CODES_COUNT; i++) {
                var code = crypto.randomBytes(4).toString('hex').toUpperCase();
                codes.push("".concat(code.slice(0, 4), "-").concat(code.slice(4, 8)));
            }
            return codes;
        };
        return MfaService_1;
    }());
    __setFunctionName(_classThis, "MfaService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MfaService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MfaService = _classThis;
}();
exports.MfaService = MfaService;
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { authenticator } from 'otplib';
// import * as QRCode from 'qrcode';
// import * as crypto from 'crypto';
// import { MfaSetupResponse } from '@glow-fix/types';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// // Allow ±1 window (30s) to account for clock drift
// authenticator.options = { window: 1 };
// @Injectable()
// export class MfaService {
//   private readonly APP_NAME = 'GlowFix';
//   private readonly BACKUP_CODES_COUNT = 10;
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly logger: WinstonLoggerService,
//   ) {}
//   async setupMfa(userId: string): Promise<MfaSetupResponse> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { email: true },
//     });
//     if (!customer) {
//       throw new BadRequestException('Customer not found');
//     }
//     const secret = authenticator.generateSecret();
//     const otpAuthUrl = authenticator.keyuri(
//       customer.email,
//       this.APP_NAME,
//       secret,
//     );
//     const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
//     const backupCodes = this.generateBackupCodes();
//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: { twoFactorSecret: secret },
//     });
//     this.logger.log('MFA setup initiated', 'MfaService', { userId });
//     return { secret, qrCodeUrl, backupCodes };
//   }
//   async verifyAndEnableMfa(
//     userId: string,
//     code: string,
//   ): Promise<{ enabled: boolean }> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true },
//     });
//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException(
//         'MFA setup not initiated. Please start setup first.',
//       );
//     }
//     const isValid = authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });
//     if (!isValid) {
//       throw new BadRequestException(
//         'Invalid verification code. Please try again.',
//       );
//     }
//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: { twoFactorEnabled: true },
//     });
//     this.logger.log('MFA enabled', 'MfaService', { userId });
//     return { enabled: true };
//   }
//   async verifyMfaCode(userId: string, code: string): Promise<boolean> {
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true, twoFactorEnabled: true },
//     });
//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not enabled for this account.');
//     }
//     return authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });
//   }
//   async disableMfa(userId: string, code: string): Promise<void> {
//     // Check secret directly — works even if twoFactorEnabled is still false
//     // (e.g. user set up MFA but never called mfa/verify to enable it)
//     const customer = await this.prisma.customer.findUnique({
//       where: { id: userId },
//       select: { twoFactorSecret: true },
//     });
//     if (!customer?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not set up for this account.');
//     }
//     const isValid = authenticator.verify({
//       token: code,
//       secret: customer.twoFactorSecret,
//     });
//     if (!isValid) {
//       throw new BadRequestException('Invalid verification code.');
//     }
//     await this.prisma.customer.update({
//       where: { id: userId },
//       data: {
//         twoFactorEnabled: false,
//         twoFactorSecret: null,
//       },
//     });
//     this.logger.log('MFA disabled', 'MfaService', { userId });
//   }
//   private generateBackupCodes(): string[] {
//     const codes: string[] = [];
//     for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
//       const code = crypto.randomBytes(4).toString('hex').toUpperCase();
//       codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
//     }
//     return codes;
//   }
// }
