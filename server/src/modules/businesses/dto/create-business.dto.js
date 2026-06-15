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
exports.CreateBusinessDto = exports.OperatingHoursInputDto = exports.BusinessLocationDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var BusinessLocationDto = function () {
    var _a;
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessLocationDto() {
                this.latitude = __runInitializers(this, _latitude_initializers, void 0);
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return BusinessLocationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ example: 30.0444 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLatitude)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ example: 31.2357 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLongitude)(), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessLocationDto = BusinessLocationDto;
var OperatingHoursInputDto = function () {
    var _a;
    var _day_of_week_decorators;
    var _day_of_week_initializers = [];
    var _day_of_week_extraInitializers = [];
    var _open_time_decorators;
    var _open_time_initializers = [];
    var _open_time_extraInitializers = [];
    var _close_time_decorators;
    var _close_time_initializers = [];
    var _close_time_extraInitializers = [];
    var _is_closed_decorators;
    var _is_closed_initializers = [];
    var _is_closed_extraInitializers = [];
    return _a = /** @class */ (function () {
            function OperatingHoursInputDto() {
                this.day_of_week = __runInitializers(this, _day_of_week_initializers, void 0);
                this.open_time = (__runInitializers(this, _day_of_week_extraInitializers), __runInitializers(this, _open_time_initializers, void 0));
                this.close_time = (__runInitializers(this, _open_time_extraInitializers), __runInitializers(this, _close_time_initializers, void 0));
                this.is_closed = (__runInitializers(this, _close_time_extraInitializers), __runInitializers(this, _is_closed_initializers, void 0));
                __runInitializers(this, _is_closed_extraInitializers);
            }
            return OperatingHoursInputDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _day_of_week_decorators = [(0, swagger_1.ApiProperty)({ enum: [0, 1, 2, 3, 4, 5, 6], description: '0=Sunday, 6=Saturday' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(6)];
            _open_time_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '09:00' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _close_time_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '18:00' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _is_closed_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: false }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _day_of_week_decorators, { kind: "field", name: "day_of_week", static: false, private: false, access: { has: function (obj) { return "day_of_week" in obj; }, get: function (obj) { return obj.day_of_week; }, set: function (obj, value) { obj.day_of_week = value; } }, metadata: _metadata }, _day_of_week_initializers, _day_of_week_extraInitializers);
            __esDecorate(null, null, _open_time_decorators, { kind: "field", name: "open_time", static: false, private: false, access: { has: function (obj) { return "open_time" in obj; }, get: function (obj) { return obj.open_time; }, set: function (obj, value) { obj.open_time = value; } }, metadata: _metadata }, _open_time_initializers, _open_time_extraInitializers);
            __esDecorate(null, null, _close_time_decorators, { kind: "field", name: "close_time", static: false, private: false, access: { has: function (obj) { return "close_time" in obj; }, get: function (obj) { return obj.close_time; }, set: function (obj, value) { obj.close_time = value; } }, metadata: _metadata }, _close_time_initializers, _close_time_extraInitializers);
            __esDecorate(null, null, _is_closed_decorators, { kind: "field", name: "is_closed", static: false, private: false, access: { has: function (obj) { return "is_closed" in obj; }, get: function (obj) { return obj.is_closed; }, set: function (obj, value) { obj.is_closed = value; } }, metadata: _metadata }, _is_closed_initializers, _is_closed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.OperatingHoursInputDto = OperatingHoursInputDto;
var CreateBusinessDto = function () {
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
    var _operating_hours_decorators;
    var _operating_hours_initializers = [];
    var _operating_hours_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBusinessDto() {
                this.business_name = __runInitializers(this, _business_name_initializers, void 0);
                this.address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.location = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.contact_phone = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _contact_phone_initializers, void 0));
                this.contact_email = (__runInitializers(this, _contact_phone_extraInitializers), __runInitializers(this, _contact_email_initializers, void 0));
                this.description = (__runInitializers(this, _contact_email_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.operating_hours = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _operating_hours_initializers, void 0));
                __runInitializers(this, _operating_hours_extraInitializers);
            }
            return CreateBusinessDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Shine & Co. Detailing' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(100)];
            _address_decorators = [(0, swagger_1.ApiProperty)({ example: '123 Zamalek Street, Cairo, Egypt' }), (0, class_validator_1.IsString)()];
            _location_decorators = [(0, swagger_1.ApiProperty)({ type: BusinessLocationDto }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return BusinessLocationDto; })];
            _contact_phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '+20123456789' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Matches)(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })];
            _contact_email_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'contact@shineco.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Premium car wash and detailing service provider.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _operating_hours_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [OperatingHoursInputDto], description: 'Operating hours for each day' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return OperatingHoursInputDto; })];
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _contact_phone_decorators, { kind: "field", name: "contact_phone", static: false, private: false, access: { has: function (obj) { return "contact_phone" in obj; }, get: function (obj) { return obj.contact_phone; }, set: function (obj, value) { obj.contact_phone = value; } }, metadata: _metadata }, _contact_phone_initializers, _contact_phone_extraInitializers);
            __esDecorate(null, null, _contact_email_decorators, { kind: "field", name: "contact_email", static: false, private: false, access: { has: function (obj) { return "contact_email" in obj; }, get: function (obj) { return obj.contact_email; }, set: function (obj, value) { obj.contact_email = value; } }, metadata: _metadata }, _contact_email_initializers, _contact_email_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _operating_hours_decorators, { kind: "field", name: "operating_hours", static: false, private: false, access: { has: function (obj) { return "operating_hours" in obj; }, get: function (obj) { return obj.operating_hours; }, set: function (obj, value) { obj.operating_hours = value; } }, metadata: _metadata }, _operating_hours_initializers, _operating_hours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBusinessDto = CreateBusinessDto;
