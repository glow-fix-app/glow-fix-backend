"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var types_1 = require("@glow-fix/types");
var redis_keys_1 = require("../../core/redis/redis-keys");
var otplib_1 = require("otplib");
var verify_otp_dto_1 = require("./dto/verify-otp.dto");
otplib_1.authenticator.options = { window: 1 };
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, redis, logger, tokenService, otpService, passwordService, sessionService, storage) {
            this.prisma = prisma;
            this.redis = redis;
            this.logger = logger;
            this.tokenService = tokenService;
            this.otpService = otpService;
            this.passwordService = passwordService;
            this.sessionService = sessionService;
            this.storage = storage;
        }
        // ─── Registration ───
        // ── Shared pre-registration checks ──────────────────────────────────────────
        AuthService_1.prototype.assertUniqueEmailAndPhone = function (email, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var existingEmail, existingPhone;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: email.toLowerCase() },
                            })];
                        case 1:
                            existingEmail = _a.sent();
                            if (existingEmail) {
                                throw new common_1.ConflictException('An account with this email already exists');
                            }
                            if (!phone) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { phone: phone },
                                })];
                        case 2:
                            existingPhone = _a.sent();
                            if (existingPhone) {
                                throw new common_1.ConflictException('An account with this phone number already exists');
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ── Shared post-creation steps (auth provider + OTP) ────────────────────────
        AuthService_1.prototype.finaliseRegistration = function (userId, email, phone) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.userAuthProvider.create({
                                data: { userId: userId, provider: 'EMAIL', email: email },
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.otpService.sendOtpToEmail(userId, email, verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION)];
                        case 2:
                            _a.sent();
                            if (!phone) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.otpService.sendOtpToPhone(userId, phone, verify_otp_dto_1.OtpPurpose.PHONE_VERIFICATION)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, {
                                message: phone
                                    ? 'Registration successful. Verification codes have been sent to your email and phone.'
                                    : 'Registration successful. A verification code has been sent to your email.',
                                requiresOtp: true,
                            }];
                    }
                });
            });
        };
        // ── CLIENT registration (public) ─────────────────────────────────────────────
        AuthService_1.prototype.registerClient = function (dto, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var passwordHash, user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.assertUniqueEmailAndPhone(dto.email, dto.phone)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.passwordService.hash(dto.password)];
                        case 2:
                            passwordHash = _b.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        role: 'CLIENT',
                                        fullName: dto.fullName,
                                        email: dto.email.toLowerCase(),
                                        phone: (_a = dto.phone) !== null && _a !== void 0 ? _a : null,
                                        passwordHash: passwordHash,
                                        emailVerified: false,
                                        phoneVerified: false,
                                    },
                                })];
                        case 3:
                            user = _b.sent();
                            // CLIENT role → create Client profile row (location starts as NULL — user must set it)
                            return [4 /*yield*/, this.prisma.client.create({ data: { userId: user.id } })];
                        case 4:
                            // CLIENT role → create Client profile row (location starts as NULL — user must set it)
                            _b.sent();
                            this.logger.log('Client registered', 'AuthService', {
                                userId: user.id,
                                email: user.email,
                                ipAddress: ipAddress,
                            });
                            return [2 /*return*/, this.finaliseRegistration(user.id, user.email, dto.phone)];
                    }
                });
            });
        };
        // ── MANAGER registration (public — business details and docs created transactionally) ────
        AuthService_1.prototype.registerManager = function (dto, files, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var passwordHash, user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertUniqueEmailAndPhone(dto.email, dto.phone)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.passwordService.hash(dto.password)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var u, businesses, businessId, pendingStatus;
                                    var _a, _b, _c, _d, _e, _f;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0: return [4 /*yield*/, tx.user.create({
                                                    data: {
                                                        role: 'MANAGER',
                                                        fullName: dto.fullName,
                                                        email: dto.email.toLowerCase(),
                                                        phone: (_a = dto.phone) !== null && _a !== void 0 ? _a : null,
                                                        passwordHash: passwordHash,
                                                        emailVerified: false,
                                                        phoneVerified: false,
                                                    },
                                                })];
                                            case 1:
                                                u = _g.sent();
                                                return [4 /*yield*/, tx.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)\n        VALUES (\n          gen_random_uuid(),\n          ", "::uuid,\n          ", ",\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          ", ",\n          ", ",\n          NOW(),\n          NOW()\n        )\n        RETURNING id\n      "], ["\n        INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)\n        VALUES (\n          gen_random_uuid(),\n          ", "::uuid,\n          ", ",\n          ", ",\n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          ", ",\n          ", ",\n          NOW(),\n          NOW()\n        )\n        RETURNING id\n      "])), u.id, dto.businessName, dto.address, dto.longitude, dto.latitude, dto.phone || null, dto.email.toLowerCase())];
                                            case 2:
                                                businesses = _g.sent();
                                                businessId = (_b = businesses[0]) === null || _b === void 0 ? void 0 : _b.id;
                                                if (!businessId) {
                                                    throw new Error('Failed to create business profile during registration');
                                                }
                                                return [4 /*yield*/, tx.status.findFirst({
                                                        where: { context: 'PENDING_REVIEW' },
                                                    })];
                                            case 3:
                                                pendingStatus = _g.sent();
                                                if (!!pendingStatus) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.status.create({
                                                        data: { context: 'PENDING_REVIEW' },
                                                    })];
                                            case 4:
                                                pendingStatus = _g.sent();
                                                _g.label = 5;
                                            case 5: return [4 /*yield*/, tx.businessStatus.create({
                                                    data: {
                                                        businessId: businessId,
                                                        statusId: pendingStatus.id,
                                                    },
                                                })];
                                            case 6:
                                                _g.sent();
                                                // 4. Create UserAuthProvider
                                                return [4 /*yield*/, tx.userAuthProvider.create({
                                                        data: { userId: u.id, provider: 'EMAIL', email: dto.email.toLowerCase() },
                                                    })];
                                            case 7:
                                                // 4. Create UserAuthProvider
                                                _g.sent();
                                                if (!((_c = files.businessRegistration) === null || _c === void 0 ? void 0 : _c[0])) return [3 /*break*/, 9];
                                                return [4 /*yield*/, this.uploadAndCreateDocument(tx, businessId, files.businessRegistration[0], 'BUSINESS_REGISTRATION')];
                                            case 8:
                                                _g.sent();
                                                _g.label = 9;
                                            case 9:
                                                if (!((_d = files.ownerID) === null || _d === void 0 ? void 0 : _d[0])) return [3 /*break*/, 11];
                                                return [4 /*yield*/, this.uploadAndCreateDocument(tx, businessId, files.ownerID[0], 'OWNER_ID')];
                                            case 10:
                                                _g.sent();
                                                _g.label = 11;
                                            case 11:
                                                if (!((_e = files.insuranceCertificate) === null || _e === void 0 ? void 0 : _e[0])) return [3 /*break*/, 13];
                                                return [4 /*yield*/, this.uploadAndCreateDocument(tx, businessId, files.insuranceCertificate[0], 'INSURANCE_CERTIFICATE')];
                                            case 12:
                                                _g.sent();
                                                _g.label = 13;
                                            case 13:
                                                if (!((_f = files.serviceLicense) === null || _f === void 0 ? void 0 : _f[0])) return [3 /*break*/, 15];
                                                return [4 /*yield*/, this.uploadAndCreateDocument(tx, businessId, files.serviceLicense[0], 'SERVICE_LICENSE')];
                                            case 14:
                                                _g.sent();
                                                _g.label = 15;
                                            case 15: return [2 /*return*/, u];
                                        }
                                    });
                                }); }, {
                                    timeout: 30000,
                                    maxWait: 30000,
                                })];
                        case 3:
                            user = _a.sent();
                            this.logger.log('Manager and business registered', 'AuthService', {
                                userId: user.id,
                                email: user.email,
                                ipAddress: ipAddress,
                            });
                            // 6. Send OTP *after* transaction commits successfully
                            return [4 /*yield*/, this.otpService.sendOtpToEmail(user.id, user.email, verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION)];
                        case 4:
                            // 6. Send OTP *after* transaction commits successfully
                            _a.sent();
                            if (!user.phone) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.otpService.sendOtpToPhone(user.id, user.phone, verify_otp_dto_1.OtpPurpose.PHONE_VERIFICATION)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/, {
                                message: user.phone
                                    ? 'Registration successful. Verification codes have been sent to your email and phone.'
                                    : 'Registration successful. A verification code has been sent to your email.',
                                requiresOtp: true,
                            }];
                    }
                });
            });
        };
        AuthService_1.prototype.uploadAndCreateDocument = function (tx, businessId, file, type) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, storageKey, url, pendingStatus;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.storage.uploadFile(file.buffer, "businesses/".concat(businessId, "/documents"), file.mimetype, file.originalname)];
                        case 1:
                            _a = _b.sent(), storageKey = _a.storageKey, url = _a.url;
                            return [4 /*yield*/, tx.status.findFirst({
                                    where: { context: 'PENDING' },
                                })];
                        case 2:
                            pendingStatus = _b.sent();
                            if (!!pendingStatus) return [3 /*break*/, 4];
                            return [4 /*yield*/, tx.status.create({
                                    data: { context: 'PENDING' },
                                })];
                        case 3:
                            pendingStatus = _b.sent();
                            _b.label = 4;
                        case 4: return [4 /*yield*/, tx.businessDocument.create({
                                data: {
                                    businessId: businessId,
                                    type: type,
                                    url: url,
                                    statusId: pendingStatus.id,
                                },
                            })];
                        case 5:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── ADMIN registration (protected — only existing admins can create admins) ──
        AuthService_1.prototype.registerAdmin = function (dto, actorId, // ID of the admin performing the action
        ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var actor, passwordHash, user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: actorId, isActive: true },
                                select: { role: true },
                            })];
                        case 1:
                            actor = _b.sent();
                            if (!actor || actor.role !== 'ADMIN') {
                                throw new common_1.ForbiddenException('Only admins can create admin accounts');
                            }
                            return [4 /*yield*/, this.assertUniqueEmailAndPhone(dto.email, dto.phone)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.passwordService.hash(dto.password)];
                        case 3:
                            passwordHash = _b.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        role: 'ADMIN',
                                        fullName: dto.fullName,
                                        email: dto.email.toLowerCase(),
                                        phone: (_a = dto.phone) !== null && _a !== void 0 ? _a : null,
                                        passwordHash: passwordHash,
                                        emailVerified: false,
                                        phoneVerified: false,
                                    },
                                })];
                        case 4:
                            user = _b.sent();
                            // ADMIN role → no profile table needed.
                            this.logger.log('Admin registered', 'AuthService', {
                                actorId: actorId,
                                newAdminId: user.id,
                                email: user.email,
                                ipAddress: ipAddress,
                            });
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: actorId,
                                        entityType: 'USER',
                                        entityId: user.id,
                                        action: 'CREATED',
                                        newData: { role: 'ADMIN', email: user.email },
                                        ipAddress: ipAddress,
                                        userAgent: userAgent,
                                    },
                                })];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, this.finaliseRegistration(user.id, user.email, dto.phone)];
                    }
                });
            });
        };
        // ─── OTP Verification ───
        AuthService_1.prototype.verifyOtp = function (dto, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var user, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!dto.email && !dto.phone) {
                                throw new common_1.BadRequestException('Provide either email or phone');
                            }
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: {
                                        OR: __spreadArray(__spreadArray([], (dto.email ? [{ email: dto.email.toLowerCase() }] : []), true), (dto.phone ? [{ phone: dto.phone }] : []), true),
                                        deletedAt: null,
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('User not found');
                            }
                            // Verify OTP from DB
                            return [4 /*yield*/, this.otpService.verifyOtp(user.id, dto.otp, dto.purpose)];
                        case 2:
                            // Verify OTP from DB
                            _a.sent();
                            // Mark appropriate field as verified
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: __assign(__assign({}, (dto.purpose === verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION && {
                                        emailVerified: true,
                                    })), (dto.purpose === verify_otp_dto_1.OtpPurpose.PHONE_VERIFICATION && {
                                        phoneVerified: true,
                                    })),
                                })];
                        case 3:
                            // Mark appropriate field as verified
                            _a.sent();
                            return [4 /*yield*/, this.createSession(user.id, user.role, ipAddress, userAgent)];
                        case 4:
                            tokens = _a.sent();
                            this.logger.log('OTP verified', 'AuthService', {
                                userId: user.id,
                                purpose: dto.purpose,
                            });
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: this.formatUser(user) })];
                    }
                });
            });
        };
        // ─── Resend OTP ───
        AuthService_1.prototype.resendOtp = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, existingOtp, diff;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if ((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
                                throw new common_1.BadRequestException('Provide either email or phone');
                            }
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: {
                                        OR: __spreadArray(__spreadArray([], (dto.email ? [{ email: dto.email.toLowerCase() }] : []), true), (dto.phone ? [{ phone: dto.phone }] : []), true),
                                        deletedAt: null,
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            // Generic message to avoid user enumeration
                            if (!user) {
                                return [2 /*return*/, {
                                        message: 'If an account exists, a new verification code has been sent.',
                                    }];
                            }
                            if (dto.email &&
                                user.emailVerified &&
                                dto.purpose === verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION) {
                                throw new common_1.BadRequestException('Email is already verified');
                            }
                            if (dto.phone &&
                                user.phoneVerified &&
                                dto.purpose === verify_otp_dto_1.OtpPurpose.PHONE_VERIFICATION) {
                                throw new common_1.BadRequestException('Phone number is already verified');
                            }
                            // Validate purpose
                            if (dto.email && dto.purpose === verify_otp_dto_1.OtpPurpose.PHONE_VERIFICATION) {
                                throw new common_1.BadRequestException('Invalid purpose for email');
                            }
                            if (dto.phone && dto.purpose === verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION) {
                                throw new common_1.BadRequestException('Invalid purpose for phone');
                            }
                            return [4 /*yield*/, this.prisma.userOtp.findFirst({
                                    where: {
                                        userId: user.id,
                                        purpose: dto.purpose,
                                        expiresAt: { gt: new Date() },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 2:
                            existingOtp = _a.sent();
                            if (existingOtp) {
                                diff = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
                                if (diff < 60) {
                                    throw new common_1.BadRequestException('Please wait before requesting a new OTP');
                                }
                            }
                            // Invalidate old OTPs
                            return [4 /*yield*/, this.prisma.userOtp.updateMany({
                                    where: {
                                        userId: user.id,
                                        purpose: dto.purpose,
                                        usedAt: null,
                                    },
                                    data: { usedAt: new Date() },
                                })];
                        case 3:
                            // Invalidate old OTPs
                            _a.sent();
                            if (!dto.email) return [3 /*break*/, 5];
                            if (!user.email) {
                                throw new common_1.BadRequestException('User email not found');
                            }
                            return [4 /*yield*/, this.otpService.sendOtpToEmail(user.id, user.email, dto.purpose)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            if (!user.phone) {
                                throw new common_1.BadRequestException('User phone not found');
                            }
                            return [4 /*yield*/, this.otpService.sendOtpToPhone(user.id, user.phone, dto.purpose)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, {
                                message: 'If an account exists, a new verification code has been sent.',
                            }];
                    }
                });
            });
        };
        // ─── Login ───
        AuthService_1.prototype.login = function (dto, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var anyUser, user, isPasswordValid, mfaToken, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { email: dto.identifier.toLowerCase() },
                                        { phone: dto.identifier },
                                    ],
                                },
                            })];
                        case 1:
                            anyUser = _a.sent();
                            if (!anyUser) return [3 /*break*/, 5];
                            if (!(anyUser.deletedAt !== null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.checkLoginRateLimit(ipAddress)];
                        case 2:
                            _a.sent();
                            throw new common_1.UnauthorizedException('This account has been deleted. If you believe this is a mistake, please contact support.');
                        case 3:
                            if (!!anyUser.isActive) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.checkLoginRateLimit(ipAddress)];
                        case 4:
                            _a.sent();
                            throw new common_1.UnauthorizedException('This account has been deactivated. Please contact support to restore access.');
                        case 5: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { email: dto.identifier.toLowerCase() },
                                        { phone: dto.identifier },
                                    ],
                                    deletedAt: null,
                                    isActive: true,
                                },
                            })];
                        case 6:
                            user = _a.sent();
                            if (!(!user || !user.passwordHash)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.checkLoginRateLimit(ipAddress)];
                        case 7:
                            _a.sent();
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        case 8: return [4 /*yield*/, this.checkLoginRateLimit(ipAddress)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, this.passwordService.compare(dto.password, user.passwordHash)];
                        case 10:
                            isPasswordValid = _a.sent();
                            if (!!isPasswordValid) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.recordFailedLogin(user.id, ipAddress, userAgent)];
                        case 11:
                            _a.sent();
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        case 12:
                            // Email verification gate — after password check (avoids account enumeration),
                            // before session creation (unverified users never get tokens).
                            if (!user.emailVerified) {
                                // Re-send a fresh OTP; fire-and-forget so mail failures don't block the response.
                                this.otpService
                                    .sendOtpToEmail(user.id, user.email, verify_otp_dto_1.OtpPurpose.EMAIL_VERIFICATION)
                                    .catch(function () { });
                                throw new common_1.ForbiddenException('Please verify your email before logging in. A new verification code has been sent to your email address.');
                            }
                            if (!user.twoFactorEnabled) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.tokenService.generateMfaToken(user.id)];
                        case 13:
                            mfaToken = _a.sent();
                            return [2 /*return*/, {
                                    accessToken: mfaToken,
                                    refreshToken: '',
                                    expiresIn: 300,
                                    user: { id: user.id },
                                    requiresMfa: true,
                                }];
                        case 14: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: user.id },
                                data: { updatedAt: new Date() },
                            })];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, this.createSession(user.id, user.role, ipAddress, userAgent)];
                        case 16:
                            tokens = _a.sent();
                            return [4 /*yield*/, this.redis.del(redis_keys_1.RedisKeys.loginAttempts(ipAddress))];
                        case 17:
                            _a.sent();
                            this.logger.log('User logged in', 'AuthService', {
                                userId: user.id,
                                ipAddress: ipAddress,
                            });
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: this.formatUser(user) })];
                    }
                });
            });
        };
        // ─── MFA Login Completion ───
        AuthService_1.prototype.verifyMfaLogin = function (mfaToken, code, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, _a, user, isValid, tokens;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.tokenService.verifyMfaToken(mfaToken)];
                        case 1:
                            payload = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            throw new common_1.UnauthorizedException('MFA token is invalid or expired');
                        case 3: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: payload.sub, deletedAt: null },
                            })];
                        case 4:
                            user = _b.sent();
                            if (!(user === null || user === void 0 ? void 0 : user.twoFactorEnabled) || !(user === null || user === void 0 ? void 0 : user.twoFactorSecret)) {
                                throw new common_1.BadRequestException('MFA is not enabled for this account');
                            }
                            // Defensive: MFA token was issued before the email gate existed;
                            // guard here too so a pre-existing token cannot bypass verification.
                            if (!user.emailVerified) {
                                throw new common_1.ForbiddenException('Please verify your email before logging in.');
                            }
                            isValid = otplib_1.authenticator.verify({
                                token: code,
                                secret: user.twoFactorSecret,
                            });
                            if (!isValid) {
                                throw new common_1.UnauthorizedException('Invalid MFA code');
                            }
                            return [4 /*yield*/, this.createSession(user.id, user.role, ipAddress, userAgent)];
                        case 5:
                            tokens = _b.sent();
                            this.logger.log('MFA login completed', 'AuthService', { userId: user.id });
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: this.formatUser(user) })];
                    }
                });
            });
        };
        // ─── Refresh Tokens ───
        AuthService_1.prototype.refreshTokens = function (refreshToken, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var session, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.findByTokenHash(refreshToken)];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.UnauthorizedException('Invalid refresh token');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: session.userId, deletedAt: null, isActive: true },
                                })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('User not found or inactive');
                            }
                            // Invalidate old session
                            return [4 /*yield*/, this.sessionService.invalidateByTokenHash(refreshToken)];
                        case 3:
                            // Invalidate old session
                            _a.sent();
                            // Create new session
                            return [2 /*return*/, this.createSession(user.id, user.role, ipAddress, userAgent)];
                    }
                });
            });
        };
        // ─── Logout ───
        AuthService_1.prototype.logout = function (userId, sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.invalidateSession(sessionId)];
                        case 1:
                            _a.sent();
                            this.logger.log('User logged out', 'AuthService', { userId: userId, sessionId: sessionId });
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.logoutAllSessions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var count, key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.invalidateAllSessions(userId)];
                        case 1:
                            count = _a.sent();
                            key = redis_keys_1.RedisKeys.userLogoutTimestamp(userId);
                            return [4 /*yield*/, this.redis.set(key, Date.now().toString(), 7 * 24 * 60 * 60)];
                        case 2:
                            _a.sent(); // 7d = max token lifetime
                            this.logger.log('All sessions revoked', 'AuthService', { userId: userId, count: count });
                            return [2 /*return*/, { sessionsRevoked: count }];
                    }
                });
            });
        };
        AuthService_1.prototype.forgotPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { email: (_a = dto.identifier) === null || _a === void 0 ? void 0 : _a.toLowerCase() },
                                        { phone: dto.identifier },
                                    ],
                                    deletedAt: null,
                                },
                            })];
                        case 1:
                            user = _b.sent();
                            // Always return same message (security)
                            if (!user) {
                                return [2 /*return*/, {
                                        message: 'If an account exists, a password reset code has been sent.',
                                    }];
                            }
                            if (!user.email) {
                                throw new common_1.BadRequestException('User email not found');
                            }
                            return [4 /*yield*/, this.otpService.sendOtpToEmail(user.id, user.email, verify_otp_dto_1.OtpPurpose.PASSWORD_RESET)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    message: 'A password reset code has been sent to your email.',
                                }];
                    }
                });
            });
        };
        // ─── Verify Reset OTP (Step 1: OTP → resetToken) ───
        AuthService_1.prototype.verifyResetOtp = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, resetToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: { email: dto.email.toLowerCase(), deletedAt: null },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Invalid OTP or email');
                            }
                            // Verify OTP but DO NOT consume it yet — resetPassword will consume it
                            return [4 /*yield*/, this.otpService.verifyOtp(user.id, dto.otp, verify_otp_dto_1.OtpPurpose.PASSWORD_RESET, false)];
                        case 2:
                            // Verify OTP but DO NOT consume it yet — resetPassword will consume it
                            _a.sent();
                            return [4 /*yield*/, this.tokenService.generateResetToken(user.id, user.email)];
                        case 3:
                            resetToken = _a.sent();
                            this.logger.log('Reset OTP verified, token issued', 'AuthService', {
                                userId: user.id,
                            });
                            return [2 /*return*/, { resetToken: resetToken }];
                    }
                });
            });
        };
        // ─── Reset Password (Step 2: resetToken + newPassword) ───
        AuthService_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenPayload, user, otpRecord, isSame, isReused, newPasswordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                tokenPayload = this.tokenService.verifyResetToken(dto.resetToken);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Reset link has expired. Please request a new password reset.');
                            }
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { id: tokenPayload.sub, deletedAt: null },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('User not found');
                            }
                            // confirm password check
                            if (dto.newPassword !== dto.confirmPassword) {
                                throw new common_1.BadRequestException('Passwords do not match');
                            }
                            return [4 /*yield*/, this.prisma.userOtp.findFirst({
                                    where: {
                                        userId: user.id,
                                        purpose: verify_otp_dto_1.OtpPurpose.PASSWORD_RESET,
                                        usedAt: null,
                                        expiresAt: { gt: new Date() },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 2:
                            otpRecord = _a.sent();
                            if (!otpRecord) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.userOtp.update({
                                    where: { id: otpRecord.id },
                                    data: { usedAt: new Date() },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!user.passwordHash) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.passwordService.compare(dto.newPassword, user.passwordHash)];
                        case 5:
                            isSame = _a.sent();
                            if (isSame) {
                                throw new common_1.BadRequestException('New password must be different');
                            }
                            _a.label = 6;
                        case 6: return [4 /*yield*/, this.passwordService.isPasswordReused(dto.newPassword, user.id)];
                        case 7:
                            isReused = _a.sent();
                            if (isReused) {
                                throw new common_1.BadRequestException('You cannot reuse an old password');
                            }
                            return [4 /*yield*/, this.passwordService.hash(dto.newPassword)];
                        case 8:
                            newPasswordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { passwordHash: newPasswordHash },
                                })];
                        case 9:
                            _a.sent();
                            // store in history
                            return [4 /*yield*/, this.passwordService.addToHistory(user.id, newPasswordHash)];
                        case 10:
                            // store in history
                            _a.sent();
                            // invalidate sessions
                            return [4 /*yield*/, this.sessionService.invalidateAllSessions(user.id)];
                        case 11:
                            // invalidate sessions
                            _a.sent();
                            return [2 /*return*/, { message: 'Password reset successfully. Please log in again.' }];
                    }
                });
            });
        };
        AuthService_1.prototype.changePassword = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isCurrentPasswordValid, isSamePassword, isReused, newPasswordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId, deletedAt: null },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            // confirm password check
                            if (dto.newPassword !== dto.confirmPassword) {
                                throw new common_1.BadRequestException('Passwords do not match');
                            }
                            if (!user.passwordHash) return [3 /*break*/, 4];
                            if (!dto.currentPassword) {
                                throw new common_1.BadRequestException('Current password is required');
                            }
                            return [4 /*yield*/, this.passwordService.compare(dto.currentPassword, user.passwordHash)];
                        case 2:
                            isCurrentPasswordValid = _a.sent();
                            if (!isCurrentPasswordValid) {
                                throw new common_1.UnauthorizedException('Current password is incorrect');
                            }
                            return [4 /*yield*/, this.passwordService.compare(dto.newPassword, user.passwordHash)];
                        case 3:
                            isSamePassword = _a.sent();
                            if (isSamePassword) {
                                throw new common_1.BadRequestException('New password must be different from your current password');
                            }
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.passwordService.isPasswordReused(dto.newPassword, userId)];
                        case 5:
                            isReused = _a.sent();
                            if (isReused) {
                                throw new common_1.BadRequestException('You cannot reuse an old password');
                            }
                            return [4 /*yield*/, this.passwordService.hash(dto.newPassword)];
                        case 6:
                            newPasswordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { passwordHash: newPasswordHash },
                                })];
                        case 7:
                            _a.sent();
                            // store in history
                            return [4 /*yield*/, this.passwordService.addToHistory(userId, newPasswordHash)];
                        case 8:
                            // store in history
                            _a.sent();
                            return [4 /*yield*/, this.sessionService.invalidateAllSessions(userId)];
                        case 9:
                            _a.sent();
                            this.logger.log('Password changed', 'AuthService', { userId: userId });
                            return [2 /*return*/, { message: 'Password changed successfully. Please log in again.' }];
                    }
                });
            });
        };
        // // ─── Forgot Password ───
        // async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
        //   const user = await this.prisma.user.findFirst({
        //     where: {
        //       OR: [
        //         { email: dto.identifier?.toLowerCase() },
        //         { phone: dto.identifier },
        //       ],
        //       deletedAt: null,
        //     },
        //   });
        //   if (!user) {
        //     return {
        //       message: 'If an account exists, a password reset code has been sent.',
        //     };
        //   }
        //   if (!user.email) {
        //     throw new BadRequestException('User email not found');
        //   }
        //   await this.otpService.sendOtpToEmail(
        //     user.id,
        //     user.email,
        //     OtpPurpose.PASSWORD_RESET,
        //   );
        //   return { message: 'A password reset code has been sent to your email.' };
        // }
        // // ─── Reset Password ───
        // async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        //   const isEmail = dto.identifier.includes('@');
        //   const user = await this.prisma.user.findFirst({
        //     where: {
        //       ...(isEmail
        //         ? { email: dto.identifier.toLowerCase() }
        //         : { phone: dto.identifier }),
        //       deletedAt: null,
        //     },
        //   });
        //   if (!user) {
        //     throw new BadRequestException('Invalid OTP or identifier');
        //   }
        //   let isSamePassword = false;
        //   if (user.passwordHash) {
        //     isSamePassword = await this.passwordService.compare(
        //       dto.newPassword,
        //       user.passwordHash,
        //     );
        //   }
        //   if (isSamePassword) {
        //     throw new BadRequestException('New password must be different');
        //   }
        //   await this.prisma.$transaction(async (tx) => {
        //     await this.otpService.verifyOtp(
        //       user.id,
        //       dto.otp,
        //       OtpPurpose.PASSWORD_RESET,
        //     );
        //     const newPasswordHash = await this.passwordService.hash(dto.newPassword);
        //     await tx.user.update({
        //       where: { id: user.id },
        //       data: { passwordHash: newPasswordHash },
        //     });
        //     await this.sessionService.invalidateAllSessions(user.id);
        //   });
        //   return { message: 'Password reset successfully. Please log in again.' };
        // }
        // async changePassword(
        //   userId: string,
        //   dto: ChangePasswordDto,
        // ): Promise<{ message: string }> {
        //   const user = await this.prisma.user.findUnique({
        //     where: { id: userId, deletedAt: null },
        //   });
        //   if (!user) {
        //     throw new NotFoundException('User not found');
        //   }
        //   const isCurrentPasswordValid = await this.passwordService.compare(
        //     dto.currentPassword,
        //     user.passwordHash!,
        //   );
        //   if (!isCurrentPasswordValid) {
        //     throw new UnauthorizedException('Current password is incorrect');
        //   }
        //   const isSamePassword = await this.passwordService.compare(
        //     dto.newPassword,
        //     user.passwordHash!,
        //   );
        //   if (isSamePassword) {
        //     throw new BadRequestException(
        //       'New password must be different from your current password',
        //     );
        //   }
        //   const newPasswordHash = await this.passwordService.hash(dto.newPassword);
        //   await this.prisma.user.update({
        //     where: { id: userId },
        //     data: { passwordHash: newPasswordHash },
        //   });
        //   await this.sessionService.invalidateAllSessions(userId);
        //   this.logger.log('Password changed', 'AuthService', { userId });
        //   return { message: 'Password changed successfully. Please log in again.' };
        // }
        // ─── Google OAuth ───
        AuthService_1.prototype.handleGoogleOAuth = function (profile, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var isNewUser, existingProvider, user, existingByEmail, tokens;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            isNewUser = false;
                            return [4 /*yield*/, this.prisma.userAuthProvider.findUnique({
                                    where: {
                                        provider_providerUserId: {
                                            provider: 'GOOGLE',
                                            providerUserId: profile.providerId,
                                        },
                                    },
                                    include: { user: true },
                                })];
                        case 1:
                            existingProvider = _b.sent();
                            user = (_a = existingProvider === null || existingProvider === void 0 ? void 0 : existingProvider.user) !== null && _a !== void 0 ? _a : null;
                            if (!!user) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { email: profile.email.toLowerCase() },
                                })];
                        case 2:
                            existingByEmail = _b.sent();
                            if (!existingByEmail) return [3 /*break*/, 4];
                            user = existingByEmail;
                            return [4 /*yield*/, this.prisma.userAuthProvider.create({
                                    data: {
                                        userId: user.id,
                                        provider: 'GOOGLE',
                                        providerUserId: profile.providerId,
                                        email: profile.email.toLowerCase(),
                                    },
                                })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 4: return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    role: 'CLIENT',
                                    fullName: profile.name,
                                    email: profile.email.toLowerCase(),
                                    emailVerified: true,
                                },
                            })];
                        case 5:
                            user = _b.sent();
                            return [4 /*yield*/, this.prisma.client.create({ data: { userId: user.id } })];
                        case 6:
                            _b.sent();
                            if (!profile.profilePhoto) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.image.create({
                                    data: {
                                        url: profile.profilePhoto,
                                        entityType: 'USER_AVATAR',
                                        entityId: user.id,
                                    },
                                })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8: return [4 /*yield*/, this.prisma.userAuthProvider.create({
                                data: {
                                    userId: user.id,
                                    provider: 'GOOGLE',
                                    providerUserId: profile.providerId,
                                    email: profile.email.toLowerCase(),
                                    // isPrimary: true,
                                },
                            })];
                        case 9:
                            _b.sent();
                            isNewUser = true;
                            _b.label = 10;
                        case 10: return [4 /*yield*/, this.createSession(user.id, user.role, ipAddress, userAgent)];
                        case 11:
                            tokens = _b.sent();
                            this.logger.log('Google OAuth login', 'AuthService', {
                                userId: user.id,
                                isNewUser: isNewUser,
                            });
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: this.formatUser(user), isNewUser: isNewUser })];
                    }
                });
            });
        };
        // ─── Private Helpers ───
        // Replace the private createSession() method in auth.service.ts with this:
        AuthService_1.prototype.createSession = function (userId, role, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var refreshToken, session, payload, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.enforceSessionLimit(userId)];
                        case 1:
                            _a.sent();
                            refreshToken = this.generateRefreshToken();
                            return [4 /*yield*/, this.sessionService.createSession(userId, refreshToken, ipAddress, userAgent)];
                        case 2:
                            session = _a.sent();
                            payload = {
                                sub: userId,
                                role: role,
                                permissions: this.getPermissionsForRole(role),
                                sessionId: session.id, // ← correct session ID, single write
                                deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
                            };
                            return [4 /*yield*/, this.tokenService.generateTokenPair(payload)];
                        case 3:
                            tokens = _a.sent();
                            // generateTokenPair generates its own refreshToken internally — override it
                            // with the one we already stored in DB
                            return [2 /*return*/, {
                                    accessToken: tokens.accessToken,
                                    refreshToken: refreshToken, // ← the one hashed and stored in DB
                                    expiresIn: tokens.expiresIn,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.generateRefreshToken = function () {
            var crypto = require('crypto');
            return crypto.randomBytes(64).toString('hex');
        };
        // private async createSession(
        //   userId: string,
        //   role: UserRole,
        //   ipAddress: string,
        //   userAgent: string,
        // ): Promise<JwtTokenPair> {
        //   await this.sessionService.enforceSessionLimit(userId);
        //   // Generate token pair first so we have the refreshToken to hash
        //   const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
        //     sub: userId,
        //     role,
        //     permissions: this.getPermissionsForRole(role),
        //     sessionId: '', // will be filled below
        //     deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
        //   };
        //   const tokens = await this.tokenService.generateTokenPair(payload);
        //   // Store hashed refresh token in DB
        //   const session = await this.sessionService.createSession(
        //     userId,
        //     tokens.refreshToken,
        //     ipAddress,
        //     userAgent,
        //   );
        //   // Re-sign with actual sessionId
        //   const finalPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        //     ...payload,
        //     sessionId: session.id,
        //   };
        //   const finalTokens = await this.tokenService.generateTokenPair(finalPayload);
        //   // Update session with correct token hash
        //   await this.sessionService.invalidateSession(session.id);
        //   const finalSession = await this.sessionService.createSession(
        //     userId,
        //     finalTokens.refreshToken,
        //     ipAddress,
        //     userAgent,
        //   );
        //   return finalTokens;
        // }
        AuthService_1.prototype.formatUser = function (user) {
            // avatarUrl is stored in the polymorphic `images` table (entityType = 'USER_AVATAR').
            // Fetch it separately when needed (e.g. in jwt.strategy or profile endpoint).
            return {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                role: user.role,
            };
        };
        AuthService_1.prototype.getPermissionsForRole = function (role) {
            switch (role) {
                case types_1.UserRole.CUSTOMER:
                    return [
                        types_1.Permission.MANAGE_OWN_VEHICLES,
                        types_1.Permission.CREATE_BOOKING,
                        types_1.Permission.VIEW_OWN_BOOKINGS,
                        types_1.Permission.CANCEL_OWN_BOOKING,
                        types_1.Permission.MANAGE_OWN_PROFILE,
                    ];
                case types_1.UserRole.STAFF:
                    return [
                        types_1.Permission.VIEW_ASSIGNED_BOOKINGS,
                        types_1.Permission.UPDATE_BOOKING_STATUS,
                        types_1.Permission.CREATE_DIVR,
                        types_1.Permission.UPLOAD_PHOTOS,
                        types_1.Permission.MANAGE_OWN_AVAILABILITY,
                    ];
                case types_1.UserRole.ADMIN:
                    return [types_1.Permission.MANAGE_USERS];
                default:
                    return [];
            }
        };
        AuthService_1.prototype.generateDeviceFingerprint = function (userAgent, ipAddress) {
            var crypto = require('crypto');
            return crypto
                .createHash('sha256')
                .update("".concat(userAgent, ":").concat(ipAddress))
                .digest('hex')
                .substring(0, 16);
        };
        AuthService_1.prototype.checkLoginRateLimit = function (ipAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var key, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = redis_keys_1.RedisKeys.loginAttempts(ipAddress);
                            return [4 /*yield*/, this.redis.checkRateLimit(key, 5, 60)];
                        case 1:
                            result = _a.sent();
                            if (!result.allowed) {
                                throw new common_1.ForbiddenException('Too many login attempts. Please try again in 1 minute.');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.recordFailedLogin = function (userId, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = redis_keys_1.RedisKeys.loginAttempts(ipAddress);
                            return [4 /*yield*/, this.redis.incr(key)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.redis.expire(key, 60)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: userId,
                                        entityType: 'USER',
                                        entityId: userId,
                                        action: 'LOGIN',
                                        ipAddress: ipAddress,
                                        userAgent: userAgent,
                                        newData: { reason: 'Invalid password' },
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
var templateObject_1;
// import {
//   Injectable,
//   BadRequestException,
//   UnauthorizedException,
//   ConflictException,
//   ForbiddenException,
//   NotFoundException,
// } from '@nestjs/common';
// import {
//   JwtPayload,
//   JwtTokenPair,
//   UserRole,
//   Permission,
// } from '@glow-fix/types';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { RedisService } from '../../core/redis/redis.service';
// import { RedisKeys } from '../../core/redis/redis-keys';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// import { TokenService } from './token.service';
// import { OtpService } from './otp.service';
// import { PasswordService } from './password.service';
// import { SessionService } from './session.service';
// import { authenticator } from 'otplib';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { VerifyOtpDto, OtpPurpose } from './dto/verify-otp.dto';
// import { ResendOtpDto } from './dto/resend-otp.dto';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// authenticator.options = { window: 1 };
// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly redis: RedisService,
//     private readonly logger: WinstonLoggerService,
//     private readonly tokenService: TokenService,
//     private readonly otpService: OtpService,
//     private readonly passwordService: PasswordService,
//     private readonly sessionService: SessionService,
//   ) {}
//   // ─── Registration ───
//   async register(
//     dto: RegisterDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<{ message: string; requiresOtp: boolean }> {
//     // Check email uniqueness
//     const existingEmail = await this.prisma.user.findUnique({
//       where: { email: dto.email.toLowerCase() },
//     });
//     if (existingEmail) {
//       throw new ConflictException('An account with this email already exists');
//     }
//     // Check phone uniqueness if provided
//     if (dto.phone) {
//       const existingPhone = await this.prisma.user.findUnique({
//         where: { phone: dto.phone },
//       });
//       if (existingPhone) {
//         throw new ConflictException(
//           'An account with this phone number already exists',
//         );
//       }
//     }
//     const passwordHash = await this.passwordService.hash(dto.password);
//     // Create user with CLIENT role
//     const user = await this.prisma.user.create({
//       data: {
//         role: 'CLIENT',
//         fullName: dto.fullName,
//         email: dto.email.toLowerCase(),
//         phone: dto.phone || null,
//         passwordHash,
//         emailVerified: false,
//         phoneVerified: false,
//       },
//     });
//     // Create Client profile
//     await this.prisma.client.create({
//       data: { userId: user.id },
//     });
//     // Link email auth provider
//     await this.prisma.userAuthProvider.create({
//       data: {
//         userId: user.id,
//         provider: 'EMAIL',
//         email: user.email,
//         // isPrimary: true,
//       },
//     });
//     // Send email OTP for verification
//     await this.otpService.sendOtpToEmail(
//       user.id,
//       user.email,
//       OtpPurpose.EMAIL_VERIFICATION,
//     );
//     // Optionally send phone OTP if phone provided
//     if (dto.phone) {
//       await this.otpService.sendOtpToPhone(
//         user.id,
//         dto.phone,
//         OtpPurpose.PHONE_VERIFICATION,
//       );
//     }
//     this.logger.log('User registered', 'AuthService', {
//       userId: user.id,
//       email: user.email,
//       ipAddress,
//     });
//     return {
//       message: dto.phone
//         ? 'Registration successful. Verification codes have been sent to your email and phone.'
//         : 'Registration successful. A verification code has been sent to your email.',
//       requiresOtp: true,
//     };
//   }
//   // ─── OTP Verification ───
//   async verifyOtp(
//     dto: VerifyOtpDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
//     if (!dto.email && !dto.phone) {
//       throw new BadRequestException('Provide either email or phone');
//     }
//     // 1. Find user
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//           ...(dto.phone ? [{ phone: dto.phone }] : []),
//         ],
//         deletedAt: null,
//       },
//     });
//     if (!user) {
//       throw new BadRequestException('User not found');
//     }
//     // Prevent re-verification
//     if (dto.purpose === OtpPurpose.EMAIL_VERIFICATION && user.emailVerified) {
//       throw new BadRequestException('Email is already verified');
//     }
//     // 2. Verify OTP
//     await this.otpService.verifyOtp(user.id, dto.otp, dto.purpose);
//     // 3. Update user and GET UPDATED RECORD
//     const updatedUser = await this.prisma.user.update({
//       where: { id: user.id },
//       data: {
//         ...(dto.purpose === OtpPurpose.EMAIL_VERIFICATION && {
//           emailVerified: true,
//           emailVerifiedAt: new Date(), // optional
//         }),
//         ...(dto.purpose === OtpPurpose.PHONE_VERIFICATION && {
//           phoneVerified: true,
//         }),
//       },
//     });
//     // 4. Create session
//     const tokens = await this.createSession(
//       updatedUser.id,
//       updatedUser.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//     this.logger.log('OTP verified', 'AuthService', {
//       userId: updatedUser.id,
//       purpose: dto.purpose,
//     });
//     // 5. RETURN UPDATED USER
//     return {
//       ...tokens,
//       user: this.formatUser(updatedUser),
//     };
//   }
//   // ─── Resend OTP ───
//   async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
//     if ((dto.email && dto.phone) || (!dto.email && !dto.phone)) {
//       throw new BadRequestException('Provide either email or phone');
//     }
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//           ...(dto.phone ? [{ phone: dto.phone }] : []),
//         ],
//         deletedAt: null,
//       },
//     });
//     // Generic message to avoid user enumeration
//     if (!user) {
//       return {
//         message: 'If an account exists, a new verification code has been sent.',
//       };
//     }
//     if (
//       dto.email &&
//       user.emailVerified &&
//       dto.purpose === OtpPurpose.EMAIL_VERIFICATION
//     ) {
//       throw new BadRequestException('Email is already verified');
//     }
//     if (
//       dto.phone &&
//       user.phoneVerified &&
//       dto.purpose === OtpPurpose.PHONE_VERIFICATION
//     ) {
//       throw new BadRequestException('Phone number is already verified');
//     }
//     // Validate purpose
//     if (dto.email && dto.purpose === OtpPurpose.PHONE_VERIFICATION) {
//       throw new BadRequestException('Invalid purpose for email');
//     }
//     if (dto.phone && dto.purpose === OtpPurpose.EMAIL_VERIFICATION) {
//       throw new BadRequestException('Invalid purpose for phone');
//     }
//     // Cooldown check
//     const existingOtp = await this.prisma.userOtp.findFirst({
//       where: {
//         userId: user.id,
//         purpose: dto.purpose,
//         expiresAt: { gt: new Date() },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//     if (existingOtp) {
//       const diff = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
//       if (diff < 60) {
//         throw new BadRequestException(
//           'Please wait before requesting a new OTP',
//         );
//       }
//     }
//     // Invalidate old OTPs
//     await this.prisma.userOtp.updateMany({
//       where: {
//         userId: user.id,
//         purpose: dto.purpose,
//         usedAt: null,
//       },
//       data: { usedAt: new Date() },
//     });
//     // Send OTP
//     if (dto.email) {
//       if (!user.email) {
//         throw new BadRequestException('User email not found');
//       }
//       await this.otpService.sendOtpToEmail(user.id, user.email, dto.purpose);
//     } else {
//       if (!user.phone) {
//         throw new BadRequestException('User phone not found');
//       }
//       await this.otpService.sendOtpToPhone(user.id, user.phone, dto.purpose);
//     }
//     return {
//       message: 'If an account exists, a new verification code has been sent.',
//     };
//   }
//   // async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
//   //   if (!dto.email && !dto.phone) {
//   //     throw new BadRequestException('Provide either email or phone');
//   //   }
//   //   const user = await this.prisma.user.findFirst({
//   //     where: {
//   //       OR: [
//   //         ...(dto.email ? [{ email: dto.email.toLowerCase() }] : []),
//   //         ...(dto.phone ? [{ phone: dto.phone }] : []),
//   //       ],
//   //       deletedAt: null,
//   //     },
//   //   });
//   //   // Generic message to avoid user enumeration
//   //   if (!user) {
//   //     return { message: 'If an account exists, a new verification code has been sent.' };
//   //   }
//   //   if (dto.email) {
//   //     if (user.emailVerified && dto.purpose === OtpPurpose.EMAIL_VERIFICATION) {
//   //       throw new BadRequestException('Email is already verified');
//   //     }
//   //     await this.otpService.sendOtpToEmail(user.id, dto.email.toLowerCase(), dto.purpose);
//   //   }
//   //   if (dto.phone) {
//   //     if (user.phoneVerified && dto.purpose === OtpPurpose.PHONE_VERIFICATION) {
//   //       throw new BadRequestException('Phone number is already verified');
//   //     }
//   //     await this.otpService.sendOtpToPhone(user.id, dto.phone, dto.purpose);
//   //   }
//   //   return { message: 'A new verification code has been sent.' };
//   // }
//   // ─── Login ───
//   async login(
//     dto: LoginDto,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<
//     JwtTokenPair & { user: Record<string, unknown>; requiresMfa?: boolean }
//   > {
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: dto.identifier.toLowerCase() },
//           { phone: dto.identifier },
//         ],
//         deletedAt: null,
//         isActive: true,
//       },
//     });
//     if (!user || !user.passwordHash) {
//       await this.checkLoginRateLimit(ipAddress);
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     await this.checkLoginRateLimit(ipAddress);
//     const isPasswordValid = await this.passwordService.compare(
//       dto.password,
//       user.passwordHash,
//     );
//     if (!isPasswordValid) {
//       await this.recordFailedLogin(user.id, ipAddress, userAgent);
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     // MFA check
//     if (user.twoFactorEnabled) {
//       const mfaToken = await this.tokenService.generateMfaToken(user.id);
//       return {
//         accessToken: mfaToken,
//         refreshToken: '',
//         expiresIn: 300,
//         user: { id: user.id },
//         requiresMfa: true,
//       };
//     }
//     await this.prisma.user.update({
//       where: { id: user.id },
//       data: { updatedAt: new Date() },
//     });
//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//     await this.redis.del(RedisKeys.loginAttempts(ipAddress));
//     this.logger.log('User logged in', 'AuthService', {
//       userId: user.id,
//       ipAddress,
//     });
//     return { ...tokens, user: this.formatUser(user) };
//   }
//   // ─── MFA Login Completion ───
//   async verifyMfaLogin(
//     mfaToken: string,
//     code: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair & { user: Record<string, unknown> }> {
//     let payload: JwtPayload;
//     try {
//       payload = await this.tokenService.verifyMfaToken(mfaToken);
//     } catch {
//       throw new UnauthorizedException('MFA token is invalid or expired');
//     }
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub, deletedAt: null },
//     });
//     if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
//       throw new BadRequestException('MFA is not enabled for this account');
//     }
//     const isValid = authenticator.verify({
//       token: code,
//       secret: user.twoFactorSecret,
//     });
//     if (!isValid) {
//       throw new UnauthorizedException('Invalid MFA code');
//     }
//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//     this.logger.log('MFA login completed', 'AuthService', { userId: user.id });
//     return { ...tokens, user: this.formatUser(user) };
//   }
//   // ─── Refresh Tokens ───
//   async refreshTokens(
//     refreshToken: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair> {
//     const session = await this.sessionService.findByTokenHash(refreshToken);
//     if (!session) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }
//     const user = await this.prisma.user.findUnique({
//       where: { id: session.userId, deletedAt: null, isActive: true },
//     });
//     if (!user) {
//       throw new UnauthorizedException('User not found or inactive');
//     }
//     // Invalidate old session
//     await this.sessionService.invalidateByTokenHash(refreshToken);
//     // Create new session
//     return this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//   }
//   // ─── Logout ───
//   async logout(userId: string, sessionId: string): Promise<void> {
//     await this.sessionService.invalidateSession(sessionId);
//     this.logger.log('User logged out', 'AuthService', { userId, sessionId });
//   }
//   async logoutAllSessions(
//     userId: string,
//   ): Promise<{ sessionsRevoked: number }> {
//     // 1. Delete all sessions from DB
//     const count = await this.sessionService.invalidateAllSessions(userId);
//     // 2. Store a "logged out at" timestamp in Redis
//     // Any access token issued BEFORE this timestamp will be rejected by the JWT guard
//     const key = RedisKeys.userLogoutTimestamp(userId);
//     await this.redis.set(key, Date.now().toString(), 7 * 24 * 60 * 60); // 7d = max token lifetime
//     this.logger.log('All sessions revoked', 'AuthService', { userId, count });
//     return { sessionsRevoked: count };
//   }
//   // ─── Forgot Password ───
//   async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
//     const user = await this.prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: dto.identifier?.toLowerCase() },
//           { phone: dto.identifier },
//         ],
//         deletedAt: null,
//       },
//     });
//     if (!user) {
//       return {
//         message: 'If an account exists, a password reset code has been sent.',
//       };
//     }
//     if (!user.email) {
//       throw new BadRequestException('User email not found');
//     }
//     await this.otpService.sendOtpToEmail(
//       user.id,
//       user.email,
//       OtpPurpose.PASSWORD_RESET,
//     );
//     return { message: 'A password reset code has been sent to your email.' };
//   }
//   // ─── Reset Password ───
//   async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
//     const isEmail = dto.identifier.includes('@');
//     const user = await this.prisma.user.findFirst({
//       where: {
//         ...(isEmail
//           ? { email: dto.identifier.toLowerCase() }
//           : { phone: dto.identifier }),
//         deletedAt: null,
//       },
//     });
//     if (!user) {
//       throw new BadRequestException('Invalid OTP or identifier');
//     }
//     let isSamePassword = false;
//     if (user.passwordHash) {
//       isSamePassword = await this.passwordService.compare(
//         dto.newPassword,
//         user.passwordHash,
//       );
//     }
//     if (isSamePassword) {
//       throw new BadRequestException('New password must be different');
//     }
//     await this.prisma.$transaction(async (tx) => {
//       await this.otpService.verifyOtp(
//         user.id,
//         dto.otp,
//         OtpPurpose.PASSWORD_RESET,
//       );
//       const newPasswordHash = await this.passwordService.hash(dto.newPassword);
//       await tx.user.update({
//         where: { id: user.id },
//         data: { passwordHash: newPasswordHash },
//       });
//       await this.sessionService.invalidateAllSessions(user.id);
//     });
//     return { message: 'Password reset successfully. Please log in again.' };
//   }
//   // async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
//   //   const user = await this.prisma.user.findFirst({
//   //     where: {
//   //       OR: [
//   //         { email: dto.identifier?.toLowerCase() },
//   //         { phone: dto.identifier },
//   //       ],
//   //       deletedAt: null,
//   //     },
//   //   });
//   //   if (!user) {
//   //     throw new BadRequestException('User not found');
//   //   }
//   //   await this.otpService.verifyOtp(
//   //     user.id,
//   //     dto.otp,
//   //     OtpPurpose.PASSWORD_RESET,
//   //   );
//   //   const newPasswordHash = await this.passwordService.hash(dto.newPassword);
//   //   await this.prisma.user.update({
//   //     where: { id: user.id },
//   //     data: { passwordHash: newPasswordHash },
//   //   });
//   //   // Invalidate all sessions for security
//   //   await this.sessionService.invalidateAllSessions(user.id);
//   //   this.logger.log('Password reset', 'AuthService', { userId: user.id });
//   //   return { message: 'Password reset successfully. Please log in again.' };
//   // }
//   // ─── Change Password ───
//   async changePassword(
//     userId: string,
//     dto: ChangePasswordDto,
//   ): Promise<{ message: string }> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId, deletedAt: null },
//     });
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
//     const isCurrentPasswordValid = await this.passwordService.compare(
//       dto.currentPassword,
//       user.passwordHash!,
//     );
//     if (!isCurrentPasswordValid) {
//       throw new UnauthorizedException('Current password is incorrect');
//     }
//     const isSamePassword = await this.passwordService.compare(
//       dto.newPassword,
//       user.passwordHash!,
//     );
//     if (isSamePassword) {
//       throw new BadRequestException(
//         'New password must be different from your current password',
//       );
//     }
//     const newPasswordHash = await this.passwordService.hash(dto.newPassword);
//     await this.prisma.user.update({
//       where: { id: userId },
//       data: { passwordHash: newPasswordHash },
//     });
//     await this.sessionService.invalidateAllSessions(userId);
//     this.logger.log('Password changed', 'AuthService', { userId });
//     return { message: 'Password changed successfully. Please log in again.' };
//   }
//   // ─── Google OAuth ───
//   async handleGoogleOAuth(
//     profile: {
//       providerId: string;
//       email: string;
//       name: string;
//       profilePhoto?: string;
//     },
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<
//     JwtTokenPair & { user: Record<string, unknown>; isNewUser: boolean }
//   > {
//     let isNewUser = false;
//     // Check if provider already linked
//     const existingProvider = await this.prisma.userAuthProvider.findUnique({
//       where: {
//         provider_providerUserId: {
//           provider: 'GOOGLE',
//           providerUserId: profile.providerId,
//         },
//       },
//       include: { user: true },
//     });
//     let user = existingProvider?.user ?? null;
//     if (!user) {
//       // Check by email
//       const existingByEmail = await this.prisma.user.findUnique({
//         where: { email: profile.email.toLowerCase() },
//       });
//       if (existingByEmail) {
//         user = existingByEmail;
//         await this.prisma.userAuthProvider.create({
//           data: {
//             userId: user.id,
//             provider: 'GOOGLE',
//             providerUserId: profile.providerId,
//             email: profile.email.toLowerCase(),
//           },
//         });
//       } else {
//         user = await this.prisma.user.create({
//           data: {
//             role: 'CLIENT',
//             fullName: profile.name,
//             email: profile.email.toLowerCase(),
//             emailVerified: true,
//           },
//         });
//         await this.prisma.client.create({ data: { userId: user.id } });
//         // Store the Google profile photo in the polymorphic Image table
//         if (profile.profilePhoto) {
//           await this.prisma.image.create({
//             data: {
//               url: profile.profilePhoto,
//               entityType: 'USER_AVATAR',
//               entityId: user.id,
//             },
//           });
//         }
//         await this.prisma.userAuthProvider.create({
//           data: {
//             userId: user.id,
//             provider: 'GOOGLE',
//             providerUserId: profile.providerId,
//             email: profile.email.toLowerCase(),
//             // isPrimary: true,
//           },
//         });
//         isNewUser = true;
//       }
//     }
//     const tokens = await this.createSession(
//       user.id,
//       user.role as unknown as UserRole,
//       ipAddress,
//       userAgent,
//     );
//     this.logger.log('Google OAuth login', 'AuthService', {
//       userId: user.id,
//       isNewUser,
//     });
//     return { ...tokens, user: this.formatUser(user), isNewUser };
//   }
//   // ─── Private Helpers ───
//   // Replace the private createSession() method in auth.service.ts with this:
//   private async createSession(
//     userId: string,
//     role: UserRole,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<JwtTokenPair> {
//     await this.sessionService.enforceSessionLimit(userId);
//     // Generate refresh token first
//     const refreshToken = this.generateRefreshToken();
//     // Create session in DB — this gives us the sessionId
//     const session = await this.sessionService.createSession(
//       userId,
//       refreshToken,
//       ipAddress,
//       userAgent,
//     );
//     // Now build the JWT payload with the real sessionId
//     const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
//       sub: userId,
//       role,
//       permissions: this.getPermissionsForRole(role),
//       sessionId: session.id, // ← correct session ID, single write
//       deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
//     };
//     const tokens = await this.tokenService.generateTokenPair(payload);
//     // generateTokenPair generates its own refreshToken internally — override it
//     // with the one we already stored in DB
//     return {
//       accessToken: tokens.accessToken,
//       refreshToken, // ← the one hashed and stored in DB
//       expiresIn: tokens.expiresIn,
//     };
//   }
//   private generateRefreshToken(): string {
//     const crypto = require('crypto');
//     return crypto.randomBytes(64).toString('hex');
//   }
//   // private async createSession(
//   //   userId: string,
//   //   role: UserRole,
//   //   ipAddress: string,
//   //   userAgent: string,
//   // ): Promise<JwtTokenPair> {
//   //   await this.sessionService.enforceSessionLimit(userId);
//   //   // Generate token pair first so we have the refreshToken to hash
//   //   const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
//   //     sub: userId,
//   //     role,
//   //     permissions: this.getPermissionsForRole(role),
//   //     sessionId: '', // will be filled below
//   //     deviceFingerprint: this.generateDeviceFingerprint(userAgent, ipAddress),
//   //   };
//   //   const tokens = await this.tokenService.generateTokenPair(payload);
//   //   // Store hashed refresh token in DB
//   //   const session = await this.sessionService.createSession(
//   //     userId,
//   //     tokens.refreshToken,
//   //     ipAddress,
//   //     userAgent,
//   //   );
//   //   // Re-sign with actual sessionId
//   //   const finalPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
//   //     ...payload,
//   //     sessionId: session.id,
//   //   };
//   //   const finalTokens = await this.tokenService.generateTokenPair(finalPayload);
//   //   // Update session with correct token hash
//   //   await this.sessionService.invalidateSession(session.id);
//   //   const finalSession = await this.sessionService.createSession(
//   //     userId,
//   //     finalTokens.refreshToken,
//   //     ipAddress,
//   //     userAgent,
//   //   );
//   //   return finalTokens;
//   // }
//   private formatUser(user: {
//     id: string;
//     fullName: string;
//     email: string;
//     phone?: string | null;
//     emailVerified: boolean;
//     phoneVerified: boolean;
//     twoFactorEnabled: boolean;
//     role: string;
//   }): Record<string, unknown> {
//     // avatarUrl is stored in the polymorphic `images` table (entityType = 'USER_AVATAR').
//     // Callers that need the avatar should query Image separately; here we omit it
//     // to keep auth responses lean. Add an avatarUrl field to the return type and
//     // pass it in as a second argument if you need it in token responses.
//     return {
//       id: user.id,
//       fullName: user.fullName,
//       email: user.email,
//       phone: user.phone,
//       emailVerified: user.emailVerified,
//       phoneVerified: user.phoneVerified,
//       twoFactorEnabled: user.twoFactorEnabled,
//       role: user.role,
//     };
//   }
//   private getPermissionsForRole(role: UserRole): Permission[] {
//     switch (role) {
//       case UserRole.CUSTOMER:
//         return [
//           Permission.MANAGE_OWN_VEHICLES,
//           Permission.CREATE_BOOKING,
//           Permission.VIEW_OWN_BOOKINGS,
//           Permission.CANCEL_OWN_BOOKING,
//           Permission.MANAGE_OWN_PROFILE,
//         ];
//       case UserRole.STAFF:
//         return [
//           Permission.VIEW_ASSIGNED_BOOKINGS,
//           Permission.UPDATE_BOOKING_STATUS,
//           Permission.CREATE_DIVR,
//           Permission.UPLOAD_PHOTOS,
//           Permission.MANAGE_OWN_AVAILABILITY,
//         ];
//       case UserRole.ADMIN:
//         return [Permission.MANAGE_USERS];
//       default:
//         return [];
//     }
//   }
//   private generateDeviceFingerprint(
//     userAgent: string,
//     ipAddress: string,
//   ): string {
//     const crypto = require('crypto');
//     return crypto
//       .createHash('sha256')
//       .update(`${userAgent}:${ipAddress}`)
//       .digest('hex')
//       .substring(0, 16);
//   }
//   private async checkLoginRateLimit(ipAddress: string): Promise<void> {
//     const key = RedisKeys.loginAttempts(ipAddress);
//     const result = await this.redis.checkRateLimit(key, 5, 900);
//     if (!result.allowed) {
//       throw new ForbiddenException(
//         'Too many login attempts. Please try again in 15 minutes.',
//       );
//     }
//   }
//   private async recordFailedLogin(
//     userId: string,
//     ipAddress: string,
//     userAgent: string,
//   ): Promise<void> {
//     const key = RedisKeys.loginAttempts(ipAddress);
//     await this.redis.incr(key);
//     await this.redis.expire(key, 900);
//     await this.prisma.auditLog.create({
//       data: {
//         actorId: userId,
//         entityType: 'USER',
//         entityId: userId,
//         action: 'LOGIN',
//         ipAddress,
//         userAgent,
//         newData: { reason: 'Invalid password' },
//       },
//     });
//   }
// }
