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
exports.UpdateBusinessDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var create_business_dto_1 = require("./create-business.dto");
var UpdateBusinessDto = function () {
    var _a;
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _contact_phone_decorators;
    var _contact_phone_initializers = [];
    var _contact_phone_extraInitializers = [];
    var _contact_email_decorators;
    var _contact_email_initializers = [];
    var _contact_email_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _bank_name_decorators;
    var _bank_name_initializers = [];
    var _bank_name_extraInitializers = [];
    var _bank_account_name_decorators;
    var _bank_account_name_initializers = [];
    var _bank_account_name_extraInitializers = [];
    var _bank_account_number_decorators;
    var _bank_account_number_initializers = [];
    var _bank_account_number_extraInitializers = [];
    var _swift_iban_decorators;
    var _swift_iban_initializers = [];
    var _swift_iban_extraInitializers = [];
    var _operating_hours_decorators;
    var _operating_hours_initializers = [];
    var _operating_hours_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateBusinessDto() {
                this.business_name = __runInitializers(this, _business_name_initializers, void 0);
                this.address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.location = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.contact_phone = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _contact_phone_initializers, void 0));
                this.contact_email = (__runInitializers(this, _contact_phone_extraInitializers), __runInitializers(this, _contact_email_initializers, void 0));
                this.description = (__runInitializers(this, _contact_email_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.bank_name = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _bank_name_initializers, void 0));
                this.bank_account_name = (__runInitializers(this, _bank_name_extraInitializers), __runInitializers(this, _bank_account_name_initializers, void 0));
                this.bank_account_number = (__runInitializers(this, _bank_account_name_extraInitializers), __runInitializers(this, _bank_account_number_initializers, void 0));
                this.swift_iban = (__runInitializers(this, _bank_account_number_extraInitializers), __runInitializers(this, _swift_iban_initializers, void 0));
                this.operating_hours = (__runInitializers(this, _swift_iban_extraInitializers), __runInitializers(this, _operating_hours_initializers, void 0));
                __runInitializers(this, _operating_hours_extraInitializers);
            }
            return UpdateBusinessDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Shine & Co. Detailing' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _address_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '123 Zamalek Street, Cairo, Egypt' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: create_business_dto_1.BusinessLocationDto }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return create_business_dto_1.BusinessLocationDto; })];
            _contact_phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '0123456789' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Matches)(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })];
            _contact_email_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'contact@shineco.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Premium car wash and detailing service provider.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bank_name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'National Bank of Egypt' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bank_account_name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'John Doe' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bank_account_number_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '1234567890' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _swift_iban_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'EG12000300040005000600070008' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _operating_hours_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [create_business_dto_1.OperatingHoursInputDto] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return create_business_dto_1.OperatingHoursInputDto; })];
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _contact_phone_decorators, { kind: "field", name: "contact_phone", static: false, private: false, access: { has: function (obj) { return "contact_phone" in obj; }, get: function (obj) { return obj.contact_phone; }, set: function (obj, value) { obj.contact_phone = value; } }, metadata: _metadata }, _contact_phone_initializers, _contact_phone_extraInitializers);
            __esDecorate(null, null, _contact_email_decorators, { kind: "field", name: "contact_email", static: false, private: false, access: { has: function (obj) { return "contact_email" in obj; }, get: function (obj) { return obj.contact_email; }, set: function (obj, value) { obj.contact_email = value; } }, metadata: _metadata }, _contact_email_initializers, _contact_email_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _bank_name_decorators, { kind: "field", name: "bank_name", static: false, private: false, access: { has: function (obj) { return "bank_name" in obj; }, get: function (obj) { return obj.bank_name; }, set: function (obj, value) { obj.bank_name = value; } }, metadata: _metadata }, _bank_name_initializers, _bank_name_extraInitializers);
            __esDecorate(null, null, _bank_account_name_decorators, { kind: "field", name: "bank_account_name", static: false, private: false, access: { has: function (obj) { return "bank_account_name" in obj; }, get: function (obj) { return obj.bank_account_name; }, set: function (obj, value) { obj.bank_account_name = value; } }, metadata: _metadata }, _bank_account_name_initializers, _bank_account_name_extraInitializers);
            __esDecorate(null, null, _bank_account_number_decorators, { kind: "field", name: "bank_account_number", static: false, private: false, access: { has: function (obj) { return "bank_account_number" in obj; }, get: function (obj) { return obj.bank_account_number; }, set: function (obj, value) { obj.bank_account_number = value; } }, metadata: _metadata }, _bank_account_number_initializers, _bank_account_number_extraInitializers);
            __esDecorate(null, null, _swift_iban_decorators, { kind: "field", name: "swift_iban", static: false, private: false, access: { has: function (obj) { return "swift_iban" in obj; }, get: function (obj) { return obj.swift_iban; }, set: function (obj, value) { obj.swift_iban = value; } }, metadata: _metadata }, _swift_iban_initializers, _swift_iban_extraInitializers);
            __esDecorate(null, null, _operating_hours_decorators, { kind: "field", name: "operating_hours", static: false, private: false, access: { has: function (obj) { return "operating_hours" in obj; }, get: function (obj) { return obj.operating_hours; }, set: function (obj, value) { obj.operating_hours = value; } }, metadata: _metadata }, _operating_hours_initializers, _operating_hours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateBusinessDto = UpdateBusinessDto;
