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
exports.CreateVehicleDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateVehicleDto = function () {
    var _a;
    var _license_plate_decorators;
    var _license_plate_initializers = [];
    var _license_plate_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVehicleDto() {
                this.license_plate = __runInitializers(this, _license_plate_initializers, void 0);
                this.model = (__runInitializers(this, _license_plate_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                __runInitializers(this, _color_extraInitializers);
            }
            return CreateVehicleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _license_plate_decorators = [(0, swagger_1.ApiProperty)({ description: 'License plate number', example: 'ABC 1234' }), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(3, 20), (0, class_validator_1.Matches)(/^[A-Z0-9\s-]+$/i, {
                    message: 'License plate can only contain letters, numbers, spaces, and hyphens',
                })];
            _model_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Vehicle model', example: 'Toyota Corolla' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(2, 100)];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Manufacturing year', example: 2021 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1900), (0, class_validator_1.Max)(new Date().getFullYear() + 1)];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Vehicle color', example: 'Pearl White' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.Length)(1, 50)];
            __esDecorate(null, null, _license_plate_decorators, { kind: "field", name: "license_plate", static: false, private: false, access: { has: function (obj) { return "license_plate" in obj; }, get: function (obj) { return obj.license_plate; }, set: function (obj, value) { obj.license_plate = value; } }, metadata: _metadata }, _license_plate_initializers, _license_plate_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVehicleDto = CreateVehicleDto;
