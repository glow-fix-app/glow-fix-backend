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
exports.UpdateOperatingHoursDto = exports.SingleOperatingHourDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SingleOperatingHourDto = function () {
    var _a;
    var _day_of_week_decorators;
    var _day_of_week_initializers = [];
    var _day_of_week_extraInitializers = [];
    var _open_time_decorators;
    var _open_time_initializers = [];
    var _open_time_extraInitializers = [];
    var _close_time_decorators;
    var _close_time_initializers = [];
    var _close_time_extraInitializers = [];
    var _is_closed_decorators;
    var _is_closed_initializers = [];
    var _is_closed_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SingleOperatingHourDto() {
                this.day_of_week = __runInitializers(this, _day_of_week_initializers, void 0);
                this.open_time = (__runInitializers(this, _day_of_week_extraInitializers), __runInitializers(this, _open_time_initializers, void 0));
                this.close_time = (__runInitializers(this, _open_time_extraInitializers), __runInitializers(this, _close_time_initializers, void 0));
                this.is_closed = (__runInitializers(this, _close_time_extraInitializers), __runInitializers(this, _is_closed_initializers, void 0));
                __runInitializers(this, _is_closed_extraInitializers);
            }
            return SingleOperatingHourDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _day_of_week_decorators = [(0, swagger_1.ApiProperty)({ enum: [0, 1, 2, 3, 4, 5, 6] }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(6)];
            _open_time_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '09:00' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _close_time_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '18:00' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _is_closed_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: false }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _day_of_week_decorators, { kind: "field", name: "day_of_week", static: false, private: false, access: { has: function (obj) { return "day_of_week" in obj; }, get: function (obj) { return obj.day_of_week; }, set: function (obj, value) { obj.day_of_week = value; } }, metadata: _metadata }, _day_of_week_initializers, _day_of_week_extraInitializers);
            __esDecorate(null, null, _open_time_decorators, { kind: "field", name: "open_time", static: false, private: false, access: { has: function (obj) { return "open_time" in obj; }, get: function (obj) { return obj.open_time; }, set: function (obj, value) { obj.open_time = value; } }, metadata: _metadata }, _open_time_initializers, _open_time_extraInitializers);
            __esDecorate(null, null, _close_time_decorators, { kind: "field", name: "close_time", static: false, private: false, access: { has: function (obj) { return "close_time" in obj; }, get: function (obj) { return obj.close_time; }, set: function (obj, value) { obj.close_time = value; } }, metadata: _metadata }, _close_time_initializers, _close_time_extraInitializers);
            __esDecorate(null, null, _is_closed_decorators, { kind: "field", name: "is_closed", static: false, private: false, access: { has: function (obj) { return "is_closed" in obj; }, get: function (obj) { return obj.is_closed; }, set: function (obj, value) { obj.is_closed = value; } }, metadata: _metadata }, _is_closed_initializers, _is_closed_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SingleOperatingHourDto = SingleOperatingHourDto;
var UpdateOperatingHoursDto = function () {
    var _a;
    var _hours_decorators;
    var _hours_initializers = [];
    var _hours_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateOperatingHoursDto() {
                this.hours = __runInitializers(this, _hours_initializers, void 0);
                __runInitializers(this, _hours_extraInitializers);
            }
            return UpdateOperatingHoursDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _hours_decorators = [(0, swagger_1.ApiProperty)({ type: [SingleOperatingHourDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SingleOperatingHourDto; })];
            __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: function (obj) { return "hours" in obj; }, get: function (obj) { return obj.hours; }, set: function (obj, value) { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateOperatingHoursDto = UpdateOperatingHoursDto;
