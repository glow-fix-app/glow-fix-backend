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
exports.CreateDiagnosticReportDto = exports.CreateRepairDto = exports.CreateFindingDto = exports.FindingPriority = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var FindingPriority;
(function (FindingPriority) {
    FindingPriority["CRITICAL"] = "CRITICAL";
    FindingPriority["WARNING"] = "WARNING";
    FindingPriority["INFO"] = "INFO";
})(FindingPriority || (exports.FindingPriority = FindingPriority = {}));
var CreateFindingDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateFindingDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return CreateFindingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Finding title', example: 'Timing belt — visible cracking' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Finding description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: FindingPriority, description: 'Priority level' }), (0, class_validator_1.IsEnum)(FindingPriority)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateFindingDto = CreateFindingDto;
var CreateRepairDto = function () {
    var _a;
    var _business_service_id_decorators;
    var _business_service_id_initializers = [];
    var _business_service_id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _duration_minutes_decorators;
    var _duration_minutes_initializers = [];
    var _duration_minutes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRepairDto() {
                this.business_service_id = __runInitializers(this, _business_service_id_initializers, void 0);
                this.title = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.price = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                __runInitializers(this, _duration_minutes_extraInitializers);
            }
            return CreateRepairDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business service ID (from assigned services)' }), (0, class_validator_1.IsUUID)()];
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom title (overrides service title)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _price_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom price' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _duration_minutes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom duration' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRepairDto = CreateRepairDto;
var CreateDiagnosticReportDto = function () {
    var _a;
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _summary_decorators;
    var _summary_initializers = [];
    var _summary_extraInitializers = [];
    var _findings_decorators;
    var _findings_initializers = [];
    var _findings_extraInitializers = [];
    var _recommended_repairs_decorators;
    var _recommended_repairs_initializers = [];
    var _recommended_repairs_extraInitializers = [];
    var _estimated_duration_decorators;
    var _estimated_duration_initializers = [];
    var _estimated_duration_extraInitializers = [];
    var _valid_hours_decorators;
    var _valid_hours_initializers = [];
    var _valid_hours_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDiagnosticReportDto() {
                this.booking_id = __runInitializers(this, _booking_id_initializers, void 0);
                this.summary = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.findings = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
                this.recommended_repairs = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommended_repairs_initializers, void 0));
                this.estimated_duration = (__runInitializers(this, _recommended_repairs_extraInitializers), __runInitializers(this, _estimated_duration_initializers, void 0));
                this.valid_hours = (__runInitializers(this, _estimated_duration_extraInitializers), __runInitializers(this, _valid_hours_initializers, void 0));
                __runInitializers(this, _valid_hours_extraInitializers);
            }
            return CreateDiagnosticReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _booking_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Booking ID' }), (0, class_validator_1.IsString)()];
            _summary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report summary' }), (0, class_validator_1.IsString)()];
            _findings_decorators = [(0, swagger_1.ApiProperty)({ type: [CreateFindingDto], description: 'List of findings' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return CreateFindingDto; })];
            _recommended_repairs_decorators = [(0, swagger_1.ApiProperty)({ type: [CreateRepairDto], description: 'List of recommended repairs' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return CreateRepairDto; })];
            _estimated_duration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated total duration (minutes)', example: 240 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _valid_hours_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Valid for hours', default: 72 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: function (obj) { return "summary" in obj; }, get: function (obj) { return obj.summary; }, set: function (obj, value) { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: function (obj) { return "findings" in obj; }, get: function (obj) { return obj.findings; }, set: function (obj, value) { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
            __esDecorate(null, null, _recommended_repairs_decorators, { kind: "field", name: "recommended_repairs", static: false, private: false, access: { has: function (obj) { return "recommended_repairs" in obj; }, get: function (obj) { return obj.recommended_repairs; }, set: function (obj, value) { obj.recommended_repairs = value; } }, metadata: _metadata }, _recommended_repairs_initializers, _recommended_repairs_extraInitializers);
            __esDecorate(null, null, _estimated_duration_decorators, { kind: "field", name: "estimated_duration", static: false, private: false, access: { has: function (obj) { return "estimated_duration" in obj; }, get: function (obj) { return obj.estimated_duration; }, set: function (obj, value) { obj.estimated_duration = value; } }, metadata: _metadata }, _estimated_duration_initializers, _estimated_duration_extraInitializers);
            __esDecorate(null, null, _valid_hours_decorators, { kind: "field", name: "valid_hours", static: false, private: false, access: { has: function (obj) { return "valid_hours" in obj; }, get: function (obj) { return obj.valid_hours; }, set: function (obj, value) { obj.valid_hours = value; } }, metadata: _metadata }, _valid_hours_initializers, _valid_hours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDiagnosticReportDto = CreateDiagnosticReportDto;
