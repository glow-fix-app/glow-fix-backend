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
exports.VehiclesService = void 0;
var common_1 = require("@nestjs/common");
var SORT_FIELD_MAP = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    scheduled_at: 'scheduledAt',
    license_plate: 'licensePlate',
};
var VehiclesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VehiclesService = _classThis = /** @class */ (function () {
        function VehiclesService_1(prisma, eventEmitter) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(VehiclesService.name);
        }
        VehiclesService_1.prototype.getClientIdFromUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                                select: { id: true },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [2 /*return*/, client.id];
                    }
                });
            });
        };
        VehiclesService_1.prototype.createVehicle = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, existingVehicle, vehicle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _a.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        clientId: clientId,
                                        licensePlate: dto.license_plate.toUpperCase(),
                                    },
                                })];
                        case 2:
                            existingVehicle = _a.sent();
                            if (existingVehicle) {
                                throw new common_1.ConflictException('Vehicle with this license plate already exists');
                            }
                            return [4 /*yield*/, this.prisma.clientVehicle.create({
                                    data: {
                                        clientId: clientId,
                                        licensePlate: dto.license_plate.toUpperCase(),
                                        model: dto.model,
                                        year: dto.year,
                                        color: dto.color,
                                    },
                                })];
                        case 3:
                            vehicle = _a.sent();
                            this.logger.log("Vehicle created for client ".concat(clientId, ": ").concat(dto.license_plate));
                            this.eventEmitter.emit('vehicle.created', {
                                userId: userId,
                                clientId: clientId,
                                vehicleId: vehicle.id,
                                licensePlate: dto.license_plate,
                            });
                            return [2 /*return*/, this.mapToResponseDto(vehicle)];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getUserVehicles = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, vehicles;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _a.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findMany({
                                    where: { clientId: clientId },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 2:
                            vehicles = _a.sent();
                            return [2 /*return*/, vehicles.map(function (v) { return _this.mapToResponseDto(v); })];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getVehicle = function (userId, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, vehicle, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _a.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        id: vehicleId,
                                        clientId: clientId,
                                    },
                                })];
                        case 2:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            return [4 /*yield*/, this.getVehicleStats(vehicleId)];
                        case 3:
                            stats = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, this.mapToResponseDto(vehicle)), stats)];
                    }
                });
            });
        };
        VehiclesService_1.prototype.updateVehicle = function (userId, vehicleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, existingVehicle, duplicate, updatedVehicle;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _b.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        id: vehicleId,
                                        clientId: clientId,
                                    },
                                })];
                        case 2:
                            existingVehicle = _b.sent();
                            if (!existingVehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            if (!(dto.license_plate && dto.license_plate !== existingVehicle.licensePlate)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        clientId: clientId,
                                        licensePlate: dto.license_plate.toUpperCase(),
                                        id: { not: vehicleId },
                                    },
                                })];
                        case 3:
                            duplicate = _b.sent();
                            if (duplicate) {
                                throw new common_1.ConflictException('Vehicle with this license plate already exists');
                            }
                            _b.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.clientVehicle.update({
                                where: { id: vehicleId },
                                data: {
                                    licensePlate: (_a = dto.license_plate) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                    model: dto.model,
                                    year: dto.year,
                                    color: dto.color,
                                },
                            })];
                        case 5:
                            updatedVehicle = _b.sent();
                            this.logger.log("Vehicle updated: ".concat(vehicleId, " for client ").concat(clientId));
                            this.eventEmitter.emit('vehicle.updated', {
                                userId: userId,
                                clientId: clientId,
                                vehicleId: vehicleId,
                                updates: Object.keys(dto),
                            });
                            return [2 /*return*/, this.mapToResponseDto(updatedVehicle)];
                    }
                });
            });
        };
        VehiclesService_1.prototype.deleteVehicle = function (userId, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var clientId, vehicle, bookingsCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _a.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        id: vehicleId,
                                        clientId: clientId,
                                    },
                                })];
                        case 2:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: { vehicleId: vehicleId },
                                })];
                        case 3:
                            bookingsCount = _a.sent();
                            if (bookingsCount > 0) {
                                throw new common_1.BadRequestException("Cannot delete vehicle with ".concat(bookingsCount, " existing booking(s). Archive it instead."));
                            }
                            return [4 /*yield*/, this.prisma.clientVehicle.delete({
                                    where: { id: vehicleId },
                                })];
                        case 4:
                            _a.sent();
                            this.logger.log("Vehicle deleted: ".concat(vehicleId, " for client ").concat(clientId));
                            this.eventEmitter.emit('vehicle.deleted', {
                                userId: userId,
                                clientId: clientId,
                                vehicleId: vehicleId,
                                licensePlate: vehicle.licensePlate,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Vehicle deleted successfully',
                                }];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getVehicleStats = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var bookings, completedBookings, cancelledBookings, totalSpent, lastBookingAt, nextBookingAt, now, _i, bookings_1, booking, latestStatus;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findMany({
                                where: { vehicleId: vehicleId },
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
                                orderBy: { scheduledAt: 'desc' },
                            })];
                        case 1:
                            bookings = _e.sent();
                            completedBookings = 0;
                            cancelledBookings = 0;
                            totalSpent = 0;
                            now = new Date();
                            for (_i = 0, bookings_1 = bookings; _i < bookings_1.length; _i++) {
                                booking = bookings_1[_i];
                                latestStatus = ((_b = (_a = booking.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING';
                                if (latestStatus === 'COMPLETED') {
                                    completedBookings++;
                                    if (((_d = (_c = booking.payment) === null || _c === void 0 ? void 0 : _c.status) === null || _d === void 0 ? void 0 : _d.context) === 'PAID') {
                                        totalSpent += Number(booking.totalPrice);
                                    }
                                }
                                else if (latestStatus === 'CANCELLED') {
                                    cancelledBookings++;
                                }
                                if (!lastBookingAt || booking.scheduledAt > lastBookingAt) {
                                    lastBookingAt = booking.scheduledAt;
                                }
                                if (booking.scheduledAt > now &&
                                    (!nextBookingAt || booking.scheduledAt < nextBookingAt) &&
                                    latestStatus !== 'CANCELLED') {
                                    nextBookingAt = booking.scheduledAt;
                                }
                            }
                            return [2 /*return*/, {
                                    total_bookings: bookings.length,
                                    completed_bookings: completedBookings,
                                    cancelled_bookings: cancelledBookings,
                                    total_spent: totalSpent,
                                    last_booking_at: lastBookingAt,
                                    next_booking_at: nextBookingAt,
                                }];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getVehicleBookingHistory = function (userId_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (userId, vehicleId, page, limit, status) {
                var clientId, vehicle, skip, take, where, _a, bookings, total, formattedBookings;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _b.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        id: vehicleId,
                                        clientId: clientId,
                                    },
                                })];
                        case 2:
                            vehicle = _b.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            where = { vehicleId: vehicleId };
                            if (status) {
                                where.statusHistory = {
                                    some: {
                                        status: { context: status },
                                    },
                                };
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            business: {
                                                select: {
                                                    businessName: true,
                                                },
                                            },
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'desc' },
                                                take: 1,
                                            },
                                            payment: {
                                                include: { status: true },
                                            },
                                            review: true,
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.booking.count({ where: where }),
                                ])];
                        case 3:
                            _a = _b.sent(), bookings = _a[0], total = _a[1];
                            formattedBookings = bookings.map(function (booking) {
                                var _a, _b;
                                var latestStatus = booking.statusHistory[0];
                                var payment = booking.payment;
                                var review = booking.review;
                                return {
                                    id: booking.id,
                                    booking_code: "BK-".concat(booking.id.slice(0, 8).toUpperCase()),
                                    business_name: booking.business.businessName,
                                    scheduled_at: booking.scheduledAt,
                                    total_price: Number(booking.totalPrice),
                                    status: ((_a = latestStatus === null || latestStatus === void 0 ? void 0 : latestStatus.status) === null || _a === void 0 ? void 0 : _a.context) || 'PENDING',
                                    payment_status: ((_b = payment === null || payment === void 0 ? void 0 : payment.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING',
                                    rating: review === null || review === void 0 ? void 0 : review.rating,
                                    created_at: booking.createdAt,
                                };
                            });
                            return [2 /*return*/, {
                                    data: formattedBookings,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                        vehicle: {
                                            id: vehicle.id,
                                            license_plate: vehicle.licensePlate,
                                            model: vehicle.model,
                                        },
                                    },
                                }];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getUpcomingBookings = function (userId_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (userId, vehicleId, limit) {
                var clientId, vehicle, now, bookings;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientIdFromUserId(userId)];
                        case 1:
                            clientId = _a.sent();
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: {
                                        id: vehicleId,
                                        clientId: clientId,
                                    },
                                })];
                        case 2:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.prisma.booking.findMany({
                                    where: {
                                        vehicleId: vehicleId,
                                        scheduledAt: { gt: now },
                                    },
                                    include: {
                                        business: {
                                            select: { businessName: true },
                                        },
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                        },
                                        payment: {
                                            include: { status: true },
                                        },
                                    },
                                    orderBy: { scheduledAt: 'asc' },
                                    take: limit,
                                })];
                        case 3:
                            bookings = _a.sent();
                            return [2 /*return*/, bookings.map(function (booking) {
                                    var _a, _b;
                                    var latestStatus = booking.statusHistory[0];
                                    var payment = booking.payment;
                                    return {
                                        id: booking.id,
                                        booking_code: "BK-".concat(booking.id.slice(0, 8).toUpperCase()),
                                        business_name: booking.business.businessName,
                                        scheduled_at: booking.scheduledAt,
                                        total_price: Number(booking.totalPrice),
                                        status: ((_a = latestStatus === null || latestStatus === void 0 ? void 0 : latestStatus.status) === null || _a === void 0 ? void 0 : _a.context) || 'PENDING',
                                        payment_status: ((_b = payment === null || payment === void 0 ? void 0 : payment.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING',
                                        created_at: booking.createdAt,
                                    };
                                })];
                    }
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        VehiclesService_1.prototype.getAllVehicles = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, page, _b, limit, search, year, color, _c, sort_by, _d, sort_order, _e, include_deleted, skip, take, where, orderField, _f, vehicles, total, vehiclesWithStats;
                var _g;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 20 : _b, search = query.search, year = query.year, color = query.color, _c = query.sort_by, sort_by = _c === void 0 ? 'created_at' : _c, _d = query.sort_order, sort_order = _d === void 0 ? 'desc' : _d, _e = query.include_deleted, include_deleted = _e === void 0 ? false : _e;
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            where = {};
                            if (!include_deleted) {
                                where.client = { user: { deletedAt: null, isActive: true } };
                            }
                            if (search) {
                                where.OR = [
                                    { licensePlate: { contains: search, mode: 'insensitive' } },
                                    { model: { contains: search, mode: 'insensitive' } },
                                    { client: { user: { fullName: { contains: search, mode: 'insensitive' } } } },
                                ];
                            }
                            if (year) {
                                where.year = year;
                            }
                            if (color) {
                                where.color = { contains: color, mode: 'insensitive' };
                            }
                            orderField = SORT_FIELD_MAP[sort_by] || sort_by;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.clientVehicle.findMany({
                                        where: where,
                                        include: {
                                            client: {
                                                include: {
                                                    user: {
                                                        select: {
                                                            fullName: true,
                                                            email: true,
                                                            phone: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        orderBy: (_g = {}, _g[orderField] = sort_order, _g),
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.clientVehicle.count({ where: where }),
                                ])];
                        case 1:
                            _f = _h.sent(), vehicles = _f[0], total = _f[1];
                            return [4 /*yield*/, Promise.all(vehicles.map(function (vehicle) { return __awaiter(_this, void 0, void 0, function () {
                                    var stats;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this.getVehicleStats(vehicle.id)];
                                            case 1:
                                                stats = _d.sent();
                                                return [2 /*return*/, __assign({ id: vehicle.id, client_id: vehicle.clientId, client_name: vehicle.client.user.fullName, client_email: vehicle.client.user.email, license_plate: vehicle.licensePlate, model: (_a = vehicle.model) !== null && _a !== void 0 ? _a : undefined, year: (_b = vehicle.year) !== null && _b !== void 0 ? _b : undefined, color: (_c = vehicle.color) !== null && _c !== void 0 ? _c : undefined, created_at: vehicle.createdAt, updated_at: vehicle.updatedAt }, stats)];
                                        }
                                    });
                                }); }))];
                        case 2:
                            vehiclesWithStats = _h.sent();
                            return [2 /*return*/, {
                                    data: vehiclesWithStats,
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
        VehiclesService_1.prototype.getVehicleByIdAdmin = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.clientVehicle.findUnique({
                                where: { id: vehicleId },
                                include: {
                                    client: {
                                        include: {
                                            user: {
                                                select: {
                                                    fullName: true,
                                                    email: true,
                                                    phone: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            return [4 /*yield*/, this.getVehicleStats(vehicleId)];
                        case 2:
                            stats = _a.sent();
                            return [2 /*return*/, __assign(__assign(__assign({}, vehicle), { client_name: vehicle.client.user.fullName, client_email: vehicle.client.user.email }), stats)];
                    }
                });
            });
        };
        VehiclesService_1.prototype.getVehiclesByClient = function (clientId_1) {
            return __awaiter(this, arguments, void 0, function (clientId, page, limit) {
                var skip, take, _a, vehicles, total;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.clientVehicle.findMany({
                                        where: { clientId: clientId },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.clientVehicle.count({ where: { clientId: clientId } }),
                                ])];
                        case 1:
                            _a = _b.sent(), vehicles = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: vehicles.map(function (v) { return _this.mapToResponseDto(v); }),
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
        VehiclesService_1.prototype.getMostUsedVehicles = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var results;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT\n        v.id,\n        v.license_plate,\n        v.model,\n        v.year,\n        v.color,\n        COUNT(b.id) as booking_count,\n        SUM(b.total_price) as total_revenue,\n        u.full_name as owner_name\n      FROM client_vehicles v\n      JOIN clients c ON v.client_id = c.id\n      JOIN users u ON c.user_id = u.id\n      LEFT JOIN bookings b ON v.id = b.vehicle_id\n      WHERE u.is_active = true\n        AND u.deleted_at IS NULL\n      GROUP BY v.id, u.full_name\n      ORDER BY booking_count DESC\n      LIMIT ", "\n    "], ["\n      SELECT\n        v.id,\n        v.license_plate,\n        v.model,\n        v.year,\n        v.color,\n        COUNT(b.id) as booking_count,\n        SUM(b.total_price) as total_revenue,\n        u.full_name as owner_name\n      FROM client_vehicles v\n      JOIN clients c ON v.client_id = c.id\n      JOIN users u ON c.user_id = u.id\n      LEFT JOIN bookings b ON v.id = b.vehicle_id\n      WHERE u.is_active = true\n        AND u.deleted_at IS NULL\n      GROUP BY v.id, u.full_name\n      ORDER BY booking_count DESC\n      LIMIT ", "\n    "])), limit)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results];
                    }
                });
            });
        };
        VehiclesService_1.prototype.archiveVehicle = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle, futureBookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.clientVehicle.findUnique({
                                where: { id: vehicleId },
                            })];
                        case 1:
                            vehicle = _a.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found');
                            }
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: {
                                        vehicleId: vehicleId,
                                        scheduledAt: { gt: new Date() },
                                        statusHistory: {
                                            none: {
                                                status: { context: 'CANCELLED' },
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            futureBookings = _a.sent();
                            if (futureBookings > 0) {
                                throw new common_1.BadRequestException("Cannot archive vehicle with ".concat(futureBookings, " future booking(s)"));
                            }
                            return [4 /*yield*/, this.prisma.clientVehicle.delete({
                                    where: { id: vehicleId },
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Vehicle archived: ".concat(vehicleId));
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Vehicle archived successfully',
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        VehiclesService_1.prototype.mapToResponseDto = function (vehicle) {
            return {
                id: vehicle.id,
                client_id: vehicle.clientId,
                license_plate: vehicle.licensePlate,
                model: vehicle.model || undefined,
                year: vehicle.year || undefined,
                color: vehicle.color || undefined,
                created_at: vehicle.createdAt,
                updated_at: vehicle.updatedAt,
            };
        };
        return VehiclesService_1;
    }());
    __setFunctionName(_classThis, "VehiclesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VehiclesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VehiclesService = _classThis;
}();
exports.VehiclesService = VehiclesService;
var templateObject_1;
