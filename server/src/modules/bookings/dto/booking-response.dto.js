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
exports.BookingResponseDto = exports.BookingBusinessResponseDto = exports.BookingVehicleResponseDto = exports.BookingClientResponseDto = exports.BookingClientUserResponseDto = exports.BookingPaymentResponseDto = exports.BookingStatusHistoryResponseDto = exports.BookingItemResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var BookingItemResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _businessServiceId_decorators;
    var _businessServiceId_initializers = [];
    var _businessServiceId_extraInitializers = [];
    var _serviceTitle_decorators;
    var _serviceTitle_initializers = [];
    var _serviceTitle_extraInitializers = [];
    var _serviceDescription_decorators;
    var _serviceDescription_initializers = [];
    var _serviceDescription_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingItemResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.businessServiceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _businessServiceId_initializers, void 0));
                this.serviceTitle = (__runInitializers(this, _businessServiceId_extraInitializers), __runInitializers(this, _serviceTitle_initializers, void 0));
                this.serviceDescription = (__runInitializers(this, _serviceTitle_extraInitializers), __runInitializers(this, _serviceDescription_initializers, void 0));
                this.price = (__runInitializers(this, _serviceDescription_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                __runInitializers(this, _price_extraInitializers);
            }
            return BookingItemResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _businessServiceId_decorators = [(0, swagger_1.ApiProperty)()];
            _serviceTitle_decorators = [(0, swagger_1.ApiProperty)()];
            _serviceDescription_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _businessServiceId_decorators, { kind: "field", name: "businessServiceId", static: false, private: false, access: { has: function (obj) { return "businessServiceId" in obj; }, get: function (obj) { return obj.businessServiceId; }, set: function (obj, value) { obj.businessServiceId = value; } }, metadata: _metadata }, _businessServiceId_initializers, _businessServiceId_extraInitializers);
            __esDecorate(null, null, _serviceTitle_decorators, { kind: "field", name: "serviceTitle", static: false, private: false, access: { has: function (obj) { return "serviceTitle" in obj; }, get: function (obj) { return obj.serviceTitle; }, set: function (obj, value) { obj.serviceTitle = value; } }, metadata: _metadata }, _serviceTitle_initializers, _serviceTitle_extraInitializers);
            __esDecorate(null, null, _serviceDescription_decorators, { kind: "field", name: "serviceDescription", static: false, private: false, access: { has: function (obj) { return "serviceDescription" in obj; }, get: function (obj) { return obj.serviceDescription; }, set: function (obj, value) { obj.serviceDescription = value; } }, metadata: _metadata }, _serviceDescription_initializers, _serviceDescription_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingItemResponseDto = BookingItemResponseDto;
var BookingStatusHistoryResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingStatusHistoryResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.status = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
            return BookingStatusHistoryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingStatusHistoryResponseDto = BookingStatusHistoryResponseDto;
var BookingPaymentResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingPaymentResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.amount = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.status = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.method = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                __runInitializers(this, _method_extraInitializers);
            }
            return BookingPaymentResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _amount_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _method_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingPaymentResponseDto = BookingPaymentResponseDto;
var BookingClientUserResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _fullName_decorators;
    var _fullName_initializers = [];
    var _fullName_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingClientUserResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.fullName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _fullName_initializers, void 0));
                this.phone = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.email = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                __runInitializers(this, _email_extraInitializers);
            }
            return BookingClientUserResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _fullName_decorators = [(0, swagger_1.ApiProperty)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _email_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: function (obj) { return "fullName" in obj; }, get: function (obj) { return obj.fullName; }, set: function (obj, value) { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingClientUserResponseDto = BookingClientUserResponseDto;
var BookingClientResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingClientResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.user = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _user_initializers, void 0));
                __runInitializers(this, _user_extraInitializers);
            }
            return BookingClientResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _user_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: BookingClientUserResponseDto })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingClientResponseDto = BookingClientResponseDto;
var BookingVehicleResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _make_decorators;
    var _make_initializers = [];
    var _make_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _client_decorators;
    var _client_initializers = [];
    var _client_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingVehicleResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.make = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _make_initializers, void 0));
                this.model = (__runInitializers(this, _make_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.licensePlate = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
                this.vin = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
                this.year = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.client = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _client_initializers, void 0));
                __runInitializers(this, _client_extraInitializers);
            }
            return BookingVehicleResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _make_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _model_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _licensePlate_decorators = [(0, swagger_1.ApiProperty)()];
            _vin_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _client_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: BookingClientResponseDto })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _make_decorators, { kind: "field", name: "make", static: false, private: false, access: { has: function (obj) { return "make" in obj; }, get: function (obj) { return obj.make; }, set: function (obj, value) { obj.make = value; } }, metadata: _metadata }, _make_initializers, _make_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
            __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _client_decorators, { kind: "field", name: "client", static: false, private: false, access: { has: function (obj) { return "client" in obj; }, get: function (obj) { return obj.client; }, set: function (obj, value) { obj.client = value; } }, metadata: _metadata }, _client_initializers, _client_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingVehicleResponseDto = BookingVehicleResponseDto;
var BookingBusinessResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _businessName_decorators;
    var _businessName_initializers = [];
    var _businessName_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _managerId_decorators;
    var _managerId_initializers = [];
    var _managerId_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingBusinessResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.businessName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _businessName_initializers, void 0));
                this.address = (__runInitializers(this, _businessName_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.managerId = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                this.latitude = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return BookingBusinessResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _businessName_decorators = [(0, swagger_1.ApiProperty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)()];
            _managerId_decorators = [(0, swagger_1.ApiProperty)()];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _businessName_decorators, { kind: "field", name: "businessName", static: false, private: false, access: { has: function (obj) { return "businessName" in obj; }, get: function (obj) { return obj.businessName; }, set: function (obj, value) { obj.businessName = value; } }, metadata: _metadata }, _businessName_initializers, _businessName_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: function (obj) { return "managerId" in obj; }, get: function (obj) { return obj.managerId; }, set: function (obj, value) { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingBusinessResponseDto = BookingBusinessResponseDto;
var BookingResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _client_name_decorators;
    var _client_name_initializers = [];
    var _client_name_extraInitializers = [];
    var _client_avatar_decorators;
    var _client_avatar_initializers = [];
    var _client_avatar_extraInitializers = [];
    var _vehicle_id_decorators;
    var _vehicle_id_initializers = [];
    var _vehicle_id_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _scheduled_at_decorators;
    var _scheduled_at_initializers = [];
    var _scheduled_at_extraInitializers = [];
    var _expected_delivery_at_decorators;
    var _expected_delivery_at_initializers = [];
    var _expected_delivery_at_extraInitializers = [];
    var _sub_total_decorators;
    var _sub_total_initializers = [];
    var _sub_total_extraInitializers = [];
    var _platform_fee_decorators;
    var _platform_fee_initializers = [];
    var _platform_fee_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    var _commission_decorators;
    var _commission_initializers = [];
    var _commission_extraInitializers = [];
    var _total_price_decorators;
    var _total_price_initializers = [];
    var _total_price_extraInitializers = [];
    var _cancellation_reason_decorators;
    var _cancellation_reason_initializers = [];
    var _cancellation_reason_extraInitializers = [];
    var _rejection_reason_decorators;
    var _rejection_reason_initializers = [];
    var _rejection_reason_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _status_history_decorators;
    var _status_history_initializers = [];
    var _status_history_extraInitializers = [];
    var _payment_decorators;
    var _payment_initializers = [];
    var _payment_extraInitializers = [];
    var _vehicle_decorators;
    var _vehicle_initializers = [];
    var _vehicle_extraInitializers = [];
    var _business_decorators;
    var _business_initializers = [];
    var _business_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var _diagnostic_report_decorators;
    var _diagnostic_report_initializers = [];
    var _diagnostic_report_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.client_name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _client_name_initializers, void 0));
                this.client_avatar = (__runInitializers(this, _client_name_extraInitializers), __runInitializers(this, _client_avatar_initializers, void 0));
                this.vehicle_id = (__runInitializers(this, _client_avatar_extraInitializers), __runInitializers(this, _vehicle_id_initializers, void 0));
                this.business_id = (__runInitializers(this, _vehicle_id_extraInitializers), __runInitializers(this, _business_id_initializers, void 0));
                this.scheduled_at = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _scheduled_at_initializers, void 0));
                this.expected_delivery_at = (__runInitializers(this, _scheduled_at_extraInitializers), __runInitializers(this, _expected_delivery_at_initializers, void 0));
                this.sub_total = (__runInitializers(this, _expected_delivery_at_extraInitializers), __runInitializers(this, _sub_total_initializers, void 0));
                this.platform_fee = (__runInitializers(this, _sub_total_extraInitializers), __runInitializers(this, _platform_fee_initializers, void 0));
                this.discount = (__runInitializers(this, _platform_fee_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
                this.commission = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _commission_initializers, void 0));
                this.total_price = (__runInitializers(this, _commission_extraInitializers), __runInitializers(this, _total_price_initializers, void 0));
                this.cancellation_reason = (__runInitializers(this, _total_price_extraInitializers), __runInitializers(this, _cancellation_reason_initializers, void 0));
                this.rejection_reason = (__runInitializers(this, _cancellation_reason_extraInitializers), __runInitializers(this, _rejection_reason_initializers, void 0));
                this.note = (__runInitializers(this, _rejection_reason_extraInitializers), __runInitializers(this, _note_initializers, void 0));
                this.status = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.created_at = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                this.items = (__runInitializers(this, _updated_at_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.status_history = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _status_history_initializers, void 0));
                this.payment = (__runInitializers(this, _status_history_extraInitializers), __runInitializers(this, _payment_initializers, void 0));
                this.vehicle = (__runInitializers(this, _payment_extraInitializers), __runInitializers(this, _vehicle_initializers, void 0));
                this.business = (__runInitializers(this, _vehicle_extraInitializers), __runInitializers(this, _business_initializers, void 0));
                this.images = (__runInitializers(this, _business_extraInitializers), __runInitializers(this, _images_initializers, void 0));
                this.diagnostic_report = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _diagnostic_report_initializers, void 0));
                __runInitializers(this, _diagnostic_report_extraInitializers);
            }
            return BookingResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _client_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _client_avatar_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _vehicle_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _scheduled_at_decorators = [(0, swagger_1.ApiProperty)()];
            _expected_delivery_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _sub_total_decorators = [(0, swagger_1.ApiProperty)()];
            _platform_fee_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _discount_decorators = [(0, swagger_1.ApiProperty)()];
            _commission_decorators = [(0, swagger_1.ApiProperty)()];
            _total_price_decorators = [(0, swagger_1.ApiProperty)()];
            _cancellation_reason_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _rejection_reason_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _note_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            _items_decorators = [(0, swagger_1.ApiProperty)({ type: [BookingItemResponseDto] })];
            _status_history_decorators = [(0, swagger_1.ApiProperty)({ type: [BookingStatusHistoryResponseDto] })];
            _payment_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: BookingPaymentResponseDto })];
            _vehicle_decorators = [(0, swagger_1.ApiProperty)({ type: BookingVehicleResponseDto })];
            _business_decorators = [(0, swagger_1.ApiProperty)({ type: BookingBusinessResponseDto })];
            _images_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            _diagnostic_report_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Latest diagnostic report for this booking' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _client_name_decorators, { kind: "field", name: "client_name", static: false, private: false, access: { has: function (obj) { return "client_name" in obj; }, get: function (obj) { return obj.client_name; }, set: function (obj, value) { obj.client_name = value; } }, metadata: _metadata }, _client_name_initializers, _client_name_extraInitializers);
            __esDecorate(null, null, _client_avatar_decorators, { kind: "field", name: "client_avatar", static: false, private: false, access: { has: function (obj) { return "client_avatar" in obj; }, get: function (obj) { return obj.client_avatar; }, set: function (obj, value) { obj.client_avatar = value; } }, metadata: _metadata }, _client_avatar_initializers, _client_avatar_extraInitializers);
            __esDecorate(null, null, _vehicle_id_decorators, { kind: "field", name: "vehicle_id", static: false, private: false, access: { has: function (obj) { return "vehicle_id" in obj; }, get: function (obj) { return obj.vehicle_id; }, set: function (obj, value) { obj.vehicle_id = value; } }, metadata: _metadata }, _vehicle_id_initializers, _vehicle_id_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _scheduled_at_decorators, { kind: "field", name: "scheduled_at", static: false, private: false, access: { has: function (obj) { return "scheduled_at" in obj; }, get: function (obj) { return obj.scheduled_at; }, set: function (obj, value) { obj.scheduled_at = value; } }, metadata: _metadata }, _scheduled_at_initializers, _scheduled_at_extraInitializers);
            __esDecorate(null, null, _expected_delivery_at_decorators, { kind: "field", name: "expected_delivery_at", static: false, private: false, access: { has: function (obj) { return "expected_delivery_at" in obj; }, get: function (obj) { return obj.expected_delivery_at; }, set: function (obj, value) { obj.expected_delivery_at = value; } }, metadata: _metadata }, _expected_delivery_at_initializers, _expected_delivery_at_extraInitializers);
            __esDecorate(null, null, _sub_total_decorators, { kind: "field", name: "sub_total", static: false, private: false, access: { has: function (obj) { return "sub_total" in obj; }, get: function (obj) { return obj.sub_total; }, set: function (obj, value) { obj.sub_total = value; } }, metadata: _metadata }, _sub_total_initializers, _sub_total_extraInitializers);
            __esDecorate(null, null, _platform_fee_decorators, { kind: "field", name: "platform_fee", static: false, private: false, access: { has: function (obj) { return "platform_fee" in obj; }, get: function (obj) { return obj.platform_fee; }, set: function (obj, value) { obj.platform_fee = value; } }, metadata: _metadata }, _platform_fee_initializers, _platform_fee_extraInitializers);
            __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
            __esDecorate(null, null, _commission_decorators, { kind: "field", name: "commission", static: false, private: false, access: { has: function (obj) { return "commission" in obj; }, get: function (obj) { return obj.commission; }, set: function (obj, value) { obj.commission = value; } }, metadata: _metadata }, _commission_initializers, _commission_extraInitializers);
            __esDecorate(null, null, _total_price_decorators, { kind: "field", name: "total_price", static: false, private: false, access: { has: function (obj) { return "total_price" in obj; }, get: function (obj) { return obj.total_price; }, set: function (obj, value) { obj.total_price = value; } }, metadata: _metadata }, _total_price_initializers, _total_price_extraInitializers);
            __esDecorate(null, null, _cancellation_reason_decorators, { kind: "field", name: "cancellation_reason", static: false, private: false, access: { has: function (obj) { return "cancellation_reason" in obj; }, get: function (obj) { return obj.cancellation_reason; }, set: function (obj, value) { obj.cancellation_reason = value; } }, metadata: _metadata }, _cancellation_reason_initializers, _cancellation_reason_extraInitializers);
            __esDecorate(null, null, _rejection_reason_decorators, { kind: "field", name: "rejection_reason", static: false, private: false, access: { has: function (obj) { return "rejection_reason" in obj; }, get: function (obj) { return obj.rejection_reason; }, set: function (obj, value) { obj.rejection_reason = value; } }, metadata: _metadata }, _rejection_reason_initializers, _rejection_reason_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _status_history_decorators, { kind: "field", name: "status_history", static: false, private: false, access: { has: function (obj) { return "status_history" in obj; }, get: function (obj) { return obj.status_history; }, set: function (obj, value) { obj.status_history = value; } }, metadata: _metadata }, _status_history_initializers, _status_history_extraInitializers);
            __esDecorate(null, null, _payment_decorators, { kind: "field", name: "payment", static: false, private: false, access: { has: function (obj) { return "payment" in obj; }, get: function (obj) { return obj.payment; }, set: function (obj, value) { obj.payment = value; } }, metadata: _metadata }, _payment_initializers, _payment_extraInitializers);
            __esDecorate(null, null, _vehicle_decorators, { kind: "field", name: "vehicle", static: false, private: false, access: { has: function (obj) { return "vehicle" in obj; }, get: function (obj) { return obj.vehicle; }, set: function (obj, value) { obj.vehicle = value; } }, metadata: _metadata }, _vehicle_initializers, _vehicle_extraInitializers);
            __esDecorate(null, null, _business_decorators, { kind: "field", name: "business", static: false, private: false, access: { has: function (obj) { return "business" in obj; }, get: function (obj) { return obj.business; }, set: function (obj, value) { obj.business = value; } }, metadata: _metadata }, _business_initializers, _business_extraInitializers);
            __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
            __esDecorate(null, null, _diagnostic_report_decorators, { kind: "field", name: "diagnostic_report", static: false, private: false, access: { has: function (obj) { return "diagnostic_report" in obj; }, get: function (obj) { return obj.diagnostic_report; }, set: function (obj, value) { obj.diagnostic_report = value; } }, metadata: _metadata }, _diagnostic_report_initializers, _diagnostic_report_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingResponseDto = BookingResponseDto;
