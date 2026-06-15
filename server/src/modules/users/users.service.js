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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var geocode_1 = require("../../utils/geocode");
// Shared select matching schema exactly (Prisma uses camelCase)
var USER_SELECT = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
};
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(prisma, winstonLogger, avatarService) {
            this.prisma = prisma;
            this.winstonLogger = winstonLogger;
            this.avatarService = avatarService;
            this.logger = new common_1.Logger(UsersService.name);
        }
        // ─── Get full profile (includes avatar resolution) ───
        UsersService_1.prototype.getProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, avatarUrl, clientLocation, locResult, city, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId, deletedAt: null },
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    phone: true,
                                    role: true,
                                    emailVerified: true,
                                    phoneVerified: true,
                                    twoFactorEnabled: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException('User not found');
                            return [4 /*yield*/, this.avatarService.resolve(userId)];
                        case 2:
                            avatarUrl = _a.sent();
                            clientLocation = null;
                            if (!(user.role === 'CLIENT')) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        SELECT \n          ST_Y(location::geometry) as latitude,\n          ST_X(location::geometry) as longitude,\n          city\n        FROM clients \n        WHERE user_id = ", "::uuid AND location IS NOT NULL\n      "], ["\n        SELECT \n          ST_Y(location::geometry) as latitude,\n          ST_X(location::geometry) as longitude,\n          city\n        FROM clients \n        WHERE user_id = ", "::uuid AND location IS NOT NULL\n      "])), userId)];
                        case 3:
                            locResult = _a.sent();
                            if (!(locResult && locResult.length > 0)) return [3 /*break*/, 10];
                            city = locResult[0].city;
                            if (!!city) return [3 /*break*/, 9];
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 8, , 9]);
                            return [4 /*yield*/, (0, geocode_1.reverseGeocodeCity)(locResult[0].latitude, locResult[0].longitude)];
                        case 5:
                            city = _a.sent();
                            if (!city) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma
                                    .$executeRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["UPDATE clients SET city = ", " WHERE user_id = ", "::uuid"], ["UPDATE clients SET city = ", " WHERE user_id = ", "::uuid"])), city, userId)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            err_1 = _a.sent();
                            this.logger.warn("Failed to auto-geocode client location: ".concat(err_1));
                            return [3 /*break*/, 9];
                        case 9:
                            clientLocation = {
                                latitude: Number(locResult[0].latitude),
                                longitude: Number(locResult[0].longitude),
                                city: city !== null && city !== void 0 ? city : null,
                            };
                            _a.label = 10;
                        case 10: return [2 /*return*/, {
                                id: user.id,
                                full_name: user.fullName,
                                email: user.email,
                                phone: user.phone,
                                role: user.role,
                                email_verified: user.emailVerified,
                                phone_verified: user.phoneVerified,
                                two_factor_enabled: user.twoFactorEnabled,
                                avatar_url: avatarUrl,
                                created_at: user.createdAt,
                                updated_at: user.updatedAt,
                                clientLocation: clientLocation,
                            }];
                    }
                });
            });
        };
        // ─── Get client profile with client-specific data ───
        UsersService_1.prototype.getClientProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client, location, clientLocation, coords, avatarUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                                include: {
                                    user: {
                                        select: USER_SELECT,
                                    },
                                },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            location = null;
                            clientLocation = client.location;
                            if (clientLocation) {
                                coords = clientLocation.coordinates;
                                if (coords && Array.isArray(coords)) {
                                    location = {
                                        longitude: coords[0],
                                        latitude: coords[1],
                                    };
                                }
                            }
                            return [4 /*yield*/, this.avatarService.resolve(userId)];
                        case 2:
                            avatarUrl = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, client.user), { avatar_url: avatarUrl, client_id: client.id, location: location })];
                    }
                });
            });
        };
        // ─── Get single user by ID ───
        UsersService_1.prototype.getUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user, avatarUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: id, deletedAt: null },
                                select: USER_SELECT,
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            return [4 /*yield*/, this.avatarService.resolve(id)];
                        case 2:
                            avatarUrl = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, user), { avatar_url: avatarUrl })];
                    }
                });
            });
        };
        UsersService_1.prototype.mapUserToResponse = function (user) {
            return {
                id: user.id,
                full_name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                email_verified: user.emailVerified,
                phone_verified: user.phoneVerified,
                two_factor_enabled: user.twoFactorEnabled,
                is_active: user.isActive,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
                deleted_at: user.deletedAt,
            };
        };
        // ─── Get all users — admin only ───
        UsersService_1.prototype.getAllUsers = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, role, email_verified, phone_verified, is_active, skip, where, _c, data, total, dataWithAvatars;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b, search = query.search, role = query.role, email_verified = query.email_verified, phone_verified = query.phone_verified, is_active = query.is_active;
                            skip = (page - 1) * limit;
                            where = {
                                deletedAt: null,
                            };
                            if (email_verified !== undefined)
                                where.emailVerified = email_verified;
                            if (phone_verified !== undefined)
                                where.phoneVerified = phone_verified;
                            if (is_active !== undefined)
                                where.isActive = is_active;
                            if (role)
                                where.role = role;
                            if (search) {
                                where.OR = [
                                    { fullName: { contains: search, mode: 'insensitive' } },
                                    { email: { contains: search, mode: 'insensitive' } },
                                    { phone: { contains: search } },
                                ];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.user.findMany({
                                        where: where,
                                        select: USER_SELECT,
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: limit,
                                    }),
                                    this.prisma.user.count({ where: where }),
                                ])];
                        case 1:
                            _c = _d.sent(), data = _c[0], total = _c[1];
                            return [4 /*yield*/, Promise.all(data.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _a = [__assign({}, this.mapUserToResponse(user))];
                                                _b = {};
                                                return [4 /*yield*/, this.avatarService.resolve(user.id)];
                                            case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.avatar_url = _c.sent(), _b)])))];
                                        }
                                    });
                                }); }))];
                        case 2:
                            dataWithAvatars = _d.sent();
                            return [2 /*return*/, {
                                    data: dataWithAvatars,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit),
                                }];
                    }
                });
            });
        };
        // ─── Update user ───
        UsersService_1.prototype.updateUser = function (id, dto, requesterId, requesterRole) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, emailTaken, phoneTaken, updated, avatarUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (requesterId !== id && requesterRole !== 'ADMIN') {
                                throw new common_1.ForbiddenException('You are not allowed to update this user');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: id, deletedAt: null },
                                })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            if (!(dto.email && dto.email !== existing.email)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { email: dto.email },
                                })];
                        case 2:
                            emailTaken = _a.sent();
                            if (emailTaken) {
                                throw new common_1.ConflictException('Email is already in use');
                            }
                            _a.label = 3;
                        case 3:
                            if (!(dto.phone && dto.phone !== existing.phone)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { phone: dto.phone },
                                })];
                        case 4:
                            phoneTaken = _a.sent();
                            if (phoneTaken) {
                                throw new common_1.ConflictException('Phone number is already in use');
                            }
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: id },
                                data: __assign(__assign(__assign(__assign({}, (dto.full_name !== undefined && { fullName: dto.full_name })), (dto.email !== undefined && {
                                    email: dto.email,
                                    emailVerified: false, // must re-verify
                                })), (dto.phone !== undefined && {
                                    phone: dto.phone,
                                    phoneVerified: false, // must re-verify
                                })), { updatedAt: new Date() }),
                                select: USER_SELECT,
                            })];
                        case 6:
                            updated = _a.sent();
                            this.winstonLogger.log('User updated', 'UsersService', {
                                targetId: id,
                                requesterId: requesterId,
                                changedFields: Object.keys(dto),
                            });
                            return [4 /*yield*/, this.avatarService.resolve(id)];
                        case 7:
                            avatarUrl = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, this.mapUserToResponse(updated)), { avatar_url: avatarUrl })];
                    }
                });
            });
        };
        // async deleteUser(
        //   id: string,
        //   requesterId: string,
        //   requesterRole: string,
        // ): Promise<{ message: string }> {
        //   // if (requesterId !== id && requesterRole !== 'ADMIN') {
        //   //   throw new ForbiddenException('You are not allowed to delete this user');
        //   // }
        //   const existing = await this.prisma.user.findUnique({
        //     where: { id, deletedAt: null },
        //   });
        //   if (!existing) {
        //     throw new NotFoundException('User not found');
        //   }
        //   // Permanently delete the user and all related data
        //   await this.prisma.$transaction([
        //     // Delete sessions first (foreign key constraint)
        //     this.prisma.userSession.deleteMany({
        //       where: { userId: id },
        //     }),
        //     // // Delete OAuth accounts
        //     // this.prisma.oAuthAccount.deleteMany({
        //     //   where: { customerId: id },
        //     // }),
        //     // // Delete security events
        //     // this.prisma.securityEvent.deleteMany({
        //     //   where: { userId: id },
        //     // }),
        //     // // Delete referrals
        //     // this.prisma.referral.deleteMany({
        //     //   where: {
        //     //     OR: [{ referrerId: id }, { refereeId: id }],
        //     //   },
        //     // }),
        //     // Finally delete the customer
        //     this.prisma.user.delete({
        //       where: { id },
        //     }),
        //   ]);
        //   this.logger.log('User permanently deleted', 'UsersService', {
        //     targetId: id,
        //     requesterId,
        //   });
        //   return { message: 'User permanently deleted successfully' };
        // }
        // ─── Delete user (soft delete per schema) ───
        UsersService_1.prototype.deleteUser = function (id, requesterId, requesterRole) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (requesterId !== id && requesterRole !== 'ADMIN') {
                                throw new common_1.ForbiddenException('You are not allowed to delete this user');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: id, deletedAt: null },
                                })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            // Soft delete - set deletedAt and isActive = false
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: id },
                                    data: {
                                        deletedAt: new Date(),
                                        isActive: false,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 2:
                            // Soft delete - set deletedAt and isActive = false
                            _a.sent();
                            // Also invalidate all sessions
                            return [4 /*yield*/, this.prisma.userSession.deleteMany({
                                    where: { userId: id },
                                })];
                        case 3:
                            // Also invalidate all sessions
                            _a.sent();
                            this.winstonLogger.log('User soft-deleted', 'UsersService', {
                                targetId: id,
                                requesterId: requesterId,
                            });
                            return [2 /*return*/, { message: 'User deleted successfully' }];
                    }
                });
            });
        };
        // ─── Get user by email (for auth) ───
        UsersService_1.prototype.getUserByEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({
                            where: { email: email.toLowerCase() },
                        })];
                });
            });
        };
        // ─── Get user by phone ───
        UsersService_1.prototype.getUserByPhone = function (phone) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({
                            where: { phone: phone },
                        })];
                });
            });
        };
        // ─── Get manager's business ───
        UsersService_1.prototype.getManagerBusiness = function (managerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.business.findFirst({
                            where: { managerId: managerId },
                            include: {
                                operatingHours: true,
                                statusHistory: {
                                    include: { status: true },
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                },
                            },
                        })];
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
var templateObject_1, templateObject_2;
// async deleteUser(
//   id: string,
//   requesterId: string,
//   requesterRole: string,
// ): Promise<{ message: string }> {
//   // if (requesterId !== id && requesterRole !== 'ADMIN') {
//   //   throw new ForbiddenException('You are not allowed to delete this user');
//   // }
//   const existing = await this.prisma.user.findUnique({
//     where: { id, deletedAt: null },
//   });
//   if (!existing) {
//     throw new NotFoundException('User not found');
//   }
//   // Permanently delete the user and all related data
//   await this.prisma.$transaction([
//     // Delete sessions first (foreign key constraint)
//     this.prisma.userSession.deleteMany({
//       where: { userId: id },
//     }),
//     // // Delete OAuth accounts
//     // this.prisma.oAuthAccount.deleteMany({
//     //   where: { customerId: id },
//     // }),
//     // // Delete security events
//     // this.prisma.securityEvent.deleteMany({
//     //   where: { userId: id },
//     // }),
//     // // Delete referrals
//     // this.prisma.referral.deleteMany({
//     //   where: {
//     //     OR: [{ referrerId: id }, { refereeId: id }],
//     //   },
//     // }),
//     // Finally delete the customer
//     this.prisma.user.delete({
//       where: { id },
//     }),
//   ]);
//   this.logger.log('User permanently deleted', 'UsersService', {
//     targetId: id,
//     requesterId,
//   });
//   return { message: 'User permanently deleted successfully' };
// }
