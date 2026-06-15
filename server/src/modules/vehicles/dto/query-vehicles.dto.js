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
exports.QueryVehiclesDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var QueryVehiclesDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _sort_by_decorators;
    var _sort_by_initializers = [];
    var _sort_by_extraInitializers = [];
    var _sort_order_decorators;
    var _sort_order_initializers = [];
    var _sort_order_extraInitializers = [];
    var _include_deleted_decorators;
    var _include_deleted_initializers = [];
    var _include_deleted_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QueryVehiclesDto() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.search = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.year = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.sort_by = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _sort_by_initializers, 'created_at'));
                this.sort_order = (__runInitializers(this, _sort_by_extraInitializers), __runInitializers(this, _sort_order_initializers, 'desc'));
                this.include_deleted = (__runInitializers(this, _sort_order_extraInitializers), __runInitializers(this, _include_deleted_initializers, void 0));
                __runInitializers(this, _include_deleted_extraInitializers);
            }
            return QueryVehiclesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number (1-based)', example: 1 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Items per page (max 50)', example: 20 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50)];
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search by license plate or model' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by year' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1900)];
            _color_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by color' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sort_by_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sort by field', example: 'created_at' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sort_order_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Sort order', example: 'desc' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _include_deleted_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include deleted vehicles (admin only)' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true';
                }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _sort_by_decorators, { kind: "field", name: "sort_by", static: false, private: false, access: { has: function (obj) { return "sort_by" in obj; }, get: function (obj) { return obj.sort_by; }, set: function (obj, value) { obj.sort_by = value; } }, metadata: _metadata }, _sort_by_initializers, _sort_by_extraInitializers);
            __esDecorate(null, null, _sort_order_decorators, { kind: "field", name: "sort_order", static: false, private: false, access: { has: function (obj) { return "sort_order" in obj; }, get: function (obj) { return obj.sort_order; }, set: function (obj, value) { obj.sort_order = value; } }, metadata: _metadata }, _sort_order_initializers, _sort_order_extraInitializers);
            __esDecorate(null, null, _include_deleted_decorators, { kind: "field", name: "include_deleted", static: false, private: false, access: { has: function (obj) { return "include_deleted" in obj; }, get: function (obj) { return obj.include_deleted; }, set: function (obj, value) { obj.include_deleted = value; } }, metadata: _metadata }, _include_deleted_initializers, _include_deleted_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QueryVehiclesDto = QueryVehiclesDto;
