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
exports.ReviewBookingDto = exports.ReviewBookingItemDto = exports.ReviewStatus = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["ACCEPTED"] = "ACCEPTED";
    ReviewStatus["REJECTED"] = "REJECTED";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var ReviewBookingItemDto = function () {
    var _a;
    var _businessServiceId_decorators;
    var _businessServiceId_initializers = [];
    var _businessServiceId_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReviewBookingItemDto() {
                this.businessServiceId = __runInitializers(this, _businessServiceId_initializers, void 0);
                this.price = (__runInitializers(this, _businessServiceId_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                __runInitializers(this, _price_extraInitializers);
            }
            return ReviewBookingItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _businessServiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business Service ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsUUID)()];
            _price_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Negotiated price for this service item', example: 150.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _businessServiceId_decorators, { kind: "field", name: "businessServiceId", static: false, private: false, access: { has: function (obj) { return "businessServiceId" in obj; }, get: function (obj) { return obj.businessServiceId; }, set: function (obj, value) { obj.businessServiceId = value; } }, metadata: _metadata }, _businessServiceId_initializers, _businessServiceId_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReviewBookingItemDto = ReviewBookingItemDto;
var ReviewBookingDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejectionReason_decorators;
    var _rejectionReason_initializers = [];
    var _rejectionReason_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _expectedDeliveryAt_decorators;
    var _expectedDeliveryAt_initializers = [];
    var _expectedDeliveryAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReviewBookingDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.rejectionReason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                this.items = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.expectedDeliveryAt = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _expectedDeliveryAt_initializers, void 0));
                __runInitializers(this, _expectedDeliveryAt_extraInitializers);
            }
            return ReviewBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review decision (ACCEPTED or REJECTED)', enum: ReviewStatus }), (0, class_validator_1.IsEnum)(ReviewStatus), (0, class_validator_1.IsNotEmpty)()];
            _rejectionReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reason for rejection if status is REJECTED', example: 'Provider fully booked' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _items_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [ReviewBookingItemDto], description: 'Updated service items or prices' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return ReviewBookingItemDto; })];
            _expectedDeliveryAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected delivery date and time if accepted', example: '2026-06-15T14:30:00.000Z' }), (0, class_validator_1.ValidateIf)(function (o) { return o.status === ReviewStatus.ACCEPTED; }), (0, class_validator_1.IsNotEmpty)({ message: 'expectedDeliveryAt is required when accepting a booking' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: function (obj) { return "rejectionReason" in obj; }, get: function (obj) { return obj.rejectionReason; }, set: function (obj, value) { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _expectedDeliveryAt_decorators, { kind: "field", name: "expectedDeliveryAt", static: false, private: false, access: { has: function (obj) { return "expectedDeliveryAt" in obj; }, get: function (obj) { return obj.expectedDeliveryAt; }, set: function (obj, value) { obj.expectedDeliveryAt = value; } }, metadata: _metadata }, _expectedDeliveryAt_initializers, _expectedDeliveryAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReviewBookingDto = ReviewBookingDto;
