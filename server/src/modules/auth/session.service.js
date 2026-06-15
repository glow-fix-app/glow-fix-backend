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
exports.SessionService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var ua_parser_js_1 = require("ua-parser-js");
var utils_1 = require("@glow-fix/utils");
var SessionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SessionService = _classThis = /** @class */ (function () {
        function SessionService_1(prisma, logger) {
            this.prisma = prisma;
            this.logger = logger;
        }
        SessionService_1.prototype.createSession = function (userId, refreshToken, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var parsed, browser, os, device, deviceInfo, expiresAt, tokenHash, session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parsed = new ua_parser_js_1.UAParser(userAgent);
                            browser = parsed.getBrowser();
                            os = parsed.getOS();
                            device = parsed.getDevice();
                            deviceInfo = [
                                device.type || 'desktop',
                                browser.name ? "".concat(browser.name, " ").concat(browser.version || '').trim() : null,
                                os.name ? "".concat(os.name, " ").concat(os.version || '').trim() : null,
                            ]
                                .filter(Boolean)
                                .join(' | ');
                            expiresAt = new Date(Date.now() + utils_1.SESSION.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000);
                            tokenHash = crypto
                                .createHash('sha256')
                                .update(refreshToken)
                                .digest('hex');
                            return [4 /*yield*/, this.prisma.userSession.create({
                                    data: {
                                        userId: userId,
                                        tokenHash: tokenHash,
                                        deviceInfo: deviceInfo,
                                        ipAddress: ipAddress,
                                        userAgent: userAgent,
                                        expiresAt: expiresAt,
                                        lastUsedAt: new Date(),
                                    },
                                })];
                        case 1:
                            session = _a.sent();
                            return [2 /*return*/, { id: session.id }];
                    }
                });
            });
        };
        SessionService_1.prototype.invalidateSession = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.userSession.delete({
                                    where: { id: sessionId },
                                })];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            this.logger.debug("Session ".concat(sessionId, " not found for deletion"), 'SessionService');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SessionService_1.prototype.invalidateAllSessions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userSession.deleteMany({
                                where: { userId: userId },
                            })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.count];
                    }
                });
            });
        };
        SessionService_1.prototype.invalidateByTokenHash = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tokenHash = crypto
                                .createHash('sha256')
                                .update(refreshToken)
                                .digest('hex');
                            return [4 /*yield*/, this.prisma.userSession.deleteMany({ where: { tokenHash: tokenHash } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SessionService_1.prototype.findByTokenHash = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash;
                return __generator(this, function (_a) {
                    tokenHash = crypto
                        .createHash('sha256')
                        .update(refreshToken)
                        .digest('hex');
                    return [2 /*return*/, this.prisma.userSession.findUnique({
                            where: { tokenHash: tokenHash },
                            select: { id: true, userId: true },
                        })];
                });
            });
        };
        SessionService_1.prototype.enforceSessionLimit = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var sessions, sessionsToRemove;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userSession.findMany({
                                where: { userId: userId },
                                orderBy: { lastUsedAt: 'asc' },
                            })];
                        case 1:
                            sessions = _a.sent();
                            if (!(sessions.length >= utils_1.SESSION.MAX_CONCURRENT_DEVICES)) return [3 /*break*/, 3];
                            sessionsToRemove = sessions.slice(0, sessions.length - utils_1.SESSION.MAX_CONCURRENT_DEVICES + 1);
                            return [4 /*yield*/, this.prisma.userSession.deleteMany({
                                    where: { id: { in: sessionsToRemove.map(function (s) { return s.id; }) } },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.debug("Removed ".concat(sessionsToRemove.length, " old sessions for user ").concat(userId), 'SessionService');
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SessionService_1.prototype.getActiveSessions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.userSession.findMany({
                            where: {
                                userId: userId,
                                expiresAt: { gt: new Date() },
                            },
                            select: {
                                id: true,
                                deviceInfo: true,
                                ipAddress: true,
                                lastUsedAt: true,
                                createdAt: true,
                            },
                            orderBy: { lastUsedAt: 'desc' },
                        })];
                });
            });
        };
        SessionService_1.prototype.updateActivity = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userSession
                                .update({
                                where: { id: sessionId },
                                data: { lastUsedAt: new Date() },
                            })
                                .catch(function () {
                                // Silent fail — non-critical
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SessionService_1;
    }());
    __setFunctionName(_classThis, "SessionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SessionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SessionService = _classThis;
}();
exports.SessionService = SessionService;
// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';
// import { UAParser } from 'ua-parser-js';
// import { SESSION } from '@glow-fix/utils';
// import { Session } from '@prisma/client';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// @Injectable()
// export class SessionService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly logger: WinstonLoggerService,
//   ) {}
//   async createSession(
//     userId: string,
//     userType: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<{ id: string }> {
//     const parsed = new UAParser(userAgent);
//     const browser = parsed.getBrowser();
//     const os = parsed.getOS();
//     const device = parsed.getDevice();
//     const expiresAt = new Date(
//       Date.now() + SESSION.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000,
//     );
//     const session = await this.prisma.session.create({
//       data: {
//         userId,
//         userType,
//         refreshToken: crypto.randomBytes(64).toString('hex'),
//         deviceType: device.type || 'desktop',
//         browser: browser.name
//           ? `${browser.name} ${browser.version || ''}`.trim()
//           : null,
//         os: os.name ? `${os.name} ${os.version || ''}`.trim() : null,
//         ipAddress,
//         userAgent,
//         expiresAt,
//         lastActivityAt: new Date(), // Add this
//       },
//     });
//     return { id: session.id }; // ← Make sure this returns the ID
//   }
//   async invalidateSession(sessionId: string): Promise<void> {
//     try {
//       await this.prisma.session.delete({
//         where: { id: sessionId },
//       });
//     } catch {
//       // Session may already be deleted
//       this.logger.debug(
//         `Session ${sessionId} not found for deletion`,
//         'SessionService',
//       );
//     }
//   }
//   async invalidateAllSessions(userId: string): Promise<number> {
//     const result = await this.prisma.session.deleteMany({
//       where: { userId },
//     });
//     return result.count;
//   }
//   async enforceSessionLimit(userId: string): Promise<void> {
//     const sessions = await this.prisma.session.findMany({
//       where: { userId },
//       orderBy: { lastActivityAt: 'asc' },
//     });
//     if (sessions.length >= SESSION.MAX_CONCURRENT_DEVICES) {
//       // Remove oldest sessions to make room
//       const sessionsToRemove = sessions.slice(
//         0,
//         sessions.length - SESSION.MAX_CONCURRENT_DEVICES + 1,
//       );
//       await this.prisma.session.deleteMany({
//         where: {
//           id: { in: sessionsToRemove.map((session: Session) => session.id) },
//         },
//       });
//       this.logger.debug(
//         `Removed ${sessionsToRemove.length} old sessions for user ${userId}`,
//         'SessionService',
//       );
//     }
//   }
//   async getActiveSessions(userId: string): Promise<
//     {
//       id: string;
//       deviceType: string | null;
//       browser: string | null;
//       os: string | null;
//       ipAddress: string | null;
//       lastActivityAt: Date;
//       createdAt: Date;
//     }[]
//   > {
//     return this.prisma.session.findMany({
//       where: {
//         userId,
//         expiresAt: { gt: new Date() },
//       },
//       select: {
//         id: true,
//         deviceType: true,
//         browser: true,
//         os: true,
//         ipAddress: true,
//         lastActivityAt: true,
//         createdAt: true,
//       },
//       orderBy: { lastActivityAt: 'desc' },
//     });
//   }
//   async updateActivity(sessionId: string): Promise<void> {
//     await this.prisma.session
//       .update({
//         where: { id: sessionId },
//         data: { lastActivityAt: new Date() },
//       })
//       .catch(() => {
//         // Silent fail — non-critical operation
//       });
//   }
// }
