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
exports.ExportReportDto = exports.BusinessAnalyticsQueryDto = exports.AnalyticsQueryDto = exports.MetricType = exports.TimeRange = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var TimeRange;
(function (TimeRange) {
    TimeRange["TODAY"] = "today";
    TimeRange["YESTERDAY"] = "yesterday";
    TimeRange["THIS_WEEK"] = "this_week";
    TimeRange["LAST_WEEK"] = "last_week";
    TimeRange["THIS_MONTH"] = "this_month";
    TimeRange["LAST_MONTH"] = "last_month";
    TimeRange["THIS_QUARTER"] = "this_quarter";
    TimeRange["THIS_YEAR"] = "this_year";
    TimeRange["CUSTOM"] = "custom";
})(TimeRange || (exports.TimeRange = TimeRange = {}));
var MetricType;
(function (MetricType) {
    MetricType["REVENUE"] = "revenue";
    MetricType["BOOKINGS"] = "bookings";
    MetricType["USERS"] = "users";
    MetricType["BUSINESSES"] = "businesses";
})(MetricType || (exports.MetricType = MetricType = {}));
var AnalyticsQueryDto = function () {
    var _a;
    var _range_decorators;
    var _range_initializers = [];
    var _range_extraInitializers = [];
    var _start_date_decorators;
    var _start_date_initializers = [];
    var _start_date_extraInitializers = [];
    var _end_date_decorators;
    var _end_date_initializers = [];
    var _end_date_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _group_by_decorators;
    var _group_by_initializers = [];
    var _group_by_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AnalyticsQueryDto() {
                this.range = __runInitializers(this, _range_initializers, TimeRange.THIS_MONTH);
                this.start_date = (__runInitializers(this, _range_extraInitializers), __runInitializers(this, _start_date_initializers, void 0));
                this.end_date = (__runInitializers(this, _start_date_extraInitializers), __runInitializers(this, _end_date_initializers, void 0));
                this.business_id = (__runInitializers(this, _end_date_extraInitializers), __runInitializers(this, _business_id_initializers, void 0));
                this.group_by = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _group_by_initializers, void 0));
                __runInitializers(this, _group_by_extraInitializers);
            }
            return AnalyticsQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _range_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: TimeRange, default: TimeRange.THIS_MONTH }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(TimeRange)];
            _start_date_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Start date for custom range (YYYY-MM-DD)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _end_date_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'End date for custom range (YYYY-MM-DD)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _business_id_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Business ID for manager view' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _group_by_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Group by interval: day, week, month, year' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _range_decorators, { kind: "field", name: "range", static: false, private: false, access: { has: function (obj) { return "range" in obj; }, get: function (obj) { return obj.range; }, set: function (obj, value) { obj.range = value; } }, metadata: _metadata }, _range_initializers, _range_extraInitializers);
            __esDecorate(null, null, _start_date_decorators, { kind: "field", name: "start_date", static: false, private: false, access: { has: function (obj) { return "start_date" in obj; }, get: function (obj) { return obj.start_date; }, set: function (obj, value) { obj.start_date = value; } }, metadata: _metadata }, _start_date_initializers, _start_date_extraInitializers);
            __esDecorate(null, null, _end_date_decorators, { kind: "field", name: "end_date", static: false, private: false, access: { has: function (obj) { return "end_date" in obj; }, get: function (obj) { return obj.end_date; }, set: function (obj, value) { obj.end_date = value; } }, metadata: _metadata }, _end_date_initializers, _end_date_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _group_by_decorators, { kind: "field", name: "group_by", static: false, private: false, access: { has: function (obj) { return "group_by" in obj; }, get: function (obj) { return obj.group_by; }, set: function (obj, value) { obj.group_by = value; } }, metadata: _metadata }, _group_by_initializers, _group_by_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AnalyticsQueryDto = AnalyticsQueryDto;
var BusinessAnalyticsQueryDto = function () {
    var _a;
    var _classSuper = AnalyticsQueryDto;
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(BusinessAnalyticsQueryDto, _super);
            function BusinessAnalyticsQueryDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.business_id = __runInitializers(_this, _business_id_initializers, void 0);
                __runInitializers(_this, _business_id_extraInitializers);
                return _this;
            }
            return BusinessAnalyticsQueryDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _business_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessAnalyticsQueryDto = BusinessAnalyticsQueryDto;
var ExportReportDto = function () {
    var _a;
    var _start_date_decorators;
    var _start_date_initializers = [];
    var _start_date_extraInitializers = [];
    var _end_date_decorators;
    var _end_date_initializers = [];
    var _end_date_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ExportReportDto() {
                this.start_date = __runInitializers(this, _start_date_initializers, void 0);
                this.end_date = (__runInitializers(this, _start_date_extraInitializers), __runInitializers(this, _end_date_initializers, void 0));
                this.format = (__runInitializers(this, _end_date_extraInitializers), __runInitializers(this, _format_initializers, 'csv'));
                __runInitializers(this, _format_extraInitializers);
            }
            return ExportReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _start_date_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Start date (YYYY-MM-DD)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _end_date_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'End date (YYYY-MM-DD)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _format_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Format: csv, pdf, excel' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _start_date_decorators, { kind: "field", name: "start_date", static: false, private: false, access: { has: function (obj) { return "start_date" in obj; }, get: function (obj) { return obj.start_date; }, set: function (obj, value) { obj.start_date = value; } }, metadata: _metadata }, _start_date_initializers, _start_date_extraInitializers);
            __esDecorate(null, null, _end_date_decorators, { kind: "field", name: "end_date", static: false, private: false, access: { has: function (obj) { return "end_date" in obj; }, get: function (obj) { return obj.end_date; }, set: function (obj, value) { obj.end_date = value; } }, metadata: _metadata }, _end_date_initializers, _end_date_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ExportReportDto = ExportReportDto;
