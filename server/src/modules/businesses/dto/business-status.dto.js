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
exports.BusinessStatusResponseDto = exports.UpdateBusinessStatusDto = exports.BusinessStatus = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var BusinessStatus;
(function (BusinessStatus) {
    BusinessStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    BusinessStatus["APPROVED"] = "APPROVED";
    BusinessStatus["REJECTED"] = "REJECTED";
    BusinessStatus["SUSPENDED"] = "SUSPENDED";
})(BusinessStatus || (exports.BusinessStatus = BusinessStatus = {}));
var UpdateBusinessStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejection_reason_decorators;
    var _rejection_reason_initializers = [];
    var _rejection_reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateBusinessStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.rejection_reason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rejection_reason_initializers, void 0));
                __runInitializers(this, _rejection_reason_extraInitializers);
            }
            return UpdateBusinessStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: BusinessStatus }), (0, class_validator_1.IsEnum)(BusinessStatus)];
            _rejection_reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Required when status is REJECTED or SUSPENDED' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rejection_reason_decorators, { kind: "field", name: "rejection_reason", static: false, private: false, access: { has: function (obj) { return "rejection_reason" in obj; }, get: function (obj) { return obj.rejection_reason; }, set: function (obj, value) { obj.rejection_reason = value; } }, metadata: _metadata }, _rejection_reason_initializers, _rejection_reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateBusinessStatusDto = UpdateBusinessStatusDto;
var BusinessStatusResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejection_reason_decorators;
    var _rejection_reason_initializers = [];
    var _rejection_reason_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessStatusResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_id_initializers, void 0));
                this.status = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.rejection_reason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rejection_reason_initializers, void 0));
                this.created_at = (__runInitializers(this, _rejection_reason_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return BusinessStatusResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _rejection_reason_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rejection_reason_decorators, { kind: "field", name: "rejection_reason", static: false, private: false, access: { has: function (obj) { return "rejection_reason" in obj; }, get: function (obj) { return obj.rejection_reason; }, set: function (obj, value) { obj.rejection_reason = value; } }, metadata: _metadata }, _rejection_reason_initializers, _rejection_reason_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessStatusResponseDto = BusinessStatusResponseDto;
