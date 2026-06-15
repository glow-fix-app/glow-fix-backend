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
exports.PaymentMethodStatsDto = exports.RevenueSummaryDto = exports.RevenueStatsDto = exports.RevenuePointDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var RevenuePointDto = function () {
    var _a;
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _revenue_decorators;
    var _revenue_initializers = [];
    var _revenue_extraInitializers = [];
    var _fees_decorators;
    var _fees_initializers = [];
    var _fees_extraInitializers = [];
    var _net_revenue_decorators;
    var _net_revenue_initializers = [];
    var _net_revenue_extraInitializers = [];
    var _bookings_count_decorators;
    var _bookings_count_initializers = [];
    var _bookings_count_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RevenuePointDto() {
                this.date = __runInitializers(this, _date_initializers, void 0);
                this.revenue = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _revenue_initializers, void 0));
                this.fees = (__runInitializers(this, _revenue_extraInitializers), __runInitializers(this, _fees_initializers, void 0));
                this.net_revenue = (__runInitializers(this, _fees_extraInitializers), __runInitializers(this, _net_revenue_initializers, void 0));
                this.bookings_count = (__runInitializers(this, _net_revenue_extraInitializers), __runInitializers(this, _bookings_count_initializers, void 0));
                __runInitializers(this, _bookings_count_extraInitializers);
            }
            return RevenuePointDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _date_decorators = [(0, swagger_1.ApiProperty)()];
            _revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _fees_decorators = [(0, swagger_1.ApiProperty)()];
            _net_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _bookings_count_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _revenue_decorators, { kind: "field", name: "revenue", static: false, private: false, access: { has: function (obj) { return "revenue" in obj; }, get: function (obj) { return obj.revenue; }, set: function (obj, value) { obj.revenue = value; } }, metadata: _metadata }, _revenue_initializers, _revenue_extraInitializers);
            __esDecorate(null, null, _fees_decorators, { kind: "field", name: "fees", static: false, private: false, access: { has: function (obj) { return "fees" in obj; }, get: function (obj) { return obj.fees; }, set: function (obj, value) { obj.fees = value; } }, metadata: _metadata }, _fees_initializers, _fees_extraInitializers);
            __esDecorate(null, null, _net_revenue_decorators, { kind: "field", name: "net_revenue", static: false, private: false, access: { has: function (obj) { return "net_revenue" in obj; }, get: function (obj) { return obj.net_revenue; }, set: function (obj, value) { obj.net_revenue = value; } }, metadata: _metadata }, _net_revenue_initializers, _net_revenue_extraInitializers);
            __esDecorate(null, null, _bookings_count_decorators, { kind: "field", name: "bookings_count", static: false, private: false, access: { has: function (obj) { return "bookings_count" in obj; }, get: function (obj) { return obj.bookings_count; }, set: function (obj, value) { obj.bookings_count = value; } }, metadata: _metadata }, _bookings_count_initializers, _bookings_count_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RevenuePointDto = RevenuePointDto;
var RevenueStatsDto = function () {
    var _a;
    var _daily_decorators;
    var _daily_initializers = [];
    var _daily_extraInitializers = [];
    var _weekly_decorators;
    var _weekly_initializers = [];
    var _weekly_extraInitializers = [];
    var _monthly_decorators;
    var _monthly_initializers = [];
    var _monthly_extraInitializers = [];
    var _yearly_decorators;
    var _yearly_initializers = [];
    var _yearly_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RevenueStatsDto() {
                this.daily = __runInitializers(this, _daily_initializers, void 0);
                this.weekly = (__runInitializers(this, _daily_extraInitializers), __runInitializers(this, _weekly_initializers, void 0));
                this.monthly = (__runInitializers(this, _weekly_extraInitializers), __runInitializers(this, _monthly_initializers, void 0));
                this.yearly = (__runInitializers(this, _monthly_extraInitializers), __runInitializers(this, _yearly_initializers, void 0));
                __runInitializers(this, _yearly_extraInitializers);
            }
            return RevenueStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _daily_decorators = [(0, swagger_1.ApiProperty)({ type: [RevenuePointDto] })];
            _weekly_decorators = [(0, swagger_1.ApiProperty)({ type: [RevenuePointDto] })];
            _monthly_decorators = [(0, swagger_1.ApiProperty)({ type: [RevenuePointDto] })];
            _yearly_decorators = [(0, swagger_1.ApiProperty)({ type: [RevenuePointDto] })];
            __esDecorate(null, null, _daily_decorators, { kind: "field", name: "daily", static: false, private: false, access: { has: function (obj) { return "daily" in obj; }, get: function (obj) { return obj.daily; }, set: function (obj, value) { obj.daily = value; } }, metadata: _metadata }, _daily_initializers, _daily_extraInitializers);
            __esDecorate(null, null, _weekly_decorators, { kind: "field", name: "weekly", static: false, private: false, access: { has: function (obj) { return "weekly" in obj; }, get: function (obj) { return obj.weekly; }, set: function (obj, value) { obj.weekly = value; } }, metadata: _metadata }, _weekly_initializers, _weekly_extraInitializers);
            __esDecorate(null, null, _monthly_decorators, { kind: "field", name: "monthly", static: false, private: false, access: { has: function (obj) { return "monthly" in obj; }, get: function (obj) { return obj.monthly; }, set: function (obj, value) { obj.monthly = value; } }, metadata: _metadata }, _monthly_initializers, _monthly_extraInitializers);
            __esDecorate(null, null, _yearly_decorators, { kind: "field", name: "yearly", static: false, private: false, access: { has: function (obj) { return "yearly" in obj; }, get: function (obj) { return obj.yearly; }, set: function (obj, value) { obj.yearly = value; } }, metadata: _metadata }, _yearly_initializers, _yearly_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RevenueStatsDto = RevenueStatsDto;
var RevenueSummaryDto = function () {
    var _a;
    var _total_revenue_decorators;
    var _total_revenue_initializers = [];
    var _total_revenue_extraInitializers = [];
    var _platform_fees_decorators;
    var _platform_fees_initializers = [];
    var _platform_fees_extraInitializers = [];
    var _net_revenue_decorators;
    var _net_revenue_initializers = [];
    var _net_revenue_extraInitializers = [];
    var _average_daily_revenue_decorators;
    var _average_daily_revenue_initializers = [];
    var _average_daily_revenue_extraInitializers = [];
    var _projected_monthly_revenue_decorators;
    var _projected_monthly_revenue_initializers = [];
    var _projected_monthly_revenue_extraInitializers = [];
    var _revenue_growth_percent_decorators;
    var _revenue_growth_percent_initializers = [];
    var _revenue_growth_percent_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RevenueSummaryDto() {
                this.total_revenue = __runInitializers(this, _total_revenue_initializers, void 0);
                this.platform_fees = (__runInitializers(this, _total_revenue_extraInitializers), __runInitializers(this, _platform_fees_initializers, void 0));
                this.net_revenue = (__runInitializers(this, _platform_fees_extraInitializers), __runInitializers(this, _net_revenue_initializers, void 0));
                this.average_daily_revenue = (__runInitializers(this, _net_revenue_extraInitializers), __runInitializers(this, _average_daily_revenue_initializers, void 0));
                this.projected_monthly_revenue = (__runInitializers(this, _average_daily_revenue_extraInitializers), __runInitializers(this, _projected_monthly_revenue_initializers, void 0));
                this.revenue_growth_percent = (__runInitializers(this, _projected_monthly_revenue_extraInitializers), __runInitializers(this, _revenue_growth_percent_initializers, void 0));
                __runInitializers(this, _revenue_growth_percent_extraInitializers);
            }
            return RevenueSummaryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _platform_fees_decorators = [(0, swagger_1.ApiProperty)()];
            _net_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _average_daily_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _projected_monthly_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _revenue_growth_percent_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _total_revenue_decorators, { kind: "field", name: "total_revenue", static: false, private: false, access: { has: function (obj) { return "total_revenue" in obj; }, get: function (obj) { return obj.total_revenue; }, set: function (obj, value) { obj.total_revenue = value; } }, metadata: _metadata }, _total_revenue_initializers, _total_revenue_extraInitializers);
            __esDecorate(null, null, _platform_fees_decorators, { kind: "field", name: "platform_fees", static: false, private: false, access: { has: function (obj) { return "platform_fees" in obj; }, get: function (obj) { return obj.platform_fees; }, set: function (obj, value) { obj.platform_fees = value; } }, metadata: _metadata }, _platform_fees_initializers, _platform_fees_extraInitializers);
            __esDecorate(null, null, _net_revenue_decorators, { kind: "field", name: "net_revenue", static: false, private: false, access: { has: function (obj) { return "net_revenue" in obj; }, get: function (obj) { return obj.net_revenue; }, set: function (obj, value) { obj.net_revenue = value; } }, metadata: _metadata }, _net_revenue_initializers, _net_revenue_extraInitializers);
            __esDecorate(null, null, _average_daily_revenue_decorators, { kind: "field", name: "average_daily_revenue", static: false, private: false, access: { has: function (obj) { return "average_daily_revenue" in obj; }, get: function (obj) { return obj.average_daily_revenue; }, set: function (obj, value) { obj.average_daily_revenue = value; } }, metadata: _metadata }, _average_daily_revenue_initializers, _average_daily_revenue_extraInitializers);
            __esDecorate(null, null, _projected_monthly_revenue_decorators, { kind: "field", name: "projected_monthly_revenue", static: false, private: false, access: { has: function (obj) { return "projected_monthly_revenue" in obj; }, get: function (obj) { return obj.projected_monthly_revenue; }, set: function (obj, value) { obj.projected_monthly_revenue = value; } }, metadata: _metadata }, _projected_monthly_revenue_initializers, _projected_monthly_revenue_extraInitializers);
            __esDecorate(null, null, _revenue_growth_percent_decorators, { kind: "field", name: "revenue_growth_percent", static: false, private: false, access: { has: function (obj) { return "revenue_growth_percent" in obj; }, get: function (obj) { return obj.revenue_growth_percent; }, set: function (obj, value) { obj.revenue_growth_percent = value; } }, metadata: _metadata }, _revenue_growth_percent_initializers, _revenue_growth_percent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RevenueSummaryDto = RevenueSummaryDto;
var PaymentMethodStatsDto = function () {
    var _a;
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _total_amount_decorators;
    var _total_amount_initializers = [];
    var _total_amount_extraInitializers = [];
    var _count_decorators;
    var _count_initializers = [];
    var _count_extraInitializers = [];
    var _percentage_decorators;
    var _percentage_initializers = [];
    var _percentage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaymentMethodStatsDto() {
                this.method = __runInitializers(this, _method_initializers, void 0);
                this.total_amount = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _total_amount_initializers, void 0));
                this.count = (__runInitializers(this, _total_amount_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.percentage = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _percentage_initializers, void 0));
                __runInitializers(this, _percentage_extraInitializers);
            }
            return PaymentMethodStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _method_decorators = [(0, swagger_1.ApiProperty)()];
            _total_amount_decorators = [(0, swagger_1.ApiProperty)()];
            _count_decorators = [(0, swagger_1.ApiProperty)()];
            _percentage_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _total_amount_decorators, { kind: "field", name: "total_amount", static: false, private: false, access: { has: function (obj) { return "total_amount" in obj; }, get: function (obj) { return obj.total_amount; }, set: function (obj, value) { obj.total_amount = value; } }, metadata: _metadata }, _total_amount_initializers, _total_amount_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _percentage_decorators, { kind: "field", name: "percentage", static: false, private: false, access: { has: function (obj) { return "percentage" in obj; }, get: function (obj) { return obj.percentage; }, set: function (obj, value) { obj.percentage = value; } }, metadata: _metadata }, _percentage_initializers, _percentage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaymentMethodStatsDto = PaymentMethodStatsDto;
