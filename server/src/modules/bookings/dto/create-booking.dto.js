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
exports.CreateBookingDto = exports.BookingImageDto = exports.BookingItemDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var BookingItemDto = function () {
    var _a;
    var _businessServiceId_decorators;
    var _businessServiceId_initializers = [];
    var _businessServiceId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingItemDto() {
                this.businessServiceId = __runInitializers(this, _businessServiceId_initializers, void 0);
                __runInitializers(this, _businessServiceId_extraInitializers);
            }
            return BookingItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _businessServiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business Service ID', example: '123e4567-e89b-12d3-a456-426614174000' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _businessServiceId_decorators, { kind: "field", name: "businessServiceId", static: false, private: false, access: { has: function (obj) { return "businessServiceId" in obj; }, get: function (obj) { return obj.businessServiceId; }, set: function (obj, value) { obj.businessServiceId = value; } }, metadata: _metadata }, _businessServiceId_initializers, _businessServiceId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingItemDto = BookingItemDto;
var BookingImageDto = function () {
    var _a;
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _storageKey_decorators;
    var _storageKey_initializers = [];
    var _storageKey_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BookingImageDto() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.storageKey = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _storageKey_initializers, void 0));
                __runInitializers(this, _storageKey_extraInitializers);
            }
            return BookingImageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Image URL', example: 'https://cdn.example.com/bookings/problems/abc.webp' }), (0, class_validator_1.IsString)()];
            _storageKey_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'R2 storage key', example: 'bookings/problems/abc.webp' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _storageKey_decorators, { kind: "field", name: "storageKey", static: false, private: false, access: { has: function (obj) { return "storageKey" in obj; }, get: function (obj) { return obj.storageKey; }, set: function (obj, value) { obj.storageKey = value; } }, metadata: _metadata }, _storageKey_initializers, _storageKey_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BookingImageDto = BookingImageDto;
var CreateBookingDto = function () {
    var _a;
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
    var _businessId_decorators;
    var _businessId_initializers = [];
    var _businessId_extraInitializers = [];
    var _scheduledAt_decorators;
    var _scheduledAt_initializers = [];
    var _scheduledAt_extraInitializers = [];
    var _expectedDeliveryAt_decorators;
    var _expectedDeliveryAt_initializers = [];
    var _expectedDeliveryAt_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBookingDto() {
                this.vehicleId = __runInitializers(this, _vehicleId_initializers, void 0);
                this.businessId = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _businessId_initializers, void 0));
                this.scheduledAt = (__runInitializers(this, _businessId_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
                this.expectedDeliveryAt = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _expectedDeliveryAt_initializers, void 0));
                this.items = (__runInitializers(this, _expectedDeliveryAt_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.note = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _note_initializers, void 0));
                this.images = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _images_initializers, void 0));
                __runInitializers(this, _images_extraInitializers);
            }
            return CreateBookingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vehicleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vehicle ID', example: '123e4567-e89b-12d3-a456-426614174001' }), (0, class_validator_1.IsString)()];
            _businessId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business/Provider ID', example: '123e4567-e89b-12d3-a456-426614174002' }), (0, class_validator_1.IsString)()];
            _scheduledAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled Date & Time', example: '2026-06-15T10:00:00Z' }), (0, class_validator_1.IsDateString)()];
            _expectedDeliveryAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expected Delivery Date & Time', example: '2026-06-15T14:00:00Z' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _items_decorators = [(0, swagger_1.ApiProperty)({ type: [BookingItemDto], description: 'Selected services for the booking' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BookingItemDto; })];
            _note_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional customer note/instruction', example: 'Please pay extra attention to the dashboard clean.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _images_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [BookingImageDto], description: 'Optional problem photos with storage keys' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BookingImageDto; })];
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _businessId_decorators, { kind: "field", name: "businessId", static: false, private: false, access: { has: function (obj) { return "businessId" in obj; }, get: function (obj) { return obj.businessId; }, set: function (obj, value) { obj.businessId = value; } }, metadata: _metadata }, _businessId_initializers, _businessId_extraInitializers);
            __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: function (obj) { return "scheduledAt" in obj; }, get: function (obj) { return obj.scheduledAt; }, set: function (obj, value) { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
            __esDecorate(null, null, _expectedDeliveryAt_decorators, { kind: "field", name: "expectedDeliveryAt", static: false, private: false, access: { has: function (obj) { return "expectedDeliveryAt" in obj; }, get: function (obj) { return obj.expectedDeliveryAt; }, set: function (obj, value) { obj.expectedDeliveryAt = value; } }, metadata: _metadata }, _expectedDeliveryAt_initializers, _expectedDeliveryAt_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBookingDto = CreateBookingDto;
