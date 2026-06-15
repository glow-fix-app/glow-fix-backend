"use strict";
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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_1 = require("multer");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var types_1 = require("@glow-fix/types");
var UsersController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Users'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.Controller)({ path: 'users', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMe_decorators;
    var _getMyClientProfile_decorators;
    var _updateMe_decorators;
    var _uploadAvatar_decorators;
    var _deleteAvatar_decorators;
    var _deleteMe_decorators;
    var _getAllUsers_decorators;
    var _getUser_decorators;
    var _updateUser_decorators;
    var _deleteUser_decorators;
    var _getManagerBusiness_decorators;
    var UsersController = _classThis = /** @class */ (function () {
        function UsersController_1(usersService, avatarService) {
            this.usersService = (__runInitializers(this, _instanceExtraInitializers), usersService);
            this.avatarService = avatarService;
        }
        // ─── GET /v1/users/me ───
        UsersController_1.prototype.getMe = function (actor) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.getProfile(actor.sub)];
                });
            });
        };
        // ─── GET /v1/users/me/client (client-specific data) ───
        UsersController_1.prototype.getMyClientProfile = function (actor) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.getClientProfile(actor.sub)];
                });
            });
        };
        // ─── PUT /v1/users/me ───
        UsersController_1.prototype.updateMe = function (actor, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.updateUser(actor.sub, dto, actor.sub, actor.role)];
                });
            });
        };
        // ─── PUT /v1/users/me/avatar ───
        UsersController_1.prototype.uploadAvatar = function (file, actor) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('No file provided. Send image as "avatar" field.');
                            }
                            return [4 /*yield*/, this.avatarService.upload(actor.sub, {
                                    buffer: file.buffer,
                                    mimetype: file.mimetype,
                                    size: file.size,
                                })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, { message: 'Avatar updated successfully', url: result.url }];
                    }
                });
            });
        };
        // ─── DELETE /v1/users/me/avatar ───
        UsersController_1.prototype.deleteAvatar = function (actor) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.avatarService.delete(actor.sub)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Avatar removed successfully' }];
                    }
                });
            });
        };
        // ─── DELETE /v1/users/me ───
        UsersController_1.prototype.deleteMe = function (actor) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.deleteUser(actor.sub, actor.sub, actor.role)];
                });
            });
        };
        // ==================== ADMIN ONLY ENDPOINTS ====================
        // ─── GET /v1/users (admin only) ───
        UsersController_1.prototype.getAllUsers = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.getAllUsers(query)];
                });
            });
        };
        // ─── GET /v1/users/:id (admin or self) ───
        UsersController_1.prototype.getUser = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (user.role !== 'ADMIN' && user.sub !== id) {
                        throw new common_1.ForbiddenException('You are not allowed to view this profile');
                    }
                    return [2 /*return*/, this.usersService.getUser(id)];
                });
            });
        };
        // ─── PATCH /v1/users/:id (admin or self) ───
        UsersController_1.prototype.updateUser = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.updateUser(id, dto, user.sub, user.role)];
                });
            });
        };
        // ─── DELETE /v1/users/:id (admin only) ───
        UsersController_1.prototype.deleteUser = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.deleteUser(id, user.sub, user.role)];
                });
            });
        };
        // ─── GET /v1/users/:id/business (manager's business) ───
        UsersController_1.prototype.getManagerBusiness = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.usersService.getManagerBusiness(id)];
                });
            });
        };
        return UsersController_1;
    }());
    __setFunctionName(_classThis, "UsersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMe_decorators = [(0, common_1.Get)('me'), (0, swagger_1.ApiOperation)({ summary: "Get authenticated user's full profile" }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile returned successfully' })];
        _getMyClientProfile_decorators = [(0, common_1.Get)('me/client'), (0, swagger_1.ApiOperation)({ summary: "Get authenticated user's client profile with location" }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile returned' })];
        _updateMe_decorators = [(0, common_1.Put)('me'), (0, swagger_1.ApiOperation)({ summary: "Update authenticated user's profile" }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated' })];
        _uploadAvatar_decorators = [(0, common_1.Put)('me/avatar'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', {
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: 5 * 1024 * 1024 },
            })), (0, swagger_1.ApiOperation)({ summary: 'Upload or replace profile avatar' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['avatar'],
                    properties: {
                        avatar: {
                            type: 'string',
                            format: 'binary',
                            description: 'JPEG, PNG, WebP, or GIF — max 5 MB',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar updated successfully' })];
        _deleteAvatar_decorators = [(0, common_1.Delete)('me/avatar'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Remove profile avatar' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar removed' })];
        _deleteMe_decorators = [(0, common_1.Delete)('me'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete own account (soft delete)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Account deleted' })];
        _getAllUsers_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(types_1.UserRole.ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get all users with pagination and filters (admin only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated user list' })];
        _getUser_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get user by ID (own profile or admin)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User returned' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' })];
        _updateUser_decorators = [(0, common_1.Patch)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update a user (own profile or admin)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated' })];
        _deleteUser_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(types_1.UserRole.ADMIN), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete a user (admin only)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted' })];
        _getManagerBusiness_decorators = [(0, common_1.Get)(':id/business'), (0, roles_decorator_1.Roles)(types_1.UserRole.ADMIN, 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: "Get manager's business (admin/manager only)" })];
        __esDecorate(_classThis, null, _getMe_decorators, { kind: "method", name: "getMe", static: false, private: false, access: { has: function (obj) { return "getMe" in obj; }, get: function (obj) { return obj.getMe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyClientProfile_decorators, { kind: "method", name: "getMyClientProfile", static: false, private: false, access: { has: function (obj) { return "getMyClientProfile" in obj; }, get: function (obj) { return obj.getMyClientProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMe_decorators, { kind: "method", name: "updateMe", static: false, private: false, access: { has: function (obj) { return "updateMe" in obj; }, get: function (obj) { return obj.updateMe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadAvatar_decorators, { kind: "method", name: "uploadAvatar", static: false, private: false, access: { has: function (obj) { return "uploadAvatar" in obj; }, get: function (obj) { return obj.uploadAvatar; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteAvatar_decorators, { kind: "method", name: "deleteAvatar", static: false, private: false, access: { has: function (obj) { return "deleteAvatar" in obj; }, get: function (obj) { return obj.deleteAvatar; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteMe_decorators, { kind: "method", name: "deleteMe", static: false, private: false, access: { has: function (obj) { return "deleteMe" in obj; }, get: function (obj) { return obj.deleteMe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllUsers_decorators, { kind: "method", name: "getAllUsers", static: false, private: false, access: { has: function (obj) { return "getAllUsers" in obj; }, get: function (obj) { return obj.getAllUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUser_decorators, { kind: "method", name: "getUser", static: false, private: false, access: { has: function (obj) { return "getUser" in obj; }, get: function (obj) { return obj.getUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUser_decorators, { kind: "method", name: "updateUser", static: false, private: false, access: { has: function (obj) { return "updateUser" in obj; }, get: function (obj) { return obj.updateUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteUser_decorators, { kind: "method", name: "deleteUser", static: false, private: false, access: { has: function (obj) { return "deleteUser" in obj; }, get: function (obj) { return obj.deleteUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManagerBusiness_decorators, { kind: "method", name: "getManagerBusiness", static: false, private: false, access: { has: function (obj) { return "getManagerBusiness" in obj; }, get: function (obj) { return obj.getManagerBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersController = _classThis;
}();
exports.UsersController = UsersController;
// // Owns all user-profile-related routes.
// // Auth is enforced by the global JwtAuthGuard — no @Public() here.
// //
// // Dependency direction:
// //   UsersModule → can import anything (guards come from AuthModule via global)
// //   AuthModule  → never imports UsersModule
// import {
//   Controller,
//   Get,
//   Put,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
//   Param,
//   Body,
//   Patch,
//   ForbiddenException,
//   Query,
// } from '@nestjs/common';
// import { FileInterceptor }   from '@nestjs/platform-express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiConsumes,
//   ApiBody,
//   ApiParam,
// } from '@nestjs/swagger';
// import { memoryStorage } from 'multer';
// import { UsersService }  from './users.service';
// import { AvatarService } from './avatar.service';
// import { CurrentUser }   from '../../common/decorators/current-user.decorator';
// import { JwtPayload, UserRole } from '@glow-fix/types';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { GetUsersQueryDto } from './dto/get-users-query.dto';
// @ApiTags('Users')
// @ApiBearerAuth('access-token')
// @Controller({ path: 'users', version: '1' })
// export class UsersController {
//   constructor(
//     private readonly usersService:  UsersService,
//     private readonly avatarService: AvatarService,
//   ) {}
//   // ── GET /v1/users/me ───────────────────────────────────────────────────────
//   // The single source of truth for the full user profile.
//   // Called after login to hydrate the client-side user store.
//   // avatarUrl is resolved here — Redis-first, one DB query only on cache miss.
//   @Get('me')
//   @ApiOperation({ summary: 'Get the authenticated user\'s full profile' })
//   @ApiResponse({ status: 200, description: 'Profile returned successfully' })
//   async getMe(@CurrentUser() actor: JwtPayload) {
//     return this.usersService.getProfile(actor.sub);
//   }
//   // ── PUT /v1/users/me/avatar ────────────────────────────────────────────────
//   @Put('me/avatar')
//   @HttpCode(HttpStatus.OK)
//   @UseInterceptors(
//     FileInterceptor('avatar', {
//       storage: memoryStorage(),
//       limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB — multer-level guard
//     }),
//   )
//   @ApiOperation({ summary: 'Upload or replace your profile avatar' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       required: ['avatar'],
//       properties: {
//         avatar: {
//           type:        'string',
//           format:      'binary',
//           description: 'JPEG, PNG, WebP, or GIF — max 5 MB',
//         },
//       },
//     },
//   })
//   @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
//   @ApiResponse({ status: 400, description: 'No file / wrong type / too large' })
//   async uploadAvatar(
//     @UploadedFile() file: Express.Multer.File | undefined,
//     @CurrentUser() actor: JwtPayload,
//   ): Promise<{ message: string; url: string }> {
//     if (!file) {
//       throw new BadRequestException(
//         'No file provided. Send the image as the "avatar" field.',
//       );
//     }
//     const result = await this.avatarService.upload(actor.sub, {
//       buffer:   file.buffer,
//       mimetype: file.mimetype,
//       size:     file.size,
//     });
//     return { message: 'Avatar updated successfully', url: result.url };
//   }
//   // ── DELETE /v1/users/me/avatar ─────────────────────────────────────────────
//   @Delete('me/avatar')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Remove your profile avatar' })
//   @ApiResponse({ status: 200, description: 'Avatar removed' })
//   @ApiResponse({ status: 404, description: 'No avatar found' })
//   async deleteAvatar(
//     @CurrentUser() actor: JwtPayload,
//   ): Promise<{ message: string }> {
//     await this.avatarService.delete(actor.sub);
//     return { message: 'Avatar removed successfully' };
//   }
//     // ─── Admin: list all users ───
//   @Get()
// //   @Roles(UserRole.ADMIN)
//   @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
//   @ApiResponse({ status: 200, description: 'Paginated user list' })
//   @ApiResponse({ status: 403, description: 'Forbidden — admins only' })
//   async getAllUsers(
//     @Query() query: GetUsersQueryDto,
//   ): Promise<Record<string, unknown>> {
//     return this.usersService.getAllUsers(query);
//   }
//   // ─── Get user by ID ───
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a user by ID (own profile or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User returned' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async getUser(
//     @Param('id') id: string,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<Record<string, unknown>> {
//     // Non-admins can only fetch their own profile
//     if (user.role !== 'ADMIN' && user.sub !== id) {
//       throw new ForbiddenException('You are not allowed to view this profile');
//     }
//     return this.usersService.getUser(id);
//   }
//   // ─── Update user ───
//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a user (own profile or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User updated' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   @ApiResponse({ status: 409, description: 'Email or mobile already in use' })
//   async updateUser(
//     @Param('id') id: string,
//     @Body() dto: UpdateUserDto,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<Record<string, unknown>> {
//     return this.usersService.updateUser(id, dto, user.sub, user.role);
//   }
//   // ─── Delete user ───
//   @Delete(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Soft-delete a user (own account or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User deleted' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async deleteUser(
//     @Param('id') id: string,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<{ message: string }> {
//     return this.usersService.deleteUser(id, user.sub, user.role);
//   }
// }
// // import {
// //   Controller,
// //   Get,
// //   Patch,
// //   Delete,
// //   Param,
// //   Body,
// //   Query,
// //   HttpCode,
// //   HttpStatus,
// //   ForbiddenException,
// // } from '@nestjs/common';
// // import {
// //   ApiTags,
// //   ApiOperation,
// //   ApiResponse,
// //   ApiBearerAuth,
// //   ApiParam,
// // } from '@nestjs/swagger';
// // import { JwtPayload } from '@glow-fix/types';
// // import { CurrentUser } from '../../common/decorators/current-user.decorator';
// // import { Roles } from '../../common/decorators/roles.decorator';
// // import { UsersService } from './users.service';
// // import { UpdateUserDto } from './dto/update-user.dto';
// // import { GetUsersQueryDto } from './dto/get-users-query.dto';
// // @ApiTags('Users')
// // @ApiBearerAuth('access-token')
// // @Controller({ path: 'users', version: '1' })
// // export class UsersController {
// //   constructor(private readonly usersService: UsersService) {}
// //   // ─── Own profile ───
// //   @Get('me')
// //   @ApiOperation({ summary: 'Get own profile' })
// //   @ApiResponse({ status: 200, description: 'Profile returned' })
// //   async getMe(
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.getMe(user.sub);
// //   }
// //   // ─── Admin: list all users ───
// //   @Get()
// // //   @Roles(UserRole.ADMIN)
// //   @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
// //   @ApiResponse({ status: 200, description: 'Paginated user list' })
// //   @ApiResponse({ status: 403, description: 'Forbidden — admins only' })
// //   async getAllUsers(
// //     @Query() query: GetUsersQueryDto,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.getAllUsers(query);
// //   }
// //   // ─── Get user by ID ───
// //   @Get(':id')
// //   @ApiOperation({ summary: 'Get a user by ID (own profile or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User returned' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   async getUser(
// //     @Param('id') id: string,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     // Non-admins can only fetch their own profile
// //     if (user.role !== 'ADMIN' && user.sub !== id) {
// //       throw new ForbiddenException('You are not allowed to view this profile');
// //     }
// //     return this.usersService.getUser(id);
// //   }
// //   // ─── Update user ───
// //   @Patch(':id')
// //   @ApiOperation({ summary: 'Update a user (own profile or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User updated' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   @ApiResponse({ status: 409, description: 'Email or mobile already in use' })
// //   async updateUser(
// //     @Param('id') id: string,
// //     @Body() dto: UpdateUserDto,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.updateUser(id, dto, user.sub, user.role);
// //   }
// //   // ─── Delete user ───
// //   @Delete(':id')
// //   @HttpCode(HttpStatus.OK)
// //   @ApiOperation({ summary: 'Soft-delete a user (own account or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User deleted' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   async deleteUser(
// //     @Param('id') id: string,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<{ message: string }> {
// //     return this.usersService.deleteUser(id, user.sub, user.role);
// //   }
// // }
