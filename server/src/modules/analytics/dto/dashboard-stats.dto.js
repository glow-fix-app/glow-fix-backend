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
exports.DashboardSummaryResponseDto = exports.DashboardTrendsDto = exports.DashboardStatsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var DashboardStatsDto = function () {
    var _a;
    var _total_revenue_decorators;
    var _total_revenue_initializers = [];
    var _total_revenue_extraInitializers = [];
    var _total_fees_decorators;
    var _total_fees_initializers = [];
    var _total_fees_extraInitializers = [];
    var _net_revenue_decorators;
    var _net_revenue_initializers = [];
    var _net_revenue_extraInitializers = [];
    var _total_bookings_decorators;
    var _total_bookings_initializers = [];
    var _total_bookings_extraInitializers = [];
    var _completed_bookings_decorators;
    var _completed_bookings_initializers = [];
    var _completed_bookings_extraInitializers = [];
    var _cancelled_bookings_decorators;
    var _cancelled_bookings_initializers = [];
    var _cancelled_bookings_extraInitializers = [];
    var _pending_bookings_decorators;
    var _pending_bookings_initializers = [];
    var _pending_bookings_extraInitializers = [];
    var _completion_rate_decorators;
    var _completion_rate_initializers = [];
    var _completion_rate_extraInitializers = [];
    var _total_users_decorators;
    var _total_users_initializers = [];
    var _total_users_extraInitializers = [];
    var _new_users_decorators;
    var _new_users_initializers = [];
    var _new_users_extraInitializers = [];
    var _total_businesses_decorators;
    var _total_businesses_initializers = [];
    var _total_businesses_extraInitializers = [];
    var _new_businesses_decorators;
    var _new_businesses_initializers = [];
    var _new_businesses_extraInitializers = [];
    var _active_businesses_decorators;
    var _active_businesses_initializers = [];
    var _active_businesses_extraInitializers = [];
    var _pending_businesses_decorators;
    var _pending_businesses_initializers = [];
    var _pending_businesses_extraInitializers = [];
    var _average_order_value_decorators;
    var _average_order_value_initializers = [];
    var _average_order_value_extraInitializers = [];
    var _total_points_issued_decorators;
    var _total_points_issued_initializers = [];
    var _total_points_issued_extraInitializers = [];
    var _total_points_redeemed_decorators;
    var _total_points_redeemed_initializers = [];
    var _total_points_redeemed_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardStatsDto() {
                this.total_revenue = __runInitializers(this, _total_revenue_initializers, void 0);
                this.total_fees = (__runInitializers(this, _total_revenue_extraInitializers), __runInitializers(this, _total_fees_initializers, void 0));
                this.net_revenue = (__runInitializers(this, _total_fees_extraInitializers), __runInitializers(this, _net_revenue_initializers, void 0));
                this.total_bookings = (__runInitializers(this, _net_revenue_extraInitializers), __runInitializers(this, _total_bookings_initializers, void 0));
                this.completed_bookings = (__runInitializers(this, _total_bookings_extraInitializers), __runInitializers(this, _completed_bookings_initializers, void 0));
                this.cancelled_bookings = (__runInitializers(this, _completed_bookings_extraInitializers), __runInitializers(this, _cancelled_bookings_initializers, void 0));
                this.pending_bookings = (__runInitializers(this, _cancelled_bookings_extraInitializers), __runInitializers(this, _pending_bookings_initializers, void 0));
                this.completion_rate = (__runInitializers(this, _pending_bookings_extraInitializers), __runInitializers(this, _completion_rate_initializers, void 0));
                this.total_users = (__runInitializers(this, _completion_rate_extraInitializers), __runInitializers(this, _total_users_initializers, void 0));
                this.new_users = (__runInitializers(this, _total_users_extraInitializers), __runInitializers(this, _new_users_initializers, void 0));
                this.total_businesses = (__runInitializers(this, _new_users_extraInitializers), __runInitializers(this, _total_businesses_initializers, void 0));
                this.new_businesses = (__runInitializers(this, _total_businesses_extraInitializers), __runInitializers(this, _new_businesses_initializers, void 0));
                this.active_businesses = (__runInitializers(this, _new_businesses_extraInitializers), __runInitializers(this, _active_businesses_initializers, void 0));
                this.pending_businesses = (__runInitializers(this, _active_businesses_extraInitializers), __runInitializers(this, _pending_businesses_initializers, void 0));
                this.average_order_value = (__runInitializers(this, _pending_businesses_extraInitializers), __runInitializers(this, _average_order_value_initializers, void 0));
                this.total_points_issued = (__runInitializers(this, _average_order_value_extraInitializers), __runInitializers(this, _total_points_issued_initializers, void 0));
                this.total_points_redeemed = (__runInitializers(this, _total_points_issued_extraInitializers), __runInitializers(this, _total_points_redeemed_initializers, void 0));
                __runInitializers(this, _total_points_redeemed_extraInitializers);
            }
            return DashboardStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_revenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total revenue for the period' })];
            _total_fees_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total platform fees collected' })];
            _net_revenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Net revenue after fees' })];
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of bookings' })];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed bookings count' })];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cancelled bookings count' })];
            _pending_bookings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pending bookings count' })];
            _completion_rate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Booking completion rate (%)' })];
            _total_users_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of users' })];
            _new_users_decorators = [(0, swagger_1.ApiProperty)({ description: 'New users this period' })];
            _total_businesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of businesses' })];
            _new_businesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'New businesses this period' })];
            _active_businesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Active businesses' })];
            _pending_businesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pending businesses awaiting approval' })];
            _average_order_value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average order value (EGP)' })];
            _total_points_issued_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total loyalty points issued' })];
            _total_points_redeemed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total loyalty points redeemed' })];
            __esDecorate(null, null, _total_revenue_decorators, { kind: "field", name: "total_revenue", static: false, private: false, access: { has: function (obj) { return "total_revenue" in obj; }, get: function (obj) { return obj.total_revenue; }, set: function (obj, value) { obj.total_revenue = value; } }, metadata: _metadata }, _total_revenue_initializers, _total_revenue_extraInitializers);
            __esDecorate(null, null, _total_fees_decorators, { kind: "field", name: "total_fees", static: false, private: false, access: { has: function (obj) { return "total_fees" in obj; }, get: function (obj) { return obj.total_fees; }, set: function (obj, value) { obj.total_fees = value; } }, metadata: _metadata }, _total_fees_initializers, _total_fees_extraInitializers);
            __esDecorate(null, null, _net_revenue_decorators, { kind: "field", name: "net_revenue", static: false, private: false, access: { has: function (obj) { return "net_revenue" in obj; }, get: function (obj) { return obj.net_revenue; }, set: function (obj, value) { obj.net_revenue = value; } }, metadata: _metadata }, _net_revenue_initializers, _net_revenue_extraInitializers);
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _pending_bookings_decorators, { kind: "field", name: "pending_bookings", static: false, private: false, access: { has: function (obj) { return "pending_bookings" in obj; }, get: function (obj) { return obj.pending_bookings; }, set: function (obj, value) { obj.pending_bookings = value; } }, metadata: _metadata }, _pending_bookings_initializers, _pending_bookings_extraInitializers);
            __esDecorate(null, null, _completion_rate_decorators, { kind: "field", name: "completion_rate", static: false, private: false, access: { has: function (obj) { return "completion_rate" in obj; }, get: function (obj) { return obj.completion_rate; }, set: function (obj, value) { obj.completion_rate = value; } }, metadata: _metadata }, _completion_rate_initializers, _completion_rate_extraInitializers);
            __esDecorate(null, null, _total_users_decorators, { kind: "field", name: "total_users", static: false, private: false, access: { has: function (obj) { return "total_users" in obj; }, get: function (obj) { return obj.total_users; }, set: function (obj, value) { obj.total_users = value; } }, metadata: _metadata }, _total_users_initializers, _total_users_extraInitializers);
            __esDecorate(null, null, _new_users_decorators, { kind: "field", name: "new_users", static: false, private: false, access: { has: function (obj) { return "new_users" in obj; }, get: function (obj) { return obj.new_users; }, set: function (obj, value) { obj.new_users = value; } }, metadata: _metadata }, _new_users_initializers, _new_users_extraInitializers);
            __esDecorate(null, null, _total_businesses_decorators, { kind: "field", name: "total_businesses", static: false, private: false, access: { has: function (obj) { return "total_businesses" in obj; }, get: function (obj) { return obj.total_businesses; }, set: function (obj, value) { obj.total_businesses = value; } }, metadata: _metadata }, _total_businesses_initializers, _total_businesses_extraInitializers);
            __esDecorate(null, null, _new_businesses_decorators, { kind: "field", name: "new_businesses", static: false, private: false, access: { has: function (obj) { return "new_businesses" in obj; }, get: function (obj) { return obj.new_businesses; }, set: function (obj, value) { obj.new_businesses = value; } }, metadata: _metadata }, _new_businesses_initializers, _new_businesses_extraInitializers);
            __esDecorate(null, null, _active_businesses_decorators, { kind: "field", name: "active_businesses", static: false, private: false, access: { has: function (obj) { return "active_businesses" in obj; }, get: function (obj) { return obj.active_businesses; }, set: function (obj, value) { obj.active_businesses = value; } }, metadata: _metadata }, _active_businesses_initializers, _active_businesses_extraInitializers);
            __esDecorate(null, null, _pending_businesses_decorators, { kind: "field", name: "pending_businesses", static: false, private: false, access: { has: function (obj) { return "pending_businesses" in obj; }, get: function (obj) { return obj.pending_businesses; }, set: function (obj, value) { obj.pending_businesses = value; } }, metadata: _metadata }, _pending_businesses_initializers, _pending_businesses_extraInitializers);
            __esDecorate(null, null, _average_order_value_decorators, { kind: "field", name: "average_order_value", static: false, private: false, access: { has: function (obj) { return "average_order_value" in obj; }, get: function (obj) { return obj.average_order_value; }, set: function (obj, value) { obj.average_order_value = value; } }, metadata: _metadata }, _average_order_value_initializers, _average_order_value_extraInitializers);
            __esDecorate(null, null, _total_points_issued_decorators, { kind: "field", name: "total_points_issued", static: false, private: false, access: { has: function (obj) { return "total_points_issued" in obj; }, get: function (obj) { return obj.total_points_issued; }, set: function (obj, value) { obj.total_points_issued = value; } }, metadata: _metadata }, _total_points_issued_initializers, _total_points_issued_extraInitializers);
            __esDecorate(null, null, _total_points_redeemed_decorators, { kind: "field", name: "total_points_redeemed", static: false, private: false, access: { has: function (obj) { return "total_points_redeemed" in obj; }, get: function (obj) { return obj.total_points_redeemed; }, set: function (obj, value) { obj.total_points_redeemed = value; } }, metadata: _metadata }, _total_points_redeemed_initializers, _total_points_redeemed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardStatsDto = DashboardStatsDto;
var DashboardTrendsDto = function () {
    var _a;
    var _revenue_trend_decorators;
    var _revenue_trend_initializers = [];
    var _revenue_trend_extraInitializers = [];
    var _bookings_trend_decorators;
    var _bookings_trend_initializers = [];
    var _bookings_trend_extraInitializers = [];
    var _users_trend_decorators;
    var _users_trend_initializers = [];
    var _users_trend_extraInitializers = [];
    var _businesses_trend_decorators;
    var _businesses_trend_initializers = [];
    var _businesses_trend_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardTrendsDto() {
                this.revenue_trend = __runInitializers(this, _revenue_trend_initializers, void 0);
                this.bookings_trend = (__runInitializers(this, _revenue_trend_extraInitializers), __runInitializers(this, _bookings_trend_initializers, void 0));
                this.users_trend = (__runInitializers(this, _bookings_trend_extraInitializers), __runInitializers(this, _users_trend_initializers, void 0));
                this.businesses_trend = (__runInitializers(this, _users_trend_extraInitializers), __runInitializers(this, _businesses_trend_initializers, void 0));
                __runInitializers(this, _businesses_trend_extraInitializers);
            }
            return DashboardTrendsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _revenue_trend_decorators = [(0, swagger_1.ApiProperty)()];
            _bookings_trend_decorators = [(0, swagger_1.ApiProperty)()];
            _users_trend_decorators = [(0, swagger_1.ApiProperty)()];
            _businesses_trend_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _revenue_trend_decorators, { kind: "field", name: "revenue_trend", static: false, private: false, access: { has: function (obj) { return "revenue_trend" in obj; }, get: function (obj) { return obj.revenue_trend; }, set: function (obj, value) { obj.revenue_trend = value; } }, metadata: _metadata }, _revenue_trend_initializers, _revenue_trend_extraInitializers);
            __esDecorate(null, null, _bookings_trend_decorators, { kind: "field", name: "bookings_trend", static: false, private: false, access: { has: function (obj) { return "bookings_trend" in obj; }, get: function (obj) { return obj.bookings_trend; }, set: function (obj, value) { obj.bookings_trend = value; } }, metadata: _metadata }, _bookings_trend_initializers, _bookings_trend_extraInitializers);
            __esDecorate(null, null, _users_trend_decorators, { kind: "field", name: "users_trend", static: false, private: false, access: { has: function (obj) { return "users_trend" in obj; }, get: function (obj) { return obj.users_trend; }, set: function (obj, value) { obj.users_trend = value; } }, metadata: _metadata }, _users_trend_initializers, _users_trend_extraInitializers);
            __esDecorate(null, null, _businesses_trend_decorators, { kind: "field", name: "businesses_trend", static: false, private: false, access: { has: function (obj) { return "businesses_trend" in obj; }, get: function (obj) { return obj.businesses_trend; }, set: function (obj, value) { obj.businesses_trend = value; } }, metadata: _metadata }, _businesses_trend_initializers, _businesses_trend_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardTrendsDto = DashboardTrendsDto;
var DashboardSummaryResponseDto = function () {
    var _a;
    var _stats_decorators;
    var _stats_initializers = [];
    var _stats_extraInitializers = [];
    var _trends_decorators;
    var _trends_initializers = [];
    var _trends_extraInitializers = [];
    var _period_decorators;
    var _period_initializers = [];
    var _period_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DashboardSummaryResponseDto() {
                this.stats = __runInitializers(this, _stats_initializers, void 0);
                this.trends = (__runInitializers(this, _stats_extraInitializers), __runInitializers(this, _trends_initializers, void 0));
                this.period = (__runInitializers(this, _trends_extraInitializers), __runInitializers(this, _period_initializers, void 0));
                __runInitializers(this, _period_extraInitializers);
            }
            return DashboardSummaryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _stats_decorators = [(0, swagger_1.ApiProperty)({ type: DashboardStatsDto })];
            _trends_decorators = [(0, swagger_1.ApiProperty)({ type: DashboardTrendsDto })];
            _period_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _stats_decorators, { kind: "field", name: "stats", static: false, private: false, access: { has: function (obj) { return "stats" in obj; }, get: function (obj) { return obj.stats; }, set: function (obj, value) { obj.stats = value; } }, metadata: _metadata }, _stats_initializers, _stats_extraInitializers);
            __esDecorate(null, null, _trends_decorators, { kind: "field", name: "trends", static: false, private: false, access: { has: function (obj) { return "trends" in obj; }, get: function (obj) { return obj.trends; }, set: function (obj, value) { obj.trends = value; } }, metadata: _metadata }, _trends_initializers, _trends_extraInitializers);
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: function (obj) { return "period" in obj; }, get: function (obj) { return obj.period; }, set: function (obj, value) { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DashboardSummaryResponseDto = DashboardSummaryResponseDto;
