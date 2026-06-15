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
exports.LoyaltySummaryDto = exports.LoyaltyTransactionDto = exports.ClientStatsDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var ClientStatsDto = function () {
    var _a;
    var _total_bookings_decorators;
    var _total_bookings_initializers = [];
    var _total_bookings_extraInitializers = [];
    var _completed_bookings_decorators;
    var _completed_bookings_initializers = [];
    var _completed_bookings_extraInitializers = [];
    var _cancelled_bookings_decorators;
    var _cancelled_bookings_initializers = [];
    var _cancelled_bookings_extraInitializers = [];
    var _pending_bookings_decorators;
    var _pending_bookings_initializers = [];
    var _pending_bookings_extraInitializers = [];
    var _in_progress_bookings_decorators;
    var _in_progress_bookings_initializers = [];
    var _in_progress_bookings_extraInitializers = [];
    var _total_spent_decorators;
    var _total_spent_initializers = [];
    var _total_spent_extraInitializers = [];
    var _total_refunded_decorators;
    var _total_refunded_initializers = [];
    var _total_refunded_extraInitializers = [];
    var _loyalty_points_decorators;
    var _loyalty_points_initializers = [];
    var _loyalty_points_extraInitializers = [];
    var _vehicles_count_decorators;
    var _vehicles_count_initializers = [];
    var _vehicles_count_extraInitializers = [];
    var _member_since_decorators;
    var _member_since_initializers = [];
    var _member_since_extraInitializers = [];
    var _last_active_decorators;
    var _last_active_initializers = [];
    var _last_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClientStatsDto() {
                this.total_bookings = __runInitializers(this, _total_bookings_initializers, void 0);
                this.completed_bookings = (__runInitializers(this, _total_bookings_extraInitializers), __runInitializers(this, _completed_bookings_initializers, void 0));
                this.cancelled_bookings = (__runInitializers(this, _completed_bookings_extraInitializers), __runInitializers(this, _cancelled_bookings_initializers, void 0));
                this.pending_bookings = (__runInitializers(this, _cancelled_bookings_extraInitializers), __runInitializers(this, _pending_bookings_initializers, void 0));
                this.in_progress_bookings = (__runInitializers(this, _pending_bookings_extraInitializers), __runInitializers(this, _in_progress_bookings_initializers, void 0));
                this.total_spent = (__runInitializers(this, _in_progress_bookings_extraInitializers), __runInitializers(this, _total_spent_initializers, void 0));
                this.total_refunded = (__runInitializers(this, _total_spent_extraInitializers), __runInitializers(this, _total_refunded_initializers, void 0));
                this.loyalty_points = (__runInitializers(this, _total_refunded_extraInitializers), __runInitializers(this, _loyalty_points_initializers, void 0));
                this.vehicles_count = (__runInitializers(this, _loyalty_points_extraInitializers), __runInitializers(this, _vehicles_count_initializers, void 0));
                this.member_since = (__runInitializers(this, _vehicles_count_extraInitializers), __runInitializers(this, _member_since_initializers, void 0));
                this.last_active = (__runInitializers(this, _member_since_extraInitializers), __runInitializers(this, _last_active_initializers, void 0));
                __runInitializers(this, _last_active_extraInitializers);
            }
            return ClientStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _pending_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _in_progress_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _total_spent_decorators = [(0, swagger_1.ApiProperty)()];
            _total_refunded_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _loyalty_points_decorators = [(0, swagger_1.ApiProperty)()];
            _vehicles_count_decorators = [(0, swagger_1.ApiProperty)()];
            _member_since_decorators = [(0, swagger_1.ApiProperty)()];
            _last_active_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _pending_bookings_decorators, { kind: "field", name: "pending_bookings", static: false, private: false, access: { has: function (obj) { return "pending_bookings" in obj; }, get: function (obj) { return obj.pending_bookings; }, set: function (obj, value) { obj.pending_bookings = value; } }, metadata: _metadata }, _pending_bookings_initializers, _pending_bookings_extraInitializers);
            __esDecorate(null, null, _in_progress_bookings_decorators, { kind: "field", name: "in_progress_bookings", static: false, private: false, access: { has: function (obj) { return "in_progress_bookings" in obj; }, get: function (obj) { return obj.in_progress_bookings; }, set: function (obj, value) { obj.in_progress_bookings = value; } }, metadata: _metadata }, _in_progress_bookings_initializers, _in_progress_bookings_extraInitializers);
            __esDecorate(null, null, _total_spent_decorators, { kind: "field", name: "total_spent", static: false, private: false, access: { has: function (obj) { return "total_spent" in obj; }, get: function (obj) { return obj.total_spent; }, set: function (obj, value) { obj.total_spent = value; } }, metadata: _metadata }, _total_spent_initializers, _total_spent_extraInitializers);
            __esDecorate(null, null, _total_refunded_decorators, { kind: "field", name: "total_refunded", static: false, private: false, access: { has: function (obj) { return "total_refunded" in obj; }, get: function (obj) { return obj.total_refunded; }, set: function (obj, value) { obj.total_refunded = value; } }, metadata: _metadata }, _total_refunded_initializers, _total_refunded_extraInitializers);
            __esDecorate(null, null, _loyalty_points_decorators, { kind: "field", name: "loyalty_points", static: false, private: false, access: { has: function (obj) { return "loyalty_points" in obj; }, get: function (obj) { return obj.loyalty_points; }, set: function (obj, value) { obj.loyalty_points = value; } }, metadata: _metadata }, _loyalty_points_initializers, _loyalty_points_extraInitializers);
            __esDecorate(null, null, _vehicles_count_decorators, { kind: "field", name: "vehicles_count", static: false, private: false, access: { has: function (obj) { return "vehicles_count" in obj; }, get: function (obj) { return obj.vehicles_count; }, set: function (obj, value) { obj.vehicles_count = value; } }, metadata: _metadata }, _vehicles_count_initializers, _vehicles_count_extraInitializers);
            __esDecorate(null, null, _member_since_decorators, { kind: "field", name: "member_since", static: false, private: false, access: { has: function (obj) { return "member_since" in obj; }, get: function (obj) { return obj.member_since; }, set: function (obj, value) { obj.member_since = value; } }, metadata: _metadata }, _member_since_initializers, _member_since_extraInitializers);
            __esDecorate(null, null, _last_active_decorators, { kind: "field", name: "last_active", static: false, private: false, access: { has: function (obj) { return "last_active" in obj; }, get: function (obj) { return obj.last_active; }, set: function (obj, value) { obj.last_active = value; } }, metadata: _metadata }, _last_active_initializers, _last_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClientStatsDto = ClientStatsDto;
var LoyaltyTransactionDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _points_decorators;
    var _points_initializers = [];
    var _points_extraInitializers = [];
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
            function LoyaltyTransactionDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.points = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _points_initializers, void 0));
                this.reason = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.booking_code = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.business_name = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.created_at = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return LoyaltyTransactionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['EARNED', 'REDEEMED'] })];
            _points_decorators = [(0, swagger_1.ApiProperty)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _business_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: function (obj) { return "points" in obj; }, get: function (obj) { return obj.points; }, set: function (obj, value) { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoyaltyTransactionDto = LoyaltyTransactionDto;
var LoyaltySummaryDto = function () {
    var _a;
    var _points_balance_decorators;
    var _points_balance_initializers = [];
    var _points_balance_extraInitializers = [];
    var _points_value_egp_decorators;
    var _points_value_egp_initializers = [];
    var _points_value_egp_extraInitializers = [];
    var _recent_transactions_decorators;
    var _recent_transactions_initializers = [];
    var _recent_transactions_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoyaltySummaryDto() {
                this.points_balance = __runInitializers(this, _points_balance_initializers, void 0);
                this.points_value_egp = (__runInitializers(this, _points_balance_extraInitializers), __runInitializers(this, _points_value_egp_initializers, void 0));
                this.recent_transactions = (__runInitializers(this, _points_value_egp_extraInitializers), __runInitializers(this, _recent_transactions_initializers, void 0));
                __runInitializers(this, _recent_transactions_extraInitializers);
            }
            return LoyaltySummaryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _points_balance_decorators = [(0, swagger_1.ApiProperty)()];
            _points_value_egp_decorators = [(0, swagger_1.ApiProperty)()];
            _recent_transactions_decorators = [(0, swagger_1.ApiProperty)({ type: [LoyaltyTransactionDto] })];
            __esDecorate(null, null, _points_balance_decorators, { kind: "field", name: "points_balance", static: false, private: false, access: { has: function (obj) { return "points_balance" in obj; }, get: function (obj) { return obj.points_balance; }, set: function (obj, value) { obj.points_balance = value; } }, metadata: _metadata }, _points_balance_initializers, _points_balance_extraInitializers);
            __esDecorate(null, null, _points_value_egp_decorators, { kind: "field", name: "points_value_egp", static: false, private: false, access: { has: function (obj) { return "points_value_egp" in obj; }, get: function (obj) { return obj.points_value_egp; }, set: function (obj, value) { obj.points_value_egp = value; } }, metadata: _metadata }, _points_value_egp_initializers, _points_value_egp_extraInitializers);
            __esDecorate(null, null, _recent_transactions_decorators, { kind: "field", name: "recent_transactions", static: false, private: false, access: { has: function (obj) { return "recent_transactions" in obj; }, get: function (obj) { return obj.recent_transactions; }, set: function (obj, value) { obj.recent_transactions = value; } }, metadata: _metadata }, _recent_transactions_initializers, _recent_transactions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoyaltySummaryDto = LoyaltySummaryDto;
// import { ApiProperty } from '@nestjs/swagger';
// export class ClientStatsDto {
//   @ApiProperty()
//   total_bookings: number;
//   @ApiProperty()
//   completed_bookings: number;
//   @ApiProperty()
//   cancelled_bookings: number;
//   @ApiProperty()
//   pending_bookings: number;
//   @ApiProperty()
//   in_progress_bookings: number;
//   @ApiProperty()
//   total_spent: number;
//   @ApiProperty()
//   average_booking_value: number;
//   @ApiProperty()
//   loyalty_points: number;
//   @ApiProperty()
//   vehicles_count: number;
//   @ApiProperty()
//   member_since: Date;
//   @ApiProperty()
//   last_active: Date;
// }
