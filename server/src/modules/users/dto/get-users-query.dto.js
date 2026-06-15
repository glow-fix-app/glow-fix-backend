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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersQueryDto = exports.UserRole = void 0;
// dto/get-users-query.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var GetUsersQueryDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _email_verified_decorators;
    var _email_verified_initializers = [];
    var _email_verified_extraInitializers = [];
    var _phone_verified_decorators;
    var _phone_verified_initializers = [];
    var _phone_verified_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GetUsersQueryDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.role = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.email_verified = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _email_verified_initializers, void 0));
                this.phone_verified = (__runInitializers(this, _email_verified_extraInitializers), __runInitializers(this, _phone_verified_initializers, void 0));
                this.is_active = (__runInitializers(this, _phone_verified_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return GetUsersQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Page number (1-based)' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 20, description: 'Items per page (max 100)' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'jane', description: 'Search by name, email, or phone' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _role_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: UserRole, description: 'Filter by user role' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(UserRole)];
            _email_verified_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by email verification status' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true';
                }), (0, class_validator_1.IsBoolean)()];
            _phone_verified_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by phone verification status' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true';
                }), (0, class_validator_1.IsBoolean)()];
            _is_active_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by active status' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true';
                }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _email_verified_decorators, { kind: "field", name: "email_verified", static: false, private: false, access: { has: function (obj) { return "email_verified" in obj; }, get: function (obj) { return obj.email_verified; }, set: function (obj, value) { obj.email_verified = value; } }, metadata: _metadata }, _email_verified_initializers, _email_verified_extraInitializers);
            __esDecorate(null, null, _phone_verified_decorators, { kind: "field", name: "phone_verified", static: false, private: false, access: { has: function (obj) { return "phone_verified" in obj; }, get: function (obj) { return obj.phone_verified; }, set: function (obj, value) { obj.phone_verified = value; } }, metadata: _metadata }, _phone_verified_initializers, _phone_verified_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetUsersQueryDto = GetUsersQueryDto;
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
// import { Transform, Type } from 'class-transformer';
// export class GetUsersQueryDto {
//   @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page?: number = 1;
//   @ApiPropertyOptional({ example: 20, description: 'Items per page (max 100)' })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100)
//   limit?: number = 20;
//   @ApiPropertyOptional({ example: 'jane', description: 'Search by name, email, or mobile' })
//   @IsOptional()
//   @IsString()
//   search?: string;
//   @ApiPropertyOptional({ example: true, description: 'Filter by email verification status' })
//   @IsOptional()
//   @Transform(({ value }: { value: string }) => value === 'true')
//   @IsBoolean()
//   emailVerified?: boolean;
//   @ApiPropertyOptional({ example: true, description: 'Filter by mobile verification status' })
//   @IsOptional()
//   @Transform(({ value }: { value: string }) => value === 'true')
//   @IsBoolean()
//   mobileVerified?: boolean;
// }
