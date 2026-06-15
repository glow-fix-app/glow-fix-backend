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
exports.BusinessCategoriesResponseDto = exports.CategoryWithServicesDto = exports.ServiceDto = void 0;
// modules/categories/dto/category-response.dto.ts
var swagger_1 = require("@nestjs/swagger");
var ServiceDto = function () {
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
    var _is_active_decorators;
    var _is_active_initializers = [];
    var _is_active_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ServiceDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_service_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_service_id_initializers, void 0));
                this.title = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.price = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                this.is_active = (__runInitializers(this, _duration_minutes_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
                __runInitializers(this, _is_active_extraInitializers);
            }
            return ServiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            _duration_minutes_decorators = [(0, swagger_1.ApiProperty)()];
            _is_active_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: function (obj) { return "is_active" in obj; }, get: function (obj) { return obj.is_active; }, set: function (obj, value) { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ServiceDto = ServiceDto;
var CategoryWithServicesDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _services_decorators;
    var _services_initializers = [];
    var _services_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CategoryWithServicesDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.services = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _services_initializers, void 0));
                __runInitializers(this, _services_extraInitializers);
            }
            return CategoryWithServicesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _services_decorators = [(0, swagger_1.ApiProperty)({ type: [ServiceDto] })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _services_decorators, { kind: "field", name: "services", static: false, private: false, access: { has: function (obj) { return "services" in obj; }, get: function (obj) { return obj.services; }, set: function (obj, value) { obj.services = value; } }, metadata: _metadata }, _services_initializers, _services_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CategoryWithServicesDto = CategoryWithServicesDto;
var BusinessCategoriesResponseDto = function () {
    var _a;
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessCategoriesResponseDto() {
                this.business_id = __runInitializers(this, _business_id_initializers, void 0);
                this.business_name = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.categories = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
                __runInitializers(this, _categories_extraInitializers);
            }
            return BusinessCategoriesResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _categories_decorators = [(0, swagger_1.ApiProperty)({ type: [CategoryWithServicesDto] })];
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessCategoriesResponseDto = BusinessCategoriesResponseDto;
