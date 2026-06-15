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
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var process_payment_dto_1 = require("./dto/process-payment.dto");
var PaymentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentsService = _classThis = /** @class */ (function () {
        function PaymentsService_1(prisma, eventEmitter, stripeProvider) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.stripeProvider = stripeProvider;
            this.logger = new common_1.Logger(PaymentsService.name);
        }
        // Helper to generate booking code
        PaymentsService_1.prototype.generateBookingCode = function (bookingId) {
            return "BK-".concat(bookingId.slice(0, 8).toUpperCase());
        };
        // ==================== PAYMENT PROCESSING ====================
        PaymentsService_1.prototype.processPayment = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, bookingStatus, payableStatuses, clientId, pointsBalance, loyaltyConfig, totalAmount, loyaltyDiscount, pointsUsed, redemptionDetails, paymentMethod, pendingStatus, payment, customerName, customerEmail, customerPhone;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findUnique({
                                where: { id: dto.booking_id },
                                include: {
                                    business: {
                                        include: { manager: true },
                                    },
                                    vehicle: {
                                        include: {
                                            client: { include: { user: true } },
                                        },
                                    },
                                    payment: {
                                        include: { status: true },
                                    },
                                    items: {
                                        include: {
                                            businessService: {
                                                include: { service: true },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            booking = _c.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            // Verify ownership
                            if (booking.vehicle.client.userId !== userId) {
                                throw new common_1.ForbiddenException('You do not own this booking');
                            }
                            // Check if payment already exists and is completed
                            if (((_b = (_a = booking.payment) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) === 'PAID') {
                                throw new common_1.BadRequestException('Booking already paid');
                            }
                            return [4 /*yield*/, this.getBookingStatus(booking.id)];
                        case 2:
                            bookingStatus = _c.sent();
                            payableStatuses = ['ACCEPTED'];
                            if (!payableStatuses.includes(bookingStatus)) {
                                throw new common_1.BadRequestException("Booking cannot be paid in status: ".concat(bookingStatus));
                            }
                            clientId = booking.vehicle.client.id;
                            return [4 /*yield*/, this.getClientPointsBalance(clientId)];
                        case 3:
                            pointsBalance = _c.sent();
                            return [4 /*yield*/, this.prisma.loyaltyConfig.findFirst()];
                        case 4:
                            loyaltyConfig = _c.sent();
                            totalAmount = Number(booking.totalPrice);
                            loyaltyDiscount = 0;
                            pointsUsed = 0;
                            if (!(dto.redeem_points && pointsBalance >= 100 && (loyaltyConfig === null || loyaltyConfig === void 0 ? void 0 : loyaltyConfig.isActive))) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.calculateLoyaltyRedemption(userId, totalAmount, dto.points_to_redeem, pointsBalance, loyaltyConfig)];
                        case 5:
                            redemptionDetails = _c.sent();
                            if (redemptionDetails.eligible && redemptionDetails.discountAmount > 0) {
                                loyaltyDiscount = redemptionDetails.discountAmount;
                                totalAmount = totalAmount - loyaltyDiscount;
                                pointsUsed = redemptionDetails.pointsUsed;
                            }
                            _c.label = 6;
                        case 6:
                            // Ensure total amount is not negative
                            if (totalAmount < 0) {
                                totalAmount = 0;
                            }
                            // Override with manual amount if provided
                            if (dto.amount && dto.amount > 0) {
                                if (dto.amount > Number(booking.totalPrice)) {
                                    throw new common_1.BadRequestException('Payment amount cannot exceed booking total');
                                }
                                totalAmount = dto.amount;
                            }
                            return [4 /*yield*/, this.prisma.paymentMethod.findUnique({
                                    where: { name: dto.payment_method },
                                })];
                        case 7:
                            paymentMethod = _c.sent();
                            if (!!paymentMethod) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.prisma.paymentMethod.create({
                                    data: { name: dto.payment_method, isEnabled: true },
                                })];
                        case 8:
                            paymentMethod = _c.sent();
                            _c.label = 9;
                        case 9: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PAYMENT_PENDING' },
                            })];
                        case 10:
                            pendingStatus = _c.sent();
                            return [4 /*yield*/, this.prisma.payment.upsert({
                                    where: { bookingId: dto.booking_id },
                                    create: {
                                        bookingId: dto.booking_id,
                                        paymentMethodId: paymentMethod.id,
                                        provider: 'stripe',
                                        amount: totalAmount,
                                        currency: 'EGP',
                                        statusId: (pendingStatus === null || pendingStatus === void 0 ? void 0 : pendingStatus.id) || '',
                                        idempotencyKey: (0, crypto_1.randomUUID)(),
                                    },
                                    update: {
                                        paymentMethodId: paymentMethod.id,
                                        provider: 'stripe',
                                        amount: totalAmount,
                                        currency: 'EGP',
                                        statusId: (pendingStatus === null || pendingStatus === void 0 ? void 0 : pendingStatus.id) || '',
                                        idempotencyKey: (0, crypto_1.randomUUID)(),
                                    }
                                })];
                        case 11:
                            payment = _c.sent();
                            customerName = booking.vehicle.client.user.fullName;
                            customerEmail = booking.vehicle.client.user.email;
                            customerPhone = booking.vehicle.client.user.phone || '';
                            // Process based on payment method
                            switch (dto.payment_method) {
                                case process_payment_dto_1.PaymentMethod.CARD:
                                    return [2 /*return*/, this.processCardPayment(payment, {
                                            amount: totalAmount,
                                            currency: 'EGP',
                                            customerEmail: customerEmail,
                                            customerName: customerName,
                                            customerPhone: customerPhone,
                                            bookingId: booking.id,
                                            savePaymentMethod: dto.save_payment_method,
                                            paymentMethodId: dto.payment_method_id,
                                            pointsUsed: pointsUsed,
                                            loyaltyDiscount: loyaltyDiscount,
                                        })];
                                case process_payment_dto_1.PaymentMethod.CASH:
                                    return [2 /*return*/, this.processCashPayment(payment, booking.id, loyaltyDiscount, pointsUsed, totalAmount)];
                                default:
                                    throw new common_1.BadRequestException('Unsupported payment method');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.processCardPayment = function (payment, options) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentIntent, err_1, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 5]);
                            return [4 /*yield*/, this.stripeProvider.createPaymentIntent({
                                    amount: options.amount,
                                    currency: options.currency,
                                    customerEmail: options.customerEmail,
                                    customerName: options.customerName,
                                    customerPhone: options.customerPhone,
                                    bookingId: options.bookingId,
                                    metadata: {
                                        payment_id: payment.id,
                                        points_used: options.pointsUsed.toString(),
                                        loyalty_discount: options.loyaltyDiscount.toString(),
                                    },
                                    idempotencyKey: payment.idempotencyKey,
                                })];
                        case 1:
                            paymentIntent = _a.sent();
                            // Update payment with Stripe intent ID
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: payment.id },
                                    data: {
                                        providerRef: paymentIntent.payment_intent_id,
                                    },
                                })];
                        case 2:
                            // Update payment with Stripe intent ID
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    payment_id: payment.id,
                                    amount: options.amount,
                                    client_secret: paymentIntent.client_secret,
                                    payment_intent_id: paymentIntent.payment_intent_id,
                                    loyalty_points_used: options.pointsUsed,
                                    loyalty_points_earned: 0,
                                    message: 'Payment intent created. Confirm payment on client side.',
                                }];
                        case 3:
                            err_1 = _a.sent();
                            message = err_1 instanceof Error ? err_1.message : 'An unexpected error occurred';
                            return [4 /*yield*/, this.handleFailedPayment(payment.id, message)];
                        case 4:
                            _a.sent();
                            throw new common_1.BadRequestException(message);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.processCashPayment = function (payment, bookingId, loyaltyDiscount, pointsUsed, totalAmount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.finalizePayment(payment.id, "cash_".concat(payment.id.slice(0, 8)), loyaltyDiscount, pointsUsed, bookingId, totalAmount)];
                });
            });
        };
        PaymentsService_1.prototype.confirmPayment = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentIntent, payment, amount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stripeProvider.retrievePaymentIntent(dto.payment_intent_id)];
                        case 1:
                            paymentIntent = _a.sent();
                            return [4 /*yield*/, this.prisma.payment.findFirst({
                                    where: { providerRef: dto.payment_intent_id },
                                    include: {
                                        booking: {
                                            include: {
                                                vehicle: {
                                                    include: {
                                                        client: { include: { user: true } },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            if (payment.booking.vehicle.client.userId !== userId) {
                                throw new common_1.ForbiddenException('You do not own this booking');
                            }
                            if (paymentIntent.status === 'succeeded') {
                                amount = Number(payment.amount);
                                return [2 /*return*/, this.finalizePayment(payment.id, dto.payment_intent_id, 0, 0, payment.bookingId, amount)];
                            }
                            else if (paymentIntent.status === 'requires_payment_method') {
                                throw new common_1.BadRequestException('Payment requires payment method');
                            }
                            else if (paymentIntent.status === 'requires_confirmation') {
                                throw new common_1.BadRequestException('Payment requires confirmation');
                            }
                            else {
                                throw new common_1.BadRequestException("Payment status: ".concat(paymentIntent.status));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.getClientPointsBalance = function (clientId) {
            return __awaiter(this, void 0, void 0, function () {
                var balanceResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.loyaltyTransaction.aggregate({
                                where: { clientId: clientId },
                                _sum: { points: true },
                            })];
                        case 1:
                            balanceResult = _a.sent();
                            return [2 /*return*/, balanceResult._sum.points || 0];
                    }
                });
            });
        };
        PaymentsService_1.prototype.calculateLoyaltyRedemption = function (userId, totalAmount, pointsToRedeem, pointsBalance, config) {
            return __awaiter(this, void 0, void 0, function () {
                var maxDiscountPercent, maxDiscountAmount, pointsPerEGP, maxPointsForDiscount, pointsToUse, discountAmount;
                return __generator(this, function (_a) {
                    if (!config || !config.isActive) {
                        return [2 /*return*/, { eligible: false, discountAmount: 0, pointsUsed: 0 }];
                    }
                    maxDiscountPercent = config.maxRedeemPct;
                    maxDiscountAmount = (totalAmount * maxDiscountPercent) / 100;
                    pointsPerEGP = 1 / Number(config.egpPerPoint);
                    maxPointsForDiscount = Math.floor(maxDiscountAmount * pointsPerEGP);
                    pointsToUse = pointsToRedeem || Math.min(pointsBalance, maxPointsForDiscount);
                    pointsToUse = Math.min(pointsToUse, pointsBalance, maxPointsForDiscount);
                    if (pointsToUse < 100) {
                        return [2 /*return*/, { eligible: false, discountAmount: 0, pointsUsed: 0 }];
                    }
                    discountAmount = pointsToUse * Number(config.egpPerPoint);
                    return [2 /*return*/, {
                            eligible: true,
                            discountAmount: discountAmount,
                            pointsUsed: pointsToUse,
                        }];
                });
            });
        };
        PaymentsService_1.prototype.finalizePayment = function (paymentId, providerRef, loyaltyDiscount, pointsUsed, bookingId, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, paidStatus, confirmedStatus, payoutPendingStatus, config;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.status.findFirst({ where: { context: 'PAID' } }),
                                this.prisma.status.findFirst({ where: { context: 'CONFIRMED' } }),
                                this.prisma.status.findFirst({ where: { context: 'PAYOUT_PENDING' } }),
                                this.prisma.loyaltyConfig.findFirst(),
                            ])];
                        case 1:
                            _a = _b.sent(), paidStatus = _a[0], confirmedStatus = _a[1], payoutPendingStatus = _a[2], config = _a[3];
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var paymentRows, settings, platformFeePercent, payment, pointsEarned, clientId, clientUser, bookingCode, confNotifType, grossAmount, platformFee, netAmount, payout;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        SELECT id, status_id FROM payments WHERE id = ", "::uuid FOR UPDATE\n      "], ["\n        SELECT id, status_id FROM payments WHERE id = ", "::uuid FOR UPDATE\n      "])), paymentId)];
                                            case 1:
                                                paymentRows = _a.sent();
                                                if (!paymentRows || paymentRows.length === 0) {
                                                    throw new common_1.NotFoundException('Payment not found');
                                                }
                                                if (paidStatus && paymentRows[0].status_id === paidStatus.id) {
                                                    this.logger.warn("Payment ".concat(paymentId, " was already finalized."));
                                                    return [2 /*return*/, {
                                                            success: true,
                                                            payment_id: paymentId,
                                                            amount: amount,
                                                            loyalty_points_used: pointsUsed,
                                                            loyalty_points_earned: 0,
                                                            message: 'Payment already finalized',
                                                        }];
                                                }
                                                return [4 /*yield*/, tx.setting.findFirst()];
                                            case 2:
                                                settings = _a.sent();
                                                platformFeePercent = (settings === null || settings === void 0 ? void 0 : settings.businessFeePct) ? Number(settings.businessFeePct) : 10;
                                                return [4 /*yield*/, tx.payment.update({
                                                        where: { id: paymentId },
                                                        data: {
                                                            providerRef: providerRef,
                                                            statusId: (paidStatus === null || paidStatus === void 0 ? void 0 : paidStatus.id) || '',
                                                            paidAt: new Date(),
                                                        },
                                                        include: {
                                                            booking: {
                                                                include: {
                                                                    business: true,
                                                                    vehicle: {
                                                                        include: {
                                                                            client: { include: { user: true } },
                                                                        },
                                                                    },
                                                                    items: {
                                                                        include: {
                                                                            businessService: {
                                                                                include: { service: true },
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    })];
                                            case 3:
                                                payment = _a.sent();
                                                pointsEarned = 0;
                                                clientId = payment.booking.vehicle.client.id;
                                                clientUser = payment.booking.vehicle.client.user;
                                                bookingCode = this.generateBookingCode(bookingId);
                                                if (!(pointsUsed > 0)) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.loyaltyTransaction.create({
                                                        data: {
                                                            clientId: clientId,
                                                            bookingId: bookingId,
                                                            type: 'REDEEMED',
                                                            points: -pointsUsed,
                                                            reason: "Redeemed ".concat(pointsUsed, " points for EGP ").concat(loyaltyDiscount.toFixed(2), " discount"),
                                                        },
                                                    })];
                                            case 4:
                                                _a.sent();
                                                _a.label = 5;
                                            case 5:
                                                if (!confirmedStatus) return [3 /*break*/, 11];
                                                return [4 /*yield*/, tx.bookingStatus.create({
                                                        data: {
                                                            bookingId: bookingId,
                                                            statusId: confirmedStatus.id,
                                                        },
                                                    })];
                                            case 6:
                                                _a.sent();
                                                return [4 /*yield*/, tx.notificationType.findFirst({ where: { code: 'BOOKING_CONFIRMED' } })];
                                            case 7:
                                                confNotifType = _a.sent();
                                                if (!!confNotifType) return [3 /*break*/, 9];
                                                return [4 /*yield*/, tx.notificationType.create({
                                                        data: { code: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' }
                                                    })];
                                            case 8:
                                                confNotifType = _a.sent();
                                                _a.label = 9;
                                            case 9: return [4 /*yield*/, tx.notification.create({
                                                    data: {
                                                        recipientUserId: clientUser.id,
                                                        typeId: confNotifType.id,
                                                        title: 'Booking Confirmed!',
                                                        body: "Your payment was successful and your booking ".concat(bookingCode, " has been officially confirmed!"),
                                                        actionUrl: "/client/bookings/".concat(bookingId),
                                                        sentAt: new Date(),
                                                    }
                                                })];
                                            case 10:
                                                _a.sent();
                                                _a.label = 11;
                                            case 11:
                                                grossAmount = Number(payment.booking.totalPrice);
                                                platformFee = (grossAmount * platformFeePercent) / 100;
                                                netAmount = grossAmount - platformFee;
                                                return [4 /*yield*/, tx.payout.create({
                                                        data: {
                                                            businessId: payment.booking.business.id,
                                                            amount: netAmount,
                                                            statusId: (payoutPendingStatus === null || payoutPendingStatus === void 0 ? void 0 : payoutPendingStatus.id) || '',
                                                        },
                                                    })];
                                            case 12:
                                                payout = _a.sent();
                                                return [4 /*yield*/, tx.payoutBooking.create({
                                                        data: {
                                                            payoutId: payout.id,
                                                            bookingId: bookingId,
                                                        },
                                                    })];
                                            case 13:
                                                _a.sent();
                                                this.logger.log("Payment finalized: ".concat(paymentId, ", payout created: ").concat(payout.id));
                                                // Send notifications
                                                return [4 /*yield*/, this.sendPaymentSuccessNotification(clientUser.id, clientUser.fullName, bookingCode, amount, pointsEarned, pointsUsed, loyaltyDiscount)];
                                            case 14:
                                                // Send notifications
                                                _a.sent();
                                                return [4 /*yield*/, this.sendPaymentReceivedNotification(payment.booking.business.managerId, payment.booking.business.businessName, bookingCode, amount, platformFee, netAmount)];
                                            case 15:
                                                _a.sent();
                                                this.eventEmitter.emit('payment.completed', {
                                                    bookingId: bookingId,
                                                    paymentId: paymentId,
                                                    amount: amount,
                                                    loyaltyPointsEarned: pointsEarned,
                                                    loyaltyPointsUsed: pointsUsed,
                                                    customerEmail: clientUser.email,
                                                    customerName: clientUser.fullName,
                                                    businessId: payment.booking.business.id,
                                                    businessName: payment.booking.business.businessName,
                                                });
                                                return [2 /*return*/, {
                                                        success: true,
                                                        payment_id: payment.id,
                                                        amount: amount,
                                                        loyalty_points_used: pointsUsed,
                                                        loyalty_points_earned: pointsEarned,
                                                        receipt_url: "/api/v1/payments/".concat(payment.id, "/receipt"),
                                                        message: this.getSuccessMessage(pointsUsed, pointsEarned, loyaltyDiscount),
                                                    }];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        PaymentsService_1.prototype.sendPaymentSuccessNotification = function (userId, userName, bookingCode, amount, pointsEarned, pointsUsed, discountAmount) {
            return __awaiter(this, void 0, void 0, function () {
                var notificationType, message, err_2, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.notificationType.findFirst({
                                    where: { code: 'PAYMENT_RECEIVED' },
                                })];
                        case 1:
                            notificationType = _a.sent();
                            if (!!notificationType) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.notificationType.create({
                                    data: {
                                        code: 'PAYMENT_RECEIVED',
                                        label: 'Payment Received',
                                    },
                                })];
                        case 2:
                            notificationType = _a.sent();
                            _a.label = 3;
                        case 3:
                            message = "Your payment of EGP ".concat(amount.toFixed(2), " for booking ").concat(bookingCode, " was successful.");
                            if (pointsUsed > 0) {
                                message += " You redeemed ".concat(pointsUsed, " points and saved EGP ").concat(discountAmount.toFixed(2), "!");
                            }
                            if (pointsEarned > 0) {
                                message += " You earned ".concat(pointsEarned, " loyalty points.");
                            }
                            return [4 /*yield*/, this.prisma.notification.create({
                                    data: {
                                        recipientUserId: userId,
                                        typeId: notificationType.id,
                                        title: 'Payment Successful! ≡ƒÆ░',
                                        body: message,
                                        actionUrl: "/payments/success?booking=".concat(bookingCode),
                                        sentAt: new Date(),
                                    },
                                })];
                        case 4:
                            _a.sent();
                            this.logger.log("Payment success notification sent to user ".concat(userId));
                            return [3 /*break*/, 6];
                        case 5:
                            err_2 = _a.sent();
                            errorMessage = err_2 instanceof Error ? err_2.message : 'Unknown error';
                            this.logger.error("Failed to send payment notification: ".concat(errorMessage));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.sendPaymentReceivedNotification = function (managerId, businessName, bookingCode, amount, platformFee, netAmount) {
            return __awaiter(this, void 0, void 0, function () {
                var notificationType, err_3, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.notificationType.findFirst({
                                    where: { code: 'PAYOUT_PROCESSED' },
                                })];
                        case 1:
                            notificationType = _a.sent();
                            if (!!notificationType) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.notificationType.create({
                                    data: {
                                        code: 'PAYOUT_PROCESSED',
                                        label: 'Payout Processed',
                                    },
                                })];
                        case 2:
                            notificationType = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.notification.create({
                                data: {
                                    recipientUserId: managerId,
                                    typeId: notificationType.id,
                                    title: 'Payment Received! ≡ƒÆ╡',
                                    body: "You received EGP ".concat(amount.toFixed(2), " for booking ").concat(bookingCode, ". Platform fee: EGP ").concat(platformFee.toFixed(2), ". Net: EGP ").concat(netAmount.toFixed(2)),
                                    actionUrl: "/business/dashboard/payments",
                                    sentAt: new Date(),
                                },
                            })];
                        case 4:
                            _a.sent();
                            this.logger.log("Payment received notification sent to manager ".concat(managerId));
                            return [3 /*break*/, 6];
                        case 5:
                            err_3 = _a.sent();
                            errorMessage = err_3 instanceof Error ? err_3.message : 'Unknown error';
                            this.logger.error("Failed to send business payment notification: ".concat(errorMessage));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.getSuccessMessage = function (pointsUsed, pointsEarned, discountAmount) {
            if (pointsUsed > 0 && pointsEarned > 0) {
                return "Payment successful! You redeemed ".concat(pointsUsed, " points (saved EGP ").concat(discountAmount.toFixed(2), ") and earned ").concat(pointsEarned, " new points!");
            }
            else if (pointsUsed > 0) {
                return "Payment successful! You redeemed ".concat(pointsUsed, " points and saved EGP ").concat(discountAmount.toFixed(2), "!");
            }
            else if (pointsEarned > 0) {
                return "Payment successful! You earned ".concat(pointsEarned, " loyalty points!");
            }
            return 'Payment processed successfully!';
        };
        PaymentsService_1.prototype.handleFailedPayment = function (paymentId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var failedStatus, payment, clientUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'FAILED' },
                            })];
                        case 1:
                            failedStatus = _a.sent();
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: paymentId },
                                    data: {
                                        statusId: (failedStatus === null || failedStatus === void 0 ? void 0 : failedStatus.id) || '',
                                        failureReason: reason,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.payment.findUnique({
                                    where: { id: paymentId },
                                    include: {
                                        booking: {
                                            include: {
                                                vehicle: {
                                                    include: {
                                                        client: { include: { user: true } },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 3:
                            payment = _a.sent();
                            if (!payment) return [3 /*break*/, 5];
                            clientUser = payment.booking.vehicle.client.user;
                            return [4 /*yield*/, this.sendPaymentFailureNotification(clientUser.id, reason)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.sendPaymentFailureNotification = function (userId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var notificationType, err_4, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.notificationType.findFirst({
                                    where: { code: 'PAYMENT_FAILED' },
                                })];
                        case 1:
                            notificationType = _a.sent();
                            if (!!notificationType) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.notificationType.create({
                                    data: {
                                        code: 'PAYMENT_FAILED',
                                        label: 'Payment Failed',
                                    },
                                })];
                        case 2:
                            notificationType = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.notification.create({
                                data: {
                                    recipientUserId: userId,
                                    typeId: notificationType.id,
                                    title: 'Payment Failed Γ¥î',
                                    body: "Your payment could not be processed. Reason: ".concat(reason, ". Please try again or contact support."),
                                    actionUrl: "/payments/retry",
                                    sentAt: new Date(),
                                },
                            })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_4 = _a.sent();
                            errorMessage = err_4 instanceof Error ? err_4.message : 'Unknown error';
                            this.logger.error("Failed to send payment failure notification: ".concat(errorMessage));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // ==================== STRIPE WEBHOOK ====================
        PaymentsService_1.prototype.handleStripeWebhook = function (payload, signature) {
            return __awaiter(this, void 0, void 0, function () {
                var event, message, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            try {
                                event = this.stripeProvider.verifyWebhookSignature(payload, signature);
                            }
                            catch (err) {
                                message = err instanceof Error ? err.message : String(err);
                                this.logger.error("Webhook signature verification failed: ".concat(message));
                                return [2 /*return*/, { received: false }];
                            }
                            this.logger.log("Processing Stripe webhook: ".concat(event.type));
                            _a = event.type;
                            switch (_a) {
                                case 'payment_intent.succeeded': return [3 /*break*/, 1];
                                case 'payment_intent.payment_failed': return [3 /*break*/, 3];
                                case 'charge.refunded': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [4 /*yield*/, this.handlePaymentIntentSucceeded(event.data.object)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 3: return [4 /*yield*/, this.handlePaymentIntentFailed(event.data.object)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.handleChargeRefunded(event.data.object)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            this.logger.log("Unhandled event type: ".concat(event.type));
                            _b.label = 8;
                        case 8: return [2 /*return*/, { received: true }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.handlePaymentIntentSucceeded = function (paymentIntent) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, amount;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findFirst({
                                where: { providerRef: paymentIntent.id },
                                include: { status: true },
                            })];
                        case 1:
                            payment = _b.sent();
                            if (!(payment && ((_a = payment.status) === null || _a === void 0 ? void 0 : _a.context) !== 'PAID')) return [3 /*break*/, 3];
                            amount = Number(payment.amount);
                            return [4 /*yield*/, this.finalizePayment(payment.id, paymentIntent.id, 0, 0, payment.bookingId, amount)];
                        case 2:
                            _b.sent();
                            this.logger.log("Payment succeeded for booking: ".concat(payment.bookingId));
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.handlePaymentIntentFailed = function (paymentIntent) {
            return __awaiter(this, void 0, void 0, function () {
                var payment;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findFirst({
                                where: { providerRef: paymentIntent.id },
                            })];
                        case 1:
                            payment = _b.sent();
                            if (!payment) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.handleFailedPayment(payment.id, ((_a = paymentIntent.last_payment_error) === null || _a === void 0 ? void 0 : _a.message) || 'Payment failed')];
                        case 2:
                            _b.sent();
                            this.logger.warn("Payment failed for booking: ".concat(payment.bookingId));
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.handleChargeRefunded = function (charge) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, refundedStatus, updatedPayment, clientUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findFirst({
                                where: { providerRef: charge.payment_intent },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'REFUNDED' },
                                })];
                        case 2:
                            refundedStatus = _a.sent();
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: payment.id },
                                    data: { statusId: (refundedStatus === null || refundedStatus === void 0 ? void 0 : refundedStatus.id) || '' },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.payment.findUnique({
                                    where: { id: payment.id },
                                    include: {
                                        booking: {
                                            include: {
                                                vehicle: {
                                                    include: {
                                                        client: { include: { user: true } },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 4:
                            updatedPayment = _a.sent();
                            if (!updatedPayment) return [3 /*break*/, 6];
                            clientUser = updatedPayment.booking.vehicle.client.user;
                            return [4 /*yield*/, this.sendRefundNotification(clientUser.id, Number(payment.amount))];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            this.logger.log("Payment refunded: ".concat(payment.id));
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        PaymentsService_1.prototype.sendRefundNotification = function (userId, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var notificationType, err_5, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.notificationType.findFirst({
                                    where: { code: 'REFUND_PROCESSED' },
                                })];
                        case 1:
                            notificationType = _a.sent();
                            if (!!notificationType) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.notificationType.create({
                                    data: {
                                        code: 'REFUND_PROCESSED',
                                        label: 'Refund Processed',
                                    },
                                })];
                        case 2:
                            notificationType = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.notification.create({
                                data: {
                                    recipientUserId: userId,
                                    typeId: notificationType.id,
                                    title: 'Refund Processed ≡ƒÆ╕',
                                    body: "A refund of EGP ".concat(amount.toFixed(2), " has been processed to your original payment method."),
                                    actionUrl: "/payments/refunds",
                                    sentAt: new Date(),
                                },
                            })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_5 = _a.sent();
                            errorMessage = err_5 instanceof Error ? err_5.message : 'Unknown error';
                            this.logger.error("Failed to send refund notification: ".concat(errorMessage));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // ==================== DISPUTES ====================
        PaymentsService_1.prototype.createDispute = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, pendingStatus, dispute;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findUnique({
                                where: { id: dto.payment_id },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            business: true,
                                        },
                                    },
                                    status: true,
                                },
                            })];
                        case 1:
                            payment = _c.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            if (payment.booking.vehicle.client.userId !== userId) {
                                throw new common_1.ForbiddenException('You cannot dispute this payment');
                            }
                            if (((_a = payment.status) === null || _a === void 0 ? void 0 : _a.context) !== 'PAID') {
                                throw new common_1.BadRequestException('Only paid payments can be disputed');
                            }
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'PAYMENT_PENDING' },
                                })];
                        case 2:
                            pendingStatus = _c.sent();
                            return [4 /*yield*/, this.prisma.payment.update({
                                    where: { id: dto.payment_id },
                                    data: { statusId: pendingStatus === null || pendingStatus === void 0 ? void 0 : pendingStatus.id },
                                })];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, this.prisma.dispute.create({
                                    data: {
                                        paymentId: dto.payment_id,
                                        bookingId: payment.bookingId,
                                        reason: dto.reason,
                                        description: dto.description,
                                        photoUrls: dto.photo_urls || [],
                                        desiredOutcome: dto.desired_outcome,
                                        suggestedAmount: (_b = dto.suggested_amount) !== null && _b !== void 0 ? _b : null,
                                        status: 'PENDING',
                                    },
                                })];
                        case 4:
                            dispute = _c.sent();
                            // Send dispute notification
                            return [4 /*yield*/, this.sendDisputeNotification(payment.booking.business.managerId, dispute.id, dto.reason)];
                        case 5:
                            // Send dispute notification
                            _c.sent();
                            this.eventEmitter.emit('payment.dispute_created', {
                                paymentId: dto.payment_id,
                                bookingId: payment.bookingId,
                                disputeId: dispute.id,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    dispute_id: dispute.id,
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.sendDisputeNotification = function (managerId, disputeId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var notificationType, err_6, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.prisma.notificationType.findFirst({
                                    where: { code: 'DISPUTE_CREATED' },
                                })];
                        case 1:
                            notificationType = _a.sent();
                            if (!!notificationType) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.notificationType.create({
                                    data: {
                                        code: 'DISPUTE_CREATED',
                                        label: 'Dispute Created',
                                    },
                                })];
                        case 2:
                            notificationType = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.notification.create({
                                data: {
                                    recipientUserId: managerId,
                                    typeId: notificationType.id,
                                    title: 'Payment Dispute ΓÜá∩╕Å',
                                    body: "A dispute has been filed for payment. Reason: ".concat(reason, ". Please review."),
                                    actionUrl: "/admin/disputes/".concat(disputeId),
                                    sentAt: new Date(),
                                },
                            })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_6 = _a.sent();
                            errorMessage = err_6 instanceof Error ? err_6.message : 'Unknown error';
                            this.logger.error("Failed to send dispute notification: ".concat(errorMessage));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        // ==================== PAYOUT MANAGEMENT ====================
        PaymentsService_1.prototype.getBusinessPayouts = function (managerId_1, businessId_1) {
            return __awaiter(this, arguments, void 0, function (managerId, businessId, page, limit) {
                var business, skip, take, _a, payouts, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findFirst({
                                where: { id: businessId, managerId: managerId },
                            })];
                        case 1:
                            business = _b.sent();
                            if (!business) {
                                throw new common_1.ForbiddenException('You do not own this business');
                            }
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.payout.findMany({
                                        where: { businessId: businessId },
                                        include: {
                                            status: true,
                                            payoutBookings: {
                                                include: {
                                                    booking: true,
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.payout.count({ where: { businessId: businessId } }),
                                ])];
                        case 2:
                            _a = _b.sent(), payouts = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: payouts.map(function (p) { return ({
                                        id: p.id,
                                        amount: Number(p.amount),
                                        status: p.status.context,
                                        processed_at: p.processedAt,
                                        created_at: p.createdAt,
                                        bookings: p.payoutBookings.map(function (pb) { return ({
                                            id: pb.booking.id,
                                            booking_code: "BK-".concat(pb.booking.id.slice(0, 8).toUpperCase()),
                                            amount: Number(pb.booking.totalPrice),
                                        }); }),
                                    }); }),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        total_pages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        // ==================== PAYMENT QUERIES ====================
        PaymentsService_1.prototype.getPayment = function (paymentId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, isClient, isManager, isAdmin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findUnique({
                                where: { id: paymentId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            business: true,
                                        },
                                    },
                                    status: true,
                                    paymentMethod: true,
                                },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            isClient = payment.booking.vehicle.client.userId === userId;
                            isManager = payment.booking.business.managerId === userId;
                            isAdmin = userRole === 'ADMIN';
                            if (!isClient && !isManager && !isAdmin) {
                                throw new common_1.ForbiddenException('Access denied');
                            }
                            return [2 /*return*/, {
                                    id: payment.id,
                                    booking_id: payment.bookingId,
                                    amount: Number(payment.amount),
                                    currency: payment.currency,
                                    status: payment.status.context,
                                    provider_ref: payment.providerRef || undefined,
                                    paid_at: payment.paidAt || undefined,
                                    created_at: payment.createdAt,
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.getBookingPayment = function (bookingId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, isClient, isManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findUnique({
                                where: { bookingId: bookingId },
                                include: {
                                    booking: {
                                        include: {
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            business: true,
                                        },
                                    },
                                    status: true,
                                },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                return [2 /*return*/, null];
                            }
                            isClient = payment.booking.vehicle.client.userId === userId;
                            isManager = payment.booking.business.managerId === userId;
                            if (!isClient && !isManager) {
                                throw new common_1.ForbiddenException('Access denied');
                            }
                            return [2 /*return*/, {
                                    id: payment.id,
                                    booking_id: payment.bookingId,
                                    amount: Number(payment.amount),
                                    currency: payment.currency,
                                    status: payment.status.context,
                                    provider_ref: payment.providerRef || undefined,
                                    paid_at: payment.paidAt || undefined,
                                    created_at: payment.createdAt,
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.getUserPayments = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, limit) {
                var skip, take, client, _a, payments, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, this.prisma.client.findUnique({
                                    where: { userId: userId },
                                })];
                        case 1:
                            client = _b.sent();
                            if (!client) {
                                return [2 /*return*/, { data: [], meta: { total: 0, page: page, limit: limit, total_pages: 0 } }];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.payment.findMany({
                                        where: {
                                            booking: {
                                                vehicle: { clientId: client.id },
                                            },
                                        },
                                        include: {
                                            status: true,
                                            booking: {
                                                include: {
                                                    business: true,
                                                    statusHistory: {
                                                        include: { status: true },
                                                        orderBy: { createdAt: 'desc' },
                                                        take: 1,
                                                    },
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.payment.count({
                                        where: {
                                            booking: {
                                                vehicle: { clientId: client.id },
                                            },
                                        },
                                    }),
                                ])];
                        case 2:
                            _a = _b.sent(), payments = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: payments.map(function (p) {
                                        var _a, _b, _c, _d, _e;
                                        return ({
                                            id: p.id,
                                            booking_id: p.bookingId,
                                            booking_code: p.bookingId.substring(0, 8).toUpperCase(),
                                            booking_status: ((_d = (_c = (_b = (_a = p.booking) === null || _a === void 0 ? void 0 : _a.statusHistory) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.status) === null || _d === void 0 ? void 0 : _d.context) || 'UNKNOWN',
                                            amount: Number(p.amount),
                                            currency: p.currency,
                                            status: p.status.context,
                                            provider_ref: p.providerRef || undefined,
                                            paid_at: p.paidAt || undefined,
                                            created_at: p.createdAt,
                                            booking: {
                                                id: p.bookingId,
                                                business: ((_e = p.booking) === null || _e === void 0 ? void 0 : _e.business) ? {
                                                    id: p.booking.business.id,
                                                    businessName: p.booking.business.businessName,
                                                } : undefined,
                                            }
                                        });
                                    }),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        total_pages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        PaymentsService_1.prototype.getReceipt = function (paymentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, isClient, items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.payment.findUnique({
                                where: { id: paymentId },
                                include: {
                                    booking: {
                                        include: {
                                            business: true,
                                            vehicle: {
                                                include: {
                                                    client: { include: { user: true } },
                                                },
                                            },
                                            items: {
                                                include: {
                                                    businessService: {
                                                        include: { service: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    paymentMethod: true,
                                    status: true,
                                },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException('Payment not found');
                            }
                            isClient = payment.booking.vehicle.client.userId === userId;
                            if (!isClient) {
                                throw new common_1.ForbiddenException('Access denied');
                            }
                            items = payment.booking.items.map(function (item) {
                                var _a, _b;
                                return ({
                                    description: ((_b = (_a = item.businessService) === null || _a === void 0 ? void 0 : _a.service) === null || _b === void 0 ? void 0 : _b.title) || 'Service',
                                    quantity: 1,
                                    unit_price: Number(item.price),
                                    total: Number(item.price),
                                });
                            });
                            return [2 /*return*/, {
                                    receipt_number: "RCP-".concat(payment.id.slice(0, 8).toUpperCase()),
                                    booking_code: "BK-".concat(payment.bookingId.slice(0, 8).toUpperCase()),
                                    date: payment.paidAt || payment.createdAt,
                                    from: {
                                        name: payment.booking.business.businessName,
                                        address: payment.booking.business.address,
                                        phone: payment.booking.business.contactPhone || undefined,
                                        email: payment.booking.business.contactEmail || undefined,
                                    },
                                    billed_to: {
                                        name: payment.booking.vehicle.client.user.fullName,
                                        email: payment.booking.vehicle.client.user.email,
                                        phone: payment.booking.vehicle.client.user.phone || undefined,
                                    },
                                    subtotal: Number(payment.booking.subTotal),
                                    discount: Number(payment.booking.discount),
                                    total: Number(payment.amount),
                                    payment_method: payment.paymentMethod.name,
                                    provider_ref: payment.providerRef || undefined,
                                    status: payment.status.context,
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        PaymentsService_1.prototype.getBookingStatus = function (bookingId) {
            return __awaiter(this, void 0, void 0, function () {
                var status;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.bookingStatus.findFirst({
                                where: { bookingId: bookingId },
                                include: { status: true },
                                orderBy: { createdAt: 'desc' },
                            })];
                        case 1:
                            status = _b.sent();
                            return [2 /*return*/, ((_a = status === null || status === void 0 ? void 0 : status.status) === null || _a === void 0 ? void 0 : _a.context) || 'PENDING'];
                    }
                });
            });
        };
        return PaymentsService_1;
    }());
    __setFunctionName(_classThis, "PaymentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsService = _classThis;
}();
exports.PaymentsService = PaymentsService;
var templateObject_1;
