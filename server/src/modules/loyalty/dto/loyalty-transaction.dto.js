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
exports.QuickRedeemResponseDto = exports.QuickRedeemOptionDto = exports.LoyaltySummaryResponseDto = exports.LoyaltyTransactionResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var LoyaltyTransactionResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _client_id_decorators;
    var _client_id_initializers = [];
    var _client_id_extraInitializers = [];
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
    var _balance_after_decorators;
    var _balance_after_initializers = [];
    var _balance_after_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _booking_code_decorators;
    var _booking_code_initializers = [];
    var _booking_code_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoyaltyTransactionResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.client_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _client_id_initializers, void 0));
                this.booking_id = (__runInitializers(this, _client_id_extraInitializers), __runInitializers(this, _booking_id_initializers, void 0));
                this.type = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.points = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _points_initializers, void 0));
                this.balance_after = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _balance_after_initializers, void 0));
                this.reason = (__runInitializers(this, _balance_after_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.booking_code = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.business_name = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.created_at = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return LoyaltyTransactionResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _client_id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_id_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['EARNED', 'REDEEMED'] })];
            _points_decorators = [(0, swagger_1.ApiProperty)()];
            _balance_after_decorators = [(0, swagger_1.ApiProperty)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _business_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _client_id_decorators, { kind: "field", name: "client_id", static: false, private: false, access: { has: function (obj) { return "client_id" in obj; }, get: function (obj) { return obj.client_id; }, set: function (obj, value) { obj.client_id = value; } }, metadata: _metadata }, _client_id_initializers, _client_id_extraInitializers);
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _balance_after_decorators, { kind: "field", name: "balance_after", static: false, private: false, access: { has: function (obj) { return "balance_after" in obj; }, get: function (obj) { return obj.balance_after; }, set: function (obj, value) { obj.balance_after = value; } }, metadata: _metadata }, _balance_after_initializers, _balance_after_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoyaltyTransactionResponseDto = LoyaltyTransactionResponseDto;
var LoyaltySummaryResponseDto = function () {
    var _a;
    var _points_balance_decorators;
    var _points_balance_initializers = [];
    var _points_balance_extraInitializers = [];
    var _points_value_egp_decorators;
    var _points_value_egp_initializers = [];
    var _points_value_egp_extraInitializers = [];
    var _points_earned_lifetime_decorators;
    var _points_earned_lifetime_initializers = [];
    var _points_earned_lifetime_extraInitializers = [];
    var _points_redeemed_lifetime_decorators;
    var _points_redeemed_lifetime_initializers = [];
    var _points_redeemed_lifetime_extraInitializers = [];
    var _points_expiring_soon_decorators;
    var _points_expiring_soon_initializers = [];
    var _points_expiring_soon_extraInitializers = [];
    var _next_tier_decorators;
    var _next_tier_initializers = [];
    var _next_tier_extraInitializers = [];
    var _points_to_next_tier_decorators;
    var _points_to_next_tier_initializers = [];
    var _points_to_next_tier_extraInitializers = [];
    var _tier_name_decorators;
    var _tier_name_initializers = [];
    var _tier_name_extraInitializers = [];
    var _tier_discount_decorators;
    var _tier_discount_initializers = [];
    var _tier_discount_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoyaltySummaryResponseDto() {
                this.points_balance = __runInitializers(this, _points_balance_initializers, void 0);
                this.points_value_egp = (__runInitializers(this, _points_balance_extraInitializers), __runInitializers(this, _points_value_egp_initializers, void 0));
                this.points_earned_lifetime = (__runInitializers(this, _points_value_egp_extraInitializers), __runInitializers(this, _points_earned_lifetime_initializers, void 0));
                this.points_redeemed_lifetime = (__runInitializers(this, _points_earned_lifetime_extraInitializers), __runInitializers(this, _points_redeemed_lifetime_initializers, void 0));
                this.points_expiring_soon = (__runInitializers(this, _points_redeemed_lifetime_extraInitializers), __runInitializers(this, _points_expiring_soon_initializers, void 0));
                this.next_tier = (__runInitializers(this, _points_expiring_soon_extraInitializers), __runInitializers(this, _next_tier_initializers, void 0));
                this.points_to_next_tier = (__runInitializers(this, _next_tier_extraInitializers), __runInitializers(this, _points_to_next_tier_initializers, void 0));
                this.tier_name = (__runInitializers(this, _points_to_next_tier_extraInitializers), __runInitializers(this, _tier_name_initializers, void 0));
                this.tier_discount = (__runInitializers(this, _tier_name_extraInitializers), __runInitializers(this, _tier_discount_initializers, void 0));
                __runInitializers(this, _tier_discount_extraInitializers);
            }
            return LoyaltySummaryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _points_balance_decorators = [(0, swagger_1.ApiProperty)()];
            _points_value_egp_decorators = [(0, swagger_1.ApiProperty)()];
            _points_earned_lifetime_decorators = [(0, swagger_1.ApiProperty)()];
            _points_redeemed_lifetime_decorators = [(0, swagger_1.ApiProperty)()];
            _points_expiring_soon_decorators = [(0, swagger_1.ApiProperty)()];
            _next_tier_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _points_to_next_tier_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _tier_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _tier_discount_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _points_balance_decorators, { kind: "field", name: "points_balance", static: false, private: false, access: { has: function (obj) { return "points_balance" in obj; }, get: function (obj) { return obj.points_balance; }, set: function (obj, value) { obj.points_balance = value; } }, metadata: _metadata }, _points_balance_initializers, _points_balance_extraInitializers);
            __esDecorate(null, null, _points_value_egp_decorators, { kind: "field", name: "points_value_egp", static: false, private: false, access: { has: function (obj) { return "points_value_egp" in obj; }, get: function (obj) { return obj.points_value_egp; }, set: function (obj, value) { obj.points_value_egp = value; } }, metadata: _metadata }, _points_value_egp_initializers, _points_value_egp_extraInitializers);
            __esDecorate(null, null, _points_earned_lifetime_decorators, { kind: "field", name: "points_earned_lifetime", static: false, private: false, access: { has: function (obj) { return "points_earned_lifetime" in obj; }, get: function (obj) { return obj.points_earned_lifetime; }, set: function (obj, value) { obj.points_earned_lifetime = value; } }, metadata: _metadata }, _points_earned_lifetime_initializers, _points_earned_lifetime_extraInitializers);
            __esDecorate(null, null, _points_redeemed_lifetime_decorators, { kind: "field", name: "points_redeemed_lifetime", static: false, private: false, access: { has: function (obj) { return "points_redeemed_lifetime" in obj; }, get: function (obj) { return obj.points_redeemed_lifetime; }, set: function (obj, value) { obj.points_redeemed_lifetime = value; } }, metadata: _metadata }, _points_redeemed_lifetime_initializers, _points_redeemed_lifetime_extraInitializers);
            __esDecorate(null, null, _points_expiring_soon_decorators, { kind: "field", name: "points_expiring_soon", static: false, private: false, access: { has: function (obj) { return "points_expiring_soon" in obj; }, get: function (obj) { return obj.points_expiring_soon; }, set: function (obj, value) { obj.points_expiring_soon = value; } }, metadata: _metadata }, _points_expiring_soon_initializers, _points_expiring_soon_extraInitializers);
            __esDecorate(null, null, _next_tier_decorators, { kind: "field", name: "next_tier", static: false, private: false, access: { has: function (obj) { return "next_tier" in obj; }, get: function (obj) { return obj.next_tier; }, set: function (obj, value) { obj.next_tier = value; } }, metadata: _metadata }, _next_tier_initializers, _next_tier_extraInitializers);
            __esDecorate(null, null, _points_to_next_tier_decorators, { kind: "field", name: "points_to_next_tier", static: false, private: false, access: { has: function (obj) { return "points_to_next_tier" in obj; }, get: function (obj) { return obj.points_to_next_tier; }, set: function (obj, value) { obj.points_to_next_tier = value; } }, metadata: _metadata }, _points_to_next_tier_initializers, _points_to_next_tier_extraInitializers);
            __esDecorate(null, null, _tier_name_decorators, { kind: "field", name: "tier_name", static: false, private: false, access: { has: function (obj) { return "tier_name" in obj; }, get: function (obj) { return obj.tier_name; }, set: function (obj, value) { obj.tier_name = value; } }, metadata: _metadata }, _tier_name_initializers, _tier_name_extraInitializers);
            __esDecorate(null, null, _tier_discount_decorators, { kind: "field", name: "tier_discount", static: false, private: false, access: { has: function (obj) { return "tier_discount" in obj; }, get: function (obj) { return obj.tier_discount; }, set: function (obj, value) { obj.tier_discount = value; } }, metadata: _metadata }, _tier_discount_initializers, _tier_discount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoyaltySummaryResponseDto = LoyaltySummaryResponseDto;
var QuickRedeemOptionDto = function () {
    var _a;
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
    var _value_egp_decorators;
    var _value_egp_initializers = [];
    var _value_egp_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QuickRedeemOptionDto() {
                this.points = __runInitializers(this, _points_initializers, void 0);
                this.value_egp = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _value_egp_initializers, void 0));
                this.description = (__runInitializers(this, _value_egp_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return QuickRedeemOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _points_decorators = [(0, swagger_1.ApiProperty)()];
            _value_egp_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _value_egp_decorators, { kind: "field", name: "value_egp", static: false, private: false, access: { has: function (obj) { return "value_egp" in obj; }, get: function (obj) { return obj.value_egp; }, set: function (obj, value) { obj.value_egp = value; } }, metadata: _metadata }, _value_egp_initializers, _value_egp_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QuickRedeemOptionDto = QuickRedeemOptionDto;
var QuickRedeemResponseDto = function () {
    var _a;
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QuickRedeemResponseDto() {
                this.options = __runInitializers(this, _options_initializers, void 0);
                __runInitializers(this, _options_extraInitializers);
            }
            return QuickRedeemResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _options_decorators = [(0, swagger_1.ApiProperty)({ type: [QuickRedeemOptionDto] })];
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QuickRedeemResponseDto = QuickRedeemResponseDto;
