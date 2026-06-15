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
exports.CreateDisputeDto = exports.DesiredOutcome = exports.DisputeReason = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var DisputeReason;
(function (DisputeReason) {
    DisputeReason["WORK_NOT_COMPLETED"] = "WORK_NOT_COMPLETED";
    DisputeReason["WORK_POOR_QUALITY"] = "WORK_POOR_QUALITY";
    DisputeReason["OVERCHARGED"] = "OVERCHARGED";
    DisputeReason["UNAUTHORIZED"] = "UNAUTHORIZED";
    DisputeReason["OTHER"] = "OTHER";
})(DisputeReason || (exports.DisputeReason = DisputeReason = {}));
var DesiredOutcome;
(function (DesiredOutcome) {
    DesiredOutcome["FULL_REFUND"] = "FULL_REFUND";
    DesiredOutcome["PARTIAL_REFUND"] = "PARTIAL_REFUND";
    DesiredOutcome["REDO_SERVICE"] = "REDO_SERVICE";
})(DesiredOutcome || (exports.DesiredOutcome = DesiredOutcome = {}));
var CreateDisputeDto = function () {
    var _a;
    var _payment_id_decorators;
    var _payment_id_initializers = [];
    var _payment_id_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _photo_urls_decorators;
    var _photo_urls_initializers = [];
    var _photo_urls_extraInitializers = [];
    var _desired_outcome_decorators;
    var _desired_outcome_initializers = [];
    var _desired_outcome_extraInitializers = [];
    var _suggested_amount_decorators;
    var _suggested_amount_initializers = [];
    var _suggested_amount_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDisputeDto() {
                this.payment_id = __runInitializers(this, _payment_id_initializers, void 0);
                this.reason = (__runInitializers(this, _payment_id_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.photo_urls = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _photo_urls_initializers, void 0));
                this.desired_outcome = (__runInitializers(this, _photo_urls_extraInitializers), __runInitializers(this, _desired_outcome_initializers, void 0));
                this.suggested_amount = (__runInitializers(this, _desired_outcome_extraInitializers), __runInitializers(this, _suggested_amount_initializers, void 0));
                __runInitializers(this, _suggested_amount_extraInitializers);
            }
            return CreateDisputeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _payment_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID' }), (0, class_validator_1.IsUUID)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ enum: DisputeReason }), (0, class_validator_1.IsEnum)(DisputeReason)];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _photo_urls_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _desired_outcome_decorators = [(0, swagger_1.ApiProperty)({ enum: DesiredOutcome }), (0, class_validator_1.IsEnum)(DesiredOutcome)];
            _suggested_amount_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _payment_id_decorators, { kind: "field", name: "payment_id", static: false, private: false, access: { has: function (obj) { return "payment_id" in obj; }, get: function (obj) { return obj.payment_id; }, set: function (obj, value) { obj.payment_id = value; } }, metadata: _metadata }, _payment_id_initializers, _payment_id_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _photo_urls_decorators, { kind: "field", name: "photo_urls", static: false, private: false, access: { has: function (obj) { return "photo_urls" in obj; }, get: function (obj) { return obj.photo_urls; }, set: function (obj, value) { obj.photo_urls = value; } }, metadata: _metadata }, _photo_urls_initializers, _photo_urls_extraInitializers);
            __esDecorate(null, null, _desired_outcome_decorators, { kind: "field", name: "desired_outcome", static: false, private: false, access: { has: function (obj) { return "desired_outcome" in obj; }, get: function (obj) { return obj.desired_outcome; }, set: function (obj, value) { obj.desired_outcome = value; } }, metadata: _metadata }, _desired_outcome_initializers, _desired_outcome_extraInitializers);
            __esDecorate(null, null, _suggested_amount_decorators, { kind: "field", name: "suggested_amount", static: false, private: false, access: { has: function (obj) { return "suggested_amount" in obj; }, get: function (obj) { return obj.suggested_amount; }, set: function (obj, value) { obj.suggested_amount = value; } }, metadata: _metadata }, _suggested_amount_initializers, _suggested_amount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDisputeDto = CreateDisputeDto;
