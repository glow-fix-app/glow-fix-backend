"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.VehicleBookingHistoryDto = exports.VehicleWithStatsResponseDto = exports.VehicleResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var VehicleResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _client_id_decorators;
    var _client_id_initializers = [];
    var _client_id_extraInitializers = [];
    var _license_plate_decorators;
    var _license_plate_initializers = [];
    var _license_plate_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VehicleResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.client_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _client_id_initializers, void 0));
                this.license_plate = (__runInitializers(this, _client_id_extraInitializers), __runInitializers(this, _license_plate_initializers, void 0));
                this.model = (__runInitializers(this, _license_plate_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.created_at = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return VehicleResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _client_id_decorators = [(0, swagger_1.ApiProperty)()];
            _license_plate_decorators = [(0, swagger_1.ApiProperty)()];
            _model_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _client_id_decorators, { kind: "field", name: "client_id", static: false, private: false, access: { has: function (obj) { return "client_id" in obj; }, get: function (obj) { return obj.client_id; }, set: function (obj, value) { obj.client_id = value; } }, metadata: _metadata }, _client_id_initializers, _client_id_extraInitializers);
            __esDecorate(null, null, _license_plate_decorators, { kind: "field", name: "license_plate", static: false, private: false, access: { has: function (obj) { return "license_plate" in obj; }, get: function (obj) { return obj.license_plate; }, set: function (obj, value) { obj.license_plate = value; } }, metadata: _metadata }, _license_plate_initializers, _license_plate_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VehicleResponseDto = VehicleResponseDto;
var VehicleWithStatsResponseDto = function () {
    var _a;
    var _classSuper = VehicleResponseDto;
    var _total_bookings_decorators;
    var _total_bookings_initializers = [];
    var _total_bookings_extraInitializers = [];
    var _completed_bookings_decorators;
    var _completed_bookings_initializers = [];
    var _completed_bookings_extraInitializers = [];
    var _cancelled_bookings_decorators;
    var _cancelled_bookings_initializers = [];
    var _cancelled_bookings_extraInitializers = [];
    var _total_spent_decorators;
    var _total_spent_initializers = [];
    var _total_spent_extraInitializers = [];
    var _last_booking_at_decorators;
    var _last_booking_at_initializers = [];
    var _last_booking_at_extraInitializers = [];
    var _next_booking_at_decorators;
    var _next_booking_at_initializers = [];
    var _next_booking_at_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(VehicleWithStatsResponseDto, _super);
            function VehicleWithStatsResponseDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.total_bookings = __runInitializers(_this, _total_bookings_initializers, void 0);
                _this.completed_bookings = (__runInitializers(_this, _total_bookings_extraInitializers), __runInitializers(_this, _completed_bookings_initializers, void 0));
                _this.cancelled_bookings = (__runInitializers(_this, _completed_bookings_extraInitializers), __runInitializers(_this, _cancelled_bookings_initializers, void 0));
                _this.total_spent = (__runInitializers(_this, _cancelled_bookings_extraInitializers), __runInitializers(_this, _total_spent_initializers, void 0));
                _this.last_booking_at = (__runInitializers(_this, _total_spent_extraInitializers), __runInitializers(_this, _last_booking_at_initializers, void 0));
                _this.next_booking_at = (__runInitializers(_this, _last_booking_at_extraInitializers), __runInitializers(_this, _next_booking_at_initializers, void 0));
                __runInitializers(_this, _next_booking_at_extraInitializers);
                return _this;
            }
            return VehicleWithStatsResponseDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _total_spent_decorators = [(0, swagger_1.ApiProperty)()];
            _last_booking_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _next_booking_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _total_spent_decorators, { kind: "field", name: "total_spent", static: false, private: false, access: { has: function (obj) { return "total_spent" in obj; }, get: function (obj) { return obj.total_spent; }, set: function (obj, value) { obj.total_spent = value; } }, metadata: _metadata }, _total_spent_initializers, _total_spent_extraInitializers);
            __esDecorate(null, null, _last_booking_at_decorators, { kind: "field", name: "last_booking_at", static: false, private: false, access: { has: function (obj) { return "last_booking_at" in obj; }, get: function (obj) { return obj.last_booking_at; }, set: function (obj, value) { obj.last_booking_at = value; } }, metadata: _metadata }, _last_booking_at_initializers, _last_booking_at_extraInitializers);
            __esDecorate(null, null, _next_booking_at_decorators, { kind: "field", name: "next_booking_at", static: false, private: false, access: { has: function (obj) { return "next_booking_at" in obj; }, get: function (obj) { return obj.next_booking_at; }, set: function (obj, value) { obj.next_booking_at = value; } }, metadata: _metadata }, _next_booking_at_initializers, _next_booking_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VehicleWithStatsResponseDto = VehicleWithStatsResponseDto;
var VehicleBookingHistoryDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _booking_code_decorators;
    var _booking_code_initializers = [];
    var _booking_code_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _scheduled_at_decorators;
    var _scheduled_at_initializers = [];
    var _scheduled_at_extraInitializers = [];
    var _total_price_decorators;
    var _total_price_initializers = [];
    var _total_price_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _payment_status_decorators;
    var _payment_status_initializers = [];
    var _payment_status_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VehicleBookingHistoryDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.booking_code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.business_name = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.scheduled_at = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _scheduled_at_initializers, void 0));
                this.total_price = (__runInitializers(this, _scheduled_at_extraInitializers), __runInitializers(this, _total_price_initializers, void 0));
                this.status = (__runInitializers(this, _total_price_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.payment_status = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _payment_status_initializers, void 0));
                this.rating = (__runInitializers(this, _payment_status_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.created_at = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return VehicleBookingHistoryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _scheduled_at_decorators = [(0, swagger_1.ApiProperty)()];
            _total_price_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _payment_status_decorators = [(0, swagger_1.ApiProperty)()];
            _rating_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _scheduled_at_decorators, { kind: "field", name: "scheduled_at", static: false, private: false, access: { has: function (obj) { return "scheduled_at" in obj; }, get: function (obj) { return obj.scheduled_at; }, set: function (obj, value) { obj.scheduled_at = value; } }, metadata: _metadata }, _scheduled_at_initializers, _scheduled_at_extraInitializers);
            __esDecorate(null, null, _total_price_decorators, { kind: "field", name: "total_price", static: false, private: false, access: { has: function (obj) { return "total_price" in obj; }, get: function (obj) { return obj.total_price; }, set: function (obj, value) { obj.total_price = value; } }, metadata: _metadata }, _total_price_initializers, _total_price_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _payment_status_decorators, { kind: "field", name: "payment_status", static: false, private: false, access: { has: function (obj) { return "payment_status" in obj; }, get: function (obj) { return obj.payment_status; }, set: function (obj, value) { obj.payment_status = value; } }, metadata: _metadata }, _payment_status_initializers, _payment_status_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VehicleBookingHistoryDto = VehicleBookingHistoryDto;
