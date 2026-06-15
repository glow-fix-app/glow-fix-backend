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
exports.VerifyOtpDto = exports.OtpPurpose = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
// Must match OtpPurpose enum in prisma schema exactly
var OtpPurpose;
(function (OtpPurpose) {
    OtpPurpose["PASSWORD_RESET"] = "PASSWORD_RESET";
    OtpPurpose["PHONE_VERIFICATION"] = "PHONE_VERIFICATION";
    OtpPurpose["EMAIL_VERIFICATION"] = "EMAIL_VERIFICATION";
    OtpPurpose["TWO_FACTOR"] = "TWO_FACTOR";
})(OtpPurpose || (exports.OtpPurpose = OtpPurpose = {}));
var VerifyOtpDto = function () {
    var _a;
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _otp_decorators;
    var _otp_initializers = [];
    var _otp_extraInitializers = [];
    var _purpose_decorators;
    var _purpose_initializers = [];
    var _purpose_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VerifyOtpDto() {
                this.phone = __runInitializers(this, _phone_initializers, void 0);
                this.email = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.otp = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _otp_initializers, void 0));
                this.purpose = (__runInitializers(this, _otp_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
                __runInitializers(this, _purpose_extraInitializers);
            }
            return VerifyOtpDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '+201092887320', description: 'Use this OR email' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'ahmed@example.com', description: 'Use this OR phone' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _otp_decorators = [(0, swagger_1.ApiProperty)({ example: '403930' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.Matches)(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })];
            _purpose_decorators = [(0, swagger_1.ApiProperty)({ enum: OtpPurpose, example: OtpPurpose.EMAIL_VERIFICATION }), (0, class_validator_1.IsEnum)(OtpPurpose)];
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _otp_decorators, { kind: "field", name: "otp", static: false, private: false, access: { has: function (obj) { return "otp" in obj; }, get: function (obj) { return obj.otp; }, set: function (obj, value) { obj.otp = value; } }, metadata: _metadata }, _otp_initializers, _otp_extraInitializers);
            __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: function (obj) { return "purpose" in obj; }, get: function (obj) { return obj.purpose; }, set: function (obj, value) { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VerifyOtpDto = VerifyOtpDto;
// dto/verify-otp.dto.ts
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
// export enum OtpPurpose {
//   EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
//   PHONE_VERIFICATION = 'PHONE_VERIFICATION',
//   LOGIN = 'LOGIN',
//   PASSWORD_RESET = 'PASSWORD_RESET',
// }
// export class VerifyOtpDto {
//   @ApiPropertyOptional({ example: 'user@example.com' })
//   @IsOptional()
//   @IsString()
//   email?: string;
//   @ApiPropertyOptional({ example: '+201000000000' })
//   @IsOptional()
//   @IsString()
//   phone?: string;
//   @ApiProperty({ example: '123456' })
//   @IsString()
//   @MinLength(6)
//   @MaxLength(6)
//   otp: string;
//   @ApiProperty({ enum: OtpPurpose })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }
// import {
//   IsOptional,
//   IsString,
//   IsNotEmpty,
//   IsEnum,
//   Matches,
//   IsEmail,
// } from 'class-validator';
// import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
// export enum OtpPurpose {
//   REGISTRATION = 'REGISTRATION',
//   LOGIN = 'LOGIN',
//   PASSWORD_RESET = 'PASSWORD_RESET',
//   MFA = 'MFA',
// }
// export class VerifyOtpDto {
//   @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
//   @IsOptional()
//   @IsString()
//   mobileNumber?: string;
//   @ApiPropertyOptional({ example: 'jane@example.com', description: 'Use this OR mobileNumber' })
//   @IsOptional()
//   @IsEmail()
//   email?: string;
//   @ApiProperty({ example: '403930' })
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
//   otp: string;
//   @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }
