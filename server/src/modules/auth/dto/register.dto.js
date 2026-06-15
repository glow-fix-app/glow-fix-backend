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
exports.RegisterDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var RegisterDto = function () {
    var _a;
    var _fullName_decorators;
    var _fullName_initializers = [];
    var _fullName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _confirmPassword_decorators;
    var _confirmPassword_initializers = [];
    var _confirmPassword_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterDto() {
                this.fullName = __runInitializers(this, _fullName_initializers, void 0);
                this.email = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.password = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.confirmPassword = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _confirmPassword_initializers, void 0));
                __runInitializers(this, _confirmPassword_extraInitializers);
            }
            return RegisterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fullName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Ahmed Eid' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _email_decorators = [(0, swagger_1.ApiProperty)({ example: 'ahmed@example.com' }), (0, class_validator_1.IsEmail)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === null || value === void 0 ? void 0 : value.toLowerCase();
                })];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '01092887320' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _password_decorators = [(0, swagger_1.ApiProperty)({ example: 'Test@12345678' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8)];
            _confirmPassword_decorators = [(0, swagger_1.ApiProperty)({ example: 'Test@12345678' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: function (obj) { return "fullName" in obj; }, get: function (obj) { return obj.fullName; }, set: function (obj, value) { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _confirmPassword_decorators, { kind: "field", name: "confirmPassword", static: false, private: false, access: { has: function (obj) { return "confirmPassword" in obj; }, get: function (obj) { return obj.confirmPassword; }, set: function (obj, value) { obj.confirmPassword = value; } }, metadata: _metadata }, _confirmPassword_initializers, _confirmPassword_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterDto = RegisterDto;
// import {
//   IsString,
//   IsEmail,
//   IsNotEmpty,
//   MinLength,
//   MaxLength,
//   Matches,
//   IsOptional,
//   IsBoolean,
// } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';
// import { PASSWORD } from '@glow-fix/utils';
// export class RegisterDto {
//   @ApiProperty({ example: 'John Doe' })
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(2)
//   @MaxLength(100)
//   @Transform(({ value }) => (value as string).trim())
//   fullName: string;
//   @ApiProperty({ example: '+12025551234' })
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^\+?[1-9]\d{6,14}$/, {
//     message: 'Please provide a valid phone number in international format',
//   })
//   mobileNumber: string;
//   @ApiProperty({ example: 'john@example.com' })
//   @IsEmail({}, { message: 'Please provide a valid email address' })
//   @IsNotEmpty()
//   @Transform(({ value }) => (value as string).toLowerCase().trim())
//   email: string;
//   @ApiProperty({ example: 'MyStr0ng!Pass' })
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(PASSWORD.MIN_LENGTH, {
//     message: `Password must be at least ${PASSWORD.MIN_LENGTH} characters`,
//   })
//   @MaxLength(PASSWORD.MAX_LENGTH)
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
//     message:
//       'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
//   })
//   password: string;
//   @ApiProperty({ example: 'MyStr0ng!Pass' })
//   @IsString()
//   @IsNotEmpty()
//   confirmPassword: string;
//   @ApiPropertyOptional({ example: 'GF-ABC123' })
//   @IsOptional()
//   @IsString()
//   referralCode?: string;
//   @ApiPropertyOptional({ default: false })
//   @IsOptional()
//   @IsBoolean()
//   marketingConsent?: boolean;
// }
