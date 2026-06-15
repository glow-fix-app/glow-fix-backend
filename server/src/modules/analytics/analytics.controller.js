"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var dashboard_stats_dto_1 = require("./dto/dashboard-stats.dto");
var revenue_stats_dto_1 = require("./dto/revenue-stats.dto");
var booking_metrics_dto_1 = require("./dto/booking-metrics.dto");
var business_performance_dto_1 = require("./dto/business-performance.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var AnalyticsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Analytics'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'analytics', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboardStats_decorators;
    var _getRevenueStats_decorators;
    var _getRevenueSummary_decorators;
    var _getPaymentMethodStats_decorators;
    var _getBookingMetrics_decorators;
    var _getTopServices_decorators;
    var _getBusinessPerformance_decorators;
    var _getBusinessPerformanceById_decorators;
    var _exportRevenueReport_decorators;
    var AnalyticsController = _classThis = /** @class */ (function () {
        function AnalyticsController_1(analyticsService) {
            this.analyticsService = (__runInitializers(this, _instanceExtraInitializers), analyticsService);
        }
        // ==================== DASHBOARD STATISTICS ====================
        AnalyticsController_1.prototype.getDashboardStats = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getDashboardStats(user.id, user.role, query)];
                });
            });
        };
        // ==================== REVENUE STATISTICS ====================
        AnalyticsController_1.prototype.getRevenueStats = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getRevenueStats(user.id, user.role, query)];
                });
            });
        };
        AnalyticsController_1.prototype.getRevenueSummary = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getRevenueSummary(user.id, user.role, query)];
                });
            });
        };
        AnalyticsController_1.prototype.getPaymentMethodStats = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getPaymentMethodStats(user.id, user.role, query)];
                });
            });
        };
        // ==================== BOOKING METRICS ====================
        AnalyticsController_1.prototype.getBookingMetrics = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getBookingMetrics(user.id, user.role, query)];
                });
            });
        };
        AnalyticsController_1.prototype.getTopServices = function (user_1, query_1) {
            return __awaiter(this, arguments, void 0, function (user, query, limit) {
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getTopServices(user.id, user.role, query, limit)];
                });
            });
        };
        // ==================== BUSINESS PERFORMANCE ====================
        AnalyticsController_1.prototype.getBusinessPerformance = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getBusinessPerformance(query, page, limit)];
                });
            });
        };
        AnalyticsController_1.prototype.getBusinessPerformanceById = function (user, businessId, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getBusinessPerformanceById(user.id, user.role, businessId, query)];
                });
            });
        };
        // ==================== EXPORT REPORTS ====================
        AnalyticsController_1.prototype.exportRevenueReport = function (user, dto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, filename, headers, csvRows;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.analyticsService.exportRevenueReport(user.id, user.role, dto)];
                        case 1:
                            _a = _b.sent(), data = _a.data, filename = _a.filename;
                            res.setHeader('Content-Type', 'text/csv');
                            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
                            if (data.length === 0) {
                                res.send('No data available');
                                return [2 /*return*/];
                            }
                            headers = Object.keys(data[0]);
                            csvRows = __spreadArray([
                                headers.join(',')
                            ], data.map(function (row) { return headers.map(function (h) { return JSON.stringify(row[h] || ''); }).join(','); }), true);
                            res.send(csvRows.join('\n'));
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AnalyticsController_1;
    }());
    __setFunctionName(_classThis, "AnalyticsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboardStats_decorators = [(0, common_1.Get)('dashboard'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard statistics', type: dashboard_stats_dto_1.DashboardSummaryResponseDto })];
        _getRevenueStats_decorators = [(0, common_1.Get)('revenue'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get revenue statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue statistics', type: revenue_stats_dto_1.RevenueStatsDto })];
        _getRevenueSummary_decorators = [(0, common_1.Get)('revenue/summary'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get revenue summary' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue summary', type: revenue_stats_dto_1.RevenueSummaryDto })];
        _getPaymentMethodStats_decorators = [(0, common_1.Get)('revenue/payment-methods'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get payment method statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment method stats', type: [revenue_stats_dto_1.PaymentMethodStatsDto] })];
        _getBookingMetrics_decorators = [(0, common_1.Get)('bookings'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get booking metrics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking metrics', type: booking_metrics_dto_1.BookingMetricsDto })];
        _getTopServices_decorators = [(0, common_1.Get)('bookings/top-services'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get top services by bookings' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Top services', type: booking_metrics_dto_1.TopServicesDto })];
        _getBusinessPerformance_decorators = [(0, common_1.Get)('businesses'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Get business performance list (admin only)' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Business performance list', type: business_performance_dto_1.BusinessPerformanceListDto })];
        _getBusinessPerformanceById_decorators = [(0, common_1.Get)('businesses/:businessId'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get business performance by ID' }), (0, swagger_1.ApiParam)({ name: 'businessId', description: 'Business UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Business performance', type: business_performance_dto_1.BusinessPerformanceDto })];
        _exportRevenueReport_decorators = [(0, common_1.Post)('export/revenue'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Export revenue report as CSV' })];
        __esDecorate(_classThis, null, _getDashboardStats_decorators, { kind: "method", name: "getDashboardStats", static: false, private: false, access: { has: function (obj) { return "getDashboardStats" in obj; }, get: function (obj) { return obj.getDashboardStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevenueStats_decorators, { kind: "method", name: "getRevenueStats", static: false, private: false, access: { has: function (obj) { return "getRevenueStats" in obj; }, get: function (obj) { return obj.getRevenueStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevenueSummary_decorators, { kind: "method", name: "getRevenueSummary", static: false, private: false, access: { has: function (obj) { return "getRevenueSummary" in obj; }, get: function (obj) { return obj.getRevenueSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPaymentMethodStats_decorators, { kind: "method", name: "getPaymentMethodStats", static: false, private: false, access: { has: function (obj) { return "getPaymentMethodStats" in obj; }, get: function (obj) { return obj.getPaymentMethodStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBookingMetrics_decorators, { kind: "method", name: "getBookingMetrics", static: false, private: false, access: { has: function (obj) { return "getBookingMetrics" in obj; }, get: function (obj) { return obj.getBookingMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopServices_decorators, { kind: "method", name: "getTopServices", static: false, private: false, access: { has: function (obj) { return "getTopServices" in obj; }, get: function (obj) { return obj.getTopServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessPerformance_decorators, { kind: "method", name: "getBusinessPerformance", static: false, private: false, access: { has: function (obj) { return "getBusinessPerformance" in obj; }, get: function (obj) { return obj.getBusinessPerformance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessPerformanceById_decorators, { kind: "method", name: "getBusinessPerformanceById", static: false, private: false, access: { has: function (obj) { return "getBusinessPerformanceById" in obj; }, get: function (obj) { return obj.getBusinessPerformanceById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportRevenueReport_decorators, { kind: "method", name: "exportRevenueReport", static: false, private: false, access: { has: function (obj) { return "exportRevenueReport" in obj; }, get: function (obj) { return obj.exportRevenueReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsController = _classThis;
}();
exports.AnalyticsController = AnalyticsController;
