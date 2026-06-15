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
exports.UpdateUserDto = void 0;
// dto/update-user.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var UpdateUserDto = function () {
    var _a;
    var _full_name_decorators;
    var _full_name_initializers = [];
    var _full_name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _avatar_url_decorators;
    var _avatar_url_initializers = [];
    var _avatar_url_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserDto() {
                this.full_name = __runInitializers(this, _full_name_initializers, void 0);
                this.email = (__runInitializers(this, _full_name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.avatar_url = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _avatar_url_initializers, void 0));
                __runInitializers(this, _avatar_url_extraInitializers);
            }
            return UpdateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _full_name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'jane@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === null || value === void 0 ? void 0 : value.toLowerCase();
                })];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '+201012345678' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _avatar_url_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/avatar.jpg' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            __esDecorate(null, null, _full_name_decorators, { kind: "field", name: "full_name", static: false, private: false, access: { has: function (obj) { return "full_name" in obj; }, get: function (obj) { return obj.full_name; }, set: function (obj, value) { obj.full_name = value; } }, metadata: _metadata }, _full_name_initializers, _full_name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _avatar_url_decorators, { kind: "field", name: "avatar_url", static: false, private: false, access: { has: function (obj) { return "avatar_url" in obj; }, get: function (obj) { return obj.avatar_url; }, set: function (obj, value) { obj.avatar_url = value; } }, metadata: _metadata }, _avatar_url_initializers, _avatar_url_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserDto = UpdateUserDto;
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsString,
//   IsEmail,
//   IsOptional,
//   MinLength,
//   MaxLength,
//   IsBoolean,
// } from 'class-validator';
// import { Transform } from 'class-transformer';
// export class UpdateUserDto {
//   @ApiPropertyOptional({ example: 'Jane Doe' })
//   @IsOptional()
//   @IsString()
//   @MinLength(2)
//   @MaxLength(100)
//   fullName?: string;
//   @ApiPropertyOptional({ example: 'jane@example.com' })
//   @IsOptional()
//   @IsEmail()
//   @Transform(({ value }: { value: string }) => value?.toLowerCase())
//   email?: string;
//   @ApiPropertyOptional({ example: '+201012345678' })
//   @IsOptional()
//   @IsString()
//   mobileNumber?: string;
//   @ApiPropertyOptional({ example: 'https://cdn.example.com/photo.jpg' })
//   @IsOptional()
//   @IsString()
//   profilePhotoUrl?: string;
//   @ApiPropertyOptional({ example: true })
//   @IsOptional()
//   @IsBoolean()
//   marketingConsent?: boolean;
// }
