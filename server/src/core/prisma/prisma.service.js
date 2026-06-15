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
exports.PrismaService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var PrismaService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = client_1.PrismaClient;
    var PrismaService = _classThis = /** @class */ (function (_super) {
        __extends(PrismaService_1, _super);
        function PrismaService_1(winstonLogger) {
            var _this = _super.call(this, {
                log: [
                    { emit: 'event', level: 'query' },
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'warn' },
                ],
            }) || this;
            _this.winstonLogger = winstonLogger;
            _this.logger = new common_1.Logger(PrismaService.name);
            return _this;
        }
        PrismaService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Query logging - warn on slow queries (>200ms)
                            this.$on('query', function (event) {
                                if (event.duration > 200) {
                                    _this.winstonLogger.warn("Slow query detected (".concat(event.duration, "ms): ").concat(event.query), 'PrismaService');
                                }
                            });
                            // Error logging
                            this.$on('error', function (event) {
                                _this.winstonLogger.error("Database error: ".concat(event.message), event.target, 'PrismaService');
                            });
                            // Warning logging
                            this.$on('warn', function (event) {
                                _this.winstonLogger.warn("Database warning: ".concat(event.message), 'PrismaService');
                            });
                            return [4 /*yield*/, this.$connect()];
                        case 1:
                            _a.sent();
                            this.logger.log('✅ Database connected successfully');
                            return [2 /*return*/];
                    }
                });
            });
        };
        PrismaService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$disconnect()];
                        case 1:
                            _a.sent();
                            this.logger.log('Database disconnected');
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Soft delete a user (set deleted_at and is_active = false)
         * Based on schema: users table has deleted_at and is_active fields
         */
        PrismaService_1.prototype.softDeleteUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.user.update({
                                where: { id: userId },
                                data: {
                                    deletedAt: new Date(),
                                    isActive: false,
                                    updatedAt: new Date(),
                                },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Hard delete expired records
         */
        PrismaService_1.prototype.cleanupExpiredRecords = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, sessionsResult, otpsResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.userSession.deleteMany({
                                    where: { expiresAt: { lt: now } },
                                })];
                        case 1:
                            sessionsResult = _a.sent();
                            return [4 /*yield*/, this.userOtp.deleteMany({
                                    where: { expiresAt: { lt: now } },
                                })];
                        case 2:
                            otpsResult = _a.sent();
                            return [2 /*return*/, {
                                    sessions: sessionsResult.count,
                                    otps: otpsResult.count,
                                }];
                    }
                });
            });
        };
        /**
         * Get client by user ID with location parsed
         */
        PrismaService_1.prototype.getClientWithLocation = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        c.id,\n        c.user_id,\n        c.created_at,\n        c.updated_at,\n        ST_Y(c.location::geometry) as latitude,\n        ST_X(c.location::geometry) as longitude,\n        u.full_name,\n        u.email,\n        u.phone,\n        u.avatar_url,\n        u.email_verified,\n        u.phone_verified\n      FROM clients c\n      JOIN users u ON c.user_id = u.id\n      WHERE c.user_id = ", "\n    "], ["\n      SELECT \n        c.id,\n        c.user_id,\n        c.created_at,\n        c.updated_at,\n        ST_Y(c.location::geometry) as latitude,\n        ST_X(c.location::geometry) as longitude,\n        u.full_name,\n        u.email,\n        u.phone,\n        u.avatar_url,\n        u.email_verified,\n        u.phone_verified\n      FROM clients c\n      JOIN users u ON c.user_id = u.id\n      WHERE c.user_id = ", "\n    "])), userId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result[0] || null];
                    }
                });
            });
        };
        /**
         * Find clients within radius (PostGIS query)
         */
        PrismaService_1.prototype.findNearbyClients = function (latitude_1, longitude_1, radiusKm_1) {
            return __awaiter(this, arguments, void 0, function (latitude, longitude, radiusKm, limit, offset) {
                var radiusMeters;
                if (limit === void 0) { limit = 50; }
                if (offset === void 0) { offset = 0; }
                return __generator(this, function (_a) {
                    radiusMeters = radiusKm * 1000;
                    return [2 /*return*/, this.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT \n        c.id,\n        c.user_id,\n        u.full_name,\n        u.email,\n        u.phone,\n        u.avatar_url,\n        ROUND((ST_Distance(c.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km\n      FROM clients c\n      JOIN users u ON c.user_id = u.id\n      WHERE u.is_active = true\n        AND u.deleted_at IS NULL\n        AND u.role = 'CLIENT'\n        AND ST_DWithin(\n          c.location, \n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          ", "\n        )\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "], ["\n      SELECT \n        c.id,\n        c.user_id,\n        u.full_name,\n        u.email,\n        u.phone,\n        u.avatar_url,\n        ROUND((ST_Distance(c.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km\n      FROM clients c\n      JOIN users u ON c.user_id = u.id\n      WHERE u.is_active = true\n        AND u.deleted_at IS NULL\n        AND u.role = 'CLIENT'\n        AND ST_DWithin(\n          c.location, \n          ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          ", "\n        )\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "])), longitude, latitude, longitude, latitude, radiusMeters, limit, offset)];
                });
            });
        };
        /**
         * Update client location
         */
        PrismaService_1.prototype.updateClientLocation = function (userId, latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$executeRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      UPDATE clients \n      SET location = ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          updated_at = NOW()\n      WHERE user_id = ", "\n    "], ["\n      UPDATE clients \n      SET location = ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n          updated_at = NOW()\n      WHERE user_id = ", "\n    "])), longitude, latitude, userId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get booking with status history
         */
        PrismaService_1.prototype.getBookingWithStatus = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT \n        b.*,\n        bs.status_id,\n        s.context as status,\n        bs.created_at as status_changed_at\n      FROM bookings b\n      LEFT JOIN booking_status bs ON b.id = bs.booking_id\n      LEFT JOIN statuses s ON bs.status_id = s.id\n      WHERE b.id = ", "\n      ORDER BY bs.created_at DESC\n      LIMIT 1\n    "], ["\n      SELECT \n        b.*,\n        bs.status_id,\n        s.context as status,\n        bs.created_at as status_changed_at\n      FROM bookings b\n      LEFT JOIN booking_status bs ON b.id = bs.booking_id\n      LEFT JOIN statuses s ON bs.status_id = s.id\n      WHERE b.id = ", "\n      ORDER BY bs.created_at DESC\n      LIMIT 1\n    "])), bookingId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result[0] || null];
                    }
                });
            });
        };
        /**
         * Update booking status
         */
        PrismaService_1.prototype.updateBookingStatus = function (bookingId, statusContext) {
            return __awaiter(this, void 0, void 0, function () {
                var statusResult, statusId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      SELECT id FROM statuses WHERE context = ", " LIMIT 1\n    "], ["\n      SELECT id FROM statuses WHERE context = ", " LIMIT 1\n    "])), statusContext)];
                        case 1:
                            statusResult = _a.sent();
                            if (statusResult.length === 0) {
                                throw new Error("Status '".concat(statusContext, "' not found"));
                            }
                            statusId = statusResult[0].id;
                            return [4 /*yield*/, this.bookingStatus.create({
                                    data: {
                                        bookingId: bookingId,
                                        statusId: statusId,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get business with current status
         */
        PrismaService_1.prototype.getBusinessWithStatus = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      SELECT \n        b.*,\n        bs.status_id,\n        s.context as status,\n        bs.created_at as status_changed_at\n      FROM businesses b\n      LEFT JOIN business_status bs ON b.id = bs.business_id\n      LEFT JOIN statuses s ON bs.status_id = s.id\n      WHERE b.id = ", "\n      ORDER BY bs.created_at DESC\n      LIMIT 1\n    "], ["\n      SELECT \n        b.*,\n        bs.status_id,\n        s.context as status,\n        bs.created_at as status_changed_at\n      FROM businesses b\n      LEFT JOIN business_status bs ON b.id = bs.business_id\n      LEFT JOIN statuses s ON bs.status_id = s.id\n      WHERE b.id = ", "\n      ORDER BY bs.created_at DESC\n      LIMIT 1\n    "])), businessId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result[0] || null];
                    }
                });
            });
        };
        /**
         * Update business status
         */
        PrismaService_1.prototype.updateBusinessStatus = function (businessId, statusContext) {
            return __awaiter(this, void 0, void 0, function () {
                var statusResult, statusId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      SELECT id FROM statuses WHERE context = ", " LIMIT 1\n    "], ["\n      SELECT id FROM statuses WHERE context = ", " LIMIT 1\n    "])), statusContext)];
                        case 1:
                            statusResult = _a.sent();
                            if (statusResult.length === 0) {
                                throw new Error("Status '".concat(statusContext, "' not found"));
                            }
                            statusId = statusResult[0].id;
                            return [4 /*yield*/, this.businessStatus.create({
                                    data: {
                                        businessId: businessId,
                                        statusId: statusId,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get payment with status
         */
        PrismaService_1.prototype.getPaymentWithStatus = function (paymentId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$queryRaw(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      SELECT \n        p.*,\n        pm.name as payment_method,\n        s.context as status\n      FROM payments p\n      JOIN payment_methods pm ON p.payment_method_id = pm.id\n      JOIN statuses s ON p.status_id = s.id\n      WHERE p.id = ", "\n    "], ["\n      SELECT \n        p.*,\n        pm.name as payment_method,\n        s.context as status\n      FROM payments p\n      JOIN payment_methods pm ON p.payment_method_id = pm.id\n      JOIN statuses s ON p.status_id = s.id\n      WHERE p.id = ", "\n    "])), paymentId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result[0] || null];
                    }
                });
            });
        };
        /**
         * Create a rejection reason record
         */
        PrismaService_1.prototype.createRejectionReason = function (entityType, entityId, reasonText) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rejectionReason.create({
                                data: {
                                    entityType: entityType,
                                    entityId: entityId,
                                    reasonText: reasonText,
                                },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get all active statuses
         */
        PrismaService_1.prototype.getStatuses = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.status.findMany({
                            select: { id: true, context: true },
                        })];
                });
            });
        };
        /**
         * Get or create status by context
         */
        PrismaService_1.prototype.getOrCreateStatus = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.status.findFirst({
                                where: { context: context },
                            })];
                        case 1:
                            status = _a.sent();
                            if (!!status) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.status.create({
                                    data: { context: context },
                                })];
                        case 2:
                            status = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, status];
                    }
                });
            });
        };
        /**
         * Get payment methods
         */
        PrismaService_1.prototype.getPaymentMethods = function () {
            return __awaiter(this, arguments, void 0, function (enabledOnly) {
                if (enabledOnly === void 0) { enabledOnly = true; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentMethod.findMany({
                            where: enabledOnly ? { isEnabled: true } : {},
                            select: { id: true, name: true, isEnabled: true },
                        })];
                });
            });
        };
        /**
         * Execute a transaction with retry logic
         */
        PrismaService_1.prototype.withTransaction = function (fn_1) {
            return __awaiter(this, arguments, void 0, function (fn, maxRetries) {
                var lastError, _loop_1, this_1, attempt, state_1;
                var _this = this;
                var _a;
                if (maxRetries === void 0) { maxRetries = 3; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            lastError = null;
                            _loop_1 = function (attempt) {
                                var _c, error_1;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 2, , 5]);
                                            _c = {};
                                            return [4 /*yield*/, this_1.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    var transactionalService;
                                                    return __generator(this, function (_a) {
                                                        transactionalService = new Proxy(this, {
                                                            get: function (target, prop) {
                                                                if (prop in tx) {
                                                                    return tx[prop];
                                                                }
                                                                return target[prop];
                                                            },
                                                        });
                                                        return [2 /*return*/, fn(transactionalService)];
                                                    });
                                                }); })];
                                        case 1: return [2 /*return*/, (_c.value = _d.sent(), _c)];
                                        case 2:
                                            error_1 = _d.sent();
                                            lastError = error_1;
                                            if (!(((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes('deadlock')) && attempt < maxRetries)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100 * attempt); })];
                                        case 3:
                                            _d.sent();
                                            return [2 /*return*/, "continue"];
                                        case 4: throw error_1;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            attempt = 1;
                            _b.label = 1;
                        case 1:
                            if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_1(attempt)];
                        case 2:
                            state_1 = _b.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _b.label = 3;
                        case 3:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 4: throw lastError;
                    }
                });
            });
        };
        /**
         * Check if database connection is healthy
         */
        PrismaService_1.prototype.healthCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var start, latency, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = Date.now();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.$queryRaw(templateObject_9 || (templateObject_9 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 2:
                            _a.sent();
                            latency = Date.now() - start;
                            return [2 /*return*/, { status: 'ok', latency: latency }];
                        case 3:
                            error_2 = _a.sent();
                            return [2 /*return*/, { status: 'error', latency: Date.now() - start }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return PrismaService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "PrismaService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrismaService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrismaService = _classThis;
}();
exports.PrismaService = PrismaService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient, Prisma } from '@prisma/client';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
// @Injectable()
// export class PrismaService
//   extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor(private readonly logger: WinstonLoggerService) {
//     super({
//       log: [
//         { emit: 'event', level: 'query' },
//         { emit: 'event', level: 'error' },
//         { emit: 'event', level: 'warn' },
//       ],
//     });
//   }
//   async onModuleInit(): Promise<void> {
//     this.$on('query', (event:any) => {
//       if (event.duration > 200) {
//         this.logger.warn(
//           `Slow query detected (${event.duration}ms): ${event.query}`,
//           'PrismaService',
//         );
//       }
//     });
//     this.$on('error', (event:any) => {
//       this.logger.error(
//         `Database error: ${event.message}`,
//         event.target,
//         'PrismaService',
//       );
//     });
//     this.$on('warn', (event:any) => {
//       this.logger.warn(`Database warning: ${event.message}`, 'PrismaService');
//     });
//     await this.$connect();
//     this.logger.log('✅ Database connected', 'PrismaService');
//   }
//   async onModuleDestroy(): Promise<void> {
//     await this.$disconnect();
//     this.logger.log('Database disconnected', 'PrismaService');
//   }
//   async softDelete(model: 'user', id: string): Promise<void> {
//     await (this[model] as any).update({
//       where: { id },
//       data: { deletedAt: new Date() },
//     });
//   }
//   async cleanupExpiredRecords(): Promise<{
//     sessions: number;
//     carts: number;
//   }> {
//     const now = new Date();
//     const [sessions] = await this.$transaction([
//       this.userSession.deleteMany({
//         where: { expiresAt: { lt: now } },
//       }),
//       // this.cart.deleteMany({
//       //   where: { expiresAt: { lt: now } },
//       // }),
//     ]);
//     return {
//       sessions: sessions.count,
//       carts: 0,
//     };
//   }
// }
