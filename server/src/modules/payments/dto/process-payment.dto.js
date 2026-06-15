"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPaymentDto = exports.ProcessPaymentResponseDto = exports.ProcessPaymentDto = exports.PaymentMethod = void 0;
// modules/payments/dto/process-payment.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var ProcessPaymentDto = function () {
    var _a;
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _payment_method_decorators;
    var _payment_method_initializers = [];
    var _payment_method_extraInitializers = [];
    var _payment_method_id_decorators;
    var _payment_method_id_initializers = [];
    var _payment_method_id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _redeem_points_decorators;
    var _redeem_points_initializers = [];
    var _redeem_points_extraInitializers = [];
    var _points_to_redeem_decorators;
    var _points_to_redeem_initializers = [];
    var _points_to_redeem_extraInitializers = [];
    var _save_payment_method_decorators;
    var _save_payment_method_initializers = [];
    var _save_payment_method_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProcessPaymentDto() {
                this.booking_id = __runInitializers(this, _booking_id_initializers, void 0);
                this.payment_method = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _payment_method_initializers, void 0));
                this.payment_method_id = (__runInitializers(this, _payment_method_extraInitializers), __runInitializers(this, _payment_method_id_initializers, void 0));
                this.amount = (__runInitializers(this, _payment_method_id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.redeem_points = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _redeem_points_initializers, void 0));
                this.points_to_redeem = (__runInitializers(this, _redeem_points_extraInitializers), __runInitializers(this, _points_to_redeem_initializers, void 0));
                this.save_payment_method = (__runInitializers(this, _points_to_redeem_extraInitializers), __runInitializers(this, _save_payment_method_initializers, void 0));
                __runInitializers(this, _save_payment_method_extraInitializers);
            }
            return ProcessPaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _booking_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Booking ID' }), (0, class_validator_1.IsString)()];
            _payment_method_decorators = [(0, swagger_1.ApiProperty)({ enum: PaymentMethod, description: 'Payment method' }), (0, class_validator_1.IsEnum)(PaymentMethod)];
            _payment_method_id_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Stripe payment method ID (for card payments)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _amount_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Amount to pay (overrides calculated amount)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(function () { return Number; })];
            _redeem_points_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Redeem loyalty points' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _points_to_redeem_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Points to redeem (if not all)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_transformer_1.Type)(function () { return Number; })];
            _save_payment_method_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Save payment method for future use' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _payment_method_decorators, { kind: "field", name: "payment_method", static: false, private: false, access: { has: function (obj) { return "payment_method" in obj; }, get: function (obj) { return obj.payment_method; }, set: function (obj, value) { obj.payment_method = value; } }, metadata: _metadata }, _payment_method_initializers, _payment_method_extraInitializers);
            __esDecorate(null, null, _payment_method_id_decorators, { kind: "field", name: "payment_method_id", static: false, private: false, access: { has: function (obj) { return "payment_method_id" in obj; }, get: function (obj) { return obj.payment_method_id; }, set: function (obj, value) { obj.payment_method_id = value; } }, metadata: _metadata }, _payment_method_id_initializers, _payment_method_id_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _redeem_points_decorators, { kind: "field", name: "redeem_points", static: false, private: false, access: { has: function (obj) { return "redeem_points" in obj; }, get: function (obj) { return obj.redeem_points; }, set: function (obj, value) { obj.redeem_points = value; } }, metadata: _metadata }, _redeem_points_initializers, _redeem_points_extraInitializers);
            __esDecorate(null, null, _points_to_redeem_decorators, { kind: "field", name: "points_to_redeem", static: false, private: false, access: { has: function (obj) { return "points_to_redeem" in obj; }, get: function (obj) { return obj.points_to_redeem; }, set: function (obj, value) { obj.points_to_redeem = value; } }, metadata: _metadata }, _points_to_redeem_initializers, _points_to_redeem_extraInitializers);
            __esDecorate(null, null, _save_payment_method_decorators, { kind: "field", name: "save_payment_method", static: false, private: false, access: { has: function (obj) { return "save_payment_method" in obj; }, get: function (obj) { return obj.save_payment_method; }, set: function (obj, value) { obj.save_payment_method = value; } }, metadata: _metadata }, _save_payment_method_initializers, _save_payment_method_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProcessPaymentDto = ProcessPaymentDto;
var ProcessPaymentResponseDto = function () {
    var _a;
    var _success_decorators;
    var _success_initializers = [];
    var _success_extraInitializers = [];
    var _payment_id_decorators;
    var _payment_id_initializers = [];
    var _payment_id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _client_secret_decorators;
    var _client_secret_initializers = [];
    var _client_secret_extraInitializers = [];
    var _payment_intent_id_decorators;
    var _payment_intent_id_initializers = [];
    var _payment_intent_id_extraInitializers = [];
    var _loyalty_points_used_decorators;
    var _loyalty_points_used_initializers = [];
    var _loyalty_points_used_extraInitializers = [];
    var _loyalty_points_earned_decorators;
    var _loyalty_points_earned_initializers = [];
    var _loyalty_points_earned_extraInitializers = [];
    var _receipt_url_decorators;
    var _receipt_url_initializers = [];
    var _receipt_url_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProcessPaymentResponseDto() {
                this.success = __runInitializers(this, _success_initializers, void 0);
                this.payment_id = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _payment_id_initializers, void 0));
                this.amount = (__runInitializers(this, _payment_id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.client_secret = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _client_secret_initializers, void 0));
                this.payment_intent_id = (__runInitializers(this, _client_secret_extraInitializers), __runInitializers(this, _payment_intent_id_initializers, void 0));
                this.loyalty_points_used = (__runInitializers(this, _payment_intent_id_extraInitializers), __runInitializers(this, _loyalty_points_used_initializers, void 0));
                this.loyalty_points_earned = (__runInitializers(this, _loyalty_points_used_extraInitializers), __runInitializers(this, _loyalty_points_earned_initializers, void 0));
                this.receipt_url = (__runInitializers(this, _loyalty_points_earned_extraInitializers), __runInitializers(this, _receipt_url_initializers, void 0));
                this.message = (__runInitializers(this, _receipt_url_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                __runInitializers(this, _message_extraInitializers);
            }
            return ProcessPaymentResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, swagger_1.ApiProperty)()];
            _payment_id_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _amount_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _client_secret_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _payment_intent_id_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _loyalty_points_used_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _loyalty_points_earned_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _receipt_url_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _message_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: function (obj) { return "success" in obj; }, get: function (obj) { return obj.success; }, set: function (obj, value) { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _payment_id_decorators, { kind: "field", name: "payment_id", static: false, private: false, access: { has: function (obj) { return "payment_id" in obj; }, get: function (obj) { return obj.payment_id; }, set: function (obj, value) { obj.payment_id = value; } }, metadata: _metadata }, _payment_id_initializers, _payment_id_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _client_secret_decorators, { kind: "field", name: "client_secret", static: false, private: false, access: { has: function (obj) { return "client_secret" in obj; }, get: function (obj) { return obj.client_secret; }, set: function (obj, value) { obj.client_secret = value; } }, metadata: _metadata }, _client_secret_initializers, _client_secret_extraInitializers);
            __esDecorate(null, null, _payment_intent_id_decorators, { kind: "field", name: "payment_intent_id", static: false, private: false, access: { has: function (obj) { return "payment_intent_id" in obj; }, get: function (obj) { return obj.payment_intent_id; }, set: function (obj, value) { obj.payment_intent_id = value; } }, metadata: _metadata }, _payment_intent_id_initializers, _payment_intent_id_extraInitializers);
            __esDecorate(null, null, _loyalty_points_used_decorators, { kind: "field", name: "loyalty_points_used", static: false, private: false, access: { has: function (obj) { return "loyalty_points_used" in obj; }, get: function (obj) { return obj.loyalty_points_used; }, set: function (obj, value) { obj.loyalty_points_used = value; } }, metadata: _metadata }, _loyalty_points_used_initializers, _loyalty_points_used_extraInitializers);
            __esDecorate(null, null, _loyalty_points_earned_decorators, { kind: "field", name: "loyalty_points_earned", static: false, private: false, access: { has: function (obj) { return "loyalty_points_earned" in obj; }, get: function (obj) { return obj.loyalty_points_earned; }, set: function (obj, value) { obj.loyalty_points_earned = value; } }, metadata: _metadata }, _loyalty_points_earned_initializers, _loyalty_points_earned_extraInitializers);
            __esDecorate(null, null, _receipt_url_decorators, { kind: "field", name: "receipt_url", static: false, private: false, access: { has: function (obj) { return "receipt_url" in obj; }, get: function (obj) { return obj.receipt_url; }, set: function (obj, value) { obj.receipt_url = value; } }, metadata: _metadata }, _receipt_url_initializers, _receipt_url_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProcessPaymentResponseDto = ProcessPaymentResponseDto;
var ConfirmPaymentDto = function () {
    var _a;
    var _payment_intent_id_decorators;
    var _payment_intent_id_initializers = [];
    var _payment_intent_id_extraInitializers = [];
    var _payment_method_id_decorators;
    var _payment_method_id_initializers = [];
    var _payment_method_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ConfirmPaymentDto() {
                this.payment_intent_id = __runInitializers(this, _payment_intent_id_initializers, void 0);
                this.payment_method_id = (__runInitializers(this, _payment_intent_id_extraInitializers), __runInitializers(this, _payment_method_id_initializers, void 0));
                __runInitializers(this, _payment_method_id_extraInitializers);
            }
            return ConfirmPaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _payment_intent_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment Intent ID from Stripe' }), (0, class_validator_1.IsString)()];
            _payment_method_id_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Payment method ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _payment_intent_id_decorators, { kind: "field", name: "payment_intent_id", static: false, private: false, access: { has: function (obj) { return "payment_intent_id" in obj; }, get: function (obj) { return obj.payment_intent_id; }, set: function (obj, value) { obj.payment_intent_id = value; } }, metadata: _metadata }, _payment_intent_id_initializers, _payment_intent_id_extraInitializers);
            __esDecorate(null, null, _payment_method_id_decorators, { kind: "field", name: "payment_method_id", static: false, private: false, access: { has: function (obj) { return "payment_method_id" in obj; }, get: function (obj) { return obj.payment_method_id; }, set: function (obj, value) { obj.payment_method_id = value; } }, metadata: _metadata }, _payment_method_id_initializers, _payment_method_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ConfirmPaymentDto = ConfirmPaymentDto;
