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
exports.TopServicesDto = exports.TopServiceDto = exports.BookingMetricsDto = exports.BookingStatusCountDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var BookingStatusCountDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _count_decorators;
    var _count_initializers = [];
    var _count_extraInitializers = [];
    var _percentage_decorators;
    var _percentage_initializers = [];
    var _percentage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingStatusCountDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.count = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.percentage = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _percentage_initializers, void 0));
                __runInitializers(this, _percentage_extraInitializers);
            }
            return BookingStatusCountDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _count_decorators = [(0, swagger_1.ApiProperty)()];
            _percentage_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _percentage_decorators, { kind: "field", name: "percentage", static: false, private: false, access: { has: function (obj) { return "percentage" in obj; }, get: function (obj) { return obj.percentage; }, set: function (obj, value) { obj.percentage = value; } }, metadata: _metadata }, _percentage_initializers, _percentage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingStatusCountDto = BookingStatusCountDto;
var BookingMetricsDto = function () {
    var _a;
    var _total_bookings_decorators;
    var _total_bookings_initializers = [];
    var _total_bookings_extraInitializers = [];
    var _completed_bookings_decorators;
    var _completed_bookings_initializers = [];
    var _completed_bookings_extraInitializers = [];
    var _cancelled_bookings_decorators;
    var _cancelled_bookings_initializers = [];
    var _cancelled_bookings_extraInitializers = [];
    var _no_show_bookings_decorators;
    var _no_show_bookings_initializers = [];
    var _no_show_bookings_extraInitializers = [];
    var _average_completion_time_hours_decorators;
    var _average_completion_time_hours_initializers = [];
    var _average_completion_time_hours_extraInitializers = [];
    var _average_cancellation_time_hours_decorators;
    var _average_cancellation_time_hours_initializers = [];
    var _average_cancellation_time_hours_extraInitializers = [];
    var _bookings_by_status_decorators;
    var _bookings_by_status_initializers = [];
    var _bookings_by_status_extraInitializers = [];
    var _bookings_by_hour_decorators;
    var _bookings_by_hour_initializers = [];
    var _bookings_by_hour_extraInitializers = [];
    var _bookings_by_day_of_week_decorators;
    var _bookings_by_day_of_week_initializers = [];
    var _bookings_by_day_of_week_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingMetricsDto() {
                this.total_bookings = __runInitializers(this, _total_bookings_initializers, void 0);
                this.completed_bookings = (__runInitializers(this, _total_bookings_extraInitializers), __runInitializers(this, _completed_bookings_initializers, void 0));
                this.cancelled_bookings = (__runInitializers(this, _completed_bookings_extraInitializers), __runInitializers(this, _cancelled_bookings_initializers, void 0));
                this.no_show_bookings = (__runInitializers(this, _cancelled_bookings_extraInitializers), __runInitializers(this, _no_show_bookings_initializers, void 0));
                this.average_completion_time_hours = (__runInitializers(this, _no_show_bookings_extraInitializers), __runInitializers(this, _average_completion_time_hours_initializers, void 0));
                this.average_cancellation_time_hours = (__runInitializers(this, _average_completion_time_hours_extraInitializers), __runInitializers(this, _average_cancellation_time_hours_initializers, void 0));
                this.bookings_by_status = (__runInitializers(this, _average_cancellation_time_hours_extraInitializers), __runInitializers(this, _bookings_by_status_initializers, void 0));
                this.bookings_by_hour = (__runInitializers(this, _bookings_by_status_extraInitializers), __runInitializers(this, _bookings_by_hour_initializers, void 0));
                this.bookings_by_day_of_week = (__runInitializers(this, _bookings_by_hour_extraInitializers), __runInitializers(this, _bookings_by_day_of_week_initializers, void 0));
                __runInitializers(this, _bookings_by_day_of_week_extraInitializers);
            }
            return BookingMetricsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _no_show_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _average_completion_time_hours_decorators = [(0, swagger_1.ApiProperty)()];
            _average_cancellation_time_hours_decorators = [(0, swagger_1.ApiProperty)()];
            _bookings_by_status_decorators = [(0, swagger_1.ApiProperty)({ type: [BookingStatusCountDto] })];
            _bookings_by_hour_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _bookings_by_day_of_week_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _no_show_bookings_decorators, { kind: "field", name: "no_show_bookings", static: false, private: false, access: { has: function (obj) { return "no_show_bookings" in obj; }, get: function (obj) { return obj.no_show_bookings; }, set: function (obj, value) { obj.no_show_bookings = value; } }, metadata: _metadata }, _no_show_bookings_initializers, _no_show_bookings_extraInitializers);
            __esDecorate(null, null, _average_completion_time_hours_decorators, { kind: "field", name: "average_completion_time_hours", static: false, private: false, access: { has: function (obj) { return "average_completion_time_hours" in obj; }, get: function (obj) { return obj.average_completion_time_hours; }, set: function (obj, value) { obj.average_completion_time_hours = value; } }, metadata: _metadata }, _average_completion_time_hours_initializers, _average_completion_time_hours_extraInitializers);
            __esDecorate(null, null, _average_cancellation_time_hours_decorators, { kind: "field", name: "average_cancellation_time_hours", static: false, private: false, access: { has: function (obj) { return "average_cancellation_time_hours" in obj; }, get: function (obj) { return obj.average_cancellation_time_hours; }, set: function (obj, value) { obj.average_cancellation_time_hours = value; } }, metadata: _metadata }, _average_cancellation_time_hours_initializers, _average_cancellation_time_hours_extraInitializers);
            __esDecorate(null, null, _bookings_by_status_decorators, { kind: "field", name: "bookings_by_status", static: false, private: false, access: { has: function (obj) { return "bookings_by_status" in obj; }, get: function (obj) { return obj.bookings_by_status; }, set: function (obj, value) { obj.bookings_by_status = value; } }, metadata: _metadata }, _bookings_by_status_initializers, _bookings_by_status_extraInitializers);
            __esDecorate(null, null, _bookings_by_hour_decorators, { kind: "field", name: "bookings_by_hour", static: false, private: false, access: { has: function (obj) { return "bookings_by_hour" in obj; }, get: function (obj) { return obj.bookings_by_hour; }, set: function (obj, value) { obj.bookings_by_hour = value; } }, metadata: _metadata }, _bookings_by_hour_initializers, _bookings_by_hour_extraInitializers);
            __esDecorate(null, null, _bookings_by_day_of_week_decorators, { kind: "field", name: "bookings_by_day_of_week", static: false, private: false, access: { has: function (obj) { return "bookings_by_day_of_week" in obj; }, get: function (obj) { return obj.bookings_by_day_of_week; }, set: function (obj, value) { obj.bookings_by_day_of_week = value; } }, metadata: _metadata }, _bookings_by_day_of_week_initializers, _bookings_by_day_of_week_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingMetricsDto = BookingMetricsDto;
var TopServiceDto = function () {
    var _a;
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _service_name_decorators;
    var _service_name_initializers = [];
    var _service_name_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _booking_count_decorators;
    var _booking_count_initializers = [];
    var _booking_count_extraInitializers = [];
    var _total_revenue_decorators;
    var _total_revenue_initializers = [];
    var _total_revenue_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TopServiceDto() {
                this.service_id = __runInitializers(this, _service_id_initializers, void 0);
                this.service_name = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _service_name_initializers, void 0));
                this.category_name = (__runInitializers(this, _service_name_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.booking_count = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _booking_count_initializers, void 0));
                this.total_revenue = (__runInitializers(this, _booking_count_extraInitializers), __runInitializers(this, _total_revenue_initializers, void 0));
                __runInitializers(this, _total_revenue_extraInitializers);
            }
            return TopServiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _service_name_decorators = [(0, swagger_1.ApiProperty)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_count_decorators = [(0, swagger_1.ApiProperty)()];
            _total_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _service_name_decorators, { kind: "field", name: "service_name", static: false, private: false, access: { has: function (obj) { return "service_name" in obj; }, get: function (obj) { return obj.service_name; }, set: function (obj, value) { obj.service_name = value; } }, metadata: _metadata }, _service_name_initializers, _service_name_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _booking_count_decorators, { kind: "field", name: "booking_count", static: false, private: false, access: { has: function (obj) { return "booking_count" in obj; }, get: function (obj) { return obj.booking_count; }, set: function (obj, value) { obj.booking_count = value; } }, metadata: _metadata }, _booking_count_initializers, _booking_count_extraInitializers);
            __esDecorate(null, null, _total_revenue_decorators, { kind: "field", name: "total_revenue", static: false, private: false, access: { has: function (obj) { return "total_revenue" in obj; }, get: function (obj) { return obj.total_revenue; }, set: function (obj, value) { obj.total_revenue = value; } }, metadata: _metadata }, _total_revenue_initializers, _total_revenue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TopServiceDto = TopServiceDto;
var TopServicesDto = function () {
    var _a;
    var _top_services_decorators;
    var _top_services_initializers = [];
    var _top_services_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TopServicesDto() {
                this.top_services = __runInitializers(this, _top_services_initializers, void 0);
                __runInitializers(this, _top_services_extraInitializers);
            }
            return TopServicesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _top_services_decorators = [(0, swagger_1.ApiProperty)({ type: [TopServiceDto] })];
            __esDecorate(null, null, _top_services_decorators, { kind: "field", name: "top_services", static: false, private: false, access: { has: function (obj) { return "top_services" in obj; }, get: function (obj) { return obj.top_services; }, set: function (obj, value) { obj.top_services = value; } }, metadata: _metadata }, _top_services_initializers, _top_services_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TopServicesDto = TopServicesDto;
