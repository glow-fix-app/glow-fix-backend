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
exports.LoyaltyService = void 0;
var common_1 = require("@nestjs/common");
var LoyaltyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LoyaltyService = _classThis = /** @class */ (function () {
        function LoyaltyService_1(prisma, eventEmitter, notificationsService) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.notificationsService = notificationsService;
            this.logger = new common_1.Logger(LoyaltyService.name);
            this.cachedConfig = null;
            this.configCacheTime = null;
            this.CONFIG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
        }
        // ==================== CONFIGURATION ====================
        /**
         * Get current loyalty configuration (cached)
         */
        LoyaltyService_1.prototype.getConfig = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Check cache
                            if (this.cachedConfig &&
                                this.configCacheTime &&
                                Date.now() - this.configCacheTime.getTime() < this.CONFIG_CACHE_TTL_MS) {
                                return [2 /*return*/, this.cachedConfig];
                            }
                            return [4 /*yield*/, this.prisma.loyaltyConfig.findFirst({
                                    where: { isActive: true },
                                })];
                        case 1:
                            config = _a.sent();
                            if (!!config) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.loyaltyConfig.create({
                                    data: {
                                        pointsPer100Egp: 100,
                                        egpPerPoint: 0.1,
                                        maxRedeemPct: 50,
                                        isActive: true,
                                    },
                                })];
                        case 2:
                            // Create default config if none exists
                            config = _a.sent();
                            _a.label = 3;
                        case 3:
                            this.cachedConfig = {
                                id: config.id,
                                points_per_100_egp: config.pointsPer100Egp,
                                egp_per_point: Number(config.egpPerPoint),
                                max_redeem_pct: config.maxRedeemPct,
                                min_points_to_redeem: 100, // Default, would come from config table
                                points_expiry_days: null,
                                is_active: config.isActive,
                            };
                            this.configCacheTime = new Date();
                            return [2 /*return*/, this.cachedConfig];
                    }
                });
            });
        };
        /**
         * Update loyalty configuration (admin only)
         */
        LoyaltyService_1.prototype.updateConfig = function (adminId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var config, newConfig, updated;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.loyaltyConfig.findFirst()];
                        case 1:
                            config = _e.sent();
                            if (!!config) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.loyaltyConfig.create({
                                    data: {
                                        pointsPer100Egp: (_a = dto.points_per_100_egp) !== null && _a !== void 0 ? _a : 100,
                                        egpPerPoint: (_b = dto.egp_per_point) !== null && _b !== void 0 ? _b : 0.1,
                                        maxRedeemPct: (_c = dto.max_redeem_pct) !== null && _c !== void 0 ? _c : 50,
                                        isActive: (_d = dto.is_active) !== null && _d !== void 0 ? _d : true,
                                    },
                                })];
                        case 2:
                            newConfig = _e.sent();
                            this.cachedConfig = null;
                            this.logger.log("Loyalty config created by admin ".concat(adminId));
                            return [2 /*return*/, this.formatConfigResponse(newConfig)];
                        case 3: return [4 /*yield*/, this.prisma.loyaltyConfig.update({
                                where: { id: config.id },
                                data: {
                                    pointsPer100Egp: dto.points_per_100_egp,
                                    egpPerPoint: dto.egp_per_point,
                                    maxRedeemPct: dto.max_redeem_pct,
                                    isActive: dto.is_active,
                                },
                            })];
                        case 4:
                            updated = _e.sent();
                            this.cachedConfig = null; // Invalidate cache
                            this.logger.log("Loyalty config updated by admin ".concat(adminId));
                            return [2 /*return*/, this.formatConfigResponse(updated)];
                    }
                });
            });
        };
        // ==================== POINTS EARNING ====================
        /**
         * Award points to a client for a completed booking
         */
        LoyaltyService_1.prototype.awardPoints = function (clientId, bookingId, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var config, pointsEarned, existingTransaction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _a.sent();
                            if (!config.is_active) {
                                return [2 /*return*/, 0];
                            }
                            pointsEarned = Math.floor((amount / 100) * config.points_per_100_egp);
                            if (pointsEarned <= 0) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.findFirst({
                                    where: {
                                        bookingId: bookingId,
                                        type: 'EARNED',
                                    },
                                })];
                        case 2:
                            existingTransaction = _a.sent();
                            if (existingTransaction) {
                                this.logger.warn("Points already awarded for booking ".concat(bookingId));
                                return [2 /*return*/, existingTransaction.points];
                            }
                            // Create transaction
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: clientId,
                                        bookingId: bookingId,
                                        type: 'EARNED',
                                        points: pointsEarned,
                                        reason: "Earned ".concat(pointsEarned, " points from booking (").concat(amount, " EGP)"),
                                    },
                                })];
                        case 3:
                            // Create transaction
                            _a.sent();
                            this.logger.log("Awarded ".concat(pointsEarned, " points to client ").concat(clientId, " for booking ").concat(bookingId));
                            // Send notification
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientId,
                                    typeCode: 'LOYALTY_POINTS_EARNED',
                                    title: 'Loyalty Points Earned! 🎉',
                                    body: "You earned ".concat(pointsEarned, " points from your recent booking. Keep earning!"),
                                })];
                        case 4:
                            // Send notification
                            _a.sent();
                            this.eventEmitter.emit('loyalty.points_earned', {
                                clientId: clientId,
                                bookingId: bookingId,
                                points: pointsEarned,
                                amount: amount,
                            });
                            return [2 /*return*/, pointsEarned];
                    }
                });
            });
        };
        /**
         * Award signup bonus points to new client
         */
        LoyaltyService_1.prototype.awardSignupBonus = function (clientId) {
            return __awaiter(this, void 0, void 0, function () {
                var signupBonus, existingBonus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signupBonus = 500;
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.findFirst({
                                    where: {
                                        clientId: clientId,
                                        reason: { contains: 'Signup bonus' },
                                    },
                                })];
                        case 1:
                            existingBonus = _a.sent();
                            if (existingBonus) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: clientId,
                                        type: 'EARNED',
                                        points: signupBonus,
                                        reason: 'Signup bonus - welcome to Glow Fix!',
                                        bookingId: null,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Awarded signup bonus of ".concat(signupBonus, " points to client ").concat(clientId));
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientId,
                                    typeCode: 'LOYALTY_POINTS_EARNED',
                                    title: 'Welcome Bonus! 🎁',
                                    body: "You received ".concat(signupBonus, " bonus points for joining Glow Fix!"),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, signupBonus];
                    }
                });
            });
        };
        // ==================== POINTS REDEMPTION ====================
        /**
         * Calculate potential redemption for a booking
         */
        LoyaltyService_1.prototype.calculateRedemption = function (clientId, totalAmount, pointsToRedeem) {
            return __awaiter(this, void 0, void 0, function () {
                var config, pointsBalance, maxDiscountAmount, maxPointsForDiscount, maxPointsToRedeem, pointsToUse, discountAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _a.sent();
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 2:
                            pointsBalance = _a.sent();
                            if (!config.is_active) {
                                return [2 /*return*/, {
                                        eligible: false,
                                        points_available: pointsBalance,
                                        max_points_to_redeem: 0,
                                        max_discount_amount: 0,
                                        message: 'Loyalty program is currently inactive',
                                    }];
                            }
                            if (pointsBalance < config.min_points_to_redeem) {
                                return [2 /*return*/, {
                                        eligible: false,
                                        points_available: pointsBalance,
                                        max_points_to_redeem: 0,
                                        max_discount_amount: 0,
                                        message: "Minimum ".concat(config.min_points_to_redeem, " points required for redemption"),
                                    }];
                            }
                            maxDiscountAmount = (totalAmount * config.max_redeem_pct) / 100;
                            maxPointsForDiscount = Math.floor(maxDiscountAmount / config.egp_per_point);
                            maxPointsToRedeem = Math.min(pointsBalance, maxPointsForDiscount);
                            pointsToUse = pointsToRedeem || maxPointsToRedeem;
                            pointsToUse = Math.min(pointsToUse, maxPointsToRedeem);
                            if (pointsToUse < config.min_points_to_redeem && pointsToRedeem) {
                                return [2 /*return*/, {
                                        eligible: false,
                                        points_available: pointsBalance,
                                        max_points_to_redeem: maxPointsToRedeem,
                                        max_discount_amount: maxDiscountAmount,
                                        message: "Minimum ".concat(config.min_points_to_redeem, " points required. You have ").concat(pointsBalance, " points."),
                                    }];
                            }
                            discountAmount = pointsToUse * config.egp_per_point;
                            return [2 /*return*/, {
                                    eligible: true,
                                    points_available: pointsBalance,
                                    max_points_to_redeem: maxPointsToRedeem,
                                    max_discount_amount: maxDiscountAmount,
                                    suggested_points: pointsToUse,
                                    discount_amount: discountAmount,
                                    remaining_points: pointsBalance - pointsToUse,
                                }];
                    }
                });
            });
        };
        /**
         * Redeem points for a booking discount
         */
        LoyaltyService_1.prototype.redeemPointsForBooking = function (clientId, bookingId, pointsToRedeem) {
            return __awaiter(this, void 0, void 0, function () {
                var config, booking, bookingStatus, status, existingRedemption, calculation, pointsBalance, discountInCents;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _b.sent();
                            return [4 /*yield*/, this.prisma.booking.findUnique({
                                    where: { id: bookingId },
                                    include: {
                                        vehicle: {
                                            include: { client: { include: { user: true } } },
                                        },
                                    },
                                })];
                        case 2:
                            booking = _b.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            if (booking.vehicle.client.userId !== clientId) {
                                throw new common_1.ForbiddenException('You do not own this booking');
                            }
                            return [4 /*yield*/, this.prisma.bookingStatus.findFirst({
                                    where: { bookingId: bookingId },
                                    include: { status: true },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 3:
                            bookingStatus = _b.sent();
                            status = ((_a = bookingStatus === null || bookingStatus === void 0 ? void 0 : bookingStatus.status) === null || _a === void 0 ? void 0 : _a.context) || 'PENDING';
                            if (status !== 'PENDING' && status !== 'CONFIRMED') {
                                throw new common_1.BadRequestException('Points can only be redeemed for pending or confirmed bookings');
                            }
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.findFirst({
                                    where: {
                                        bookingId: bookingId,
                                        type: 'REDEEMED',
                                    },
                                })];
                        case 4:
                            existingRedemption = _b.sent();
                            if (existingRedemption) {
                                throw new common_1.BadRequestException('Points already redeemed for this booking');
                            }
                            return [4 /*yield*/, this.calculateRedemption(clientId, Number(booking.totalPrice) / 100, pointsToRedeem)];
                        case 5:
                            calculation = _b.sent();
                            if (!calculation.eligible ||
                                !calculation.discount_amount ||
                                !calculation.suggested_points) {
                                throw new common_1.BadRequestException(calculation.message || 'Not enough points for redemption');
                            }
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 6:
                            pointsBalance = _b.sent();
                            discountInCents = Math.floor(calculation.discount_amount * 100);
                            // Create redemption transaction
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: clientId,
                                        bookingId: bookingId,
                                        type: 'REDEEMED',
                                        points: -calculation.suggested_points,
                                        reason: "Redeemed ".concat(calculation.suggested_points, " points for EGP ").concat(calculation.discount_amount.toFixed(2), " discount"),
                                    },
                                })];
                        case 7:
                            // Create redemption transaction
                            _b.sent();
                            // Update booking with discount
                            return [4 /*yield*/, this.prisma.booking.update({
                                    where: { id: bookingId },
                                    data: {
                                        discount: {
                                            increment: discountInCents,
                                        },
                                        totalPrice: {
                                            decrement: discountInCents,
                                        },
                                    },
                                })];
                        case 8:
                            // Update booking with discount
                            _b.sent();
                            this.logger.log("Redeemed ".concat(calculation.suggested_points, " points for client ").concat(clientId, " on booking ").concat(bookingId));
                            // Send notification
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientId,
                                    typeCode: 'LOYALTY_POINTS_REDEEMED',
                                    title: 'Points Redeemed! 💰',
                                    body: "You redeemed ".concat(calculation.suggested_points, " points and saved EGP ").concat(calculation.discount_amount.toFixed(2), " on your booking."),
                                })];
                        case 9:
                            // Send notification
                            _b.sent();
                            this.eventEmitter.emit('loyalty.points_redeemed', {
                                clientId: clientId,
                                bookingId: bookingId,
                                points: calculation.suggested_points,
                                discount: calculation.discount_amount,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    points_used: calculation.suggested_points,
                                    discount_amount: calculation.discount_amount,
                                    remaining_points: pointsBalance - calculation.suggested_points,
                                    message: "Successfully redeemed ".concat(calculation.suggested_points, " points for EGP ").concat(calculation.discount_amount.toFixed(2), " discount!"),
                                }];
                    }
                });
            });
        };
        /**
         * Quick redeem for coupon (as shown in UI: Redeem 100 pts → EGP 10)
         */
        LoyaltyService_1.prototype.quickRedeem = function (clientId, pointsToRedeem) {
            return __awaiter(this, void 0, void 0, function () {
                var config, pointsBalance, discountAmount, couponCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _a.sent();
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 2:
                            pointsBalance = _a.sent();
                            // Validate points
                            if (pointsToRedeem < config.min_points_to_redeem) {
                                throw new common_1.BadRequestException("Minimum ".concat(config.min_points_to_redeem, " points required for redemption"));
                            }
                            if (pointsToRedeem > pointsBalance) {
                                throw new common_1.BadRequestException("Insufficient points. You have ".concat(pointsBalance, " points."));
                            }
                            discountAmount = pointsToRedeem * config.egp_per_point;
                            couponCode = "SAVE".concat(discountAmount, "_").concat(Date.now(), "_").concat(clientId.slice(0, 6));
                            // Create redemption transaction
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: clientId,
                                        type: 'REDEEMED',
                                        points: -pointsToRedeem,
                                        reason: "Redeemed ".concat(pointsToRedeem, " points for EGP ").concat(discountAmount.toFixed(2), " off coupon (").concat(couponCode, ")"),
                                        bookingId: null,
                                    },
                                })];
                        case 3:
                            // Create redemption transaction
                            _a.sent();
                            this.logger.log("Redeemed ".concat(pointsToRedeem, " points for coupon ").concat(couponCode, " for client ").concat(clientId));
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientId,
                                    typeCode: 'LOYALTY_POINTS_REDEEMED',
                                    title: 'Coupon Generated! 🎫',
                                    body: "You redeemed ".concat(pointsToRedeem, " points for EGP ").concat(discountAmount.toFixed(2), " off coupon. Code: ").concat(couponCode),
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    points_used: pointsToRedeem,
                                    discount_amount: discountAmount,
                                    remaining_points: pointsBalance - pointsToRedeem,
                                    coupon_code: couponCode,
                                    message: "Successfully redeemed ".concat(pointsToRedeem, " points for EGP ").concat(discountAmount.toFixed(2), " off!"),
                                }];
                    }
                });
            });
        };
        // ==================== POINTS BALANCE & HISTORY ====================
        /**
         * Get client's points balance
         */
        LoyaltyService_1.prototype.getClientPointsBalance = function (clientId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                where: { clientId: clientId },
                                _sum: { points: true },
                            })];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, ((_a = result._sum) === null || _a === void 0 ? void 0 : _a.points) || 0];
                    }
                });
            });
        };
        /**
         * Get client's loyalty summary (for UI display)
         */
        LoyaltyService_1.prototype.getClientSummary = function (clientId) {
            return __awaiter(this, void 0, void 0, function () {
                var config, pointsBalance, earnedResult, redeemedResult, pointsEarnedLifetime, pointsRedeemedLifetime, pointsValueEgp, pointsExpiringSoon, expiryDate, oldTransactions, oldPointsSum, tiers, currentTier, nextTier, pointsToNextTier, i, nextTierIndex;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _c.sent();
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 2:
                            pointsBalance = _c.sent();
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                    where: { clientId: clientId, type: 'EARNED' },
                                    _sum: { points: true },
                                })];
                        case 3:
                            earnedResult = _c.sent();
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                    where: { clientId: clientId, type: 'REDEEMED' },
                                    _sum: { points: true },
                                })];
                        case 4:
                            redeemedResult = _c.sent();
                            pointsEarnedLifetime = ((_a = earnedResult._sum) === null || _a === void 0 ? void 0 : _a.points) || 0;
                            pointsRedeemedLifetime = Math.abs(((_b = redeemedResult._sum) === null || _b === void 0 ? void 0 : _b.points) || 0);
                            pointsValueEgp = pointsBalance * Number(config.egp_per_point);
                            pointsExpiringSoon = 0;
                            if (!config.points_expiry_days) return [3 /*break*/, 6];
                            expiryDate = new Date();
                            expiryDate.setDate(expiryDate.getDate() - config.points_expiry_days);
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.findMany({
                                    where: {
                                        clientId: clientId,
                                        type: 'EARNED',
                                        createdAt: { lt: expiryDate },
                                    },
                                })];
                        case 5:
                            oldTransactions = _c.sent();
                            oldPointsSum = oldTransactions.reduce(function (sum, t) { return sum + t.points; }, 0);
                            pointsExpiringSoon = Math.max(0, oldPointsSum - pointsRedeemedLifetime);
                            _c.label = 6;
                        case 6:
                            tiers = [
                                { name: 'Bronze', minPoints: 0, discount: 0 },
                                { name: 'Silver', minPoints: 1000, discount: 5 },
                                { name: 'Gold', minPoints: 5000, discount: 10 },
                                { name: 'Platinum', minPoints: 10000, discount: 15 },
                            ];
                            currentTier = tiers[0];
                            for (i = 0; i < tiers.length; i++) {
                                if (pointsBalance >= tiers[i].minPoints) {
                                    currentTier = tiers[i];
                                }
                            }
                            nextTierIndex = tiers.findIndex(function (t) { return t.name === currentTier.name; }) + 1;
                            if (nextTierIndex < tiers.length) {
                                nextTier = tiers[nextTierIndex].name;
                                pointsToNextTier = tiers[nextTierIndex].minPoints - pointsBalance;
                            }
                            return [2 /*return*/, {
                                    points_balance: pointsBalance,
                                    points_value_egp: Math.round(pointsValueEgp * 100) / 100,
                                    points_earned_lifetime: pointsEarnedLifetime,
                                    points_redeemed_lifetime: pointsRedeemedLifetime,
                                    points_expiring_soon: pointsExpiringSoon,
                                    next_tier: nextTier,
                                    points_to_next_tier: pointsToNextTier,
                                    tier_name: currentTier.name,
                                    tier_discount: currentTier.discount,
                                }];
                    }
                });
            });
        };
        /**
         * Get quick redeem options (for UI)
         */
        LoyaltyService_1.prototype.getQuickRedeemOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getConfig()];
                        case 1:
                            config = _a.sent();
                            options = [
                                {
                                    points: 100,
                                    value_egp: 100 * config.egp_per_point,
                                    description: 'EGP 10 off',
                                },
                                {
                                    points: 250,
                                    value_egp: 250 * config.egp_per_point,
                                    description: 'EGP 25 off',
                                },
                                {
                                    points: 500,
                                    value_egp: 500 * config.egp_per_point,
                                    description: 'EGP 50 off',
                                },
                                {
                                    points: 1000,
                                    value_egp: 1000 * config.egp_per_point,
                                    description: 'EGP 100 off',
                                },
                            ];
                            return [2 /*return*/, { options: options }];
                    }
                });
            });
        };
        /**
         * Get loyalty transaction history
         */
        LoyaltyService_1.prototype.getTransactionHistory = function (clientId_1) {
            return __awaiter(this, arguments, void 0, function (clientId, page, limit, type) {
                var safePage, safeLimit, skip, take, where, _a, transactions, total, runningBalance, transactionsWithBalance;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            safePage = Math.max(1, page);
                            safeLimit = Math.max(1, Math.min(limit, 50));
                            skip = (safePage - 1) * safeLimit;
                            take = Math.min(safeLimit, 50);
                            where = { clientId: clientId };
                            if (type) {
                                where.type = type;
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.loyaltyTransaction.findMany({
                                        where: where,
                                        include: {
                                            booking: {
                                                select: {
                                                    business: { select: { businessName: true } },
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.loyaltyTransaction.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), transactions = _a[0], total = _a[1];
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 2:
                            runningBalance = _b.sent();
                            transactionsWithBalance = __spreadArray([], transactions, true).reverse()
                                .map(function (t, idx, arr) {
                                var _a;
                                if (idx === 0) {
                                    return __assign(__assign({}, t), { balance_after: runningBalance });
                                }
                                var prevPoints = ((_a = arr[idx - 1]) === null || _a === void 0 ? void 0 : _a.points) || 0;
                                runningBalance = runningBalance - prevPoints;
                                return __assign(__assign({}, t), { balance_after: runningBalance });
                            })
                                .reverse();
                            return [2 /*return*/, {
                                    data: transactionsWithBalance.map(function (t) {
                                        var _a, _b;
                                        return ({
                                            id: t.id,
                                            client_id: t.clientId,
                                            booking_id: t.bookingId || undefined,
                                            type: t.type,
                                            points: t.points,
                                            balance_after: t.balance_after,
                                            reason: t.reason,
                                            business_name: (_b = (_a = t.booking) === null || _a === void 0 ? void 0 : _a.business) === null || _b === void 0 ? void 0 : _b.businessName,
                                            created_at: t.createdAt,
                                        });
                                    }),
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
         * Get leaderboard (top points earners)
         */
        LoyaltyService_1.prototype.getLeaderboard = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var results;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        lt.client_id,\n        SUM(lt.points) as total_points,\n        u.full_name as client_name,\n        u.avatar_url\n      FROM loyalty_transactions lt\n      JOIN clients c ON lt.client_id = c.id\n      JOIN users u ON c.user_id = u.id\n      GROUP BY lt.client_id, u.full_name, u.avatar_url\n      HAVING SUM(lt.points) > 0\n      ORDER BY total_points DESC\n      LIMIT ", "\n    "], ["\n      SELECT \n        lt.client_id,\n        SUM(lt.points) as total_points,\n        u.full_name as client_name,\n        u.avatar_url\n      FROM loyalty_transactions lt\n      JOIN clients c ON lt.client_id = c.id\n      JOIN users u ON c.user_id = u.id\n      GROUP BY lt.client_id, u.full_name, u.avatar_url\n      HAVING SUM(lt.points) > 0\n      ORDER BY total_points DESC\n      LIMIT ", "\n    "])), limit)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.map(function (entry, index) { return ({
                                    rank: index + 1,
                                    client_id: entry.client_id,
                                    client_name: entry.client_name,
                                    total_points: Number(entry.total_points),
                                    avatar_url: entry.avatar_url || undefined,
                                }); })];
                    }
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        /**
         * Manually adjust points (admin only)
         */
        LoyaltyService_1.prototype.adjustPoints = function (adminId, clientId, points, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var currentBalance, newBalance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 1:
                            currentBalance = _a.sent();
                            newBalance = currentBalance + points;
                            return [4 /*yield*/, this.prisma.loyaltyTransaction.create({
                                    data: {
                                        clientId: clientId,
                                        type: points > 0 ? 'EARNED' : 'REDEEMED',
                                        points: points,
                                        reason: "Manual adjustment by admin: ".concat(reason),
                                        bookingId: null,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Admin ".concat(adminId, " adjusted ").concat(points, " points for client ").concat(clientId, ": ").concat(reason));
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: clientId,
                                    typeCode: 'SYSTEM_MESSAGE',
                                    title: points > 0 ? 'Points Added ✨' : 'Points Deducted 📉',
                                    body: points > 0
                                        ? "".concat(points, " points have been added to your account. Reason: ").concat(reason)
                                        : "".concat(Math.abs(points), " points have been deducted from your account. Reason: ").concat(reason),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    new_balance: newBalance,
                                    message: "Successfully adjusted ".concat(points, " points for client"),
                                }];
                    }
                });
            });
        };
        /**
         * Get loyalty stats for admin dashboard
         */
        LoyaltyService_1.prototype.getAdminStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, issuedResult, redeemedResult, activeClients, redemptions, totalPointsIssued, totalPointsRedeemed, activeClientsCount, config;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.loyaltyTransaction.aggregate({
                                    where: { type: 'EARNED' },
                                    _sum: { points: true },
                                }),
                                this.prisma.loyaltyTransaction.aggregate({
                                    where: { type: 'REDEEMED' },
                                    _sum: { points: true },
                                }),
                                this.prisma.loyaltyTransaction.groupBy({
                                    by: ['clientId'],
                                    having: { points: { _sum: { gt: 0 } } },
                                }),
                                this.prisma.loyaltyTransaction.count({
                                    where: { type: 'REDEEMED' },
                                }),
                            ])];
                        case 1:
                            _a = _b.sent(), issuedResult = _a[0], redeemedResult = _a[1], activeClients = _a[2], redemptions = _a[3];
                            totalPointsIssued = issuedResult._sum.points || 0;
                            totalPointsRedeemed = Math.abs(redeemedResult._sum.points || 0);
                            activeClientsCount = activeClients.length;
                            return [4 /*yield*/, this.getConfig()];
                        case 2:
                            config = _b.sent();
                            return [2 /*return*/, {
                                    total_points_issued: totalPointsIssued,
                                    total_points_redeemed: totalPointsRedeemed,
                                    active_clients_with_points: activeClientsCount,
                                    average_points_per_client: activeClientsCount > 0
                                        ? Math.floor(totalPointsIssued / activeClientsCount)
                                        : 0,
                                    total_redemptions: redemptions,
                                    total_discount_value: totalPointsRedeemed * config.egp_per_point,
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        LoyaltyService_1.prototype.formatConfigResponse = function (config) {
            return {
                id: config.id,
                points_per_100_egp: config.pointsPer100Egp,
                egp_per_point: Number(config.egpPerPoint),
                max_redeem_pct: config.maxRedeemPct,
                min_points_to_redeem: 100,
                points_expiry_days: undefined,
                is_active: config.isActive,
                created_at: config.createdAt,
                updated_at: config.updatedAt,
            };
        };
        return LoyaltyService_1;
    }());
    __setFunctionName(_classThis, "LoyaltyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoyaltyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoyaltyService = _classThis;
}();
exports.LoyaltyService = LoyaltyService;
var templateObject_1;
