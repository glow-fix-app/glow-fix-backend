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
exports.ReceiptResponseDto = exports.PaymentResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var PaymentResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _provider_ref_decorators;
    var _provider_ref_initializers = [];
    var _provider_ref_extraInitializers = [];
    var _paid_at_decorators;
    var _paid_at_initializers = [];
    var _paid_at_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _booking_decorators;
    var _booking_initializers = [];
    var _booking_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaymentResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.booking_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _booking_id_initializers, void 0));
                this.amount = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.status = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.provider_ref = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _provider_ref_initializers, void 0));
                this.paid_at = (__runInitializers(this, _provider_ref_extraInitializers), __runInitializers(this, _paid_at_initializers, void 0));
                this.created_at = (__runInitializers(this, _paid_at_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.booking = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _booking_initializers, void 0));
                __runInitializers(this, _booking_extraInitializers);
            }
            return PaymentResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_id_decorators = [(0, swagger_1.ApiProperty)()];
            _amount_decorators = [(0, swagger_1.ApiProperty)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] })];
            _provider_ref_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _paid_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _provider_ref_decorators, { kind: "field", name: "provider_ref", static: false, private: false, access: { has: function (obj) { return "provider_ref" in obj; }, get: function (obj) { return obj.provider_ref; }, set: function (obj, value) { obj.provider_ref = value; } }, metadata: _metadata }, _provider_ref_initializers, _provider_ref_extraInitializers);
            __esDecorate(null, null, _paid_at_decorators, { kind: "field", name: "paid_at", static: false, private: false, access: { has: function (obj) { return "paid_at" in obj; }, get: function (obj) { return obj.paid_at; }, set: function (obj, value) { obj.paid_at = value; } }, metadata: _metadata }, _paid_at_initializers, _paid_at_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _booking_decorators, { kind: "field", name: "booking", static: false, private: false, access: { has: function (obj) { return "booking" in obj; }, get: function (obj) { return obj.booking; }, set: function (obj, value) { obj.booking = value; } }, metadata: _metadata }, _booking_initializers, _booking_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaymentResponseDto = PaymentResponseDto;
var ReceiptResponseDto = function () {
    var _a;
    var _receipt_number_decorators;
    var _receipt_number_initializers = [];
    var _receipt_number_extraInitializers = [];
    var _booking_code_decorators;
    var _booking_code_initializers = [];
    var _booking_code_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _from_decorators;
    var _from_initializers = [];
    var _from_extraInitializers = [];
    var _billed_to_decorators;
    var _billed_to_initializers = [];
    var _billed_to_extraInitializers = [];
    var _subtotal_decorators;
    var _subtotal_initializers = [];
    var _subtotal_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    var _total_decorators;
    var _total_initializers = [];
    var _total_extraInitializers = [];
    var _payment_method_decorators;
    var _payment_method_initializers = [];
    var _payment_method_extraInitializers = [];
    var _provider_ref_decorators;
    var _provider_ref_initializers = [];
    var _provider_ref_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReceiptResponseDto() {
                this.receipt_number = __runInitializers(this, _receipt_number_initializers, void 0);
                this.booking_code = (__runInitializers(this, _receipt_number_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.date = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.from = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _from_initializers, void 0));
                this.billed_to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _billed_to_initializers, void 0));
                this.subtotal = (__runInitializers(this, _billed_to_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
                this.discount = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
                this.total = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _total_initializers, void 0));
                this.payment_method = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _payment_method_initializers, void 0));
                this.provider_ref = (__runInitializers(this, _payment_method_extraInitializers), __runInitializers(this, _provider_ref_initializers, void 0));
                this.status = (__runInitializers(this, _provider_ref_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return ReceiptResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _receipt_number_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiProperty)()];
            _date_decorators = [(0, swagger_1.ApiProperty)()];
            _from_decorators = [(0, swagger_1.ApiProperty)()];
            _billed_to_decorators = [(0, swagger_1.ApiProperty)()];
            _subtotal_decorators = [(0, swagger_1.ApiProperty)()];
            _discount_decorators = [(0, swagger_1.ApiProperty)()];
            _total_decorators = [(0, swagger_1.ApiProperty)()];
            _payment_method_decorators = [(0, swagger_1.ApiProperty)()];
            _provider_ref_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _receipt_number_decorators, { kind: "field", name: "receipt_number", static: false, private: false, access: { has: function (obj) { return "receipt_number" in obj; }, get: function (obj) { return obj.receipt_number; }, set: function (obj, value) { obj.receipt_number = value; } }, metadata: _metadata }, _receipt_number_initializers, _receipt_number_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
            __esDecorate(null, null, _billed_to_decorators, { kind: "field", name: "billed_to", static: false, private: false, access: { has: function (obj) { return "billed_to" in obj; }, get: function (obj) { return obj.billed_to; }, set: function (obj, value) { obj.billed_to = value; } }, metadata: _metadata }, _billed_to_initializers, _billed_to_extraInitializers);
            __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: function (obj) { return "subtotal" in obj; }, get: function (obj) { return obj.subtotal; }, set: function (obj, value) { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
            __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, null, _payment_method_decorators, { kind: "field", name: "payment_method", static: false, private: false, access: { has: function (obj) { return "payment_method" in obj; }, get: function (obj) { return obj.payment_method; }, set: function (obj, value) { obj.payment_method = value; } }, metadata: _metadata }, _payment_method_initializers, _payment_method_extraInitializers);
            __esDecorate(null, null, _provider_ref_decorators, { kind: "field", name: "provider_ref", static: false, private: false, access: { has: function (obj) { return "provider_ref" in obj; }, get: function (obj) { return obj.provider_ref; }, set: function (obj, value) { obj.provider_ref = value; } }, metadata: _metadata }, _provider_ref_initializers, _provider_ref_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReceiptResponseDto = ReceiptResponseDto;
