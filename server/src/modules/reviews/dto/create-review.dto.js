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
exports.CreateReviewDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateReviewDto = function () {
    var _a;
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    var _quality_rating_decorators;
    var _quality_rating_initializers = [];
    var _quality_rating_extraInitializers = [];
    var _punctuality_rating_decorators;
    var _punctuality_rating_initializers = [];
    var _punctuality_rating_extraInitializers = [];
    var _communication_rating_decorators;
    var _communication_rating_initializers = [];
    var _communication_rating_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateReviewDto() {
                this.booking_id = __runInitializers(this, _booking_id_initializers, void 0);
                this.rating = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.quality_rating = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _quality_rating_initializers, void 0));
                this.punctuality_rating = (__runInitializers(this, _quality_rating_extraInitializers), __runInitializers(this, _punctuality_rating_initializers, void 0));
                this.communication_rating = (__runInitializers(this, _punctuality_rating_extraInitializers), __runInitializers(this, _communication_rating_initializers, void 0));
                this.comment = (__runInitializers(this, _communication_rating_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                __runInitializers(this, _comment_extraInitializers);
            }
            return CreateReviewDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _booking_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Booking ID' }), (0, class_validator_1.IsString)()];
            _rating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall rating (1-5)', minimum: 1, maximum: 5 }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _quality_rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Quality rating (1-5)', minimum: 1, maximum: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _punctuality_rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Punctuality rating (1-5)', minimum: 1, maximum: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _communication_rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Communication rating (1-5)', minimum: 1, maximum: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _comment_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Review comment', maxLength: 600 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(600)];
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _quality_rating_decorators, { kind: "field", name: "quality_rating", static: false, private: false, access: { has: function (obj) { return "quality_rating" in obj; }, get: function (obj) { return obj.quality_rating; }, set: function (obj, value) { obj.quality_rating = value; } }, metadata: _metadata }, _quality_rating_initializers, _quality_rating_extraInitializers);
            __esDecorate(null, null, _punctuality_rating_decorators, { kind: "field", name: "punctuality_rating", static: false, private: false, access: { has: function (obj) { return "punctuality_rating" in obj; }, get: function (obj) { return obj.punctuality_rating; }, set: function (obj, value) { obj.punctuality_rating = value; } }, metadata: _metadata }, _punctuality_rating_initializers, _punctuality_rating_extraInitializers);
            __esDecorate(null, null, _communication_rating_decorators, { kind: "field", name: "communication_rating", static: false, private: false, access: { has: function (obj) { return "communication_rating" in obj; }, get: function (obj) { return obj.communication_rating; }, set: function (obj, value) { obj.communication_rating = value; } }, metadata: _metadata }, _communication_rating_initializers, _communication_rating_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateReviewDto = CreateReviewDto;
