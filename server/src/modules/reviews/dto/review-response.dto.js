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
exports.RatingSummaryDto = exports.BusinessReviewsResponseDto = exports.ReviewWithUserDto = exports.ReviewResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var ReviewResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _reply_decorators;
    var _reply_initializers = [];
    var _reply_extraInitializers = [];
    var _replied_at_decorators;
    var _replied_at_initializers = [];
    var _replied_at_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReviewResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.booking_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _booking_id_initializers, void 0));
                this.rating = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.quality_rating = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _quality_rating_initializers, void 0));
                this.punctuality_rating = (__runInitializers(this, _quality_rating_extraInitializers), __runInitializers(this, _punctuality_rating_initializers, void 0));
                this.communication_rating = (__runInitializers(this, _punctuality_rating_extraInitializers), __runInitializers(this, _communication_rating_initializers, void 0));
                this.comment = (__runInitializers(this, _communication_rating_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                this.reply = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _reply_initializers, void 0));
                this.replied_at = (__runInitializers(this, _reply_extraInitializers), __runInitializers(this, _replied_at_initializers, void 0));
                this.created_at = (__runInitializers(this, _replied_at_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return ReviewResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_id_decorators = [(0, swagger_1.ApiProperty)()];
            _rating_decorators = [(0, swagger_1.ApiProperty)()];
            _quality_rating_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _punctuality_rating_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _communication_rating_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _comment_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _reply_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _replied_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _quality_rating_decorators, { kind: "field", name: "quality_rating", static: false, private: false, access: { has: function (obj) { return "quality_rating" in obj; }, get: function (obj) { return obj.quality_rating; }, set: function (obj, value) { obj.quality_rating = value; } }, metadata: _metadata }, _quality_rating_initializers, _quality_rating_extraInitializers);
            __esDecorate(null, null, _punctuality_rating_decorators, { kind: "field", name: "punctuality_rating", static: false, private: false, access: { has: function (obj) { return "punctuality_rating" in obj; }, get: function (obj) { return obj.punctuality_rating; }, set: function (obj, value) { obj.punctuality_rating = value; } }, metadata: _metadata }, _punctuality_rating_initializers, _punctuality_rating_extraInitializers);
            __esDecorate(null, null, _communication_rating_decorators, { kind: "field", name: "communication_rating", static: false, private: false, access: { has: function (obj) { return "communication_rating" in obj; }, get: function (obj) { return obj.communication_rating; }, set: function (obj, value) { obj.communication_rating = value; } }, metadata: _metadata }, _communication_rating_initializers, _communication_rating_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            __esDecorate(null, null, _reply_decorators, { kind: "field", name: "reply", static: false, private: false, access: { has: function (obj) { return "reply" in obj; }, get: function (obj) { return obj.reply; }, set: function (obj, value) { obj.reply = value; } }, metadata: _metadata }, _reply_initializers, _reply_extraInitializers);
            __esDecorate(null, null, _replied_at_decorators, { kind: "field", name: "replied_at", static: false, private: false, access: { has: function (obj) { return "replied_at" in obj; }, get: function (obj) { return obj.replied_at; }, set: function (obj, value) { obj.replied_at = value; } }, metadata: _metadata }, _replied_at_initializers, _replied_at_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReviewResponseDto = ReviewResponseDto;
var ReviewWithUserDto = function () {
    var _a;
    var _classSuper = ReviewResponseDto;
    var _client_id_decorators;
    var _client_id_initializers = [];
    var _client_id_extraInitializers = [];
    var _client_name_decorators;
    var _client_name_initializers = [];
    var _client_name_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(ReviewWithUserDto, _super);
            function ReviewWithUserDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.client_id = __runInitializers(_this, _client_id_initializers, void 0);
                _this.client_name = (__runInitializers(_this, _client_id_extraInitializers), __runInitializers(_this, _client_name_initializers, void 0));
                _this.business_id = (__runInitializers(_this, _client_name_extraInitializers), __runInitializers(_this, _business_id_initializers, void 0));
                _this.business_name = (__runInitializers(_this, _business_id_extraInitializers), __runInitializers(_this, _business_name_initializers, void 0));
                __runInitializers(_this, _business_name_extraInitializers);
                return _this;
            }
            return ReviewWithUserDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _client_id_decorators = [(0, swagger_1.ApiProperty)()];
            _client_name_decorators = [(0, swagger_1.ApiProperty)()];
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _client_id_decorators, { kind: "field", name: "client_id", static: false, private: false, access: { has: function (obj) { return "client_id" in obj; }, get: function (obj) { return obj.client_id; }, set: function (obj, value) { obj.client_id = value; } }, metadata: _metadata }, _client_id_initializers, _client_id_extraInitializers);
            __esDecorate(null, null, _client_name_decorators, { kind: "field", name: "client_name", static: false, private: false, access: { has: function (obj) { return "client_name" in obj; }, get: function (obj) { return obj.client_name; }, set: function (obj, value) { obj.client_name = value; } }, metadata: _metadata }, _client_name_initializers, _client_name_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReviewWithUserDto = ReviewWithUserDto;
var BusinessReviewsResponseDto = function () {
    var _a;
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    var _total_reviews_decorators;
    var _total_reviews_initializers = [];
    var _total_reviews_extraInitializers = [];
    var _reviews_decorators;
    var _reviews_initializers = [];
    var _reviews_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessReviewsResponseDto() {
                this.business_id = __runInitializers(this, _business_id_initializers, void 0);
                this.business_name = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.average_rating = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.reviews = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
                __runInitializers(this, _reviews_extraInitializers);
            }
            return BusinessReviewsResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _reviews_decorators = [(0, swagger_1.ApiProperty)({ type: [ReviewWithUserDto] })];
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: function (obj) { return "reviews" in obj; }, get: function (obj) { return obj.reviews; }, set: function (obj, value) { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessReviewsResponseDto = BusinessReviewsResponseDto;
var RatingSummaryDto = function () {
    var _a;
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    var _total_reviews_decorators;
    var _total_reviews_initializers = [];
    var _total_reviews_extraInitializers = [];
    var _rating_distribution_decorators;
    var _rating_distribution_initializers = [];
    var _rating_distribution_extraInitializers = [];
    var _average_quality_decorators;
    var _average_quality_initializers = [];
    var _average_quality_extraInitializers = [];
    var _average_punctuality_decorators;
    var _average_punctuality_initializers = [];
    var _average_punctuality_extraInitializers = [];
    var _average_communication_decorators;
    var _average_communication_initializers = [];
    var _average_communication_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RatingSummaryDto() {
                this.average_rating = __runInitializers(this, _average_rating_initializers, void 0);
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.rating_distribution = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _rating_distribution_initializers, void 0));
                this.average_quality = (__runInitializers(this, _rating_distribution_extraInitializers), __runInitializers(this, _average_quality_initializers, void 0));
                this.average_punctuality = (__runInitializers(this, _average_quality_extraInitializers), __runInitializers(this, _average_punctuality_initializers, void 0));
                this.average_communication = (__runInitializers(this, _average_punctuality_extraInitializers), __runInitializers(this, _average_communication_initializers, void 0));
                __runInitializers(this, _average_communication_extraInitializers);
            }
            return RatingSummaryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _rating_distribution_decorators = [(0, swagger_1.ApiProperty)()];
            _average_quality_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _average_punctuality_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _average_communication_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _rating_distribution_decorators, { kind: "field", name: "rating_distribution", static: false, private: false, access: { has: function (obj) { return "rating_distribution" in obj; }, get: function (obj) { return obj.rating_distribution; }, set: function (obj, value) { obj.rating_distribution = value; } }, metadata: _metadata }, _rating_distribution_initializers, _rating_distribution_extraInitializers);
            __esDecorate(null, null, _average_quality_decorators, { kind: "field", name: "average_quality", static: false, private: false, access: { has: function (obj) { return "average_quality" in obj; }, get: function (obj) { return obj.average_quality; }, set: function (obj, value) { obj.average_quality = value; } }, metadata: _metadata }, _average_quality_initializers, _average_quality_extraInitializers);
            __esDecorate(null, null, _average_punctuality_decorators, { kind: "field", name: "average_punctuality", static: false, private: false, access: { has: function (obj) { return "average_punctuality" in obj; }, get: function (obj) { return obj.average_punctuality; }, set: function (obj, value) { obj.average_punctuality = value; } }, metadata: _metadata }, _average_punctuality_initializers, _average_punctuality_extraInitializers);
            __esDecorate(null, null, _average_communication_decorators, { kind: "field", name: "average_communication", static: false, private: false, access: { has: function (obj) { return "average_communication" in obj; }, get: function (obj) { return obj.average_communication; }, set: function (obj, value) { obj.average_communication = value; } }, metadata: _metadata }, _average_communication_initializers, _average_communication_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RatingSummaryDto = RatingSummaryDto;
