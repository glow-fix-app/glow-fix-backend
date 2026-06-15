"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.ClientsService = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var geocode_1 = require("../../utils/geocode");
var ClientsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ClientsService = _classThis = /** @class */ (function () {
        function ClientsService_1(prisma, eventEmitter) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(ClientsService.name);
        }
        /**
         * Get client by user ID
         */
        ClientsService_1.prototype.getClientByUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            phone: true,
                                            isActive: true,
                                            createdAt: true,
                                            updatedAt: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            if (!client.user.isActive) {
                                throw new common_1.ForbiddenException('Account is deactivated');
                            }
                            return [2 /*return*/, {
                                    id: client.id,
                                    user_id: client.userId,
                                    full_name: client.user.fullName,
                                    email: client.user.email,
                                    phone: client.user.phone || undefined,
                                    location: this.parseLocation(client.location),
                                    created_at: client.createdAt,
                                    updated_at: client.updatedAt,
                                }];
                    }
                });
            });
        };
        /**
         * Update client location using PostGIS
         */
        ClientsService_1.prototype.updateLocation = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var city;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientOrThrow(userId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, geocode_1.reverseGeocodeCity)(dto.latitude, dto.longitude)];
                        case 2:
                            city = _a.sent();
                            return [4 /*yield*/, this.prisma.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      UPDATE clients \n      SET location = ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          city = ", ",\n          updated_at = NOW()\n      WHERE user_id = ", "::uuid\n    "], ["\n      UPDATE clients \n      SET location = ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          city = ", ",\n          updated_at = NOW()\n      WHERE user_id = ", "::uuid\n    "])), dto.longitude, dto.latitude, city, userId)];
                        case 3:
                            _a.sent();
                            this.logger.log("Location updated for client ".concat(userId, ": ").concat(dto.latitude, ", ").concat(dto.longitude, ", city: ").concat(city));
                            this.eventEmitter.emit('client.location_updated', {
                                userId: userId,
                                latitude: dto.latitude,
                                longitude: dto.longitude,
                                city: city,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    location: { latitude: dto.latitude, longitude: dto.longitude, city: city },
                                }];
                    }
                });
            });
        };
        /**
         * Get client location
         */
        ClientsService_1.prototype.getLocation = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, uuid_1.validate)(userId))
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT \n      ST_Y(location::geometry) as latitude,\n      ST_X(location::geometry) as longitude\n    FROM clients \n    WHERE user_id = ", "::uuid\n  "], ["\n    SELECT \n      ST_Y(location::geometry) as latitude,\n      ST_X(location::geometry) as longitude\n    FROM clients \n    WHERE user_id = ", "::uuid\n  "])), userId)];
                        case 1:
                            result = _a.sent();
                            if (!result || result.length === 0 || result[0].latitude === null || result[0].longitude === null) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    latitude: result[0].latitude,
                                    longitude: result[0].longitude,
                                }];
                    }
                });
            });
        };
        /**
         * Get client statistics (bookings, spending, points)
         */
        ClientsService_1.prototype.getClientStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client, bookings, completedBookings, cancelledBookings, pendingBookings, inProgressBookings, totalSpent, totalRefunded, paidBookings, _i, bookings_1, booking, isPaid, isRefunded, latestStatus, loyaltyResult, loyaltyPoints, vehiclesCount, user;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            client = _g.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        vehicle: { clientId: client.id },
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
                        case 2:
                            bookings = _g.sent();
                            completedBookings = 0;
                            cancelledBookings = 0;
                            pendingBookings = 0;
                            inProgressBookings = 0;
                            totalSpent = 0;
                            totalRefunded = 0;
                            paidBookings = 0;
                            for (_i = 0, bookings_1 = bookings; _i < bookings_1.length; _i++) {
                                booking = bookings_1[_i];
                                isPaid = ((_b = (_a = booking.payment) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'PAID';
                                isRefunded = ((_d = (_c = booking.payment) === null || _c === void 0 ? void 0 : _c.status) === null || _d === void 0 ? void 0 : _d.context) === 'REFUNDED';
                                if (isPaid || isRefunded) {
                                    paidBookings++;
                                }
                                latestStatus = ((_f = (_e = booking.statusHistory[0]) === null || _e === void 0 ? void 0 : _e.status) === null || _f === void 0 ? void 0 : _f.context) || 'PENDING';
                                switch (latestStatus) {
                                    case 'COMPLETED':
                                        completedBookings++;
                                        if (isPaid) {
                                            totalSpent += Number(booking.totalPrice);
                                        }
                                        break;
                                    case 'CANCELLED':
                                        cancelledBookings++;
                                        if (isPaid || isRefunded) {
                                            totalRefunded += Number(booking.totalPrice);
                                        }
                                        break;
                                    case 'PENDING':
                                    case 'CONFIRMED':
                                        pendingBookings++;
                                        break;
                                    case 'VEHICLE_RECEIVED':
                                    case 'IN_PROGRESS':
                                    case 'READY_FOR_PICKUP':
                                        inProgressBookings++;
                                        break;
                                }
                            }
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                    where: { clientId: client.id },
                                    _sum: { points: true },
                                })];
                        case 3:
                            loyaltyResult = _g.sent();
                            loyaltyPoints = loyaltyResult._sum.points || 0;
                            return [4 /*yield*/, this.prisma.clientVehicle.count({
                                    where: { clientId: client.id },
                                })];
                        case 4:
                            vehiclesCount = _g.sent();
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: userId },
                                    select: { createdAt: true, updatedAt: true },
                                })];
                        case 5:
                            user = _g.sent();
                            return [2 /*return*/, {
                                    total_bookings: paidBookings,
                                    completed_bookings: completedBookings,
                                    cancelled_bookings: cancelledBookings,
                                    pending_bookings: pendingBookings,
                                    in_progress_bookings: inProgressBookings,
                                    total_spent: totalSpent,
                                    total_refunded: totalRefunded,
                                    loyalty_points: loyaltyPoints,
                                    vehicles_count: vehiclesCount,
                                    member_since: (user === null || user === void 0 ? void 0 : user.createdAt) || new Date(),
                                    last_active: (user === null || user === void 0 ? void 0 : user.updatedAt) || new Date(),
                                }];
                    }
                });
            });
        };
        /**
         * Get loyalty summary with recent transactions
         */
        ClientsService_1.prototype.getLoyaltySummary = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client, balanceResult, pointsBalance, pointsValueEgp, transactions, recentTransactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                    where: { clientId: client.id },
                                    _sum: { points: true },
                                })];
                        case 2:
                            balanceResult = _a.sent();
                            pointsBalance = balanceResult._sum.points || 0;
                            pointsValueEgp = pointsBalance * 0.1;
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.findMany({
                                    where: { clientId: client.id },
                                    include: {
                                        booking: {
                                            select: {
                                                id: true,
                                                business: { select: { businessName: true } },
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 20,
                                })];
                        case 3:
                            transactions = _a.sent();
                            recentTransactions = transactions.map(function (t) {
                                var _a, _b, _c;
                                return ({
                                    id: t.id,
                                    type: t.type,
                                    points: t.points,
                                    reason: t.reason,
                                    booking_code: (_a = t.booking) === null || _a === void 0 ? void 0 : _a.id,
                                    business_name: (_c = (_b = t.booking) === null || _b === void 0 ? void 0 : _b.business) === null || _c === void 0 ? void 0 : _c.businessName,
                                    created_at: t.createdAt,
                                });
                            });
                            return [2 /*return*/, {
                                    points_balance: pointsBalance,
                                    points_value_egp: pointsValueEgp,
                                    recent_transactions: recentTransactions,
                                }];
                    }
                });
            });
        };
        /**
         * Find nearby businesses for client discovery
         */
        ClientsService_1.prototype.getNearbyBusinesses = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, radiusKm, page, limit) {
                var client, location, skip, limitNum, radiusMeters, approvedStatus, results, totalResult, total, now, businessesWithOpenStatus;
                var _this = this;
                var _a;
                if (radiusKm === void 0) { radiusKm = 10; }
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            client = _b.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [4 /*yield*/, this.getLocation(userId)];
                        case 2:
                            location = _b.sent();
                            if (!location) {
                                throw new common_1.NotFoundException('Client location not set. Please update your location first.');
                            }
                            skip = (page - 1) * limit;
                            limitNum = Math.min(limit, 50);
                            radiusMeters = radiusKm * 1000;
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'APPROVED' },
                                })];
                        case 3:
                            approvedStatus = _b.sent();
                            if (!approvedStatus) {
                                return [2 /*return*/, { data: [], meta: { total: 0, page: page, limit: limit, totalPages: 0 } }];
                            }
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.contact_phone,\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n      GROUP BY b.id\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "], ["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.contact_phone,\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n      GROUP BY b.id\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "])), location.longitude, location.latitude, approvedStatus.id, location.longitude, location.latitude, radiusMeters, limitNum, skip)];
                        case 4:
                            results = _b.sent();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT COUNT(*)::int as count\n      FROM businesses b\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n    "], ["\n      SELECT COUNT(*)::int as count\n      FROM businesses b\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n    "])), approvedStatus.id, location.longitude, location.latitude, radiusMeters)];
                        case 5:
                            totalResult = _b.sent();
                            total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
                            now = new Date();
                            return [4 /*yield*/, Promise.all(results.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = {
                                                    id: b.id,
                                                    business_name: b.business_name,
                                                    address: b.address,
                                                    distance_km: parseFloat(b.distance_km),
                                                    contact_phone: b.contact_phone,
                                                    average_rating: Math.round(parseFloat(b.average_rating) * 10) / 10,
                                                    total_reviews: parseInt(b.total_reviews, 10)
                                                };
                                                return [4 /*yield*/, this.isBusinessOpen(b.id, now)];
                                            case 1: return [2 /*return*/, (_a.is_open = _b.sent(),
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        case 6:
                            businessesWithOpenStatus = _b.sent();
                            return [2 /*return*/, {
                                    data: businessesWithOpenStatus,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Check if a business is open at a given time
         */
        ClientsService_1.prototype.isBusinessOpen = function (businessId, dateTime) {
            return __awaiter(this, void 0, void 0, function () {
                var dayOfWeek, timeStr, hours;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dayOfWeek = dateTime.getDay();
                            timeStr = dateTime.toTimeString().slice(0, 5);
                            return [4 /*yield*/, this.prisma.operatingHour.findFirst({
                                    where: {
                                        businessId: businessId,
                                        dayOfWeek: dayOfWeek,
                                    },
                                })];
                        case 1:
                            hours = _a.sent();
                            if (!hours || !hours.openTime || !hours.closeTime) {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, timeStr >= hours.openTime && timeStr <= hours.closeTime];
                    }
                });
            });
        };
        /**
         * Get client's vehicles (returns vehicle IDs for integration with Vehicles module)
         */
        ClientsService_1.prototype.getClientVehicles = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client, vehicles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [4 /*yield*/, this.prisma.clientVehicle.findMany({
                                    where: { clientId: client.id },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 2:
                            vehicles = _a.sent();
                            return [2 /*return*/, vehicles.map(function (v) { return ({
                                    id: v.id,
                                    license_plate: v.licensePlate,
                                    model: v.model || undefined,
                                    year: v.year || undefined,
                                    color: v.color || undefined,
                                }); })];
                    }
                });
            });
        };
        /**
         * Parse PostGIS location to JSON
         */
        ClientsService_1.prototype.parseLocation = function (location) {
            if (!location)
                return undefined;
            try {
                var coords = location.coordinates;
                if (coords && Array.isArray(coords) && coords.length === 2) {
                    return {
                        longitude: coords[0],
                        latitude: coords[1],
                    };
                }
            }
            catch (_a) {
                return undefined;
            }
            return undefined;
        };
        ClientsService_1.prototype.getClientOrThrow = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, uuid_1.validate)(userId)) {
                                throw new common_1.NotFoundException('Invalid user ID');
                            }
                            return [4 /*yield*/, this.prisma.client.findUnique({
                                    where: { userId: userId },
                                })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [2 /*return*/, client];
                    }
                });
            });
        };
        return ClientsService_1;
    }());
    __setFunctionName(_classThis, "ClientsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientsService = _classThis;
}();
exports.ClientsService = ClientsService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
//   Logger,
// } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { Prisma } from '@prisma/client';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { UpdateClientLocationDto } from './dto/client-location.dto';
// import { ClientResponseDto, NearbyClientDto } from './dto/client-response.dto';
// import { ClientStatsDto } from './dto/client-stats.dto';
// @Injectable()
// export class ClientsService {
//   private readonly logger = new Logger(ClientsService.name);
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly eventEmitter: EventEmitter2,
//   ) {}
//   /**
//    * Get client by user ID with full details
//    */
//   async getClientByUserId(userId: string): Promise<ClientResponseDto> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true,
//             phone: true,
//             // avatar may be stored elsewhere; include if present in DB
//             emailVerified: true,
//             phoneVerified: true,
//             role: true,
//             isActive: true,
//             createdAt: true,
//             updatedAt: true,
//           },
//         },
//       },
//     });
//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }
//     if (!client.user.isActive) {
//       throw new ForbiddenException('Account is deactivated');
//     }
//     // Get statistics
//     const stats = await this.getClientStats(client.id);
//     return this.mapToResponseDto(client, stats);
//   }
//   /**
//    * Get client by client ID (from clients table)
//    */
//   async getClientById(clientId: string): Promise<any> {
//     const client = await this.prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true,
//             phone: true,
//             emailVerified: true,
//             phoneVerified: true,
//           },
//         },
//       },
//     });
//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }
//     return client;
//   }
//   /**
//    * Update client location using PostGIS
//    */
//   async updateLocation(
//     userId: string,
//     dto: UpdateClientLocationDto,
//   ): Promise<{
//     success: boolean;
//     location: { latitude: number; longitude: number };
//   }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });
//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }
//     // Create PostGIS point: ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
//     await this.prisma.$executeRaw`
//     UPDATE clients 
//     SET location = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)::geography,
//     updated_at = NOW()
//     WHERE user_id = ${userId}::uuid
//   `;
//     this.logger.log(
//       `Location updated for client ${userId}: ${dto.latitude}, ${dto.longitude}`,
//     );
//     this.eventEmitter.emit('client.location_updated', {
//       userId,
//       latitude: dto.latitude,
//       longitude: dto.longitude,
//     });
//     return {
//       success: true,
//       location: { latitude: dto.latitude, longitude: dto.longitude },
//     };
//   }
//   /**
//    * Get client location
//    */
//   async getLocation(
//     userId: string,
//   ): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<
//     Array<{ latitude: number; longitude: number }>
//     >`
//       SELECT 
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM clients 
//       WHERE user_id = ${userId}::uuid
//     `;
//     if (!result || result.length === 0) {
//       return null;
//     }
//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }
//   /**
//    * Get nearby clients within radius (for admin/discovery)
//    */
//   async getNearbyClients(
//     latitude: number,
//     longitude: number,
//     radiusKm: number = 10,
//     limit: number = 50,
//     page: number = 1,
//   ): Promise<{
//     data: NearbyClientDto[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }> {
//     const skip = (page - 1) * limit;
//     const radiusMeters = radiusKm * 1000;
//     // First, get total count
//     const countResult = await this.prisma.$queryRaw<Array<{ count: number }>>`
//       SELECT COUNT(*)::int as count
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//         AND u.role = 'CLIENT'
//         AND ST_DWithin(
//           c.location, 
//           ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//           ${radiusMeters}
//         )
//     `;
//     const total = countResult[0]?.count || 0;
//     // Get paginated results
//     const results = await this.prisma.$queryRaw<Array<any>>`
//       SELECT 
//         c.id,
//         c.user_id,
//         u.full_name,
//         u.email,
//         u.phone,
//         u.avatar_url,
//         ROUND((ST_Distance(c.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km,
//         COALESCE(b.total_bookings, 0) as total_bookings,
//         COALESCE(r.avg_rating, 0) as average_rating
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       LEFT JOIN (
//         SELECT vehicle.client_id, COUNT(*) as total_bookings
//         FROM bookings b
//         JOIN client_vehicles v ON b.vehicle_id = v.id
//         JOIN clients vehicle ON v.client_id = vehicle.id
//         GROUP BY vehicle.client_id
//       ) b ON b.client_id = c.id
//       LEFT JOIN (
//         SELECT v.client_id, AVG(r.rating) as avg_rating
//         FROM reviews r
//         JOIN bookings b ON r.booking_id = b.id
//         JOIN client_vehicles v ON b.vehicle_id = v.id
//         GROUP BY v.client_id
//       ) r ON r.client_id = c.id
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//         AND u.role = 'CLIENT'
//         AND ST_DWithin(
//           c.location, 
//           ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//           ${radiusMeters}
//         )
//       ORDER BY distance_km
//       LIMIT ${limit}
//       OFFSET ${skip}
//     `;
//     return {
//       data: results.map((r) => ({
//         id: r.id,
//         user_id: r.user_id,
//         full_name: r.full_name,
//         email: r.email,
//         phone: r.phone,
//         avatar_url: r.avatar_url,
//         distance_km: parseFloat(r.distance_km),
//         total_bookings: parseInt(r.total_bookings, 10),
//         average_rating: parseFloat(r.average_rating),
//       })),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }
//   /**
//    * Get client statistics
//    */
//   async getClientStats(clientId: string): Promise<ClientStatsDto> {
//     const client = await this.prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         user: {
//           select: { createdAt: true, updatedAt: true },
//         },
//       },
//     });
//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }
//     // Get all bookings for this client via vehicles
//     const bookings = await this.prisma.booking.findMany({
//       where: {
//         vehicle: {
//           clientId: clientId,
//         },
//       },
//       include: {
//         statusHistory: {
//           include: { status: true },
//           orderBy: { createdAt: 'desc' },
//           take: 1,
//         },
//       },
//     });
//     let completedBookings = 0;
//     let cancelledBookings = 0;
//     let pendingBookings = 0;
//     let inProgressBookings = 0;
//     let totalSpent = 0;
//     for (const booking of bookings) {
//       const latestStatus =
//         booking.statusHistory?.[0]?.status?.context || 'PENDING';
//       switch (latestStatus) {
//         case 'COMPLETED':
//           completedBookings++;
//           totalSpent += Number(booking.totalPrice);
//           break;
//         case 'CANCELLED':
//           cancelledBookings++;
//           break;
//         case 'PENDING':
//         case 'CONFIRMED':
//           pendingBookings++;
//           break;
//         case 'IN_PROGRESS':
//         case 'VEHICLE_RECEIVED':
//         case 'READY_FOR_PICKUP':
//           inProgressBookings++;
//           break;
//       }
//     }
//     // Get loyalty points
//     const loyaltyResult = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: { points: true },
//     });
//     const loyaltyPoints = loyaltyResult._sum.points || 0;
//     // Get vehicles count
//     const vehiclesCount = await this.prisma.clientVehicle.count({
//       where: { clientId: clientId },
//     });
//     return {
//       total_bookings: bookings.length,
//       completed_bookings: completedBookings,
//       cancelled_bookings: cancelledBookings,
//       pending_bookings: pendingBookings,
//       in_progress_bookings: inProgressBookings,
//       total_spent: totalSpent,
//       average_booking_value:
//         bookings.length > 0 ? totalSpent / bookings.length : 0,
//       loyalty_points: loyaltyPoints,
//       vehicles_count: vehiclesCount,
//       member_since: client.user.createdAt,
//       last_active: client.user.updatedAt,
//     };
//   }
//   /**
//    * Get client booking history
//    */
//   async getBookingHistory(
//     userId: string,
//     page: number = 1,
//     limit: number = 20,
//     status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });
//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);
//     const where: any = {
//       vehicle: { clientId: client.id },
//     };
//     if (status) {
//       where.statusHistory = {
//         some: {
//           status: { context: status },
//         },
//       };
//     }
//     const [bookings, total] = await Promise.all([
//       this.prisma.booking.findMany({
//         where,
//         include: {
//           business: {
//             select: {
//               businessName: true,
//               address: true,
//               contactPhone: true,
//             },
//           },
//           vehicle: {
//             select: {
//               licensePlate: true,
//               model: true,
//               color: true,
//             },
//           },
//           statusHistory: {
//             include: { status: true },
//             orderBy: { createdAt: 'desc' },
//             take: 1,
//           },
//           items: {
//             include: {
//               businessService: {
//                 include: {
//                   service: true,
//                 },
//               },
//             },
//           },
//           payment: { include: { status: true } },
//           review: true,
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.booking.count({ where }),
//     ]);
//     const formattedBookings = bookings.map((booking) => {
//       const latestStatus = booking.statusHistory?.[0];
//       const payment = booking.payment;
//       const review = booking.review;
//       return {
//         id: booking.id,
//         business_name: booking.business.businessName,
//         business_address: booking.business.address,
//         vehicle: {
//           license_plate: booking.vehicle.licensePlate,
//           model: booking.vehicle.model,
//           color: booking.vehicle.color,
//         },
//         scheduled_at: booking.scheduledAt,
//         expected_delivery_at: booking.expectedDeliveryAt,
//         services: booking.items.map((item) => ({
//           name: item.businessService?.service?.title,
//           price: Number(item.price),
//         })),
//         subtotal: Number(booking.subTotal),
//         discount: Number(booking.discount),
//         commission: Number(booking.commission),
//         total_price: Number(booking.totalPrice),
//         status: latestStatus?.status?.context || 'PENDING',
//         status_created_at: latestStatus?.createdAt,
//         payment_status: payment?.status?.context || 'PENDING',
//         is_reviewed: !!review,
//         rating: review?.rating,
//         created_at: booking.createdAt,
//       };
//     });
//     return {
//       data: formattedBookings,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }
//   /**
//    * Get client's favorite services (most booked)
//    */
//   async getFavoriteServices(
//     userId: string,
//     limit: number = 10,
//   ): Promise<
//     Array<{
//       service_id: string;
//       service_name: string;
//       category: string;
//       booking_count: number;
//     }>
//   > {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });
//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }
//     const results = await this.prisma.$queryRaw`
//       SELECT 
//         s.id as service_id,
//         s.title as service_name,
//         c.name as category,
//         COUNT(*) as booking_count
//       FROM booking_items bi
//       JOIN bookings b ON bi.booking_id = b.id
//       JOIN client_vehicles v ON b.vehicle_id = v.id
//       JOIN business_service bs ON bi.business_service_id = bs.id
//       JOIN services s ON bs.service_id = s.id
//       JOIN categories c ON s.category_id = c.id
//       WHERE v.client_id = ${client.id}
//       GROUP BY s.id, s.title, c.name
//       ORDER BY booking_count DESC
//       LIMIT ${limit}
//     `;
//     return results as Array<any>;
//   }
//   /**
//    * Get client loyalty transaction history
//    */
//   async getLoyaltyHistory(
//     userId: string,
//     page: number = 1,
//     limit: number = 20,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });
//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);
//     const [transactions, total] = await Promise.all([
//       this.prisma.loyaltyTransaction.findMany({
//         where: { clientId: client.id },
//         include: {
//           booking: {
//             include: { business: { select: { businessName: true } } },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.loyaltyTransaction.count({
//         where: { clientId: client.id },
//       }),
//     ]);
//     let runningBalance = await this.getClientPointsBalance(client.id);
//     const transactionsWithBalance = [...transactions]
//       .reverse()
//       .map((t, idx, arr) => {
//         if (idx === 0) {
//           return { ...t, balance_after: runningBalance };
//         }
//         const prevPoints = arr[idx - 1]?.points || 0;
//         runningBalance = runningBalance - prevPoints;
//         return { ...t, balance_after: runningBalance };
//       })
//       .reverse();
//     return {
//       data: transactionsWithBalance.map((t) => ({
//         id: t.id,
//         type: t.type,
//         points: t.points,
//         reason: t.reason,
//         booking_code: (t.booking as any)?.id,
//         business_name: t.booking?.business?.businessName,
//         balance_after: t.balance_after,
//         created_at: t.createdAt,
//       })),
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }
//   /**
//    * Get client points balance
//    */
//   async getClientPointsBalance(clientId: string): Promise<number> {
//     const result = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: { points: true },
//     });
//     return result._sum.points || 0;
//   }
//   /**
//    * Search clients by name, email, or phone (admin only)
//    */
//   async searchClients(
//     searchTerm: string,
//     page: number = 1,
//     limit: number = 20,
//   ): Promise<{ data: ClientResponseDto[]; meta: any }> {
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);
//     const where = {
//       user: {
//         isActive: true,
//         deletedAt: null,
//         role: 'CLIENT' as const,
//         OR: [
//           { fullName: { contains: searchTerm, mode: 'insensitive' as const } },
//           { email: { contains: searchTerm, mode: 'insensitive' as const } },
//           { phone: { contains: searchTerm } },
//         ],
//       },
//     };
//     const [clients, total] = await Promise.all([
//       this.prisma.client.findMany({
//         where,
//         include: {
//           user: {
//             select: {
//               id: true,
//               fullName: true,
//               email: true,
//               phone: true,
//               emailVerified: true,
//               phoneVerified: true,
//               createdAt: true,
//               updatedAt: true,
//             },
//           },
//         },
//         skip,
//         take,
//       }),
//       this.prisma.client.count({ where }),
//     ]);
//     const clientsWithStats = await Promise.all(
//       clients.map(async (client) => {
//         const stats = await this.getClientStats(client.id);
//         return this.mapToResponseDto(client, stats);
//       }),
//     );
//     return {
//       data: clientsWithStats,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }
//   /**
//    * Get top clients by spending (admin only)
//    */
//   async getTopClientsBySpending(
//     limit: number = 10,
//     startDate?: Date,
//     endDate?: Date,
//   ): Promise<ClientResponseDto[]> {
//     const dateFilter =
//       startDate && endDate
//         ? { created_at: { gte: startDate, lte: endDate } }
//         : {};
//     const topClients = await this.prisma.$queryRaw<Array<any>>`
//       SELECT 
//         c.id,
//         c.user_id,
//         u.full_name,
//         u.email,
//         u.phone,
//         u.avatar_url,
//         COALESCE(SUM(b.total_price), 0) as total_spent,
//         COUNT(b.id) as total_bookings
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       LEFT JOIN client_vehicles v ON v.client_id = c.id
//       LEFT JOIN bookings b ON b.vehicle_id = v.id
//       ${startDate && endDate ? `WHERE b.created_at BETWEEN ${startDate} AND ${endDate}` : ''}
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//       GROUP BY c.id, u.id
//       ORDER BY total_spent DESC
//       LIMIT ${limit}
//     `;
//     return topClients.map((client) => ({
//       id: client.id,
//       user_id: client.user_id,
//       full_name: client.full_name,
//       email: client.email,
//       phone: client.phone,
//       avatar_url: client.avatar_url,
//       email_verified: true,
//       phone_verified: true,
//       total_bookings: parseInt(client.total_bookings, 10),
//       total_spent: parseFloat(client.total_spent),
//       loyalty_points: 0,
//       vehicles_count: 0,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//   }
//   /**
//    * Delete client (soft delete user, which cascades)
//    */
//   async deleteClient(
//     userId: string,
//     requesterId: string,
//     requesterRole: string,
//   ): Promise<{ success: boolean; message: string }> {
//     if (requesterId !== userId && requesterRole !== 'ADMIN') {
//       throw new ForbiddenException('You are not allowed to delete this client');
//     }
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });
//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }
//     // Soft delete user
//     await this.prisma.user.update({
//       where: { id: userId },
//       data: {
//         isActive: false,
//         deletedAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });
//     // Invalidate all sessions
//     await this.prisma.userSession.deleteMany({
//       where: { userId: userId },
//     });
//     this.logger.log(`Client deleted for user ${userId}`);
//     this.eventEmitter.emit('client.deleted', { userId, clientId: client.id });
//     return {
//       success: true,
//       message: 'Client deleted successfully',
//     };
//   }
//   // ==================== PRIVATE HELPERS ====================
//   private parseLocation(
//     location: any,
//   ): { latitude: number; longitude: number } | undefined {
//     if (!location) return undefined;
//     try {
//       const coords = (location as any).coordinates;
//       if (coords && Array.isArray(coords) && coords.length === 2) {
//         return {
//           longitude: coords[0],
//           latitude: coords[1],
//         };
//       }
//     } catch {
//       return undefined;
//     }
//     return undefined;
//   }
//   private mapToResponseDto(
//     client: any,
//     stats: ClientStatsDto,
//   ): ClientResponseDto {
//     return {
//       id: client.id,
//       user_id: client.userId || client.user_id,
//       full_name: client.user?.fullName || client.user?.full_name,
//       email: client.user?.email,
//       phone: client.user?.phone || undefined,
//       avatar_url: (client.user as any)?.avatar_url || undefined,
//       email_verified: client.user?.emailVerified ?? client.user?.email_verified,
//       phone_verified: client.user?.phoneVerified ?? client.user?.phone_verified,
//       location: this.parseLocation(client.location),
//       total_bookings: stats.total_bookings,
//       total_spent: stats.total_spent,
//       loyalty_points: stats.loyalty_points,
//       vehicles_count: stats.vehicles_count,
//       created_at: client.createdAt || client.created_at,
//       updated_at: client.updatedAt || client.updated_at,
//     };
//   }
// }
