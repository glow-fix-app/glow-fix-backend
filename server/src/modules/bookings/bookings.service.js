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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.BookingsService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var review_booking_dto_1 = require("./dto/review-booking.dto");
var client_1 = require("@prisma/client");
var BookingsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BookingsService = _classThis = /** @class */ (function () {
        function BookingsService_1(prisma, notificationsService) {
            this.prisma = prisma;
            this.notificationsService = notificationsService;
            this.logger = new common_1.Logger(BookingsService.name);
        }
        // ==================== CLIENT WORKFLOWS ====================
        BookingsService_1.prototype.createBooking = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var client, vehicle, business, businessServices, scheduledAt, now, maxDate, dayOfWeek_1, hoursForDay, timeString, subTotal, setting, feePct, commission, platformFee, totalPrice, booking, err_1;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                                include: { user: true }
                            })];
                        case 1:
                            client = _b.sent();
                            if (!client) {
                                throw new common_1.ForbiddenException('User is not registered as a client');
                            }
                            return [4 /*yield*/, this.prisma.clientVehicle.findFirst({
                                    where: { id: dto.vehicleId, clientId: client.id }
                                })];
                        case 2:
                            vehicle = _b.sent();
                            if (!vehicle) {
                                throw new common_1.NotFoundException('Vehicle not found or does not belong to you');
                            }
                            return [4 /*yield*/, this.prisma.business.findUnique({
                                    where: { id: dto.businessId },
                                    include: { manager: true, operatingHours: true }
                                })];
                        case 3:
                            business = _b.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business/Provider not found');
                            }
                            return [4 /*yield*/, this.prisma.businessService.findMany({
                                    where: {
                                        id: { in: dto.items.map(function (item) { return item.businessServiceId; }) },
                                        businessId: dto.businessId,
                                        isActive: true
                                    },
                                    include: { service: true }
                                })];
                        case 4:
                            businessServices = _b.sent();
                            if (businessServices.length !== dto.items.length) {
                                throw new common_1.BadRequestException('Some selected services are invalid, inactive, or not offered by this provider');
                            }
                            scheduledAt = new Date(dto.scheduledAt);
                            now = new Date();
                            maxDate = new Date();
                            maxDate.setDate(now.getDate() + 7);
                            maxDate.setHours(23, 59, 59, 999);
                            if (isNaN(scheduledAt.getTime())) {
                                throw new common_1.BadRequestException('Invalid scheduled date/time');
                            }
                            if (scheduledAt.getTime() <= now.getTime()) {
                                throw new common_1.BadRequestException('Scheduled time must be in the future');
                            }
                            if (scheduledAt.getTime() > maxDate.getTime()) {
                                throw new common_1.BadRequestException('Scheduled time cannot be more than 7 days in advance');
                            }
                            if (business.operatingHours && business.operatingHours.length > 0) {
                                dayOfWeek_1 = scheduledAt.getDay();
                                hoursForDay = business.operatingHours.find(function (h) { return h.dayOfWeek === dayOfWeek_1; });
                                if (!hoursForDay || (!hoursForDay.openTime && !hoursForDay.closeTime)) {
                                    throw new common_1.BadRequestException('The provider is closed on the selected day');
                                }
                                if (hoursForDay.openTime && hoursForDay.closeTime) {
                                    timeString = "".concat(String(scheduledAt.getHours()).padStart(2, '0'), ":").concat(String(scheduledAt.getMinutes()).padStart(2, '0'));
                                    if (timeString < hoursForDay.openTime || timeString > hoursForDay.closeTime) {
                                        throw new common_1.BadRequestException("The selected time is outside the provider's operating hours (".concat(hoursForDay.openTime, " - ").concat(hoursForDay.closeTime, ")"));
                                    }
                                }
                            }
                            subTotal = businessServices.reduce(function (sum, bs) { return sum + Number(bs.price); }, 0);
                            return [4 /*yield*/, this.prisma.setting.findFirst()];
                        case 5:
                            setting = _b.sent();
                            feePct = (setting === null || setting === void 0 ? void 0 : setting.businessFeePct) ? Number(setting.businessFeePct) : 10.0;
                            commission = (subTotal * feePct) / 100;
                            platformFee = (setting === null || setting === void 0 ? void 0 : setting.clientPlatformFee) ? Number(setting.clientPlatformFee) : 0;
                            totalPrice = subTotal + platformFee;
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var pendingStatus, newBooking;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.status.findFirst({
                                                    where: { context: 'PENDING' }
                                                })];
                                            case 1:
                                                pendingStatus = _a.sent();
                                                if (!pendingStatus) {
                                                    throw new Error('PENDING status not found in database');
                                                }
                                                return [4 /*yield*/, tx.booking.create({
                                                        data: {
                                                            id: "BKG-".concat(crypto.randomBytes(3).toString('hex').toUpperCase()),
                                                            vehicleId: dto.vehicleId,
                                                            businessId: dto.businessId,
                                                            scheduledAt: new Date(dto.scheduledAt),
                                                            expectedDeliveryAt: dto.expectedDeliveryAt ? new Date(dto.expectedDeliveryAt) : null,
                                                            subTotal: new client_1.Prisma.Decimal(subTotal.toString()),
                                                            discount: new client_1.Prisma.Decimal('0.00'),
                                                            platformFee: new client_1.Prisma.Decimal(platformFee.toString()),
                                                            commission: new client_1.Prisma.Decimal(commission.toString()),
                                                            totalPrice: new client_1.Prisma.Decimal(totalPrice.toString()),
                                                            notes: dto.note ? { create: { body: dto.note } } : undefined,
                                                        },
                                                        include: {
                                                            vehicle: true,
                                                            business: true,
                                                            notes: true,
                                                            statusHistory: {
                                                                include: { status: true }
                                                            },
                                                            items: {
                                                                include: {
                                                                    businessService: {
                                                                        include: { service: true }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })];
                                            case 2:
                                                newBooking = _a.sent();
                                                // Create booking status history record
                                                return [4 /*yield*/, tx.bookingStatus.create({
                                                        data: {
                                                            bookingId: newBooking.id,
                                                            statusId: pendingStatus.id
                                                        }
                                                    })];
                                            case 3:
                                                // Create booking status history record
                                                _a.sent();
                                                // Create booking items
                                                return [4 /*yield*/, tx.bookingItem.createMany({
                                                        data: businessServices.map(function (bs) { return ({
                                                            bookingId: newBooking.id,
                                                            businessServiceId: bs.id,
                                                            price: bs.price
                                                        }); })
                                                    })];
                                            case 4:
                                                // Create booking items
                                                _a.sent();
                                                if (!(dto.images && dto.images.length > 0)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, tx.image.createMany({
                                                        data: dto.images.map(function (img) { return ({
                                                            url: img.url,
                                                            storageKey: img.storageKey,
                                                            entityType: 'BOOKING_PROBLEM',
                                                            entityId: newBooking.id
                                                        }); })
                                                    })];
                                            case 5:
                                                _a.sent();
                                                _a.label = 6;
                                            case 6: 
                                            // Return the booking with fresh relations
                                            return [2 /*return*/, tx.booking.findUnique({
                                                    where: { id: newBooking.id },
                                                    include: {
                                                        vehicle: true,
                                                        business: true,
                                                        notes: true,
                                                        statusHistory: {
                                                            include: { status: true },
                                                            orderBy: { createdAt: 'asc' }
                                                        },
                                                        items: {
                                                            include: {
                                                                businessService: {
                                                                    include: { service: true }
                                                                }
                                                            }
                                                        },
                                                        payment: {
                                                            include: {
                                                                status: true,
                                                                paymentMethod: true
                                                            }
                                                        },
                                                        diagnosticReport: {
                                                            include: {
                                                                findings: true,
                                                                recommendedRepairs: true
                                                            }
                                                        }
                                                    }
                                                })];
                                        }
                                    });
                                }); })];
                        case 6:
                            booking = _b.sent();
                            if (!booking) {
                                throw new Error('Failed to retrieve newly created booking');
                            }
                            _b.label = 7;
                        case 7:
                            _b.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: business.managerId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_REQUESTED',
                                    title: 'New Booking Request',
                                    body: "Client ".concat(client.user.fullName, " requested a booking for ").concat(vehicle.licensePlate, " scheduled at ").concat(new Date(dto.scheduledAt).toLocaleString()),
                                    actionUrl: "/manager/bookings/".concat(booking.id)
                                })];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            err_1 = _b.sent();
                            this.logger.error("Notification failed: ".concat(err_1.message));
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/, this.formatBooking(booking, ((_a = dto.images) === null || _a === void 0 ? void 0 : _a.map(function (img) { return img.url; })) || [])];
                    }
                });
            });
        };
        BookingsService_1.prototype.getClientBookings = function (userId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var client, where, ids, scheduledAtFilter, endStr, page, limit, skip, _a, bookings, total, formatted;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({ where: { userId: userId } })];
                        case 1:
                            client = _d.sent();
                            if (!client) {
                                throw new common_1.ForbiddenException('User is not registered as a client');
                            }
                            where = {
                                vehicle: { clientId: client.id }
                            };
                            if (!query.status) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getBookingIdsByLatestStatus(query.status)];
                        case 2:
                            ids = _d.sent();
                            where.id = { in: ids };
                            _d.label = 3;
                        case 3:
                            scheduledAtFilter = {};
                            if (query.startDate) {
                                scheduledAtFilter.gte = new Date(query.startDate);
                            }
                            if (query.endDate) {
                                endStr = query.endDate.includes('T') ? query.endDate : "".concat(query.endDate, "T23:59:59.999Z");
                                scheduledAtFilter.lte = new Date(endStr);
                            }
                            if (query.startDate || query.endDate) {
                                where.scheduledAt = scheduledAtFilter;
                            }
                            // Search filter
                            if (query.search) {
                                where.OR = [
                                    {
                                        notes: {
                                            some: {
                                                body: { contains: query.search, mode: 'insensitive' }
                                            }
                                        }
                                    },
                                    {
                                        business: {
                                            businessName: { contains: query.search, mode: 'insensitive' }
                                        }
                                    },
                                    {
                                        vehicle: {
                                            licensePlate: { contains: query.search, mode: 'insensitive' }
                                        }
                                    }
                                ];
                            }
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            vehicle: true,
                                            business: true,
                                            notes: true,
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'asc' }
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true }
                                                    }
                                                }
                                            },
                                            payment: {
                                                include: {
                                                    status: true,
                                                    paymentMethod: true
                                                }
                                            }
                                        },
                                        orderBy: { scheduledAt: 'desc' },
                                        skip: skip,
                                        take: limit
                                    }),
                                    this.prisma.booking.count({ where: where })
                                ])];
                        case 4:
                            _a = _d.sent(), bookings = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(bookings.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var images;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getBookingImages(b.id)];
                                            case 1:
                                                images = _a.sent();
                                                return [2 /*return*/, this.formatBooking(b, images)];
                                        }
                                    });
                                }); }))];
                        case 5:
                            formatted = _d.sent();
                            return [2 /*return*/, {
                                    data: formatted,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getClientBooking = function (userId, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var client, booking, businessLoc, images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({ where: { userId: userId } })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.ForbiddenException('User is not registered as a client');
                            }
                            return [4 /*yield*/, this.prisma.booking.findFirst({
                                    where: { id: bookingId, vehicle: { clientId: client.id } },
                                    include: {
                                        vehicle: true,
                                        business: true,
                                        cancellation: true,
                                        notes: true,
                                        diagnosticReport: {
                                            include: {
                                                findings: true,
                                                recommendedRepairs: true
                                            }
                                        },
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'asc' }
                                        },
                                        items: {
                                            include: {
                                                businessService: {
                                                    include: { service: true }
                                                }
                                            }
                                        },
                                        payment: {
                                            include: {
                                                status: true,
                                                paymentMethod: true
                                            }
                                        }
                                    }
                                })];
                        case 2:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude\n      FROM businesses\n      WHERE id = ", "::uuid\n    "], ["\n      SELECT ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude\n      FROM businesses\n      WHERE id = ", "::uuid\n    "])), booking.businessId)];
                        case 3:
                            businessLoc = _a.sent();
                            if (businessLoc.length > 0) {
                                booking.business.latitude = businessLoc[0].latitude;
                                booking.business.longitude = businessLoc[0].longitude;
                            }
                            return [4 /*yield*/, this.getBookingImages(booking.id)];
                        case 4:
                            images = _a.sent();
                            return [2 /*return*/, this.formatBooking(booking, images)];
                    }
                });
            });
        };
        BookingsService_1.prototype.cancelBookingByClient = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var client, booking, currentStatus, cancellableStates, updatedBooking, err_2, images;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({ where: { userId: userId } })];
                        case 1:
                            client = _b.sent();
                            if (!client) {
                                throw new common_1.ForbiddenException('User is not registered as a client');
                            }
                            return [4 /*yield*/, this.prisma.booking.findFirst({
                                    where: { id: bookingId, vehicle: { clientId: client.id } },
                                    include: {
                                        business: true,
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'asc' }
                                        }
                                    }
                                })];
                        case 2:
                            booking = _b.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            cancellableStates = ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'];
                            if (!cancellableStates.includes(currentStatus)) {
                                throw new common_1.BadRequestException("Booking cannot be cancelled once work has started. Current status: ".concat(currentStatus));
                            }
                            return [4 /*yield*/, this.transitionBookingStatus(bookingId, 'CANCELLED', function (tx, cancelledStatusRow) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: 
                                            // Record cancellation reason
                                            return [4 /*yield*/, tx.bookingCancellation.create({
                                                    data: {
                                                        bookingId: bookingId,
                                                        cancelledBy: userId,
                                                        reason: (_a = dto.reason) !== null && _a !== void 0 ? _a : 'Cancelled by client'
                                                    }
                                                })];
                                            case 1:
                                                // Record cancellation reason
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 3:
                            updatedBooking = _b.sent();
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.business.managerId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_CANCELLED',
                                    title: 'Booking Cancelled by Client',
                                    body: "Booking ".concat(booking.id.slice(0, 8), " has been cancelled. Reason: ").concat((_a = dto.reason) !== null && _a !== void 0 ? _a : 'Client request'),
                                    actionUrl: "/manager/bookings/".concat(booking.id)
                                })];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            err_2 = _b.sent();
                            this.logger.error("Notification failed: ".concat(err_2.message));
                            return [3 /*break*/, 7];
                        case 7: return [4 /*yield*/, this.getBookingImages(booking.id)];
                        case 8:
                            images = _b.sent();
                            return [2 /*return*/, this.formatBooking(updatedBooking, images)];
                    }
                });
            });
        };
        BookingsService_1.prototype.rescheduleBookingByClient = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var client, booking, currentStatus, newDate, updatedBooking, fullBooking, err_3, images;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({ where: { userId: userId } })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.ForbiddenException('User is not registered as a client');
                            }
                            return [4 /*yield*/, this.prisma.booking.findFirst({
                                    where: { id: bookingId, vehicle: { clientId: client.id } },
                                    include: {
                                        business: true,
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'asc' }
                                        }
                                    }
                                })];
                        case 2:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
                                throw new common_1.BadRequestException("Cannot reschedule booking in status: ".concat(currentStatus));
                            }
                            newDate = new Date(dto.scheduledAt);
                            if (newDate.getTime() <= Date.now()) {
                                throw new common_1.BadRequestException('New scheduled date must be in the future');
                            }
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var pendingStatus, updated;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.status.findFirst({ where: { context: 'PENDING' } })];
                                            case 1:
                                                pendingStatus = _a.sent();
                                                if (!pendingStatus)
                                                    throw new Error('PENDING status row missing');
                                                return [4 /*yield*/, tx.booking.update({
                                                        where: { id: bookingId },
                                                        data: {
                                                            scheduledAt: newDate,
                                                            expectedDeliveryAt: null // clear delivery estimate, provider must re-estimate
                                                        }
                                                    })];
                                            case 2:
                                                updated = _a.sent();
                                                if (!(currentStatus !== 'PENDING')) return [3 /*break*/, 4];
                                                return [4 /*yield*/, tx.bookingStatus.create({
                                                        data: {
                                                            bookingId: bookingId,
                                                            statusId: pendingStatus.id
                                                        }
                                                    })];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4: return [2 /*return*/, updated];
                                        }
                                    });
                                }); })];
                        case 3:
                            updatedBooking = _a.sent();
                            return [4 /*yield*/, this.prisma.booking.findUnique({
                                    where: { id: bookingId },
                                    include: {
                                        vehicle: true,
                                        business: true,
                                        notes: true,
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'asc' }
                                        },
                                        items: {
                                            include: {
                                                businessService: {
                                                    include: { service: true }
                                                }
                                            }
                                        },
                                        payment: {
                                            include: { status: true, paymentMethod: true }
                                        }
                                    }
                                })];
                        case 4:
                            fullBooking = _a.sent();
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.business.managerId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_REQUESTED',
                                    title: 'Booking Rescheduled by Client',
                                    body: "Client requested to reschedule Booking ".concat(booking.id.slice(0, 8), " to ").concat(newDate.toLocaleString()),
                                    actionUrl: "/manager/bookings/".concat(booking.id)
                                })];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            err_3 = _a.sent();
                            this.logger.error("Notification failed: ".concat(err_3.message));
                            return [3 /*break*/, 8];
                        case 8: return [4 /*yield*/, this.getBookingImages(bookingId)];
                        case 9:
                            images = _a.sent();
                            return [2 /*return*/, this.formatBooking(fullBooking, images)];
                    }
                });
            });
        };
        // ==================== MANAGER WORKFLOWS ====================
        BookingsService_1.prototype.getManagerBookings = function (userId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, ids, scheduledAtFilter, endStr, page, limit, skip, orderByQuery, _a, bookings, total, userIds, avatars, _b, avatarMap, formatted;
                var _this = this;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            where = {
                                business: { managerId: userId }
                            };
                            if (!query.status) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getBookingIdsByLatestStatus(query.status)];
                        case 1:
                            ids = _e.sent();
                            where.id = { in: ids };
                            _e.label = 2;
                        case 2:
                            scheduledAtFilter = {};
                            if (query.startDate) {
                                scheduledAtFilter.gte = new Date(query.startDate);
                            }
                            if (query.endDate) {
                                endStr = query.endDate.includes('T') ? query.endDate : "".concat(query.endDate, "T23:59:59.999Z");
                                scheduledAtFilter.lte = new Date(endStr);
                            }
                            if (query.startDate || query.endDate) {
                                where.scheduledAt = scheduledAtFilter;
                            }
                            if (query.search) {
                                where.OR = [
                                    {
                                        notes: {
                                            some: {
                                                body: { contains: query.search, mode: 'insensitive' }
                                            }
                                        }
                                    },
                                    {
                                        vehicle: {
                                            licensePlate: { contains: query.search, mode: 'insensitive' }
                                        }
                                    },
                                    {
                                        vehicle: {
                                            client: {
                                                user: {
                                                    fullName: { contains: query.search, mode: 'insensitive' }
                                                }
                                            }
                                        }
                                    }
                                ];
                            }
                            page = (_c = query.page) !== null && _c !== void 0 ? _c : 1;
                            limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 20;
                            skip = (page - 1) * limit;
                            orderByQuery = { scheduledAt: 'desc' };
                            if (query.sortBy === 'deliveryDate') {
                                orderByQuery = { expectedDeliveryAt: query.sortOrder === 'desc' ? 'desc' : 'asc' };
                            }
                            else if (query.status === 'PENDING') {
                                orderByQuery = { createdAt: 'desc' };
                            }
                            else if (query.startDate && query.startDate === query.endDate) {
                                orderByQuery = { scheduledAt: 'asc' };
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: {
                                                        include: { user: true }
                                                    }
                                                }
                                            },
                                            business: true,
                                            cancellation: true,
                                            notes: true,
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'asc' }
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true }
                                                    }
                                                }
                                            },
                                            payment: {
                                                include: {
                                                    status: true,
                                                    paymentMethod: true
                                                }
                                            }
                                        },
                                        orderBy: orderByQuery,
                                        skip: skip,
                                        take: limit
                                    }),
                                    this.prisma.booking.count({ where: where })
                                ])];
                        case 3:
                            _a = _e.sent(), bookings = _a[0], total = _a[1];
                            userIds = bookings
                                .map(function (b) { var _a, _b, _c; return (_c = (_b = (_a = b.vehicle) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id; })
                                .filter(Boolean);
                            if (!(userIds.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.image.findMany({
                                    where: {
                                        entityType: 'USER_AVATAR',
                                        entityId: { in: userIds }
                                    },
                                    select: { entityId: true, url: true }
                                })];
                        case 4:
                            _b = _e.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = [];
                            _e.label = 6;
                        case 6:
                            avatars = _b;
                            avatarMap = new Map(avatars.map(function (a) { return [a.entityId, a.url]; }));
                            return [4 /*yield*/, Promise.all(bookings.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var images, uId, avatarUrl;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this.getBookingImages(b.id)];
                                            case 1:
                                                images = _d.sent();
                                                uId = (_c = (_b = (_a = b.vehicle) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.id;
                                                avatarUrl = uId ? (avatarMap.get(uId) || null) : null;
                                                return [2 /*return*/, this.formatBooking(b, images, avatarUrl)];
                                        }
                                    });
                                }); }))];
                        case 7:
                            formatted = _e.sent();
                            return [2 /*return*/, {
                                    data: formatted,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getManagerBooking = function (userId, bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, images, avatarUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findFirst({
                                where: { id: bookingId, business: { managerId: userId } },
                                include: {
                                    vehicle: {
                                        include: { client: { include: { user: true } } }
                                    },
                                    business: true,
                                    cancellation: true,
                                    notes: true,
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    },
                                    items: {
                                        include: {
                                            businessService: {
                                                include: { service: true }
                                            }
                                        }
                                    },
                                    payment: {
                                        include: {
                                            status: true,
                                            paymentMethod: true
                                        }
                                    },
                                    diagnosticReport: {
                                        include: {
                                            findings: true,
                                            recommendedRepairs: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            return [4 /*yield*/, this.getBookingImages(booking.id)];
                        case 2:
                            images = _a.sent();
                            return [4 /*yield*/, this.getUserAvatarByVehicleId(booking.vehicleId)];
                        case 3:
                            avatarUrl = _a.sent();
                            return [2 /*return*/, this.formatBooking(booking, images, avatarUrl)];
                    }
                });
            });
        };
        BookingsService_1.prototype.reviewBookingByManager = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, currentStatus, updatedBooking, err_4, err_5, images, avatarUrl;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findFirst({
                                where: { id: bookingId, business: { managerId: userId } },
                                include: {
                                    vehicle: { include: { client: { include: { user: true } } } },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    },
                                    items: true
                                }
                            })];
                        case 1:
                            booking = _b.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            if (currentStatus !== 'PENDING') {
                                throw new common_1.BadRequestException("Booking is already reviewed or processed. Current status: ".concat(currentStatus));
                            }
                            if (!(dto.status === review_booking_dto_1.ReviewStatus.REJECTED)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.transitionBookingStatus(bookingId, 'REJECTED', function (tx, statusRow) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: 
                                            // Record details in cancellation table
                                            return [4 /*yield*/, tx.bookingCancellation.create({
                                                    data: {
                                                        bookingId: bookingId,
                                                        cancelledBy: userId,
                                                        reason: (_a = dto.rejectionReason) !== null && _a !== void 0 ? _a : 'Rejected by manager'
                                                    }
                                                })];
                                            case 1:
                                                // Record details in cancellation table
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            // 1. REJECT transitions status to REJECTED
                            updatedBooking = _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.vehicle.client.userId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_CANCELLED',
                                    title: 'Booking Request Rejected',
                                    body: "Your booking request ".concat(booking.id.slice(0, 8), " has been rejected by the provider. Reason: ").concat((_a = dto.rejectionReason) !== null && _a !== void 0 ? _a : 'Provider choice'),
                                    actionUrl: "/client/bookings/".concat(booking.id)
                                })];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_4 = _b.sent();
                            this.logger.error("Notification failed: ".concat(err_4.message));
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 12];
                        case 7: return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var acceptedStatus, activeItemBsIds, _i, _a, item, finalItems, subTotal, setting, feePct, commission, platformFee, totalPrice, pendingPaymentStatus, defaultPaymentMethod;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, tx.status.findFirst({ where: { context: 'ACCEPTED' } })];
                                        case 1:
                                            acceptedStatus = _b.sent();
                                            if (!acceptedStatus)
                                                throw new Error('ACCEPTED status missing');
                                            if (!(dto.items && dto.items.length > 0)) return [3 /*break*/, 5];
                                            activeItemBsIds = booking.items.map(function (i) { return i.businessServiceId; });
                                            _i = 0, _a = dto.items;
                                            _b.label = 2;
                                        case 2:
                                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                                            item = _a[_i];
                                            if (!activeItemBsIds.includes(item.businessServiceId)) {
                                                throw new common_1.BadRequestException("Item ".concat(item.businessServiceId, " is not in the original booking request"));
                                            }
                                            if (!(item.price !== undefined)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, tx.bookingItem.updateMany({
                                                    where: { bookingId: bookingId, businessServiceId: item.businessServiceId },
                                                    data: { price: new client_1.Prisma.Decimal(item.price.toString()) }
                                                })];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4:
                                            _i++;
                                            return [3 /*break*/, 2];
                                        case 5: return [4 /*yield*/, tx.bookingItem.findMany({
                                                where: { bookingId: bookingId }
                                            })];
                                        case 6:
                                            finalItems = _b.sent();
                                            subTotal = finalItems.reduce(function (sum, item) { return sum + Number(item.price); }, 0);
                                            return [4 /*yield*/, tx.setting.findFirst()];
                                        case 7:
                                            setting = _b.sent();
                                            feePct = (setting === null || setting === void 0 ? void 0 : setting.businessFeePct) ? Number(setting.businessFeePct) : 10.0;
                                            commission = (subTotal * feePct) / 100;
                                            platformFee = Number(booking.platformFee || 0);
                                            totalPrice = subTotal + platformFee;
                                            // Update booking finances and expected delivery
                                            return [4 /*yield*/, tx.booking.update({
                                                    where: { id: bookingId },
                                                    data: __assign({ subTotal: new client_1.Prisma.Decimal(subTotal.toString()), commission: new client_1.Prisma.Decimal(commission.toString()), totalPrice: new client_1.Prisma.Decimal(totalPrice.toString()) }, (dto.expectedDeliveryAt && { expectedDeliveryAt: new Date(dto.expectedDeliveryAt) }))
                                                })];
                                        case 8:
                                            // Update booking finances and expected delivery
                                            _b.sent();
                                            // Add status history record
                                            return [4 /*yield*/, tx.bookingStatus.create({
                                                    data: {
                                                        bookingId: bookingId,
                                                        statusId: acceptedStatus.id
                                                    }
                                                })];
                                        case 9:
                                            // Add status history record
                                            _b.sent();
                                            return [4 /*yield*/, tx.status.findFirst({ where: { context: 'PAYMENT_PENDING' } })];
                                        case 10:
                                            pendingPaymentStatus = _b.sent();
                                            return [4 /*yield*/, tx.paymentMethod.findFirst({ where: { name: 'CASH' } })];
                                        case 11:
                                            defaultPaymentMethod = _b.sent();
                                            if (!!defaultPaymentMethod) return [3 /*break*/, 13];
                                            return [4 /*yield*/, tx.paymentMethod.create({ data: { name: 'CASH', isEnabled: true } })];
                                        case 12:
                                            defaultPaymentMethod = _b.sent();
                                            _b.label = 13;
                                        case 13:
                                            if (!(pendingPaymentStatus && defaultPaymentMethod)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, tx.payment.upsert({
                                                    where: { bookingId: bookingId },
                                                    create: {
                                                        bookingId: bookingId,
                                                        amount: new client_1.Prisma.Decimal(totalPrice.toString()),
                                                        currency: 'EGP',
                                                        statusId: pendingPaymentStatus.id,
                                                        paymentMethodId: defaultPaymentMethod.id,
                                                        provider: 'system'
                                                    },
                                                    update: {
                                                        amount: new client_1.Prisma.Decimal(totalPrice.toString()),
                                                    }
                                                })];
                                        case 14:
                                            _b.sent();
                                            _b.label = 15;
                                        case 15: return [2 /*return*/, tx.booking.findUnique({
                                                where: { id: bookingId },
                                                include: {
                                                    vehicle: true,
                                                    business: true,
                                                    notes: true,
                                                    statusHistory: {
                                                        include: { status: true },
                                                        orderBy: { createdAt: 'asc' }
                                                    },
                                                    items: {
                                                        include: {
                                                            businessService: {
                                                                include: { service: true }
                                                            }
                                                        }
                                                    },
                                                    payment: {
                                                        include: { status: true, paymentMethod: true }
                                                    }
                                                }
                                            })];
                                    }
                                });
                            }); })];
                        case 8:
                            // 2. ACCEPT transitions status to ACCEPTED
                            updatedBooking = _b.sent();
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.vehicle.client.userId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_CONFIRMED',
                                    title: 'Booking Request Approved',
                                    body: "Your booking request ".concat(booking.id.slice(0, 8), " has been accepted by the provider! Please proceed to payment."),
                                    actionUrl: "/client/bookings/".concat(booking.id)
                                })];
                        case 10:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            err_5 = _b.sent();
                            this.logger.error("Notification failed: ".concat(err_5.message));
                            return [3 /*break*/, 12];
                        case 12:
                            if (!updatedBooking) {
                                throw new Error('Failed to retrieve updated booking');
                            }
                            return [4 /*yield*/, this.getBookingImages(bookingId)];
                        case 13:
                            images = _b.sent();
                            return [4 /*yield*/, this.getUserAvatarByVehicleId(updatedBooking.vehicleId)];
                        case 14:
                            avatarUrl = _b.sent();
                            return [2 /*return*/, this.formatBooking(updatedBooking, images, avatarUrl)];
                    }
                });
            });
        };
        BookingsService_1.prototype.updateBookingStatusByManager = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, currentStatus, targetStatus, paymentStatus, updatedBooking, clientUserId, ref, _a, config, amount, pointsEarned, err_6, images, avatarUrl;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findFirst({
                                where: { id: bookingId, business: { managerId: userId } },
                                include: {
                                    vehicle: { include: { client: { include: { user: true } } } },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    },
                                    payment: {
                                        include: { status: true }
                                    }
                                }
                            })];
                        case 1:
                            booking = _d.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            targetStatus = dto.status === 'READY' ? 'READY_FOR_PICKUP' : dto.status;
                            if (targetStatus === 'CONFIRMED' || targetStatus === 'ACCEPTED') {
                                throw new common_1.BadRequestException('Booking cannot be manually changed to ACCEPTED or CONFIRMED.');
                            }
                            if (targetStatus === 'COMPLETED') {
                                paymentStatus = (_c = (_b = booking.payment) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.context;
                                if (paymentStatus !== 'PAID') {
                                    throw new common_1.BadRequestException('Booking cannot be marked as COMPLETED until payment is fully paid.');
                                }
                            }
                            // State machine check
                            this.validateStateTransition(currentStatus, targetStatus);
                            return [4 /*yield*/, this.transitionBookingStatus(bookingId, targetStatus)];
                        case 2:
                            updatedBooking = _d.sent();
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 18, , 19]);
                            clientUserId = booking.vehicle.client.userId;
                            ref = booking.id.slice(0, 8);
                            _a = targetStatus;
                            switch (_a) {
                                case 'VEHICLE_RECEIVED': return [3 /*break*/, 4];
                                case 'IN_PROGRESS': return [3 /*break*/, 6];
                                case 'READY_FOR_PICKUP': return [3 /*break*/, 8];
                                case 'COMPLETED': return [3 /*break*/, 10];
                            }
                            return [3 /*break*/, 17];
                        case 4: return [4 /*yield*/, this.notificationsService.createNotification({
                                recipientUserId: clientUserId,
                                actorUserId: userId,
                                typeCode: 'VEHICLE_RECEIVED',
                                title: 'Vehicle Received',
                                body: "Your vehicle is received by the workshop for Booking ".concat(ref),
                                actionUrl: "/client/bookings/".concat(bookingId)
                            })];
                        case 5:
                            _d.sent();
                            return [3 /*break*/, 17];
                        case 6: return [4 /*yield*/, this.notificationsService.createNotification({
                                recipientUserId: clientUserId,
                                actorUserId: userId,
                                typeCode: 'SERVICE_IN_PROGRESS',
                                title: 'Service In Progress',
                                body: "The service has officially started on your vehicle for Booking ".concat(ref),
                                actionUrl: "/client/bookings/".concat(bookingId)
                            })];
                        case 7:
                            _d.sent();
                            return [3 /*break*/, 17];
                        case 8: return [4 /*yield*/, this.notificationsService.createNotification({
                                recipientUserId: clientUserId,
                                actorUserId: userId,
                                typeCode: 'READY_FOR_PICKUP',
                                title: 'Ready for Pickup',
                                body: "Your vehicle is ready! Please complete payment and pick up your vehicle. Booking ".concat(ref),
                                actionUrl: "/client/bookings/".concat(bookingId)
                            })];
                        case 9:
                            _d.sent();
                            return [3 /*break*/, 17];
                        case 10: return [4 /*yield*/, this.prisma.loyaltyConfig.findFirst()];
                        case 11:
                            config = _d.sent();
                            if (!(booking.payment && Number(booking.payment.amount) > 0 && (config === null || config === void 0 ? void 0 : config.isActive))) return [3 /*break*/, 14];
                            amount = Number(booking.payment.amount);
                            pointsEarned = Math.floor((amount / 100) * config.pointsPer100Egp);
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: booking.vehicle.clientId,
                                        bookingId: booking.id,
                                        type: 'EARNED',
                                        points: pointsEarned,
                                        reason: "Earned ".concat(pointsEarned, " points from booking (").concat(amount, " EGP)"),
                                    },
                                })];
                        case 12:
                            _d.sent();
                            // Notify user of earned points
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientUserId,
                                    actorUserId: userId,
                                    typeCode: 'POINTS_EARNED',
                                    title: 'Loyalty Points Earned!',
                                    body: "You just earned ".concat(pointsEarned, " points for completing Booking ").concat(ref, "!"),
                                    actionUrl: "/client/loyalty"
                                })];
                        case 13:
                            // Notify user of earned points
                            _d.sent();
                            _d.label = 14;
                        case 14: return [4 /*yield*/, this.notificationsService.createNotification({
                                recipientUserId: clientUserId,
                                actorUserId: userId,
                                typeCode: 'BOOKING_COMPLETED',
                                title: 'Booking Completed',
                                body: "Thank you for choosing us! Booking ".concat(ref, " is now completed."),
                                actionUrl: "/client/bookings/".concat(bookingId)
                            })];
                        case 15:
                            _d.sent();
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientUserId,
                                    actorUserId: userId,
                                    typeCode: 'NEW_REVIEW',
                                    title: 'Rate Your Service',
                                    body: "Please take a moment to rate and review your completed booking ".concat(ref, "."),
                                    actionUrl: "/client/bookings/".concat(bookingId)
                                })];
                        case 16:
                            _d.sent();
                            return [3 /*break*/, 17];
                        case 17: return [3 /*break*/, 19];
                        case 18:
                            err_6 = _d.sent();
                            this.logger.error("Notification failed: ".concat(err_6.message));
                            return [3 /*break*/, 19];
                        case 19:
                            if (!updatedBooking) {
                                throw new common_1.NotFoundException('Updated booking not found');
                            }
                            return [4 /*yield*/, this.getBookingImages(bookingId)];
                        case 20:
                            images = _d.sent();
                            return [4 /*yield*/, this.getUserAvatarByVehicleId(updatedBooking.vehicleId)];
                        case 21:
                            avatarUrl = _d.sent();
                            return [2 /*return*/, this.formatBooking(updatedBooking, images, avatarUrl)];
                    }
                });
            });
        };
        BookingsService_1.prototype.rescheduleBookingByManager = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, currentStatus, restrictedRescheduleStates, newDate, updatedBooking, err_7, images, avatarUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findFirst({
                                where: { id: bookingId, business: { managerId: userId } },
                                include: {
                                    vehicle: { include: { client: { include: { user: true } } } },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    }
                                }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            restrictedRescheduleStates = ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'REJECTED'];
                            if (restrictedRescheduleStates.includes(currentStatus)) {
                                throw new common_1.BadRequestException("Cannot reschedule booking in status: ".concat(currentStatus));
                            }
                            newDate = new Date(dto.scheduledAt);
                            if (newDate.getTime() <= Date.now()) {
                                throw new common_1.BadRequestException('New scheduled date must be in the future');
                            }
                            return [4 /*yield*/, this.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: {
                                        scheduledAt: newDate
                                    },
                                    include: {
                                        vehicle: true,
                                        business: true,
                                        notes: true,
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'asc' }
                                        },
                                        items: {
                                            include: {
                                                businessService: {
                                                    include: { service: true }
                                                }
                                            }
                                        },
                                        payment: {
                                            include: { status: true, paymentMethod: true }
                                        }
                                    }
                                })];
                        case 2:
                            updatedBooking = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.vehicle.client.userId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_CONFIRMED',
                                    title: 'Booking Rescheduled by Provider',
                                    body: "The provider rescheduled Booking ".concat(booking.id.slice(0, 8), " to ").concat(newDate.toLocaleString()),
                                    actionUrl: "/client/bookings/".concat(bookingId)
                                })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_7 = _a.sent();
                            this.logger.error("Notification failed: ".concat(err_7.message));
                            return [3 /*break*/, 6];
                        case 6: return [4 /*yield*/, this.getBookingImages(bookingId)];
                        case 7:
                            images = _a.sent();
                            return [4 /*yield*/, this.getUserAvatarByVehicleId(updatedBooking.vehicleId)];
                        case 8:
                            avatarUrl = _a.sent();
                            return [2 /*return*/, this.formatBooking(updatedBooking, images, avatarUrl)];
                    }
                });
            });
        };
        BookingsService_1.prototype.cancelBookingByManager = function (userId, bookingId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, currentStatus, uncancelableStates, updatedBooking, err_8, images, avatarUrl;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findFirst({
                                where: { id: bookingId, business: { managerId: userId } },
                                include: {
                                    vehicle: { include: { client: { include: { user: true } } } },
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    }
                                }
                            })];
                        case 1:
                            booking = _b.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            currentStatus = this.getLatestStatusContext(booking.statusHistory);
                            uncancelableStates = ['COMPLETED', 'CANCELLED', 'REJECTED'];
                            if (uncancelableStates.includes(currentStatus)) {
                                throw new common_1.BadRequestException("Cannot cancel booking from its current status: ".concat(currentStatus));
                            }
                            return [4 /*yield*/, this.transitionBookingStatus(bookingId, 'CANCELLED', function (tx, cancelledStatusRow) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: 
                                            // Record cancellation
                                            return [4 /*yield*/, tx.bookingCancellation.create({
                                                    data: {
                                                        bookingId: bookingId,
                                                        cancelledBy: userId,
                                                        reason: (_a = dto.reason) !== null && _a !== void 0 ? _a : 'Cancelled by manager'
                                                    }
                                                })];
                                            case 1:
                                                // Record cancellation
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            updatedBooking = _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: booking.vehicle.client.userId,
                                    actorUserId: userId,
                                    typeCode: 'BOOKING_CANCELLED',
                                    title: 'Booking Cancelled by Provider',
                                    body: "Your booking ".concat(booking.id.slice(0, 8), " has been cancelled by the provider. Reason: ").concat((_a = dto.reason) !== null && _a !== void 0 ? _a : 'Provider request'),
                                    actionUrl: "/client/bookings/".concat(bookingId)
                                })];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_8 = _b.sent();
                            this.logger.error("Notification failed: ".concat(err_8.message));
                            return [3 /*break*/, 6];
                        case 6:
                            if (!updatedBooking) {
                                throw new common_1.NotFoundException('Updated booking not found');
                            }
                            return [4 /*yield*/, this.getBookingImages(bookingId)];
                        case 7:
                            images = _b.sent();
                            return [4 /*yield*/, this.getUserAvatarByVehicleId(updatedBooking.vehicleId)];
                        case 8:
                            avatarUrl = _b.sent();
                            return [2 /*return*/, this.formatBooking(updatedBooking, images, avatarUrl)];
                    }
                });
            });
        };
        // ==================== ADMIN WORKFLOWS ====================
        BookingsService_1.prototype.getAdminBookings = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, ids, scheduledAtFilter, page, limit, skip, _a, bookings, total, formatted;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            where = {};
                            if (!query.status) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getBookingIdsByLatestStatus(query.status)];
                        case 1:
                            ids = _d.sent();
                            where.id = { in: ids };
                            _d.label = 2;
                        case 2:
                            scheduledAtFilter = {};
                            if (query.startDate) {
                                scheduledAtFilter.gte = new Date(query.startDate);
                            }
                            if (query.endDate) {
                                scheduledAtFilter.lte = new Date(query.endDate);
                            }
                            if (query.startDate || query.endDate) {
                                where.scheduledAt = scheduledAtFilter;
                            }
                            if (query.search) {
                                where.OR = [
                                    {
                                        notes: {
                                            some: {
                                                body: { contains: query.search, mode: 'insensitive' }
                                            }
                                        }
                                    },
                                    {
                                        business: {
                                            businessName: { contains: query.search, mode: 'insensitive' }
                                        }
                                    },
                                    {
                                        vehicle: {
                                            licensePlate: { contains: query.search, mode: 'insensitive' }
                                        }
                                    },
                                    {
                                        vehicle: {
                                            client: {
                                                user: {
                                                    fullName: { contains: query.search, mode: 'insensitive' }
                                                }
                                            }
                                        }
                                    }
                                ];
                            }
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            vehicle: true,
                                            business: true,
                                            notes: true,
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'asc' }
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true }
                                                    }
                                                }
                                            },
                                            payment: {
                                                include: {
                                                    status: true,
                                                    paymentMethod: true
                                                }
                                            }
                                        },
                                        orderBy: { scheduledAt: 'desc' },
                                        skip: skip,
                                        take: limit
                                    }),
                                    this.prisma.booking.count({ where: where })
                                ])];
                        case 3:
                            _a = _d.sent(), bookings = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(bookings.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var images;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getBookingImages(b.id)];
                                            case 1:
                                                images = _a.sent();
                                                return [2 /*return*/, this.formatBooking(b, images)];
                                        }
                                    });
                                }); }))];
                        case 4:
                            formatted = _d.sent();
                            return [2 /*return*/, {
                                    data: formatted,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getAdminBooking = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: bookingId },
                                include: {
                                    vehicle: {
                                        include: { client: { include: { user: true } } }
                                    },
                                    business: true,
                                    notes: true,
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'asc' }
                                    },
                                    items: {
                                        include: {
                                            businessService: {
                                                include: { service: true }
                                            }
                                        }
                                    },
                                    payment: {
                                        include: {
                                            status: true,
                                            paymentMethod: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            return [4 /*yield*/, this.getBookingImages(booking.id)];
                        case 2:
                            images = _a.sent();
                            return [2 /*return*/, this.formatBooking(booking, images)];
                    }
                });
            });
        };
        BookingsService_1.prototype.getBookingsByManager = function (managerId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, ids, page, limit, skip, _a, bookings, total, formatted;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            where = {
                                business: { managerId: managerId }
                            };
                            if (!query.status) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getBookingIdsByLatestStatus(query.status)];
                        case 1:
                            ids = _d.sent();
                            where.id = { in: ids };
                            _d.label = 2;
                        case 2:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            vehicle: true,
                                            business: true,
                                            notes: true,
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'asc' }
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true }
                                                    }
                                                }
                                            },
                                            payment: {
                                                include: {
                                                    status: true,
                                                    paymentMethod: true
                                                }
                                            }
                                        },
                                        orderBy: { scheduledAt: 'desc' },
                                        skip: skip,
                                        take: limit
                                    }),
                                    this.prisma.booking.count({ where: where })
                                ])];
                        case 3:
                            _a = _d.sent(), bookings = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(bookings.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var images;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getBookingImages(b.id)];
                                            case 1:
                                                images = _a.sent();
                                                return [2 /*return*/, this.formatBooking(b, images)];
                                        }
                                    });
                                }); }))];
                        case 4:
                            formatted = _d.sent();
                            return [2 /*return*/, {
                                    data: formatted,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        BookingsService_1.prototype.getBookingsByUser = function (clientUserId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var client, where, ids, page, limit, skip, _a, bookings, total, formatted;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({ where: { userId: clientUserId } })];
                        case 1:
                            client = _d.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client user profile not found');
                            }
                            where = {
                                vehicle: { clientId: client.id }
                            };
                            if (!query.status) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getBookingIdsByLatestStatus(query.status)];
                        case 2:
                            ids = _d.sent();
                            where.id = { in: ids };
                            _d.label = 3;
                        case 3:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.booking.findMany({
                                        where: where,
                                        include: {
                                            vehicle: true,
                                            business: true,
                                            notes: true,
                                            statusHistory: {
                                                include: { status: true },
                                                orderBy: { createdAt: 'asc' }
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true }
                                                    }
                                                }
                                            },
                                            payment: {
                                                include: {
                                                    status: true,
                                                    paymentMethod: true
                                                }
                                            }
                                        },
                                        orderBy: { scheduledAt: 'desc' },
                                        skip: skip,
                                        take: limit
                                    }),
                                    this.prisma.booking.count({ where: where })
                                ])];
                        case 4:
                            _a = _d.sent(), bookings = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(bookings.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var images;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.getBookingImages(b.id)];
                                            case 1:
                                                images = _a.sent();
                                                return [2 /*return*/, this.formatBooking(b, images)];
                                        }
                                    });
                                }); }))];
                        case 5:
                            formatted = _d.sent();
                            return [2 /*return*/, {
                                    data: formatted,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit)
                                    }
                                }];
                    }
                });
            });
        };
        // ==================== INTERNAL STATE MACHINE & HELPERS ====================
        BookingsService_1.prototype.validateStateTransition = function (current, target) {
            var transitions = {
                PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
                ACCEPTED: ['CONFIRMED', 'CANCELLED'],
                CONFIRMED: ['VEHICLE_RECEIVED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
                VEHICLE_RECEIVED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
                DIAGNOSIS_SENT: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
                DIAGNOSIS_ACCEPTED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
                DIAGNOSIS_REJECTED: ['CANCELLED', 'IN_PROGRESS'],
                IN_PROGRESS: ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
                READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
                COMPLETED: [],
                CANCELLED: [],
                REJECTED: []
            };
            var allowed = transitions[current] || [];
            if (!allowed.includes(target)) {
                throw new common_1.BadRequestException("Invalid status transition from ".concat(current, " to ").concat(target));
            }
        };
        BookingsService_1.prototype.transitionBookingStatus = function (bookingId, targetContext, additionalOperations) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var targetStatus, payment, newStatusContext, newPaymentStatus, pointsRedemption;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.status.findFirst({
                                            where: { context: targetContext }
                                        })];
                                    case 1:
                                        targetStatus = _a.sent();
                                        if (!targetStatus) {
                                            throw new Error("Target status ".concat(targetContext, " not found in database"));
                                        }
                                        // Add status history record
                                        return [4 /*yield*/, tx.bookingStatus.create({
                                                data: {
                                                    bookingId: bookingId,
                                                    statusId: targetStatus.id
                                                }
                                            })];
                                    case 2:
                                        // Add status history record
                                        _a.sent();
                                        if (!(targetContext === 'CANCELLED')) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.payment.findUnique({
                                                where: { bookingId: bookingId },
                                                include: { status: true }
                                            })];
                                    case 3:
                                        payment = _a.sent();
                                        if (!(payment && !['REFUNDED', 'CANCELLED'].includes(payment.status.context))) return [3 /*break*/, 8];
                                        newStatusContext = payment.status.context === 'PAID' ? 'REFUNDED' : 'CANCELLED';
                                        return [4 /*yield*/, tx.status.findFirst({ where: { context: newStatusContext } })];
                                    case 4:
                                        newPaymentStatus = _a.sent();
                                        if (!newPaymentStatus) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.payment.update({
                                                where: { id: payment.id },
                                                data: { statusId: newPaymentStatus.id }
                                            })];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, tx.loyaltyTransaction.findFirst({
                                                where: { bookingId: bookingId, type: 'REDEEMED' }
                                            })];
                                    case 6:
                                        pointsRedemption = _a.sent();
                                        if (!pointsRedemption) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.loyaltyTransaction.create({
                                                data: {
                                                    clientId: pointsRedemption.clientId,
                                                    bookingId: bookingId,
                                                    type: 'EARNED',
                                                    points: Math.abs(Number(pointsRedemption.points)),
                                                    reason: "Refunded points for cancelled booking ".concat(bookingId.substring(0, 8))
                                                }
                                            })];
                                    case 7:
                                        _a.sent();
                                        _a.label = 8;
                                    case 8:
                                        if (!additionalOperations) return [3 /*break*/, 10];
                                        return [4 /*yield*/, additionalOperations(tx, targetStatus)];
                                    case 9:
                                        _a.sent();
                                        _a.label = 10;
                                    case 10: 
                                    // Return fully updated Booking
                                    return [2 /*return*/, tx.booking.findUnique({
                                            where: { id: bookingId },
                                            include: {
                                                vehicle: true,
                                                business: true,
                                                notes: true,
                                                statusHistory: {
                                                    include: { status: true },
                                                    orderBy: { createdAt: 'asc' }
                                                },
                                                items: {
                                                    include: {
                                                        businessService: {
                                                            include: { service: true }
                                                        }
                                                    }
                                                },
                                                payment: {
                                                    include: { status: true, paymentMethod: true }
                                                }
                                            }
                                        })];
                                }
                            });
                        }); })];
                });
            });
        };
        BookingsService_1.prototype.getLatestStatusContext = function (statusHistory) {
            if (!statusHistory || statusHistory.length === 0)
                return 'PENDING';
            return statusHistory[statusHistory.length - 1].status.context;
        };
        BookingsService_1.prototype.getBookingIdsByLatestStatus = function (statusContext) {
            return __awaiter(this, void 0, void 0, function () {
                var rawIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT booking_id FROM (\n        SELECT DISTINCT ON (booking_id) booking_id, s.context\n        FROM booking_status bs\n        JOIN statuses s ON bs.status_id = s.id\n        ORDER BY booking_id, bs.created_at DESC\n      ) t WHERE t.context = ", "\n    "], ["\n      SELECT booking_id FROM (\n        SELECT DISTINCT ON (booking_id) booking_id, s.context\n        FROM booking_status bs\n        JOIN statuses s ON bs.status_id = s.id\n        ORDER BY booking_id, bs.created_at DESC\n      ) t WHERE t.context = ", "\n    "])), statusContext)];
                        case 1:
                            rawIds = _a.sent();
                            return [2 /*return*/, rawIds.map(function (r) { return r.booking_id; })];
                    }
                });
            });
        };
        BookingsService_1.prototype.getBookingImages = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.image.findMany({
                                where: {
                                    entityId: bookingId,
                                    entityType: 'BOOKING_PROBLEM'
                                },
                                select: { url: true }
                            })];
                        case 1:
                            images = _a.sent();
                            return [2 /*return*/, images.map(function (img) { return img.url; })];
                    }
                });
            });
        };
        BookingsService_1.prototype.getUserAvatarByVehicleId = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle, userId, avatarImg;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!vehicleId)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.prisma.clientVehicle.findUnique({
                                    where: { id: vehicleId },
                                    select: {
                                        client: {
                                            select: {
                                                userId: true
                                            }
                                        }
                                    }
                                })];
                        case 1:
                            vehicle = _b.sent();
                            userId = (_a = vehicle === null || vehicle === void 0 ? void 0 : vehicle.client) === null || _a === void 0 ? void 0 : _a.userId;
                            if (!userId)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.prisma.image.findFirst({
                                    where: { entityType: 'USER_AVATAR', entityId: userId },
                                    select: { url: true }
                                })];
                        case 2:
                            avatarImg = _b.sent();
                            return [2 /*return*/, (avatarImg === null || avatarImg === void 0 ? void 0 : avatarImg.url) || null];
                    }
                });
            });
        };
        BookingsService_1.prototype.formatBooking = function (booking, images, clientAvatar) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            if (images === void 0) { images = []; }
            if (clientAvatar === void 0) { clientAvatar = null; }
            var latestStatus = this.getLatestStatusContext(booking.statusHistory);
            var clientName = ((_c = (_b = (_a = booking.vehicle) === null || _a === void 0 ? void 0 : _a.client) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.fullName) ||
                null;
            var resolvedAvatar = clientAvatar ||
                ((_f = (_e = (_d = booking.vehicle) === null || _d === void 0 ? void 0 : _d.client) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.profileImageUrl) ||
                null;
            return {
                id: booking.id,
                client_name: clientName,
                client_avatar: resolvedAvatar,
                vehicle_id: booking.vehicleId,
                business_id: booking.businessId,
                scheduled_at: booking.scheduledAt,
                expected_delivery_at: (_g = booking.expectedDeliveryAt) !== null && _g !== void 0 ? _g : undefined,
                sub_total: Number(booking.subTotal),
                platform_fee: Number(booking.platformFee) || 0,
                discount: Number(booking.discount),
                commission: Number(booking.commission),
                total_price: Number(booking.totalPrice),
                cancellation_reason: latestStatus === 'CANCELLED' ? (((_h = booking.cancellation) === null || _h === void 0 ? void 0 : _h.reason) || undefined) : undefined,
                rejection_reason: latestStatus === 'REJECTED' ? (((_j = booking.cancellation) === null || _j === void 0 ? void 0 : _j.reason) || undefined) : undefined,
                note: booking.notes && booking.notes.length > 0 ? booking.notes[0].body : undefined,
                status: latestStatus,
                created_at: booking.createdAt,
                updated_at: booking.updatedAt,
                items: (booking.items || []).map(function (item) {
                    var _a, _b, _c, _d;
                    return ({
                        id: item.id,
                        businessServiceId: item.businessServiceId,
                        serviceTitle: ((_b = (_a = item.businessService) === null || _a === void 0 ? void 0 : _a.service) === null || _b === void 0 ? void 0 : _b.title) || 'Service',
                        serviceDescription: ((_d = (_c = item.businessService) === null || _c === void 0 ? void 0 : _c.service) === null || _d === void 0 ? void 0 : _d.description) || undefined,
                        price: Number(item.price),
                    });
                }),
                status_history: (booking.statusHistory || []).map(function (sh) { return ({
                    id: sh.id,
                    status: sh.status.context,
                    createdAt: sh.createdAt,
                }); }),
                payment: booking.payment ? {
                    id: booking.payment.id,
                    amount: Number(booking.payment.amount),
                    status: booking.payment.status.context,
                    method: booking.payment.paymentMethod.name,
                } : undefined,
                vehicle: {
                    id: booking.vehicle.id,
                    make: (_k = booking.vehicle.make) !== null && _k !== void 0 ? _k : undefined,
                    model: (_l = booking.vehicle.model) !== null && _l !== void 0 ? _l : undefined,
                    licensePlate: booking.vehicle.licensePlate,
                    vin: (_m = booking.vehicle.vin) !== null && _m !== void 0 ? _m : undefined,
                    year: (_o = booking.vehicle.year) !== null && _o !== void 0 ? _o : undefined,
                    color: (_p = booking.vehicle.color) !== null && _p !== void 0 ? _p : undefined,
                    client: booking.vehicle.client ? {
                        id: booking.vehicle.client.id,
                        user: booking.vehicle.client.user ? {
                            id: booking.vehicle.client.user.id,
                            fullName: booking.vehicle.client.user.fullName,
                            phone: (_q = booking.vehicle.client.user.phone) !== null && _q !== void 0 ? _q : undefined,
                            email: booking.vehicle.client.user.email,
                        } : undefined
                    } : undefined
                },
                business: {
                    id: booking.business.id,
                    businessName: booking.business.businessName,
                    address: booking.business.address,
                    managerId: booking.business.managerId,
                    latitude: (_r = booking.business.latitude) !== null && _r !== void 0 ? _r : undefined,
                    longitude: (_s = booking.business.longitude) !== null && _s !== void 0 ? _s : undefined,
                },
                images: images,
                diagnostic_report: booking.diagnosticReport || undefined,
            };
        };
        return BookingsService_1;
    }());
    __setFunctionName(_classThis, "BookingsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BookingsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BookingsService = _classThis;
}();
exports.BookingsService = BookingsService;
var templateObject_1, templateObject_2;
