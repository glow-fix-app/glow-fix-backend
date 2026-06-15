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
exports.ReportSummaryDto = exports.DiagnosticReportResponseDto = exports.RepairResponseDto = exports.FindingResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var FindingResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
            function FindingResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return FindingResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FindingResponseDto = FindingResponseDto;
var RepairResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _is_selected_decorators;
    var _is_selected_initializers = [];
    var _is_selected_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RepairResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_service_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_service_id_initializers, void 0));
                this.title = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.price = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                this.is_selected = (__runInitializers(this, _duration_minutes_extraInitializers), __runInitializers(this, _is_selected_initializers, void 0));
                __runInitializers(this, _is_selected_extraInitializers);
            }
            return RepairResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            _duration_minutes_decorators = [(0, swagger_1.ApiProperty)()];
            _is_selected_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            __esDecorate(null, null, _is_selected_decorators, { kind: "field", name: "is_selected", static: false, private: false, access: { has: function (obj) { return "is_selected" in obj; }, get: function (obj) { return obj.is_selected; }, set: function (obj, value) { obj.is_selected = value; } }, metadata: _metadata }, _is_selected_initializers, _is_selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RepairResponseDto = RepairResponseDto;
var DiagnosticReportResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _booking_code_decorators;
    var _booking_code_initializers = [];
    var _booking_code_extraInitializers = [];
    var _summary_decorators;
    var _summary_initializers = [];
    var _summary_extraInitializers = [];
    var _valid_until_decorators;
    var _valid_until_initializers = [];
    var _valid_until_extraInitializers = [];
    var _estimated_duration_decorators;
    var _estimated_duration_initializers = [];
    var _estimated_duration_extraInitializers = [];
    var _client_action_decorators;
    var _client_action_initializers = [];
    var _client_action_extraInitializers = [];
    var _client_action_at_decorators;
    var _client_action_at_initializers = [];
    var _client_action_at_extraInitializers = [];
    var _findings_decorators;
    var _findings_initializers = [];
    var _findings_extraInitializers = [];
    var _recommended_repairs_decorators;
    var _recommended_repairs_initializers = [];
    var _recommended_repairs_extraInitializers = [];
    var _total_repair_cost_decorators;
    var _total_repair_cost_initializers = [];
    var _total_repair_cost_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DiagnosticReportResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.booking_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _booking_id_initializers, void 0));
                this.booking_code = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.summary = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.valid_until = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _valid_until_initializers, void 0));
                this.estimated_duration = (__runInitializers(this, _valid_until_extraInitializers), __runInitializers(this, _estimated_duration_initializers, void 0));
                this.client_action = (__runInitializers(this, _estimated_duration_extraInitializers), __runInitializers(this, _client_action_initializers, void 0));
                this.client_action_at = (__runInitializers(this, _client_action_extraInitializers), __runInitializers(this, _client_action_at_initializers, void 0));
                this.findings = (__runInitializers(this, _client_action_at_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
                this.recommended_repairs = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommended_repairs_initializers, void 0));
                this.total_repair_cost = (__runInitializers(this, _recommended_repairs_extraInitializers), __runInitializers(this, _total_repair_cost_initializers, void 0));
                this.created_at = (__runInitializers(this, _total_repair_cost_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return DiagnosticReportResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiProperty)()];
            _summary_decorators = [(0, swagger_1.ApiProperty)()];
            _valid_until_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _estimated_duration_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _client_action_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _client_action_at_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _findings_decorators = [(0, swagger_1.ApiProperty)({ type: [FindingResponseDto] })];
            _recommended_repairs_decorators = [(0, swagger_1.ApiProperty)({ type: [RepairResponseDto] })];
            _total_repair_cost_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: function (obj) { return "summary" in obj; }, get: function (obj) { return obj.summary; }, set: function (obj, value) { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _valid_until_decorators, { kind: "field", name: "valid_until", static: false, private: false, access: { has: function (obj) { return "valid_until" in obj; }, get: function (obj) { return obj.valid_until; }, set: function (obj, value) { obj.valid_until = value; } }, metadata: _metadata }, _valid_until_initializers, _valid_until_extraInitializers);
            __esDecorate(null, null, _estimated_duration_decorators, { kind: "field", name: "estimated_duration", static: false, private: false, access: { has: function (obj) { return "estimated_duration" in obj; }, get: function (obj) { return obj.estimated_duration; }, set: function (obj, value) { obj.estimated_duration = value; } }, metadata: _metadata }, _estimated_duration_initializers, _estimated_duration_extraInitializers);
            __esDecorate(null, null, _client_action_decorators, { kind: "field", name: "client_action", static: false, private: false, access: { has: function (obj) { return "client_action" in obj; }, get: function (obj) { return obj.client_action; }, set: function (obj, value) { obj.client_action = value; } }, metadata: _metadata }, _client_action_initializers, _client_action_extraInitializers);
            __esDecorate(null, null, _client_action_at_decorators, { kind: "field", name: "client_action_at", static: false, private: false, access: { has: function (obj) { return "client_action_at" in obj; }, get: function (obj) { return obj.client_action_at; }, set: function (obj, value) { obj.client_action_at = value; } }, metadata: _metadata }, _client_action_at_initializers, _client_action_at_extraInitializers);
            __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: function (obj) { return "findings" in obj; }, get: function (obj) { return obj.findings; }, set: function (obj, value) { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
            __esDecorate(null, null, _recommended_repairs_decorators, { kind: "field", name: "recommended_repairs", static: false, private: false, access: { has: function (obj) { return "recommended_repairs" in obj; }, get: function (obj) { return obj.recommended_repairs; }, set: function (obj, value) { obj.recommended_repairs = value; } }, metadata: _metadata }, _recommended_repairs_initializers, _recommended_repairs_extraInitializers);
            __esDecorate(null, null, _total_repair_cost_decorators, { kind: "field", name: "total_repair_cost", static: false, private: false, access: { has: function (obj) { return "total_repair_cost" in obj; }, get: function (obj) { return obj.total_repair_cost; }, set: function (obj, value) { obj.total_repair_cost = value; } }, metadata: _metadata }, _total_repair_cost_initializers, _total_repair_cost_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DiagnosticReportResponseDto = DiagnosticReportResponseDto;
var ReportSummaryDto = function () {
    var _a;
    var _report_id_decorators;
    var _report_id_initializers = [];
    var _report_id_extraInitializers = [];
    var _booking_id_decorators;
    var _booking_id_initializers = [];
    var _booking_id_extraInitializers = [];
    var _booking_code_decorators;
    var _booking_code_initializers = [];
    var _booking_code_extraInitializers = [];
    var _summary_decorators;
    var _summary_initializers = [];
    var _summary_extraInitializers = [];
    var _critical_count_decorators;
    var _critical_count_initializers = [];
    var _critical_count_extraInitializers = [];
    var _warning_count_decorators;
    var _warning_count_initializers = [];
    var _warning_count_extraInitializers = [];
    var _info_count_decorators;
    var _info_count_initializers = [];
    var _info_count_extraInitializers = [];
    var _total_repairs_decorators;
    var _total_repairs_initializers = [];
    var _total_repairs_extraInitializers = [];
    var _total_cost_decorators;
    var _total_cost_initializers = [];
    var _total_cost_extraInitializers = [];
    var _client_action_decorators;
    var _client_action_initializers = [];
    var _client_action_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReportSummaryDto() {
                this.report_id = __runInitializers(this, _report_id_initializers, void 0);
                this.booking_id = (__runInitializers(this, _report_id_extraInitializers), __runInitializers(this, _booking_id_initializers, void 0));
                this.booking_code = (__runInitializers(this, _booking_id_extraInitializers), __runInitializers(this, _booking_code_initializers, void 0));
                this.summary = (__runInitializers(this, _booking_code_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.critical_count = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _critical_count_initializers, void 0));
                this.warning_count = (__runInitializers(this, _critical_count_extraInitializers), __runInitializers(this, _warning_count_initializers, void 0));
                this.info_count = (__runInitializers(this, _warning_count_extraInitializers), __runInitializers(this, _info_count_initializers, void 0));
                this.total_repairs = (__runInitializers(this, _info_count_extraInitializers), __runInitializers(this, _total_repairs_initializers, void 0));
                this.total_cost = (__runInitializers(this, _total_repairs_extraInitializers), __runInitializers(this, _total_cost_initializers, void 0));
                this.client_action = (__runInitializers(this, _total_cost_extraInitializers), __runInitializers(this, _client_action_initializers, void 0));
                this.created_at = (__runInitializers(this, _client_action_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return ReportSummaryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _report_id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_id_decorators = [(0, swagger_1.ApiProperty)()];
            _booking_code_decorators = [(0, swagger_1.ApiProperty)()];
            _summary_decorators = [(0, swagger_1.ApiProperty)()];
            _critical_count_decorators = [(0, swagger_1.ApiProperty)()];
            _warning_count_decorators = [(0, swagger_1.ApiProperty)()];
            _info_count_decorators = [(0, swagger_1.ApiProperty)()];
            _total_repairs_decorators = [(0, swagger_1.ApiProperty)()];
            _total_cost_decorators = [(0, swagger_1.ApiProperty)()];
            _client_action_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _report_id_decorators, { kind: "field", name: "report_id", static: false, private: false, access: { has: function (obj) { return "report_id" in obj; }, get: function (obj) { return obj.report_id; }, set: function (obj, value) { obj.report_id = value; } }, metadata: _metadata }, _report_id_initializers, _report_id_extraInitializers);
            __esDecorate(null, null, _booking_id_decorators, { kind: "field", name: "booking_id", static: false, private: false, access: { has: function (obj) { return "booking_id" in obj; }, get: function (obj) { return obj.booking_id; }, set: function (obj, value) { obj.booking_id = value; } }, metadata: _metadata }, _booking_id_initializers, _booking_id_extraInitializers);
            __esDecorate(null, null, _booking_code_decorators, { kind: "field", name: "booking_code", static: false, private: false, access: { has: function (obj) { return "booking_code" in obj; }, get: function (obj) { return obj.booking_code; }, set: function (obj, value) { obj.booking_code = value; } }, metadata: _metadata }, _booking_code_initializers, _booking_code_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: function (obj) { return "summary" in obj; }, get: function (obj) { return obj.summary; }, set: function (obj, value) { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _critical_count_decorators, { kind: "field", name: "critical_count", static: false, private: false, access: { has: function (obj) { return "critical_count" in obj; }, get: function (obj) { return obj.critical_count; }, set: function (obj, value) { obj.critical_count = value; } }, metadata: _metadata }, _critical_count_initializers, _critical_count_extraInitializers);
            __esDecorate(null, null, _warning_count_decorators, { kind: "field", name: "warning_count", static: false, private: false, access: { has: function (obj) { return "warning_count" in obj; }, get: function (obj) { return obj.warning_count; }, set: function (obj, value) { obj.warning_count = value; } }, metadata: _metadata }, _warning_count_initializers, _warning_count_extraInitializers);
            __esDecorate(null, null, _info_count_decorators, { kind: "field", name: "info_count", static: false, private: false, access: { has: function (obj) { return "info_count" in obj; }, get: function (obj) { return obj.info_count; }, set: function (obj, value) { obj.info_count = value; } }, metadata: _metadata }, _info_count_initializers, _info_count_extraInitializers);
            __esDecorate(null, null, _total_repairs_decorators, { kind: "field", name: "total_repairs", static: false, private: false, access: { has: function (obj) { return "total_repairs" in obj; }, get: function (obj) { return obj.total_repairs; }, set: function (obj, value) { obj.total_repairs = value; } }, metadata: _metadata }, _total_repairs_initializers, _total_repairs_extraInitializers);
            __esDecorate(null, null, _total_cost_decorators, { kind: "field", name: "total_cost", static: false, private: false, access: { has: function (obj) { return "total_cost" in obj; }, get: function (obj) { return obj.total_cost; }, set: function (obj, value) { obj.total_cost = value; } }, metadata: _metadata }, _total_cost_initializers, _total_cost_extraInitializers);
            __esDecorate(null, null, _client_action_decorators, { kind: "field", name: "client_action", static: false, private: false, access: { has: function (obj) { return "client_action" in obj; }, get: function (obj) { return obj.client_action; }, set: function (obj, value) { obj.client_action = value; } }, metadata: _metadata }, _client_action_initializers, _client_action_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReportSummaryDto = ReportSummaryDto;
