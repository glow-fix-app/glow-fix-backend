"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var google_auth_guard_1 = require("./guards/google-auth.guard");
var passport_1 = require("@nestjs/passport");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth'), (0, common_1.Controller)({ path: 'auth', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _registerClient_decorators;
    var _registerManager_decorators;
    var _registerAdmin_decorators;
    var _verifyOtp_decorators;
    var _resendOtp_decorators;
    var _login_decorators;
    var _refreshToken_decorators;
    var _logout_decorators;
    var _logoutAll_decorators;
    var _forgotPassword_decorators;
    var _verifyResetOtp_decorators;
    var _resetPassword_decorators;
    var _changePassword_decorators;
    var _googleAuth_decorators;
    var _googleAuthCallback_decorators;
    var _setupMfa_decorators;
    var _verifyMfa_decorators;
    var _validateMfaLogin_decorators;
    var _disableMfa_decorators;
    var _getSessions_decorators;
    var _revokeSession_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService, mfaService, sessionService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.mfaService = mfaService;
            this.sessionService = sessionService;
        }
        // ─── Registration ───
        AuthController_1.prototype.registerClient = function (dto, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (dto.password !== dto.confirmPassword) {
                        throw new common_1.BadRequestException('Passwords do not match');
                    }
                    return [2 /*return*/, this.authService.registerClient(dto, req.ip || '', req.get('user-agent') || '')];
                });
            });
        };
        AuthController_1.prototype.registerManager = function (dto, files, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (dto.password !== dto.confirmPassword) {
                        throw new common_1.BadRequestException('Passwords do not match');
                    }
                    return [2 /*return*/, this.authService.registerManager(dto, files || {}, req.ip || '', req.get('user-agent') || '')];
                });
            });
        };
        AuthController_1.prototype.registerAdmin = function (dto, actor, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (dto.password !== dto.confirmPassword) {
                        throw new common_1.BadRequestException('Passwords do not match');
                    }
                    return [2 /*return*/, this.authService.registerAdmin(dto, actor.sub, req.ip || '', req.get('user-agent') || '')];
                });
            });
        };
        // ─── OTP Verification ───
        AuthController_1.prototype.verifyOtp = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.verifyOtp(dto, req.ip || '', req.get('user-agent') || '')];
                        case 1:
                            result = _a.sent();
                            this.setRefreshTokenCookie(res, result.refreshToken);
                            return [2 /*return*/, {
                                    accessToken: result.accessToken,
                                    refreshToken: result.refreshToken,
                                    expiresIn: result.expiresIn,
                                    user: result.user,
                                }];
                    }
                });
            });
        };
        // ─── Resend OTP ───
        AuthController_1.prototype.resendOtp = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.resendOtp(dto)];
                });
            });
        };
        // ─── Login ───
        AuthController_1.prototype.login = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.login(dto, req.ip || '', req.get('user-agent') || '')];
                        case 1:
                            result = _a.sent();
                            if (result.requiresMfa) {
                                return [2 /*return*/, { requiresMfa: true, mfaToken: result.accessToken }];
                            }
                            this.setRefreshTokenCookie(res, result.refreshToken);
                            return [2 /*return*/, {
                                    accessToken: result.accessToken,
                                    refreshToken: result.refreshToken,
                                    expiresIn: result.expiresIn,
                                    user: result.user,
                                }];
                    }
                });
            });
        };
        // ─── Refresh Token ───
        AuthController_1.prototype.refreshToken = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var refreshToken, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                            if (!refreshToken) {
                                throw new common_1.BadRequestException('Refresh token not found');
                            }
                            return [4 /*yield*/, this.authService.refreshTokens(refreshToken, req.ip || '', req.get('user-agent') || '')];
                        case 1:
                            result = _b.sent();
                            this.setRefreshTokenCookie(res, result.refreshToken);
                            return [2 /*return*/, { accessToken: result.accessToken, expiresIn: result.expiresIn }];
                    }
                });
            });
        };
        // ─── Logout ───
        AuthController_1.prototype.logout = function (user, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.logout(user.id, user.sessionId)];
                        case 1:
                            _a.sent();
                            this.clearRefreshTokenCookie(res);
                            return [2 /*return*/, { message: 'Logged out successfully' }];
                    }
                });
            });
        };
        AuthController_1.prototype.logoutAll = function (user, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.logoutAllSessions(user.id)];
                        case 1:
                            result = _a.sent();
                            this.clearRefreshTokenCookie(res);
                            return [2 /*return*/, {
                                    message: 'All sessions have been revoked',
                                    sessionsRevoked: result.sessionsRevoked,
                                }];
                    }
                });
            });
        };
        // ─── Password Management ───
        AuthController_1.prototype.forgotPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.forgotPassword(dto)];
                });
            });
        };
        AuthController_1.prototype.verifyResetOtp = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.verifyResetOtp(dto)];
                });
            });
        };
        AuthController_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (dto.newPassword !== dto.confirmPassword) {
                        throw new common_1.BadRequestException('Passwords do not match');
                    }
                    return [2 /*return*/, this.authService.resetPassword(dto)];
                });
            });
        };
        AuthController_1.prototype.changePassword = function (dto, user, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (dto.newPassword !== dto.confirmPassword) {
                                throw new common_1.BadRequestException('Passwords do not match');
                            }
                            return [4 /*yield*/, this.authService.changePassword(user.id, dto)];
                        case 1:
                            result = _a.sent();
                            this.clearRefreshTokenCookie(res);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        // ─── Google OAuth ───
        AuthController_1.prototype.googleAuth = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        AuthController_1.prototype.googleAuthCallback = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var googleUser, result, frontendUrl, params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            googleUser = req.user;
                            return [4 /*yield*/, this.authService.handleGoogleOAuth(googleUser, req.ip || '', req.get('user-agent') || '')];
                        case 1:
                            result = _a.sent();
                            this.setRefreshTokenCookie(res, result.refreshToken);
                            frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                            params = new URLSearchParams({
                                token: result.accessToken,
                                isNewUser: result.isNewUser.toString(),
                            });
                            res.redirect("".concat(frontendUrl, "/auth/callback?").concat(params.toString()));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── MFA ───
        AuthController_1.prototype.setupMfa = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('CurrentUser:', user);
                            return [4 /*yield*/, this.mfaService.setupMfa(user.id)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.verifyMfa = function (user, code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mfaService.verifyAndEnableMfa(user.id, code)];
                });
            });
        };
        AuthController_1.prototype.validateMfaLogin = function (mfaToken, code, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.verifyMfaLogin(mfaToken, code, req.ip || '', req.get('user-agent') || '')];
                        case 1:
                            result = _a.sent();
                            this.setRefreshTokenCookie(res, result.refreshToken);
                            return [2 /*return*/, {
                                    accessToken: result.accessToken,
                                    expiresIn: result.expiresIn,
                                    user: result.user,
                                }];
                    }
                });
            });
        };
        AuthController_1.prototype.disableMfa = function (user, code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.mfaService.disableMfa(user.id, code)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Two-factor authentication has been disabled' }];
                    }
                });
            });
        };
        // ─── Sessions ───
        AuthController_1.prototype.getSessions = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var sessions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.getActiveSessions(user.id)];
                        case 1:
                            sessions = _a.sent();
                            return [2 /*return*/, sessions.map(function (session) { return (__assign(__assign({}, session), { isCurrent: session.id === user.sessionId })); })];
                    }
                });
            });
        };
        AuthController_1.prototype.revokeSession = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sessionService.invalidateSession(sessionId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Session revoked successfully' }];
                    }
                });
            });
        };
        // ─── Helpers ───
        AuthController_1.prototype.setRefreshTokenCookie = function (res, refreshToken) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
        };
        AuthController_1.prototype.clearRefreshTokenCookie = function (res) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth',
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _registerClient_decorators = [(0, common_1.Post)('register/client'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Register a new client account' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Registration successful, OTP sent',
            }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or phone already exists' })];
        _registerManager_decorators = [(0, common_1.Post)('register/manager'), (0, public_decorator_1.Public)(), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'businessRegistration', maxCount: 1 },
                { name: 'ownerID', maxCount: 1 },
                { name: 'insuranceCertificate', maxCount: 1 },
                { name: 'serviceLicense', maxCount: 1 },
            ], {
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
            })), (0, swagger_1.ApiOperation)({ summary: 'Register a new manager (workshop owner) account' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Registration successful, OTP sent',
            }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or phone already exists' })];
        _registerAdmin_decorators = [(0, common_1.Post)('register/admin'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'Register a new admin account (admins only)' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin account created, OTP sent' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Caller is not an admin' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or phone already exists' })];
        _verifyOtp_decorators = [(0, common_1.Post)('verify-otp'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verify OTP for email/phone verification or password reset',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP verified successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired OTP' })];
        _resendOtp_decorators = [(0, common_1.Post)('resend-otp'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Resend OTP to email or phone' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP resent successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Already verified or cooldown active',
            })];
        _login_decorators = [(0, common_1.Post)('login'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Login with email/phone and password' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' })];
        _refreshToken_decorators = [(0, common_1.Post)('refresh-token'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token cookie' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' })];
        _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'Logout current session' })];
        _logoutAll_decorators = [(0, common_1.Post)('logout-all'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'Logout all sessions' })];
        _forgotPassword_decorators = [(0, common_1.Post)('forgot-password'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Request password reset OTP' })];
        _verifyResetOtp_decorators = [(0, common_1.Post)('verify-reset-otp'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Verify OTP for password reset — returns a short-lived reset token',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'OTP verified, reset token returned',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired OTP' })];
        _resetPassword_decorators = [(0, common_1.Post)('reset-password'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reset password using reset token' })];
        _changePassword_decorators = [(0, common_1.Post)('change-password'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _googleAuth_decorators = [(0, common_1.Get)('google'), (0, public_decorator_1.Public)(), (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard), (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth login' })];
        _googleAuthCallback_decorators = [(0, common_1.Get)('google/callback'), (0, public_decorator_1.Public)(), (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard), (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback' })];
        _setupMfa_decorators = [(0, common_1.Post)('mfa/setup'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({
                summary: 'Start MFA setup — returns QR code and backup codes',
            })];
        _verifyMfa_decorators = [(0, common_1.Post)('mfa/verify'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Verify MFA code and enable 2FA' })];
        _validateMfaLogin_decorators = [(0, common_1.Post)('mfa/validate'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Complete MFA login — exchange mfaToken + TOTP code for full tokens',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'MFA validated, full tokens returned',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Invalid or expired MFA token / wrong code',
            })];
        _disableMfa_decorators = [(0, common_1.Delete)('mfa/disable'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'Disable MFA (requires current TOTP code)' })];
        _getSessions_decorators = [(0, common_1.Get)('sessions'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'List active sessions' })];
        _revokeSession_decorators = [(0, common_1.Delete)('sessions/:sessionId'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, swagger_1.ApiOperation)({ summary: 'Revoke a specific session' })];
        __esDecorate(_classThis, null, _registerClient_decorators, { kind: "method", name: "registerClient", static: false, private: false, access: { has: function (obj) { return "registerClient" in obj; }, get: function (obj) { return obj.registerClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerManager_decorators, { kind: "method", name: "registerManager", static: false, private: false, access: { has: function (obj) { return "registerManager" in obj; }, get: function (obj) { return obj.registerManager; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerAdmin_decorators, { kind: "method", name: "registerAdmin", static: false, private: false, access: { has: function (obj) { return "registerAdmin" in obj; }, get: function (obj) { return obj.registerAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyOtp_decorators, { kind: "method", name: "verifyOtp", static: false, private: false, access: { has: function (obj) { return "verifyOtp" in obj; }, get: function (obj) { return obj.verifyOtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resendOtp_decorators, { kind: "method", name: "resendOtp", static: false, private: false, access: { has: function (obj) { return "resendOtp" in obj; }, get: function (obj) { return obj.resendOtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshToken_decorators, { kind: "method", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logoutAll_decorators, { kind: "method", name: "logoutAll", static: false, private: false, access: { has: function (obj) { return "logoutAll" in obj; }, get: function (obj) { return obj.logoutAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyResetOtp_decorators, { kind: "method", name: "verifyResetOtp", static: false, private: false, access: { has: function (obj) { return "verifyResetOtp" in obj; }, get: function (obj) { return obj.verifyResetOtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changePassword_decorators, { kind: "method", name: "changePassword", static: false, private: false, access: { has: function (obj) { return "changePassword" in obj; }, get: function (obj) { return obj.changePassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleAuth_decorators, { kind: "method", name: "googleAuth", static: false, private: false, access: { has: function (obj) { return "googleAuth" in obj; }, get: function (obj) { return obj.googleAuth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleAuthCallback_decorators, { kind: "method", name: "googleAuthCallback", static: false, private: false, access: { has: function (obj) { return "googleAuthCallback" in obj; }, get: function (obj) { return obj.googleAuthCallback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setupMfa_decorators, { kind: "method", name: "setupMfa", static: false, private: false, access: { has: function (obj) { return "setupMfa" in obj; }, get: function (obj) { return obj.setupMfa; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyMfa_decorators, { kind: "method", name: "verifyMfa", static: false, private: false, access: { has: function (obj) { return "verifyMfa" in obj; }, get: function (obj) { return obj.verifyMfa; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateMfaLogin_decorators, { kind: "method", name: "validateMfaLogin", static: false, private: false, access: { has: function (obj) { return "validateMfaLogin" in obj; }, get: function (obj) { return obj.validateMfaLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _disableMfa_decorators, { kind: "method", name: "disableMfa", static: false, private: false, access: { has: function (obj) { return "disableMfa" in obj; }, get: function (obj) { return obj.disableMfa; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSessions_decorators, { kind: "method", name: "getSessions", static: false, private: false, access: { has: function (obj) { return "getSessions" in obj; }, get: function (obj) { return obj.getSessions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeSession_decorators, { kind: "method", name: "revokeSession", static: false, private: false, access: { has: function (obj) { return "revokeSession" in obj; }, get: function (obj) { return obj.revokeSession; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
