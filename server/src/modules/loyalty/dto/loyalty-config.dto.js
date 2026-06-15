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
exports.LoyaltyConfigResponseDto = exports.UpdateLoyaltyConfigDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var UpdateLoyaltyConfigDto = function () {
    var _a;
    var _points_per_100_egp_decorators;
    var _points_per_100_egp_initializers = [];
    var _points_per_100_egp_extraInitializers = [];
    var _egp_per_point_decorators;
    var _egp_per_point_initializers = [];
    var _egp_per_point_extraInitializers = [];
    var _max_redeem_pct_decorators;
    var _max_redeem_pct_initializers = [];
    var _max_redeem_pct_extraInitializers = [];
    var _min_points_to_redeem_decorators;
    var _min_points_to_redeem_initializers = [];
    var _min_points_to_redeem_extraInitializers = [];
    var _points_expiry_days_decorators;
    var _points_expiry_days_initializers = [];
    var _points_expiry_days_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateLoyaltyConfigDto() {
                this.points_per_100_egp = __runInitializers(this, _points_per_100_egp_initializers, void 0);
                this.egp_per_point = (__runInitializers(this, _points_per_100_egp_extraInitializers), __runInitializers(this, _egp_per_point_initializers, void 0));
                this.max_redeem_pct = (__runInitializers(this, _egp_per_point_extraInitializers), __runInitializers(this, _max_redeem_pct_initializers, void 0));
                this.min_points_to_redeem = (__runInitializers(this, _max_redeem_pct_extraInitializers), __runInitializers(this, _min_points_to_redeem_initializers, void 0));
                this.points_expiry_days = (__runInitializers(this, _min_points_to_redeem_extraInitializers), __runInitializers(this, _points_expiry_days_initializers, void 0));
                this.is_active = (__runInitializers(this, _points_expiry_days_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return UpdateLoyaltyConfigDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _points_per_100_egp_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Points earned per 100 EGP spent', example: 100 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _egp_per_point_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'EGP value per point for redemption', example: 0.1 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _max_redeem_pct_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum percentage of booking total that can be covered by points', example: 50 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _min_points_to_redeem_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum points required for redemption', example: 100 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _points_expiry_days_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Points expiry in days (null = never expire)', example: 365 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsPositive)()];
            _is_active_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Is loyalty program active' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _points_per_100_egp_decorators, { kind: "field", name: "points_per_100_egp", static: false, private: false, access: { has: function (obj) { return "points_per_100_egp" in obj; }, get: function (obj) { return obj.points_per_100_egp; }, set: function (obj, value) { obj.points_per_100_egp = value; } }, metadata: _metadata }, _points_per_100_egp_initializers, _points_per_100_egp_extraInitializers);
            __esDecorate(null, null, _egp_per_point_decorators, { kind: "field", name: "egp_per_point", static: false, private: false, access: { has: function (obj) { return "egp_per_point" in obj; }, get: function (obj) { return obj.egp_per_point; }, set: function (obj, value) { obj.egp_per_point = value; } }, metadata: _metadata }, _egp_per_point_initializers, _egp_per_point_extraInitializers);
            __esDecorate(null, null, _max_redeem_pct_decorators, { kind: "field", name: "max_redeem_pct", static: false, private: false, access: { has: function (obj) { return "max_redeem_pct" in obj; }, get: function (obj) { return obj.max_redeem_pct; }, set: function (obj, value) { obj.max_redeem_pct = value; } }, metadata: _metadata }, _max_redeem_pct_initializers, _max_redeem_pct_extraInitializers);
            __esDecorate(null, null, _min_points_to_redeem_decorators, { kind: "field", name: "min_points_to_redeem", static: false, private: false, access: { has: function (obj) { return "min_points_to_redeem" in obj; }, get: function (obj) { return obj.min_points_to_redeem; }, set: function (obj, value) { obj.min_points_to_redeem = value; } }, metadata: _metadata }, _min_points_to_redeem_initializers, _min_points_to_redeem_extraInitializers);
            __esDecorate(null, null, _points_expiry_days_decorators, { kind: "field", name: "points_expiry_days", static: false, private: false, access: { has: function (obj) { return "points_expiry_days" in obj; }, get: function (obj) { return obj.points_expiry_days; }, set: function (obj, value) { obj.points_expiry_days = value; } }, metadata: _metadata }, _points_expiry_days_initializers, _points_expiry_days_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateLoyaltyConfigDto = UpdateLoyaltyConfigDto;
var LoyaltyConfigResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _points_per_100_egp_decorators;
    var _points_per_100_egp_initializers = [];
    var _points_per_100_egp_extraInitializers = [];
    var _egp_per_point_decorators;
    var _egp_per_point_initializers = [];
    var _egp_per_point_extraInitializers = [];
    var _max_redeem_pct_decorators;
    var _max_redeem_pct_initializers = [];
    var _max_redeem_pct_extraInitializers = [];
    var _min_points_to_redeem_decorators;
    var _min_points_to_redeem_initializers = [];
    var _min_points_to_redeem_extraInitializers = [];
    var _points_expiry_days_decorators;
    var _points_expiry_days_initializers = [];
    var _points_expiry_days_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoyaltyConfigResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.points_per_100_egp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _points_per_100_egp_initializers, void 0));
                this.egp_per_point = (__runInitializers(this, _points_per_100_egp_extraInitializers), __runInitializers(this, _egp_per_point_initializers, void 0));
                this.max_redeem_pct = (__runInitializers(this, _egp_per_point_extraInitializers), __runInitializers(this, _max_redeem_pct_initializers, void 0));
                this.min_points_to_redeem = (__runInitializers(this, _max_redeem_pct_extraInitializers), __runInitializers(this, _min_points_to_redeem_initializers, void 0));
                this.points_expiry_days = (__runInitializers(this, _min_points_to_redeem_extraInitializers), __runInitializers(this, _points_expiry_days_initializers, void 0));
                this.is_active = (__runInitializers(this, _points_expiry_days_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                this.created_at = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return LoyaltyConfigResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _points_per_100_egp_decorators = [(0, swagger_1.ApiProperty)()];
            _egp_per_point_decorators = [(0, swagger_1.ApiProperty)()];
            _max_redeem_pct_decorators = [(0, swagger_1.ApiProperty)()];
            _min_points_to_redeem_decorators = [(0, swagger_1.ApiProperty)()];
            _points_expiry_days_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _is_active_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _points_per_100_egp_decorators, { kind: "field", name: "points_per_100_egp", static: false, private: false, access: { has: function (obj) { return "points_per_100_egp" in obj; }, get: function (obj) { return obj.points_per_100_egp; }, set: function (obj, value) { obj.points_per_100_egp = value; } }, metadata: _metadata }, _points_per_100_egp_initializers, _points_per_100_egp_extraInitializers);
            __esDecorate(null, null, _egp_per_point_decorators, { kind: "field", name: "egp_per_point", static: false, private: false, access: { has: function (obj) { return "egp_per_point" in obj; }, get: function (obj) { return obj.egp_per_point; }, set: function (obj, value) { obj.egp_per_point = value; } }, metadata: _metadata }, _egp_per_point_initializers, _egp_per_point_extraInitializers);
            __esDecorate(null, null, _max_redeem_pct_decorators, { kind: "field", name: "max_redeem_pct", static: false, private: false, access: { has: function (obj) { return "max_redeem_pct" in obj; }, get: function (obj) { return obj.max_redeem_pct; }, set: function (obj, value) { obj.max_redeem_pct = value; } }, metadata: _metadata }, _max_redeem_pct_initializers, _max_redeem_pct_extraInitializers);
            __esDecorate(null, null, _min_points_to_redeem_decorators, { kind: "field", name: "min_points_to_redeem", static: false, private: false, access: { has: function (obj) { return "min_points_to_redeem" in obj; }, get: function (obj) { return obj.min_points_to_redeem; }, set: function (obj, value) { obj.min_points_to_redeem = value; } }, metadata: _metadata }, _min_points_to_redeem_initializers, _min_points_to_redeem_extraInitializers);
            __esDecorate(null, null, _points_expiry_days_decorators, { kind: "field", name: "points_expiry_days", static: false, private: false, access: { has: function (obj) { return "points_expiry_days" in obj; }, get: function (obj) { return obj.points_expiry_days; }, set: function (obj, value) { obj.points_expiry_days = value; } }, metadata: _metadata }, _points_expiry_days_initializers, _points_expiry_days_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoyaltyConfigResponseDto = LoyaltyConfigResponseDto;
