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
exports.BulkAssignServicesDto = exports.AssignServiceToBusinessDto = void 0;
// (Manager assigns price & duration)
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var AssignServiceToBusinessDto = function () {
    var _a;
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _average_duration_decorators;
    var _average_duration_initializers = [];
    var _average_duration_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignServiceToBusinessDto() {
                this.service_id = __runInitializers(this, _service_id_initializers, void 0);
                this.price = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.average_duration = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _average_duration_initializers, void 0));
                this.is_active = (__runInitializers(this, _average_duration_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return AssignServiceToBusinessDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service ID from catalog' }), (0, class_validator_1.IsString)()];
            _price_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price in EGP (e.g., 120 for 120 EGP)', example: 120 }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_transformer_1.Type)(function () { return Number; })];
            _average_duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average duration in minutes', example: 30 }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _is_active_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _average_duration_decorators, { kind: "field", name: "average_duration", static: false, private: false, access: { has: function (obj) { return "average_duration" in obj; }, get: function (obj) { return obj.average_duration; }, set: function (obj, value) { obj.average_duration = value; } }, metadata: _metadata }, _average_duration_initializers, _average_duration_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AssignServiceToBusinessDto = AssignServiceToBusinessDto;
var BulkAssignServicesDto = function () {
    var _a;
    var _services_decorators;
    var _services_initializers = [];
    var _services_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkAssignServicesDto() {
                this.services = __runInitializers(this, _services_initializers, void 0);
                __runInitializers(this, _services_extraInitializers);
            }
            return BulkAssignServicesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _services_decorators = [(0, swagger_1.ApiProperty)({ type: [AssignServiceToBusinessDto] })];
            __esDecorate(null, null, _services_decorators, { kind: "field", name: "services", static: false, private: false, access: { has: function (obj) { return "services" in obj; }, get: function (obj) { return obj.services; }, set: function (obj, value) { obj.services = value; } }, metadata: _metadata }, _services_initializers, _services_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkAssignServicesDto = BulkAssignServicesDto;
