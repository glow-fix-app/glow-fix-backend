"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var analytics_query_dto_1 = require("./dto/analytics-query.dto");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(AnalyticsService.name);
        }
        // ==================== DATE RANGE HELPERS ====================
        AnalyticsService_1.prototype.getDateRange = function (range, startDate, endDate) {
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var end = new Date(today);
            end.setHours(23, 59, 59, 999);
            var start = new Date(today);
            switch (range !== null && range !== void 0 ? range : analytics_query_dto_1.TimeRange.THIS_MONTH) {
                case analytics_query_dto_1.TimeRange.TODAY:
                    start = today;
                    break;
                case analytics_query_dto_1.TimeRange.YESTERDAY:
                    start = new Date(today);
                    start.setDate(start.getDate() - 1);
                    end.setDate(end.getDate() - 1);
                    break;
                case analytics_query_dto_1.TimeRange.THIS_WEEK:
                    start.setDate(today.getDate() - today.getDay());
                    break;
                case analytics_query_dto_1.TimeRange.LAST_WEEK:
                    start.setDate(today.getDate() - today.getDay() - 7);
                    end.setDate(today.getDate() - today.getDay() - 1);
                    break;
                case analytics_query_dto_1.TimeRange.THIS_MONTH:
                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                    break;
                case analytics_query_dto_1.TimeRange.LAST_MONTH:
                    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    end = new Date(today.getFullYear(), today.getMonth(), 0);
                    break;
                case analytics_query_dto_1.TimeRange.THIS_QUARTER:
                    var quarter = Math.floor(today.getMonth() / 3);
                    start = new Date(today.getFullYear(), quarter * 3, 1);
                    break;
                case analytics_query_dto_1.TimeRange.THIS_YEAR:
                    start = new Date(today.getFullYear(), 0, 1);
                    break;
                case analytics_query_dto_1.TimeRange.CUSTOM:
                    if (startDate && endDate) {
                        start = new Date(startDate);
                        end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                    }
                    break;
            }
            return { start: start, end: end };
        };
        // ==================== DASHBOARD STATISTICS ====================
        AnalyticsService_1.prototype.getDashboardStats = function (userId, userRole, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end, previousStart, previousEnd, diffDays, businessFilter, business, currentStats, previousStats, trends, periodLabel;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            previousStart = new Date(start);
                            previousEnd = new Date(end);
                            diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                            previousStart.setDate(previousStart.getDate() - diffDays);
                            previousEnd.setDate(previousEnd.getDate() - diffDays);
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _c.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _c.label = 2;
                        case 2: return [4 /*yield*/, this.getPeriodStats(start, end, businessFilter)];
                        case 3:
                            currentStats = _c.sent();
                            return [4 /*yield*/, this.getPeriodStats(previousStart, previousEnd, businessFilter)];
                        case 4:
                            previousStats = _c.sent();
                            trends = {
                                revenue_trend: previousStats.total_revenue > 0
                                    ? ((currentStats.total_revenue - previousStats.total_revenue) / previousStats.total_revenue) * 100
                                    : 0,
                                bookings_trend: previousStats.total_bookings > 0
                                    ? ((currentStats.total_bookings - previousStats.total_bookings) / previousStats.total_bookings) * 100
                                    : 0,
                                users_trend: previousStats.new_users > 0
                                    ? ((currentStats.new_users - previousStats.new_users) / previousStats.new_users) * 100
                                    : 0,
                                businesses_trend: previousStats.new_businesses > 0
                                    ? ((currentStats.new_businesses - previousStats.new_businesses) / previousStats.new_businesses) * 100
                                    : 0,
                            };
                            periodLabel = this.getPeriodLabel((_b = query.range) !== null && _b !== void 0 ? _b : analytics_query_dto_1.TimeRange.THIS_MONTH, start, end);
                            return [2 /*return*/, {
                                    stats: currentStats,
                                    trends: trends,
                                    period: periodLabel,
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.getPeriodStats = function (start, end, businessFilter) {
            return __awaiter(this, void 0, void 0, function () {
                var payments, totalRevenue, platformFees, netRevenue, bookings, completedBookings, cancelledBookings, pendingBookings, completionRate, averageOrderValue, userWhere, newUsers, totalUsers, newBusinesses, totalBusinesses, activeBusinesses, pendingBusinesses, loyaltyStats, totalPointsIssued, totalPointsRedeemed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findMany({
                                where: __assign({ OR: [
                                        { paidAt: { gte: start, lte: end } },
                                        { paidAt: null, createdAt: { gte: start, lte: end } }
                                    ], status: { context: 'PAID' } }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                select: { amount: true },
                            })];
                        case 1:
                            payments = _a.sent();
                            totalRevenue = payments.reduce(function (sum, p) { return sum + Number(p.amount); }, 0);
                            platformFees = totalRevenue * 0.1;
                            netRevenue = totalRevenue - platformFees;
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: __assign({ createdAt: { gte: start, lte: end } }, businessFilter),
                                    include: {
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                        },
                                    },
                                })];
                        case 2:
                            bookings = _a.sent();
                            completedBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'COMPLETED'; }).length;
                            cancelledBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'CANCELLED'; }).length;
                            pendingBookings = bookings.filter(function (b) { var _a, _b; return ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'].includes(((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING'); }).length;
                            completionRate = bookings.length > 0 ? (completedBookings / bookings.length) * 100 : 0;
                            averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
                            userWhere = {
                                createdAt: { gte: start, lte: end },
                            };
                            if (businessFilter.businessId) {
                                // For manager, count clients who booked with this business
                                userWhere.client = {
                                    vehicles: {
                                        some: {
                                            bookings: { some: { businessId: businessFilter.businessId } }
                                        }
                                    }
                                };
                            }
                            return [4 /*yield*/, this.prisma.user.count({
                                    where: userWhere,
                                })];
                        case 3:
                            newUsers = _a.sent();
                            return [4 /*yield*/, this.prisma.user.count()];
                        case 4:
                            totalUsers = _a.sent();
                            newBusinesses = 0;
                            totalBusinesses = 0;
                            activeBusinesses = 0;
                            pendingBusinesses = 0;
                            if (!!businessFilter.businessId) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.prisma.business.count({
                                    where: { createdAt: { gte: start, lte: end } },
                                })];
                        case 5:
                            newBusinesses = _a.sent();
                            return [4 /*yield*/, this.prisma.business.count()];
                        case 6:
                            totalBusinesses = _a.sent();
                            return [4 /*yield*/, this.prisma.business.count({
                                    where: {
                                        statusHistory: { some: { status: { context: 'APPROVED' } } },
                                    },
                                })];
                        case 7:
                            activeBusinesses = _a.sent();
                            return [4 /*yield*/, this.prisma.business.count({
                                    where: {
                                        statusHistory: { some: { status: { context: 'PENDING_REVIEW' } } },
                                    },
                                })];
                        case 8:
                            pendingBusinesses = _a.sent();
                            _a.label = 9;
                        case 9: return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                where: {
                                    createdAt: { gte: start, lte: end },
                                },
                                _sum: {
                                    points: true,
                                },
                            })];
                        case 10:
                            loyaltyStats = _a.sent();
                            totalPointsIssued = loyaltyStats._sum.points || 0;
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                    where: {
                                        createdAt: { gte: start, lte: end },
                                        points: { lt: 0 },
                                    },
                                    _sum: { points: true },
                                })];
                        case 11:
                            totalPointsRedeemed = _a.sent();
                            return [2 /*return*/, {
                                    total_revenue: totalRevenue,
                                    total_fees: platformFees,
                                    net_revenue: netRevenue,
                                    total_bookings: bookings.length,
                                    completed_bookings: completedBookings,
                                    cancelled_bookings: cancelledBookings,
                                    pending_bookings: pendingBookings,
                                    completion_rate: Math.round(completionRate * 10) / 10,
                                    total_users: totalUsers,
                                    new_users: newUsers,
                                    new_businesses: newBusinesses,
                                    total_businesses: totalBusinesses,
                                    active_businesses: activeBusinesses,
                                    pending_businesses: pendingBusinesses,
                                    average_order_value: Math.round(averageOrderValue * 100) / 100,
                                    total_points_issued: totalPointsIssued,
                                    total_points_redeemed: Math.abs(totalPointsRedeemed._sum.points || 0),
                                }];
                    }
                });
            });
        };
        // ==================== REVENUE STATISTICS ====================
        AnalyticsService_1.prototype.getRevenueStats = function (userId, userRole, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end, groupBy, businessFilter, business, paidStatus, payments, revenueByDate, _i, payments_1, payment, key, date, amount, fee, week, existing, revenuePoints;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            groupBy = query.group_by || 'day';
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _b.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PAID' },
                            })];
                        case 3:
                            paidStatus = _b.sent();
                            return [4 /*yield*/, this.prisma.payment.findMany({
                                    where: __assign({ OR: [
                                            { paidAt: { gte: start, lte: end } },
                                            { paidAt: null, createdAt: { gte: start, lte: end } }
                                        ], statusId: paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                    include: {
                                        booking: {
                                            include: {
                                                business: true,
                                            },
                                        },
                                    },
                                    orderBy: { paidAt: 'asc' },
                                })];
                        case 4:
                            payments = _b.sent();
                            revenueByDate = new Map();
                            for (_i = 0, payments_1 = payments; _i < payments_1.length; _i++) {
                                payment = payments_1[_i];
                                key = void 0;
                                date = payment.paidAt || payment.createdAt;
                                amount = Number(payment.amount);
                                fee = amount * 0.1;
                                switch (groupBy) {
                                    case 'day':
                                        key = date.toISOString().split('T')[0];
                                        break;
                                    case 'week':
                                        week = this.getWeekNumber(date);
                                        key = "".concat(date.getFullYear(), "-W").concat(week);
                                        break;
                                    case 'month':
                                        key = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0'));
                                        break;
                                    case 'year':
                                        key = date.getFullYear().toString();
                                        break;
                                    default:
                                        key = date.toISOString().split('T')[0];
                                }
                                existing = revenueByDate.get(key) || { revenue: 0, fees: 0, bookings: 0 };
                                existing.revenue += amount;
                                existing.fees += fee;
                                existing.bookings += 1;
                                revenueByDate.set(key, existing);
                            }
                            revenuePoints = Array.from(revenueByDate.entries())
                                .map(function (_a) {
                                var date = _a[0], data = _a[1];
                                return ({
                                    date: date,
                                    revenue: Math.round(data.revenue * 100) / 100,
                                    fees: Math.round(data.fees * 100) / 100,
                                    net_revenue: Math.round((data.revenue - data.fees) * 100) / 100,
                                    bookings_count: data.bookings,
                                });
                            })
                                .sort(function (a, b) { return a.date.localeCompare(b.date); });
                            return [2 /*return*/, {
                                    daily: groupBy === 'day' ? revenuePoints : [],
                                    weekly: groupBy === 'week' ? revenuePoints : [],
                                    monthly: groupBy === 'month' ? revenuePoints : [],
                                    yearly: groupBy === 'year' ? revenuePoints : [],
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.getRevenueSummary = function (userId, userRole, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end, businessFilter, business, paidStatus, payments, totalRevenue, platformFees, netRevenue, daysInPeriod, averageDailyRevenue, projectedMonthlyRevenue, previousStart, previousEnd, diffDays, previousPayments, previousRevenue, revenueGrowthPercent;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _b.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PAID' },
                            })];
                        case 3:
                            paidStatus = _b.sent();
                            return [4 /*yield*/, this.prisma.payment.findMany({
                                    where: __assign({ OR: [
                                            { paidAt: { gte: start, lte: end } },
                                            { paidAt: null, createdAt: { gte: start, lte: end } }
                                        ], statusId: paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                    select: { amount: true, paidAt: true },
                                })];
                        case 4:
                            payments = _b.sent();
                            totalRevenue = payments.reduce(function (sum, p) { return sum + Number(p.amount); }, 0);
                            platformFees = totalRevenue * 0.1;
                            netRevenue = totalRevenue - platformFees;
                            daysInPeriod = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
                            averageDailyRevenue = totalRevenue / daysInPeriod;
                            projectedMonthlyRevenue = averageDailyRevenue * 30;
                            previousStart = new Date(start);
                            previousEnd = new Date(end);
                            diffDays = daysInPeriod;
                            previousStart.setDate(previousStart.getDate() - diffDays);
                            previousEnd.setDate(previousEnd.getDate() - diffDays);
                            return [4 /*yield*/, this.prisma.payment.findMany({
                                    where: __assign({ OR: [
                                            { paidAt: { gte: previousStart, lte: previousEnd } },
                                            { paidAt: null, createdAt: { gte: previousStart, lte: previousEnd } }
                                        ], statusId: paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                    select: { amount: true },
                                })];
                        case 5:
                            previousPayments = _b.sent();
                            previousRevenue = previousPayments.reduce(function (sum, p) { return sum + Number(p.amount); }, 0);
                            revenueGrowthPercent = previousRevenue > 0
                                ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
                                : totalRevenue > 0 ? 100 : 0;
                            return [2 /*return*/, {
                                    total_revenue: Math.round(totalRevenue * 100) / 100,
                                    platform_fees: Math.round(platformFees * 100) / 100,
                                    net_revenue: Math.round(netRevenue * 100) / 100,
                                    average_daily_revenue: Math.round(averageDailyRevenue * 100) / 100,
                                    projected_monthly_revenue: Math.round(projectedMonthlyRevenue * 100) / 100,
                                    revenue_growth_percent: Math.round(revenueGrowthPercent * 10) / 10,
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.getPaymentMethodStats = function (userId, userRole, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end, businessFilter, business, paidStatus, payments, methodStats, _i, payments_2, payment, methodName, amount, existing, totalAmount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _b.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PAID' },
                            })];
                        case 3:
                            paidStatus = _b.sent();
                            return [4 /*yield*/, this.prisma.payment.findMany({
                                    where: __assign({ OR: [
                                            { paidAt: { gte: start, lte: end } },
                                            { paidAt: null, createdAt: { gte: start, lte: end } }
                                        ], statusId: paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                    include: {
                                        paymentMethod: true,
                                    },
                                })];
                        case 4:
                            payments = _b.sent();
                            methodStats = new Map();
                            for (_i = 0, payments_2 = payments; _i < payments_2.length; _i++) {
                                payment = payments_2[_i];
                                methodName = payment.paymentMethod.name;
                                amount = Number(payment.amount);
                                existing = methodStats.get(methodName) || { total_amount: 0, count: 0 };
                                existing.total_amount += amount;
                                existing.count += 1;
                                methodStats.set(methodName, existing);
                            }
                            totalAmount = Array.from(methodStats.values()).reduce(function (sum, m) { return sum + m.total_amount; }, 0);
                            return [2 /*return*/, Array.from(methodStats.entries()).map(function (_a) {
                                    var method = _a[0], stats = _a[1];
                                    return ({
                                        method: method,
                                        total_amount: Math.round(stats.total_amount * 100) / 100,
                                        count: stats.count,
                                        percentage: totalAmount > 0 ? Math.round((stats.total_amount / totalAmount) * 100) : 0,
                                    });
                                })];
                    }
                });
            });
        };
        // ==================== BOOKING METRICS ====================
        AnalyticsService_1.prototype.getBookingMetrics = function (userId, userRole, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, start, end, businessFilter, business, bookings, statusCounts, totalCompletionTime, totalCancellationTime, completedCount, cancelledCount, noShowCount, _i, bookings_1, booking, status_1, createdAt, completedAt, bookingsByStatus, bookingsByHour, _b, bookings_2, booking, hour, dayNames, bookingsByDay, _c, bookings_3, booking, day;
                var _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _h.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _h.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.booking.findMany({
                                where: __assign({ createdAt: { gte: start, lte: end } }, businessFilter),
                                include: {
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                    cancellation: true,
                                },
                            })];
                        case 3:
                            bookings = _h.sent();
                            statusCounts = {};
                            totalCompletionTime = 0;
                            totalCancellationTime = 0;
                            completedCount = 0;
                            cancelledCount = 0;
                            noShowCount = 0;
                            for (_i = 0, bookings_1 = bookings; _i < bookings_1.length; _i++) {
                                booking = bookings_1[_i];
                                status_1 = ((_e = (_d = booking.statusHistory[0]) === null || _d === void 0 ? void 0 : _d.status) === null || _e === void 0 ? void 0 : _e.context) || 'PENDING';
                                statusCounts[status_1] = (statusCounts[status_1] || 0) + 1;
                                if (status_1 === 'COMPLETED') {
                                    completedCount++;
                                    createdAt = booking.createdAt.getTime();
                                    completedAt = (_f = booking.statusHistory.find(function (s) { var _a; return ((_a = s.status) === null || _a === void 0 ? void 0 : _a.context) === 'COMPLETED'; })) === null || _f === void 0 ? void 0 : _f.createdAt;
                                    if (completedAt) {
                                        totalCompletionTime += (completedAt.getTime() - createdAt) / (1000 * 60 * 60);
                                    }
                                }
                                else if (status_1 === 'CANCELLED') {
                                    cancelledCount++;
                                    if ((_g = booking.cancellation) === null || _g === void 0 ? void 0 : _g.cancelledAt) {
                                        totalCancellationTime += (booking.cancellation.cancelledAt.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60);
                                    }
                                }
                                else if (status_1 === 'NO_SHOW') {
                                    noShowCount++;
                                }
                            }
                            bookingsByStatus = Object.entries(statusCounts).map(function (_a) {
                                var status = _a[0], count = _a[1];
                                return ({
                                    status: status,
                                    count: count,
                                    percentage: bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0,
                                });
                            });
                            bookingsByHour = new Array(24).fill(0);
                            for (_b = 0, bookings_2 = bookings; _b < bookings_2.length; _b++) {
                                booking = bookings_2[_b];
                                hour = booking.scheduledAt.getHours();
                                bookingsByHour[hour]++;
                            }
                            dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            bookingsByDay = new Array(7).fill(0);
                            for (_c = 0, bookings_3 = bookings; _c < bookings_3.length; _c++) {
                                booking = bookings_3[_c];
                                day = booking.scheduledAt.getDay();
                                bookingsByDay[day]++;
                            }
                            return [2 /*return*/, {
                                    total_bookings: bookings.length,
                                    completed_bookings: completedCount,
                                    cancelled_bookings: cancelledCount,
                                    no_show_bookings: noShowCount,
                                    average_completion_time_hours: completedCount > 0 ? Math.round(totalCompletionTime / completedCount * 10) / 10 : 0,
                                    average_cancellation_time_hours: cancelledCount > 0 ? Math.round(totalCancellationTime / cancelledCount * 10) / 10 : 0,
                                    bookings_by_status: bookingsByStatus,
                                    bookings_by_hour: bookingsByHour.map(function (count, hour) { return ({ hour: hour, count: count }); }),
                                    bookings_by_day_of_week: bookingsByDay.map(function (count, index) { return ({ day: dayNames[index], count: count }); }),
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.getTopServices = function (userId_1, userRole_1, query_1) {
            return __awaiter(this, arguments, void 0, function (userId, userRole, query, limit) {
                var _a, start, end, businessFilter, business, results;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _b.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT \n        s.id as service_id,\n        s.title as service_name,\n        c.name as category_name,\n        COUNT(*) as booking_count,\n        SUM(bi.price) as total_revenue\n      FROM booking_items bi\n      JOIN bookings b ON bi.booking_id = b.id\n      JOIN business_service bs ON bi.business_service_id = bs.id\n      JOIN services s ON bs.service_id = s.id\n      JOIN categories c ON s.category_id = c.id\n      WHERE b.created_at >= ", "\n        AND b.created_at <= ", "\n        ", "\n      GROUP BY s.id, s.title, c.name\n      ORDER BY booking_count DESC\n      LIMIT ", "\n    "], ["\n      SELECT \n        s.id as service_id,\n        s.title as service_name,\n        c.name as category_name,\n        COUNT(*) as booking_count,\n        SUM(bi.price) as total_revenue\n      FROM booking_items bi\n      JOIN bookings b ON bi.booking_id = b.id\n      JOIN business_service bs ON bi.business_service_id = bs.id\n      JOIN services s ON bs.service_id = s.id\n      JOIN categories c ON s.category_id = c.id\n      WHERE b.created_at >= ", "\n        AND b.created_at <= ", "\n        ", "\n      GROUP BY s.id, s.title, c.name\n      ORDER BY booking_count DESC\n      LIMIT ", "\n    "])), start, end, businessFilter.businessId ? client_1.Prisma.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["AND b.business_id = ", "::uuid"], ["AND b.business_id = ", "::uuid"])), businessFilter.businessId) : client_1.Prisma.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""]))), limit)];
                        case 3:
                            results = _b.sent();
                            return [2 /*return*/, {
                                    top_services: results.map(function (r) { return ({
                                        service_id: r.service_id,
                                        service_name: r.service_name,
                                        category_name: r.category_name,
                                        booking_count: Number(r.booking_count),
                                        total_revenue: Number(r.total_revenue),
                                    }); }),
                                }];
                    }
                });
            });
        };
        // ==================== BUSINESS PERFORMANCE ====================
        AnalyticsService_1.prototype.getBusinessPerformance = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, page, limit) {
                var _a, start, end, skip, take, total, businesses, businessPerformance, _i, businesses_1, business, bookings, completedBookings, cancelledBookings, totalRevenue, _b, bookings_4, booking, platformFees, reviews, averageRating, activeServices, diffDays, previousStart, previousBookings, growthPercent, reviewsWithComment, responseRate;
                var _c, _d;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, this.prisma.business.count()];
                        case 1:
                            total = _e.sent();
                            return [4 /*yield*/, this.prisma.business.findMany({
                                    include: {
                                        manager: {
                                            select: { fullName: true, email: true },
                                        },
                                    },
                                    skip: skip,
                                    take: take,
                                })];
                        case 2:
                            businesses = _e.sent();
                            businessPerformance = [];
                            _i = 0, businesses_1 = businesses;
                            _e.label = 3;
                        case 3:
                            if (!(_i < businesses_1.length)) return [3 /*break*/, 10];
                            business = businesses_1[_i];
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        businessId: business.id,
                                        createdAt: { gte: start, lte: end },
                                    },
                                    include: {
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                        },
                                        payment: {
                                            include: { status: true },
                                        },
                                    },
                                })];
                        case 4:
                            bookings = _e.sent();
                            completedBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'COMPLETED'; }).length;
                            cancelledBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'CANCELLED'; }).length;
                            totalRevenue = 0;
                            for (_b = 0, bookings_4 = bookings; _b < bookings_4.length; _b++) {
                                booking = bookings_4[_b];
                                if (((_d = (_c = booking.payment) === null || _c === void 0 ? void 0 : _c.status) === null || _d === void 0 ? void 0 : _d.context) === 'PAID') {
                                    totalRevenue += Number(booking.totalPrice);
                                }
                            }
                            totalRevenue = totalRevenue;
                            platformFees = totalRevenue * 0.1;
                            return [4 /*yield*/, this.prisma.review.findMany({
                                    where: { booking: { businessId: business.id } },
                                })];
                        case 5:
                            reviews = _e.sent();
                            averageRating = reviews.length > 0
                                ? reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / reviews.length
                                : 0;
                            return [4 /*yield*/, this.prisma.businessService.count({
                                    where: { businessId: business.id, isActive: true },
                                })];
                        case 6:
                            activeServices = _e.sent();
                            diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                            previousStart = new Date(start);
                            previousStart.setDate(previousStart.getDate() - diffDays);
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        businessId: business.id,
                                        createdAt: { gte: previousStart, lt: start },
                                    },
                                })];
                        case 7:
                            previousBookings = _e.sent();
                            growthPercent = previousBookings > 0
                                ? ((bookings.length - previousBookings) / previousBookings) * 100
                                : bookings.length > 0 ? 100 : 0;
                            return [4 /*yield*/, this.prisma.review.count({
                                    where: { booking: { businessId: business.id }, comment: { not: null } },
                                })];
                        case 8:
                            reviewsWithComment = _e.sent();
                            responseRate = reviews.length > 0
                                ? Math.round((reviewsWithComment / reviews.length) * 100)
                                : 0;
                            businessPerformance.push({
                                business_id: business.id,
                                business_name: business.businessName,
                                total_bookings: bookings.length,
                                completed_bookings: completedBookings,
                                cancelled_bookings: cancelledBookings,
                                total_revenue: totalRevenue,
                                platform_fees: platformFees,
                                net_revenue: totalRevenue - platformFees,
                                average_rating: Math.round(averageRating * 10) / 10,
                                total_reviews: reviews.length,
                                active_services: activeServices,
                                response_rate: responseRate,
                                growth_percent: Math.round(growthPercent * 10) / 10,
                            });
                            _e.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 3];
                        case 10:
                            businessPerformance.sort(function (a, b) { return b.total_revenue - a.total_revenue; });
                            return [2 /*return*/, {
                                    data: businessPerformance,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    total_pages: Math.ceil(total / limit),
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.getBusinessPerformanceById = function (userId, userRole, businessId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var business_1, _a, start, end, business, bookings, completedBookings, cancelledBookings, totalRevenue, _i, bookings_5, booking, platformFees, reviews, averageRating, activeServices, reviewsWithComment, responseRate, diffDays, previousStart, previousBookings, growthPercent;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { id: businessId, managerId: userId },
                                })];
                        case 1:
                            business_1 = _d.sent();
                            if (!business_1) {
                                throw new common_1.ForbiddenException('Access denied');
                            }
                            _d.label = 2;
                        case 2:
                            _a = this.getDateRange(query.range, query.start_date, query.end_date), start = _a.start, end = _a.end;
                            return [4 /*yield*/, this.prisma.business.findUnique({
                                    where: { id: businessId },
                                })];
                        case 3:
                            business = _d.sent();
                            if (!business) {
                                throw new Error('Business not found');
                            }
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        businessId: businessId,
                                        createdAt: { gte: start, lte: end },
                                    },
                                    include: {
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                        },
                                        payment: {
                                            include: { status: true },
                                        },
                                    },
                                })];
                        case 4:
                            bookings = _d.sent();
                            completedBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'COMPLETED'; }).length;
                            cancelledBookings = bookings.filter(function (b) { var _a, _b; return ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'CANCELLED'; }).length;
                            totalRevenue = 0;
                            for (_i = 0, bookings_5 = bookings; _i < bookings_5.length; _i++) {
                                booking = bookings_5[_i];
                                if (((_c = (_b = booking.payment) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.context) === 'PAID') {
                                    totalRevenue += Number(booking.totalPrice);
                                }
                            }
                            totalRevenue = totalRevenue;
                            platformFees = totalRevenue * 0.1;
                            return [4 /*yield*/, this.prisma.review.findMany({
                                    where: { booking: { businessId: businessId } },
                                })];
                        case 5:
                            reviews = _d.sent();
                            averageRating = reviews.length > 0
                                ? reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / reviews.length
                                : 0;
                            return [4 /*yield*/, this.prisma.businessService.count({
                                    where: { businessId: businessId, isActive: true },
                                })];
                        case 6:
                            activeServices = _d.sent();
                            return [4 /*yield*/, this.prisma.review.count({
                                    where: { booking: { businessId: businessId }, comment: { not: null } },
                                })];
                        case 7:
                            reviewsWithComment = _d.sent();
                            responseRate = reviews.length > 0
                                ? Math.round((reviewsWithComment / reviews.length) * 100)
                                : 0;
                            diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                            previousStart = new Date(start);
                            previousStart.setDate(previousStart.getDate() - diffDays);
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        businessId: businessId,
                                        createdAt: { gte: previousStart, lt: start },
                                    },
                                })];
                        case 8:
                            previousBookings = _d.sent();
                            growthPercent = previousBookings > 0
                                ? ((bookings.length - previousBookings) / previousBookings) * 100
                                : bookings.length > 0 ? 100 : 0;
                            return [2 /*return*/, {
                                    business_id: business.id,
                                    business_name: business.businessName,
                                    total_bookings: bookings.length,
                                    completed_bookings: completedBookings,
                                    cancelled_bookings: cancelledBookings,
                                    total_revenue: totalRevenue,
                                    platform_fees: platformFees,
                                    net_revenue: totalRevenue - platformFees,
                                    average_rating: Math.round(averageRating * 10) / 10,
                                    total_reviews: reviews.length,
                                    active_services: activeServices,
                                    response_rate: responseRate,
                                    growth_percent: Math.round(growthPercent * 10) / 10,
                                }];
                    }
                });
            });
        };
        // ==================== EXPORT REPORTS ====================
        AnalyticsService_1.prototype.exportRevenueReport = function (userId, userRole, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, businessFilter, business, paidStatus, payments, reportData, filename;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = dto.start_date ? new Date(dto.start_date) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                            end = dto.end_date ? new Date(dto.end_date) : new Date();
                            businessFilter = {};
                            if (!(userRole === 'MANAGER')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.business.findFirst({
                                    where: { managerId: userId },
                                })];
                        case 1:
                            business = _a.sent();
                            if (business) {
                                businessFilter.businessId = business.id;
                            }
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PAID' },
                            })];
                        case 3:
                            paidStatus = _a.sent();
                            return [4 /*yield*/, this.prisma.payment.findMany({
                                    where: __assign({ OR: [
                                            { paidAt: { gte: start, lte: end } },
                                            { paidAt: null, createdAt: { gte: start, lte: end } }
                                        ], statusId: paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id }, (businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {})),
                                    include: {
                                        booking: {
                                            include: {
                                                business: true,
                                                vehicle: {
                                                    include: {
                                                        client: { include: { user: true } },
                                                    },
                                                },
                                            },
                                        },
                                        paymentMethod: true,
                                        status: true,
                                    },
                                    orderBy: { paidAt: 'asc' },
                                })];
                        case 4:
                            payments = _a.sent();
                            reportData = payments.map(function (p) {
                                var _a;
                                return ({
                                    date: (_a = p.paidAt) === null || _a === void 0 ? void 0 : _a.toISOString().split('T')[0],
                                    booking_code: "BK-".concat(p.bookingId.slice(0, 8).toUpperCase()),
                                    customer_name: p.booking.vehicle.client.user.fullName,
                                    business_name: p.booking.business.businessName,
                                    amount: Number(p.amount),
                                    fee: Number(p.amount) * 0.1,
                                    net: Number(p.amount) * 0.9,
                                    payment_method: p.paymentMethod.name,
                                    status: p.status.context,
                                });
                            });
                            filename = "revenue_report_".concat(start.toISOString().split('T')[0], "_to_").concat(end.toISOString().split('T')[0], ".csv");
                            return [2 /*return*/, { data: reportData, filename: filename }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        AnalyticsService_1.prototype.getWeekNumber = function (date) {
            var d = new Date(date);
            var yearStart = new Date(d.getFullYear(), 0, 1);
            var days = Math.floor((d.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
            return Math.ceil((days + 1) / 7);
        };
        AnalyticsService_1.prototype.getPeriodLabel = function (range, start, end) {
            var _a;
            var effectiveRange = range !== null && range !== void 0 ? range : analytics_query_dto_1.TimeRange.THIS_MONTH;
            if (effectiveRange === analytics_query_dto_1.TimeRange.CUSTOM) {
                return "".concat(start.toLocaleDateString(), " - ").concat(end.toLocaleDateString());
            }
            var labels = (_a = {},
                _a[analytics_query_dto_1.TimeRange.TODAY] = 'Today',
                _a[analytics_query_dto_1.TimeRange.YESTERDAY] = 'Yesterday',
                _a[analytics_query_dto_1.TimeRange.THIS_WEEK] = 'This Week',
                _a[analytics_query_dto_1.TimeRange.LAST_WEEK] = 'Last Week',
                _a[analytics_query_dto_1.TimeRange.THIS_MONTH] = 'This Month',
                _a[analytics_query_dto_1.TimeRange.LAST_MONTH] = 'Last Month',
                _a[analytics_query_dto_1.TimeRange.THIS_QUARTER] = 'This Quarter',
                _a[analytics_query_dto_1.TimeRange.THIS_YEAR] = 'This Year',
                _a[analytics_query_dto_1.TimeRange.CUSTOM] = 'Custom Range',
                _a);
            return labels[effectiveRange];
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
var templateObject_1, templateObject_2, templateObject_3;
