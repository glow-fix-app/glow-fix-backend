"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeProvider = void 0;
var common_1 = require("@nestjs/common");
var stripe_1 = __importDefault(require("stripe"));
var StripeProvider = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StripeProvider = _classThis = /** @class */ (function () {
        function StripeProvider_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(StripeProvider.name);
            var apiKey = this.configService.get('STRIPE_SECRET_KEY');
            if (!apiKey) {
                this.logger.warn('STRIPE_SECRET_KEY is not configured');
            }
            else {
                this.stripe = new stripe_1.default(apiKey, {
                    apiVersion: '2024-06-20',
                    maxNetworkRetries: 3,
                    timeout: 30000,
                });
                this.logger.log('Stripe provider initialized');
            }
        }
        /**
         * Create a Payment Intent
         */
        StripeProvider_1.prototype.createPaymentIntent = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentIntent, error_1, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentIntents.create({
                                    amount: Math.round(dto.amount * 100), // Convert to cents
                                    currency: dto.currency.toLowerCase(),
                                    description: "Booking ".concat(dto.bookingId),
                                    receipt_email: dto.customerEmail,
                                    metadata: __assign({ booking_id: dto.bookingId, customer_name: dto.customerName, customer_email: dto.customerEmail }, dto.metadata),
                                    statement_descriptor: 'GlowFix Booking',
                                    statement_descriptor_suffix: 'Car Service',
                                }, {
                                    idempotencyKey: dto.idempotencyKey,
                                })];
                        case 1:
                            paymentIntent = _a.sent();
                            this.logger.log("Payment Intent created: ".concat(paymentIntent.id, " for booking ").concat(dto.bookingId));
                            return [2 /*return*/, {
                                    client_secret: paymentIntent.client_secret,
                                    payment_intent_id: paymentIntent.id,
                                    amount: paymentIntent.amount / 100,
                                    currency: paymentIntent.currency,
                                }];
                        case 2:
                            error_1 = _a.sent();
                            message = error_1 instanceof Error ? error_1.message : String(error_1);
                            this.logger.error("Failed to create Payment Intent: ".concat(message));
                            throw new common_1.HttpException("Payment processing failed: ".concat(message), common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Retrieve a Payment Intent
         */
        StripeProvider_1.prototype.retrievePaymentIntent = function (paymentIntentId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentIntents.retrieve(paymentIntentId)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            message = error_2 instanceof Error ? error_2.message : String(error_2);
                            this.logger.error("Failed to retrieve Payment Intent: ".concat(message));
                            throw new common_1.HttpException('Payment not found', common_1.HttpStatus.NOT_FOUND);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Confirm a Payment Intent
         */
        StripeProvider_1.prototype.confirmPaymentIntent = function (paymentIntentId, paymentMethodId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentIntents.confirm(paymentIntentId, {
                                    payment_method: paymentMethodId,
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_3 = _a.sent();
                            message = error_3 instanceof Error ? error_3.message : String(error_3);
                            this.logger.error("Failed to confirm Payment Intent: ".concat(message));
                            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cancel a Payment Intent
         */
        StripeProvider_1.prototype.cancelPaymentIntent = function (paymentIntentId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_4, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentIntents.cancel(paymentIntentId)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_4 = _a.sent();
                            message = error_4 instanceof Error ? error_4.message : String(error_4);
                            this.logger.error("Failed to cancel Payment Intent: ".concat(message));
                            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Process refund
         */
        StripeProvider_1.prototype.createRefund = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var refundParams, refund, error_5, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            refundParams = {
                                payment_intent: dto.paymentIntentId,
                                reason: dto.reason || 'requested_by_customer',
                            };
                            if (dto.amount) {
                                refundParams.amount = Math.round(dto.amount * 100);
                            }
                            return [4 /*yield*/, this.stripe.refunds.create(refundParams)];
                        case 1:
                            refund = _a.sent();
                            this.logger.log("Refund created for Payment Intent: ".concat(dto.paymentIntentId));
                            return [2 /*return*/, refund];
                        case 2:
                            error_5 = _a.sent();
                            message = error_5 instanceof Error ? error_5.message : String(error_5);
                            this.logger.error("Failed to create refund: ".concat(message));
                            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Create a Customer
         */
        StripeProvider_1.prototype.createCustomer = function (email, name, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var customer, error_6, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.customers.create({
                                    email: email,
                                    name: name,
                                    phone: phone,
                                    metadata: {
                                        source: 'glowfix',
                                    },
                                })];
                        case 1:
                            customer = _a.sent();
                            this.logger.log("Customer created: ".concat(customer.id));
                            return [2 /*return*/, customer];
                        case 2:
                            error_6 = _a.sent();
                            message = error_6 instanceof Error ? error_6.message : String(error_6);
                            this.logger.error("Failed to create customer: ".concat(message));
                            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Attach Payment Method to Customer
         */
        StripeProvider_1.prototype.attachPaymentMethodToCustomer = function (paymentMethodId, customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_7, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentMethods.attach(paymentMethodId, {
                                    customer: customerId,
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_7 = _a.sent();
                            message = error_7 instanceof Error ? error_7.message : String(error_7);
                            this.logger.error("Failed to attach payment method: ".concat(message));
                            throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * List Payment Methods for Customer
         */
        StripeProvider_1.prototype.listCustomerPaymentMethods = function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var paymentMethods, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.stripe.paymentMethods.list({
                                    customer: customerId,
                                    type: 'card',
                                })];
                        case 1:
                            paymentMethods = _a.sent();
                            return [2 /*return*/, paymentMethods.data];
                        case 2:
                            error_8 = _a.sent();
                            this.logger.error("Failed to list payment methods: ".concat(error_8 instanceof Error ? error_8.message : String(error_8)));
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verify webhook signature
         */
        StripeProvider_1.prototype.verifyWebhookSignature = function (payload, signature) {
            var webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
            if (!webhookSecret) {
                this.logger.warn('STRIPE_WEBHOOK_SECRET is not configured');
                return JSON.parse(payload.toString());
            }
            try {
                return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            }
            catch (error) {
                var message = error instanceof Error ? error.message : String(error);
                this.logger.error("Webhook signature verification failed: ".concat(message));
                throw new common_1.HttpException('Invalid webhook signature', common_1.HttpStatus.BAD_REQUEST);
            }
        };
        return StripeProvider_1;
    }());
    __setFunctionName(_classThis, "StripeProvider");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StripeProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StripeProvider = _classThis;
}();
exports.StripeProvider = StripeProvider;
