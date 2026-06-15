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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var process_payment_dto_1 = require("./dto/process-payment.dto");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var PaymentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Payments'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'payments', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _processPayment_decorators;
    var _confirmPayment_decorators;
    var _getUserPayments_decorators;
    var _getPayment_decorators;
    var _getBookingPayment_decorators;
    var _getReceipt_decorators;
    var _createDispute_decorators;
    var _handleStripeWebhook_decorators;
    var _getBusinessPayouts_decorators;
    var PaymentsController = _classThis = /** @class */ (function () {
        function PaymentsController_1(paymentsService) {
            this.paymentsService = (__runInitializers(this, _instanceExtraInitializers), paymentsService);
        }
        // ==================== CLIENT ENDPOINTS ====================
        PaymentsController_1.prototype.processPayment = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.processPayment(user.id, dto)];
                });
            });
        };
        PaymentsController_1.prototype.confirmPayment = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.confirmPayment(user.id, dto)];
                });
            });
        };
        PaymentsController_1.prototype.getUserPayments = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.getUserPayments(user.id, page, limit)];
                });
            });
        };
        PaymentsController_1.prototype.getPayment = function (paymentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.getPayment(paymentId, user.id, user.role)];
                });
            });
        };
        PaymentsController_1.prototype.getBookingPayment = function (bookingId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.getBookingPayment(bookingId, user.id)];
                });
            });
        };
        PaymentsController_1.prototype.getReceipt = function (paymentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.getReceipt(paymentId, user.id)];
                });
            });
        };
        // ==================== DISPUTES ====================
        PaymentsController_1.prototype.createDispute = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.createDispute(user.id, dto)];
                });
            });
        };
        // ==================== STRIPE WEBHOOK (Public) ====================
        PaymentsController_1.prototype.handleStripeWebhook = function (req, signature) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, rawPayload;
                return __generator(this, function (_a) {
                    payload = req.body;
                    rawPayload = req.rawBody;
                    if (!rawPayload) {
                        throw new Error('Webhook requires raw body parsing. Check your NestJS raw body configuration.');
                    }
                    return [2 /*return*/, this.paymentsService.handleStripeWebhook(Buffer.from(rawPayload), signature)];
                });
            });
        };
        // ==================== BUSINESS/MANAGER ENDPOINTS ====================
        PaymentsController_1.prototype.getBusinessPayouts = function (user_1, businessId_1) {
            return __awaiter(this, arguments, void 0, function (user, businessId, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.paymentsService.getBusinessPayouts(user.id, businessId, page, limit)];
                });
            });
        };
        return PaymentsController_1;
    }());
    __setFunctionName(_classThis, "PaymentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processPayment_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Process payment for a booking' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed', type: process_payment_dto_1.ProcessPaymentResponseDto })];
        _confirmPayment_decorators = [(0, common_1.Post)('confirm'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Confirm payment after Stripe confirmation' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment confirmed', type: process_payment_dto_1.ProcessPaymentResponseDto })];
        _getUserPayments_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get user payment history' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _getPayment_decorators = [(0, common_1.Get)(':paymentId'), (0, swagger_1.ApiOperation)({ summary: 'Get payment by ID' }), (0, swagger_1.ApiParam)({ name: 'paymentId', description: 'Payment UUID' })];
        _getBookingPayment_decorators = [(0, common_1.Get)('booking/:bookingId'), (0, swagger_1.ApiOperation)({ summary: 'Get payment for a booking' }), (0, swagger_1.ApiParam)({ name: 'bookingId', description: 'Booking UUID' })];
        _getReceipt_decorators = [(0, common_1.Get)(':paymentId/receipt'), (0, swagger_1.ApiOperation)({ summary: 'Get payment receipt' }), (0, swagger_1.ApiParam)({ name: 'paymentId', description: 'Payment UUID' })];
        _createDispute_decorators = [(0, common_1.Post)('disputes'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a payment dispute' })];
        _handleStripeWebhook_decorators = [(0, common_1.Post)('webhook/stripe'), (0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook endpoint' })];
        _getBusinessPayouts_decorators = [(0, common_1.Get)('business/:businessId/payouts'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get business payouts (manager only)' }), (0, swagger_1.ApiParam)({ name: 'businessId', description: 'Business UUID' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        __esDecorate(_classThis, null, _processPayment_decorators, { kind: "method", name: "processPayment", static: false, private: false, access: { has: function (obj) { return "processPayment" in obj; }, get: function (obj) { return obj.processPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _confirmPayment_decorators, { kind: "method", name: "confirmPayment", static: false, private: false, access: { has: function (obj) { return "confirmPayment" in obj; }, get: function (obj) { return obj.confirmPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserPayments_decorators, { kind: "method", name: "getUserPayments", static: false, private: false, access: { has: function (obj) { return "getUserPayments" in obj; }, get: function (obj) { return obj.getUserPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPayment_decorators, { kind: "method", name: "getPayment", static: false, private: false, access: { has: function (obj) { return "getPayment" in obj; }, get: function (obj) { return obj.getPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBookingPayment_decorators, { kind: "method", name: "getBookingPayment", static: false, private: false, access: { has: function (obj) { return "getBookingPayment" in obj; }, get: function (obj) { return obj.getBookingPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReceipt_decorators, { kind: "method", name: "getReceipt", static: false, private: false, access: { has: function (obj) { return "getReceipt" in obj; }, get: function (obj) { return obj.getReceipt; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDispute_decorators, { kind: "method", name: "createDispute", static: false, private: false, access: { has: function (obj) { return "createDispute" in obj; }, get: function (obj) { return obj.createDispute; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleStripeWebhook_decorators, { kind: "method", name: "handleStripeWebhook", static: false, private: false, access: { has: function (obj) { return "handleStripeWebhook" in obj; }, get: function (obj) { return obj.handleStripeWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessPayouts_decorators, { kind: "method", name: "getBusinessPayouts", static: false, private: false, access: { has: function (obj) { return "getBusinessPayouts" in obj; }, get: function (obj) { return obj.getBusinessPayouts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsController = _classThis;
}();
exports.PaymentsController = PaymentsController;
