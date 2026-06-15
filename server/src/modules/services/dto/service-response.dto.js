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
exports.BulkAssignResponseDto = exports.AvailableServiceDto = exports.AssignedBusinessServiceResponseDto = exports.ServiceCatalogResponseDto = exports.CategoryResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var CategoryResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CategoryResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.created_at = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return CategoryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CategoryResponseDto = CategoryResponseDto;
// Admin view - service catalog (no price/duration)
var ServiceCatalogResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ServiceCatalogResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.category_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.category_name = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.title = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.created_at = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return ServiceCatalogResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _category_id_decorators = [(0, swagger_1.ApiProperty)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ServiceCatalogResponseDto = ServiceCatalogResponseDto;
// Manager view - assigned service with price
var AssignedBusinessServiceResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _service_title_decorators;
    var _service_title_initializers = [];
    var _service_title_extraInitializers = [];
    var _service_description_decorators;
    var _service_description_initializers = [];
    var _service_description_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _average_duration_decorators;
    var _average_duration_initializers = [];
    var _average_duration_extraInitializers = [];
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignedBusinessServiceResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_id_initializers, void 0));
                this.business_name = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.service_id = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _service_id_initializers, void 0));
                this.service_title = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _service_title_initializers, void 0));
                this.service_description = (__runInitializers(this, _service_title_extraInitializers), __runInitializers(this, _service_description_initializers, void 0));
                this.category_id = (__runInitializers(this, _service_description_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.category_name = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.price = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.average_duration = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _average_duration_initializers, void 0));
                this.is_active = (__runInitializers(this, _average_duration_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                this.created_at = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return AssignedBusinessServiceResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _service_title_decorators = [(0, swagger_1.ApiProperty)()];
            _service_description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _category_id_decorators = [(0, swagger_1.ApiProperty)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _price_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price set by manager (in EGP)' })];
            _average_duration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration set by manager (in minutes)' })];
            _is_active_decorators = [(0, swagger_1.ApiProperty)()];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _service_title_decorators, { kind: "field", name: "service_title", static: false, private: false, access: { has: function (obj) { return "service_title" in obj; }, get: function (obj) { return obj.service_title; }, set: function (obj, value) { obj.service_title = value; } }, metadata: _metadata }, _service_title_initializers, _service_title_extraInitializers);
            __esDecorate(null, null, _service_description_decorators, { kind: "field", name: "service_description", static: false, private: false, access: { has: function (obj) { return "service_description" in obj; }, get: function (obj) { return obj.service_description; }, set: function (obj, value) { obj.service_description = value; } }, metadata: _metadata }, _service_description_initializers, _service_description_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _average_duration_decorators, { kind: "field", name: "average_duration", static: false, private: false, access: { has: function (obj) { return "average_duration" in obj; }, get: function (obj) { return obj.average_duration; }, set: function (obj, value) { obj.average_duration = value; } }, metadata: _metadata }, _average_duration_initializers, _average_duration_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AssignedBusinessServiceResponseDto = AssignedBusinessServiceResponseDto;
// For clients viewing available services
var AvailableServiceDto = function () {
    var _a;
    var _business_service_id_decorators;
    var _business_service_id_initializers = [];
    var _business_service_id_extraInitializers = [];
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _duration_minutes_decorators;
    var _duration_minutes_initializers = [];
    var _duration_minutes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AvailableServiceDto() {
                this.business_service_id = __runInitializers(this, _business_service_id_initializers, void 0);
                this.service_id = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _service_id_initializers, void 0));
                this.title = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category_name = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.price = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                __runInitializers(this, _duration_minutes_extraInitializers);
            }
            return AvailableServiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            _duration_minutes_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AvailableServiceDto = AvailableServiceDto;
var BulkAssignResponseDto = function () {
    var _a;
    var _success_decorators;
    var _success_initializers = [];
    var _success_extraInitializers = [];
    var _assigned_count_decorators;
    var _assigned_count_initializers = [];
    var _assigned_count_extraInitializers = [];
    var _skipped_count_decorators;
    var _skipped_count_initializers = [];
    var _skipped_count_extraInitializers = [];
    var _assigned_services_decorators;
    var _assigned_services_initializers = [];
    var _assigned_services_extraInitializers = [];
    var _skipped_services_decorators;
    var _skipped_services_initializers = [];
    var _skipped_services_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkAssignResponseDto() {
                this.success = __runInitializers(this, _success_initializers, void 0);
                this.assigned_count = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _assigned_count_initializers, void 0));
                this.skipped_count = (__runInitializers(this, _assigned_count_extraInitializers), __runInitializers(this, _skipped_count_initializers, void 0));
                this.assigned_services = (__runInitializers(this, _skipped_count_extraInitializers), __runInitializers(this, _assigned_services_initializers, void 0));
                this.skipped_services = (__runInitializers(this, _assigned_services_extraInitializers), __runInitializers(this, _skipped_services_initializers, void 0));
                __runInitializers(this, _skipped_services_extraInitializers);
            }
            return BulkAssignResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _success_decorators = [(0, swagger_1.ApiProperty)()];
            _assigned_count_decorators = [(0, swagger_1.ApiProperty)()];
            _skipped_count_decorators = [(0, swagger_1.ApiProperty)()];
            _assigned_services_decorators = [(0, swagger_1.ApiProperty)({ type: [AssignedBusinessServiceResponseDto] })];
            _skipped_services_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: function (obj) { return "success" in obj; }, get: function (obj) { return obj.success; }, set: function (obj, value) { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _assigned_count_decorators, { kind: "field", name: "assigned_count", static: false, private: false, access: { has: function (obj) { return "assigned_count" in obj; }, get: function (obj) { return obj.assigned_count; }, set: function (obj, value) { obj.assigned_count = value; } }, metadata: _metadata }, _assigned_count_initializers, _assigned_count_extraInitializers);
            __esDecorate(null, null, _skipped_count_decorators, { kind: "field", name: "skipped_count", static: false, private: false, access: { has: function (obj) { return "skipped_count" in obj; }, get: function (obj) { return obj.skipped_count; }, set: function (obj, value) { obj.skipped_count = value; } }, metadata: _metadata }, _skipped_count_initializers, _skipped_count_extraInitializers);
            __esDecorate(null, null, _assigned_services_decorators, { kind: "field", name: "assigned_services", static: false, private: false, access: { has: function (obj) { return "assigned_services" in obj; }, get: function (obj) { return obj.assigned_services; }, set: function (obj, value) { obj.assigned_services = value; } }, metadata: _metadata }, _assigned_services_initializers, _assigned_services_extraInitializers);
            __esDecorate(null, null, _skipped_services_decorators, { kind: "field", name: "skipped_services", static: false, private: false, access: { has: function (obj) { return "skipped_services" in obj; }, get: function (obj) { return obj.skipped_services; }, set: function (obj, value) { obj.skipped_services = value; } }, metadata: _metadata }, _skipped_services_initializers, _skipped_services_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkAssignResponseDto = BulkAssignResponseDto;
