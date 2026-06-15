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
exports.UpdateDiagnosticReportDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var create_report_dto_1 = require("./create-report.dto");
var UpdateDiagnosticReportDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function UpdateDiagnosticReportDto() {
                this.summary = __runInitializers(this, _summary_initializers, void 0);
                this.findings = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
                this.recommended_repairs = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommended_repairs_initializers, void 0));
                this.estimated_duration = (__runInitializers(this, _recommended_repairs_extraInitializers), __runInitializers(this, _estimated_duration_initializers, void 0));
                __runInitializers(this, _estimated_duration_extraInitializers);
            }
            return UpdateDiagnosticReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _summary_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Report summary' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _findings_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [create_report_dto_1.CreateFindingDto], description: 'Updated findings' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return create_report_dto_1.CreateFindingDto; })];
            _recommended_repairs_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [create_report_dto_1.CreateRepairDto], description: 'Updated recommended repairs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return create_report_dto_1.CreateRepairDto; })];
            _estimated_duration_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated total duration (minutes)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: function (obj) { return "summary" in obj; }, get: function (obj) { return obj.summary; }, set: function (obj, value) { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: function (obj) { return "findings" in obj; }, get: function (obj) { return obj.findings; }, set: function (obj, value) { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
            __esDecorate(null, null, _recommended_repairs_decorators, { kind: "field", name: "recommended_repairs", static: false, private: false, access: { has: function (obj) { return "recommended_repairs" in obj; }, get: function (obj) { return obj.recommended_repairs; }, set: function (obj, value) { obj.recommended_repairs = value; } }, metadata: _metadata }, _recommended_repairs_initializers, _recommended_repairs_extraInitializers);
            __esDecorate(null, null, _estimated_duration_decorators, { kind: "field", name: "estimated_duration", static: false, private: false, access: { has: function (obj) { return "estimated_duration" in obj; }, get: function (obj) { return obj.estimated_duration; }, set: function (obj, value) { obj.estimated_duration = value; } }, metadata: _metadata }, _estimated_duration_initializers, _estimated_duration_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateDiagnosticReportDto = UpdateDiagnosticReportDto;
