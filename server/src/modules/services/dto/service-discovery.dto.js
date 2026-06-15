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
exports.SearchMetaDto = exports.PopularServiceDto = exports.SearchSuggestionsDto = exports.ServiceDiscoveryResponseDto = exports.ServiceOfferDto = exports.FilterCategoriesResponseDto = exports.FilterOptionDto = exports.SearchServicesDto = exports.FilterOptionsDto = exports.SortBy = void 0;
// modules/services/dto/service-discovery.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SortBy;
(function (SortBy) {
    SortBy["PRICE_ASC"] = "price_asc";
    SortBy["PRICE_DESC"] = "price_desc";
    SortBy["DISTANCE_ASC"] = "distance_asc";
    SortBy["RATING_DESC"] = "rating_desc";
    SortBy["POPULARITY"] = "popularity";
})(SortBy || (exports.SortBy = SortBy = {}));
var FilterOptionsDto = function () {
    var _a;
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    var _locations_decorators;
    var _locations_initializers = [];
    var _locations_extraInitializers = [];
    var _min_price_decorators;
    var _min_price_initializers = [];
    var _min_price_extraInitializers = [];
    var _max_price_decorators;
    var _max_price_initializers = [];
    var _max_price_extraInitializers = [];
    var _min_rating_decorators;
    var _min_rating_initializers = [];
    var _min_rating_extraInitializers = [];
    var _open_now_decorators;
    var _open_now_initializers = [];
    var _open_now_extraInitializers = [];
    var _verified_only_decorators;
    var _verified_only_initializers = [];
    var _verified_only_extraInitializers = [];
    var _radius_decorators;
    var _radius_initializers = [];
    var _radius_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FilterOptionsDto() {
                this.categories = __runInitializers(this, _categories_initializers, void 0);
                this.locations = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _locations_initializers, void 0));
                this.min_price = (__runInitializers(this, _locations_extraInitializers), __runInitializers(this, _min_price_initializers, void 0));
                this.max_price = (__runInitializers(this, _min_price_extraInitializers), __runInitializers(this, _max_price_initializers, void 0));
                this.min_rating = (__runInitializers(this, _max_price_extraInitializers), __runInitializers(this, _min_rating_initializers, void 0));
                this.open_now = (__runInitializers(this, _min_rating_extraInitializers), __runInitializers(this, _open_now_initializers, void 0));
                this.verified_only = (__runInitializers(this, _open_now_extraInitializers), __runInitializers(this, _verified_only_initializers, void 0));
                this.radius = (__runInitializers(this, _verified_only_extraInitializers), __runInitializers(this, _radius_initializers, void 0));
                __runInitializers(this, _radius_extraInitializers);
            }
            return FilterOptionsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _categories_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Service categories', type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _locations_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Locations', type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _min_price_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum price', example: 50 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_transformer_1.Type)(function () { return Number; })];
            _max_price_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum price', example: 500 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_transformer_1.Type)(function () { return Number; })];
            _min_rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum rating', example: 4 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(5), (0, class_transformer_1.Type)(function () { return Number; })];
            _open_now_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Only show open now' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true' || value === true;
                }), (0, class_validator_1.IsBoolean)()];
            _verified_only_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Only verified providers' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true' || value === true;
                }), (0, class_validator_1.IsBoolean)()];
            _radius_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Radius in km', example: 10 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            __esDecorate(null, null, _locations_decorators, { kind: "field", name: "locations", static: false, private: false, access: { has: function (obj) { return "locations" in obj; }, get: function (obj) { return obj.locations; }, set: function (obj, value) { obj.locations = value; } }, metadata: _metadata }, _locations_initializers, _locations_extraInitializers);
            __esDecorate(null, null, _min_price_decorators, { kind: "field", name: "min_price", static: false, private: false, access: { has: function (obj) { return "min_price" in obj; }, get: function (obj) { return obj.min_price; }, set: function (obj, value) { obj.min_price = value; } }, metadata: _metadata }, _min_price_initializers, _min_price_extraInitializers);
            __esDecorate(null, null, _max_price_decorators, { kind: "field", name: "max_price", static: false, private: false, access: { has: function (obj) { return "max_price" in obj; }, get: function (obj) { return obj.max_price; }, set: function (obj, value) { obj.max_price = value; } }, metadata: _metadata }, _max_price_initializers, _max_price_extraInitializers);
            __esDecorate(null, null, _min_rating_decorators, { kind: "field", name: "min_rating", static: false, private: false, access: { has: function (obj) { return "min_rating" in obj; }, get: function (obj) { return obj.min_rating; }, set: function (obj, value) { obj.min_rating = value; } }, metadata: _metadata }, _min_rating_initializers, _min_rating_extraInitializers);
            __esDecorate(null, null, _open_now_decorators, { kind: "field", name: "open_now", static: false, private: false, access: { has: function (obj) { return "open_now" in obj; }, get: function (obj) { return obj.open_now; }, set: function (obj, value) { obj.open_now = value; } }, metadata: _metadata }, _open_now_initializers, _open_now_extraInitializers);
            __esDecorate(null, null, _verified_only_decorators, { kind: "field", name: "verified_only", static: false, private: false, access: { has: function (obj) { return "verified_only" in obj; }, get: function (obj) { return obj.verified_only; }, set: function (obj, value) { obj.verified_only = value; } }, metadata: _metadata }, _verified_only_initializers, _verified_only_extraInitializers);
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: function (obj) { return "radius" in obj; }, get: function (obj) { return obj.radius; }, set: function (obj, value) { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FilterOptionsDto = FilterOptionsDto;
var SearchServicesDto = function () {
    var _a;
    var _query_decorators;
    var _query_initializers = [];
    var _query_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _filters_decorators;
    var _filters_initializers = [];
    var _filters_extraInitializers = [];
    var _sort_by_decorators;
    var _sort_by_initializers = [];
    var _sort_by_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchServicesDto() {
                this.query = __runInitializers(this, _query_initializers, void 0);
                this.category = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.latitude = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.filters = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                this.sort_by = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _sort_by_initializers, SortBy.PRICE_ASC));
                this.page = (__runInitializers(this, _sort_by_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                __runInitializers(this, _limit_extraInitializers);
            }
            return SearchServicesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query (service name)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Category filter' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Location latitude' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Location longitude' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter options' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return FilterOptionsDto; })];
            _sort_by_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: SortBy, default: SortBy.PRICE_ASC }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(SortBy)];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 1 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(function () { return Number; })];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: 20, maximum: 50 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: function (obj) { return "query" in obj; }, get: function (obj) { return obj.query; }, set: function (obj, value) { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: function (obj) { return "filters" in obj; }, get: function (obj) { return obj.filters; }, set: function (obj, value) { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            __esDecorate(null, null, _sort_by_decorators, { kind: "field", name: "sort_by", static: false, private: false, access: { has: function (obj) { return "sort_by" in obj; }, get: function (obj) { return obj.sort_by; }, set: function (obj, value) { obj.sort_by = value; } }, metadata: _metadata }, _sort_by_initializers, _sort_by_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchServicesDto = SearchServicesDto;
var FilterOptionDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _count_decorators;
    var _count_initializers = [];
    var _count_extraInitializers = [];
    var _selected_decorators;
    var _selected_initializers = [];
    var _selected_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FilterOptionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.count = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.selected = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                __runInitializers(this, _selected_extraInitializers);
            }
            return FilterOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _count_decorators = [(0, swagger_1.ApiProperty)()];
            _selected_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: function (obj) { return "selected" in obj; }, get: function (obj) { return obj.selected; }, set: function (obj, value) { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FilterOptionDto = FilterOptionDto;
var FilterCategoriesResponseDto = function () {
    var _a;
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    var _locations_decorators;
    var _locations_initializers = [];
    var _locations_extraInitializers = [];
    var _price_ranges_decorators;
    var _price_ranges_initializers = [];
    var _price_ranges_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FilterCategoriesResponseDto() {
                this.categories = __runInitializers(this, _categories_initializers, void 0);
                this.locations = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _locations_initializers, void 0));
                this.price_ranges = (__runInitializers(this, _locations_extraInitializers), __runInitializers(this, _price_ranges_initializers, void 0));
                __runInitializers(this, _price_ranges_extraInitializers);
            }
            return FilterCategoriesResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _categories_decorators = [(0, swagger_1.ApiProperty)({ type: [FilterOptionDto] })];
            _locations_decorators = [(0, swagger_1.ApiProperty)({ type: [FilterOptionDto] })];
            _price_ranges_decorators = [(0, swagger_1.ApiProperty)({ type: [FilterOptionDto] })];
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            __esDecorate(null, null, _locations_decorators, { kind: "field", name: "locations", static: false, private: false, access: { has: function (obj) { return "locations" in obj; }, get: function (obj) { return obj.locations; }, set: function (obj, value) { obj.locations = value; } }, metadata: _metadata }, _locations_initializers, _locations_extraInitializers);
            __esDecorate(null, null, _price_ranges_decorators, { kind: "field", name: "price_ranges", static: false, private: false, access: { has: function (obj) { return "price_ranges" in obj; }, get: function (obj) { return obj.price_ranges; }, set: function (obj, value) { obj.price_ranges = value; } }, metadata: _metadata }, _price_ranges_initializers, _price_ranges_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FilterCategoriesResponseDto = FilterCategoriesResponseDto;
var ServiceOfferDto = function () {
    var _a;
    var _business_service_id_decorators;
    var _business_service_id_initializers = [];
    var _business_service_id_extraInitializers = [];
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _business_address_decorators;
    var _business_address_initializers = [];
    var _business_address_extraInitializers = [];
    var _business_phone_decorators;
    var _business_phone_initializers = [];
    var _business_phone_extraInitializers = [];
    var _distance_km_decorators;
    var _distance_km_initializers = [];
    var _distance_km_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _duration_minutes_decorators;
    var _duration_minutes_initializers = [];
    var _duration_minutes_extraInitializers = [];
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    var _total_reviews_decorators;
    var _total_reviews_initializers = [];
    var _total_reviews_extraInitializers = [];
    var _is_open_decorators;
    var _is_open_initializers = [];
    var _is_open_extraInitializers = [];
    var _is_verified_decorators;
    var _is_verified_initializers = [];
    var _is_verified_extraInitializers = [];
    var _business_logo_decorators;
    var _business_logo_initializers = [];
    var _business_logo_extraInitializers = [];
    var _operating_hours_today_decorators;
    var _operating_hours_today_initializers = [];
    var _operating_hours_today_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ServiceOfferDto() {
                this.business_service_id = __runInitializers(this, _business_service_id_initializers, void 0);
                this.business_id = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _business_id_initializers, void 0));
                this.business_name = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.business_address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _business_address_initializers, void 0));
                this.business_phone = (__runInitializers(this, _business_address_extraInitializers), __runInitializers(this, _business_phone_initializers, void 0));
                this.distance_km = (__runInitializers(this, _business_phone_extraInitializers), __runInitializers(this, _distance_km_initializers, void 0));
                this.price = (__runInitializers(this, _distance_km_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                this.average_rating = (__runInitializers(this, _duration_minutes_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.is_open = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _is_open_initializers, void 0));
                this.is_verified = (__runInitializers(this, _is_open_extraInitializers), __runInitializers(this, _is_verified_initializers, void 0));
                this.business_logo = (__runInitializers(this, _is_verified_extraInitializers), __runInitializers(this, _business_logo_initializers, void 0));
                this.operating_hours_today = (__runInitializers(this, _business_logo_extraInitializers), __runInitializers(this, _operating_hours_today_initializers, void 0));
                __runInitializers(this, _operating_hours_today_extraInitializers);
            }
            return ServiceOfferDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _business_address_decorators = [(0, swagger_1.ApiProperty)()];
            _business_phone_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _distance_km_decorators = [(0, swagger_1.ApiProperty)()];
            _price_decorators = [(0, swagger_1.ApiProperty)()];
            _duration_minutes_decorators = [(0, swagger_1.ApiProperty)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _is_open_decorators = [(0, swagger_1.ApiProperty)()];
            _is_verified_decorators = [(0, swagger_1.ApiProperty)()];
            _business_logo_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _operating_hours_today_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _business_address_decorators, { kind: "field", name: "business_address", static: false, private: false, access: { has: function (obj) { return "business_address" in obj; }, get: function (obj) { return obj.business_address; }, set: function (obj, value) { obj.business_address = value; } }, metadata: _metadata }, _business_address_initializers, _business_address_extraInitializers);
            __esDecorate(null, null, _business_phone_decorators, { kind: "field", name: "business_phone", static: false, private: false, access: { has: function (obj) { return "business_phone" in obj; }, get: function (obj) { return obj.business_phone; }, set: function (obj, value) { obj.business_phone = value; } }, metadata: _metadata }, _business_phone_initializers, _business_phone_extraInitializers);
            __esDecorate(null, null, _distance_km_decorators, { kind: "field", name: "distance_km", static: false, private: false, access: { has: function (obj) { return "distance_km" in obj; }, get: function (obj) { return obj.distance_km; }, set: function (obj, value) { obj.distance_km = value; } }, metadata: _metadata }, _distance_km_initializers, _distance_km_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _is_open_decorators, { kind: "field", name: "is_open", static: false, private: false, access: { has: function (obj) { return "is_open" in obj; }, get: function (obj) { return obj.is_open; }, set: function (obj, value) { obj.is_open = value; } }, metadata: _metadata }, _is_open_initializers, _is_open_extraInitializers);
            __esDecorate(null, null, _is_verified_decorators, { kind: "field", name: "is_verified", static: false, private: false, access: { has: function (obj) { return "is_verified" in obj; }, get: function (obj) { return obj.is_verified; }, set: function (obj, value) { obj.is_verified = value; } }, metadata: _metadata }, _is_verified_initializers, _is_verified_extraInitializers);
            __esDecorate(null, null, _business_logo_decorators, { kind: "field", name: "business_logo", static: false, private: false, access: { has: function (obj) { return "business_logo" in obj; }, get: function (obj) { return obj.business_logo; }, set: function (obj, value) { obj.business_logo = value; } }, metadata: _metadata }, _business_logo_initializers, _business_logo_extraInitializers);
            __esDecorate(null, null, _operating_hours_today_decorators, { kind: "field", name: "operating_hours_today", static: false, private: false, access: { has: function (obj) { return "operating_hours_today" in obj; }, get: function (obj) { return obj.operating_hours_today; }, set: function (obj, value) { obj.operating_hours_today = value; } }, metadata: _metadata }, _operating_hours_today_initializers, _operating_hours_today_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ServiceOfferDto = ServiceOfferDto;
var ServiceDiscoveryResponseDto = function () {
    var _a;
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _service_name_decorators;
    var _service_name_initializers = [];
    var _service_name_extraInitializers = [];
    var _service_description_decorators;
    var _service_description_initializers = [];
    var _service_description_extraInitializers = [];
    var _category_id_decorators;
    var _category_id_initializers = [];
    var _category_id_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _total_offers_decorators;
    var _total_offers_initializers = [];
    var _total_offers_extraInitializers = [];
    var _provider_count_decorators;
    var _provider_count_initializers = [];
    var _provider_count_extraInitializers = [];
    var _from_price_decorators;
    var _from_price_initializers = [];
    var _from_price_extraInitializers = [];
    var _price_range_decorators;
    var _price_range_initializers = [];
    var _price_range_extraInitializers = [];
    var _offers_decorators;
    var _offers_initializers = [];
    var _offers_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ServiceDiscoveryResponseDto() {
                this.service_id = __runInitializers(this, _service_id_initializers, void 0);
                this.service_name = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _service_name_initializers, void 0));
                this.service_description = (__runInitializers(this, _service_name_extraInitializers), __runInitializers(this, _service_description_initializers, void 0));
                this.category_id = (__runInitializers(this, _service_description_extraInitializers), __runInitializers(this, _category_id_initializers, void 0));
                this.category_name = (__runInitializers(this, _category_id_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.total_offers = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _total_offers_initializers, void 0));
                this.provider_count = (__runInitializers(this, _total_offers_extraInitializers), __runInitializers(this, _provider_count_initializers, void 0));
                this.from_price = (__runInitializers(this, _provider_count_extraInitializers), __runInitializers(this, _from_price_initializers, void 0));
                this.price_range = (__runInitializers(this, _from_price_extraInitializers), __runInitializers(this, _price_range_initializers, void 0));
                this.offers = (__runInitializers(this, _price_range_extraInitializers), __runInitializers(this, _offers_initializers, void 0));
                __runInitializers(this, _offers_extraInitializers);
            }
            return ServiceDiscoveryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _service_name_decorators = [(0, swagger_1.ApiProperty)()];
            _service_description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _category_id_decorators = [(0, swagger_1.ApiProperty)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _total_offers_decorators = [(0, swagger_1.ApiProperty)()];
            _provider_count_decorators = [(0, swagger_1.ApiProperty)()];
            _from_price_decorators = [(0, swagger_1.ApiProperty)()];
            _price_range_decorators = [(0, swagger_1.ApiProperty)()];
            _offers_decorators = [(0, swagger_1.ApiProperty)({ type: [ServiceOfferDto] })];
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _service_name_decorators, { kind: "field", name: "service_name", static: false, private: false, access: { has: function (obj) { return "service_name" in obj; }, get: function (obj) { return obj.service_name; }, set: function (obj, value) { obj.service_name = value; } }, metadata: _metadata }, _service_name_initializers, _service_name_extraInitializers);
            __esDecorate(null, null, _service_description_decorators, { kind: "field", name: "service_description", static: false, private: false, access: { has: function (obj) { return "service_description" in obj; }, get: function (obj) { return obj.service_description; }, set: function (obj, value) { obj.service_description = value; } }, metadata: _metadata }, _service_description_initializers, _service_description_extraInitializers);
            __esDecorate(null, null, _category_id_decorators, { kind: "field", name: "category_id", static: false, private: false, access: { has: function (obj) { return "category_id" in obj; }, get: function (obj) { return obj.category_id; }, set: function (obj, value) { obj.category_id = value; } }, metadata: _metadata }, _category_id_initializers, _category_id_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _total_offers_decorators, { kind: "field", name: "total_offers", static: false, private: false, access: { has: function (obj) { return "total_offers" in obj; }, get: function (obj) { return obj.total_offers; }, set: function (obj, value) { obj.total_offers = value; } }, metadata: _metadata }, _total_offers_initializers, _total_offers_extraInitializers);
            __esDecorate(null, null, _provider_count_decorators, { kind: "field", name: "provider_count", static: false, private: false, access: { has: function (obj) { return "provider_count" in obj; }, get: function (obj) { return obj.provider_count; }, set: function (obj, value) { obj.provider_count = value; } }, metadata: _metadata }, _provider_count_initializers, _provider_count_extraInitializers);
            __esDecorate(null, null, _from_price_decorators, { kind: "field", name: "from_price", static: false, private: false, access: { has: function (obj) { return "from_price" in obj; }, get: function (obj) { return obj.from_price; }, set: function (obj, value) { obj.from_price = value; } }, metadata: _metadata }, _from_price_initializers, _from_price_extraInitializers);
            __esDecorate(null, null, _price_range_decorators, { kind: "field", name: "price_range", static: false, private: false, access: { has: function (obj) { return "price_range" in obj; }, get: function (obj) { return obj.price_range; }, set: function (obj, value) { obj.price_range = value; } }, metadata: _metadata }, _price_range_initializers, _price_range_extraInitializers);
            __esDecorate(null, null, _offers_decorators, { kind: "field", name: "offers", static: false, private: false, access: { has: function (obj) { return "offers" in obj; }, get: function (obj) { return obj.offers; }, set: function (obj, value) { obj.offers = value; } }, metadata: _metadata }, _offers_initializers, _offers_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ServiceDiscoveryResponseDto = ServiceDiscoveryResponseDto;
var SearchSuggestionsDto = function () {
    var _a;
    var _query_decorators;
    var _query_initializers = [];
    var _query_extraInitializers = [];
    var _service_suggestions_decorators;
    var _service_suggestions_initializers = [];
    var _service_suggestions_extraInitializers = [];
    var _category_suggestions_decorators;
    var _category_suggestions_initializers = [];
    var _category_suggestions_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchSuggestionsDto() {
                this.query = __runInitializers(this, _query_initializers, void 0);
                this.service_suggestions = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _service_suggestions_initializers, void 0));
                this.category_suggestions = (__runInitializers(this, _service_suggestions_extraInitializers), __runInitializers(this, _category_suggestions_initializers, void 0));
                __runInitializers(this, _category_suggestions_extraInitializers);
            }
            return SearchSuggestionsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiProperty)()];
            _service_suggestions_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            _category_suggestions_decorators = [(0, swagger_1.ApiProperty)({ type: [String] })];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: function (obj) { return "query" in obj; }, get: function (obj) { return obj.query; }, set: function (obj, value) { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _service_suggestions_decorators, { kind: "field", name: "service_suggestions", static: false, private: false, access: { has: function (obj) { return "service_suggestions" in obj; }, get: function (obj) { return obj.service_suggestions; }, set: function (obj, value) { obj.service_suggestions = value; } }, metadata: _metadata }, _service_suggestions_initializers, _service_suggestions_extraInitializers);
            __esDecorate(null, null, _category_suggestions_decorators, { kind: "field", name: "category_suggestions", static: false, private: false, access: { has: function (obj) { return "category_suggestions" in obj; }, get: function (obj) { return obj.category_suggestions; }, set: function (obj, value) { obj.category_suggestions = value; } }, metadata: _metadata }, _category_suggestions_initializers, _category_suggestions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchSuggestionsDto = SearchSuggestionsDto;
var PopularServiceDto = function () {
    var _a;
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _service_name_decorators;
    var _service_name_initializers = [];
    var _service_name_extraInitializers = [];
    var _category_name_decorators;
    var _category_name_initializers = [];
    var _category_name_extraInitializers = [];
    var _provider_count_decorators;
    var _provider_count_initializers = [];
    var _provider_count_extraInitializers = [];
    var _min_price_decorators;
    var _min_price_initializers = [];
    var _min_price_extraInitializers = [];
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PopularServiceDto() {
                this.service_id = __runInitializers(this, _service_id_initializers, void 0);
                this.service_name = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _service_name_initializers, void 0));
                this.category_name = (__runInitializers(this, _service_name_extraInitializers), __runInitializers(this, _category_name_initializers, void 0));
                this.provider_count = (__runInitializers(this, _category_name_extraInitializers), __runInitializers(this, _provider_count_initializers, void 0));
                this.min_price = (__runInitializers(this, _provider_count_extraInitializers), __runInitializers(this, _min_price_initializers, void 0));
                this.average_rating = (__runInitializers(this, _min_price_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                __runInitializers(this, _average_rating_extraInitializers);
            }
            return PopularServiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_id_decorators = [(0, swagger_1.ApiProperty)()];
            _service_name_decorators = [(0, swagger_1.ApiProperty)()];
            _category_name_decorators = [(0, swagger_1.ApiProperty)()];
            _provider_count_decorators = [(0, swagger_1.ApiProperty)()];
            _min_price_decorators = [(0, swagger_1.ApiProperty)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _service_name_decorators, { kind: "field", name: "service_name", static: false, private: false, access: { has: function (obj) { return "service_name" in obj; }, get: function (obj) { return obj.service_name; }, set: function (obj, value) { obj.service_name = value; } }, metadata: _metadata }, _service_name_initializers, _service_name_extraInitializers);
            __esDecorate(null, null, _category_name_decorators, { kind: "field", name: "category_name", static: false, private: false, access: { has: function (obj) { return "category_name" in obj; }, get: function (obj) { return obj.category_name; }, set: function (obj, value) { obj.category_name = value; } }, metadata: _metadata }, _category_name_initializers, _category_name_extraInitializers);
            __esDecorate(null, null, _provider_count_decorators, { kind: "field", name: "provider_count", static: false, private: false, access: { has: function (obj) { return "provider_count" in obj; }, get: function (obj) { return obj.provider_count; }, set: function (obj, value) { obj.provider_count = value; } }, metadata: _metadata }, _provider_count_initializers, _provider_count_extraInitializers);
            __esDecorate(null, null, _min_price_decorators, { kind: "field", name: "min_price", static: false, private: false, access: { has: function (obj) { return "min_price" in obj; }, get: function (obj) { return obj.min_price; }, set: function (obj, value) { obj.min_price = value; } }, metadata: _metadata }, _min_price_initializers, _min_price_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PopularServiceDto = PopularServiceDto;
var SearchMetaDto = function () {
    var _a;
    var _total_services_decorators;
    var _total_services_initializers = [];
    var _total_services_extraInitializers = [];
    var _total_offers_decorators;
    var _total_offers_initializers = [];
    var _total_offers_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _total_pages_decorators;
    var _total_pages_initializers = [];
    var _total_pages_extraInitializers = [];
    var _location_used_decorators;
    var _location_used_initializers = [];
    var _location_used_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchMetaDto() {
                this.total_services = __runInitializers(this, _total_services_initializers, void 0);
                this.total_offers = (__runInitializers(this, _total_services_extraInitializers), __runInitializers(this, _total_offers_initializers, void 0));
                this.page = (__runInitializers(this, _total_offers_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.total_pages = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _total_pages_initializers, void 0));
                this.location_used = (__runInitializers(this, _total_pages_extraInitializers), __runInitializers(this, _location_used_initializers, void 0));
                this.latitude = (__runInitializers(this, _location_used_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return SearchMetaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_services_decorators = [(0, swagger_1.ApiProperty)()];
            _total_offers_decorators = [(0, swagger_1.ApiProperty)()];
            _page_decorators = [(0, swagger_1.ApiProperty)()];
            _limit_decorators = [(0, swagger_1.ApiProperty)()];
            _total_pages_decorators = [(0, swagger_1.ApiProperty)()];
            _location_used_decorators = [(0, swagger_1.ApiProperty)()];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            __esDecorate(null, null, _total_services_decorators, { kind: "field", name: "total_services", static: false, private: false, access: { has: function (obj) { return "total_services" in obj; }, get: function (obj) { return obj.total_services; }, set: function (obj, value) { obj.total_services = value; } }, metadata: _metadata }, _total_services_initializers, _total_services_extraInitializers);
            __esDecorate(null, null, _total_offers_decorators, { kind: "field", name: "total_offers", static: false, private: false, access: { has: function (obj) { return "total_offers" in obj; }, get: function (obj) { return obj.total_offers; }, set: function (obj, value) { obj.total_offers = value; } }, metadata: _metadata }, _total_offers_initializers, _total_offers_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _total_pages_decorators, { kind: "field", name: "total_pages", static: false, private: false, access: { has: function (obj) { return "total_pages" in obj; }, get: function (obj) { return obj.total_pages; }, set: function (obj, value) { obj.total_pages = value; } }, metadata: _metadata }, _total_pages_initializers, _total_pages_extraInitializers);
            __esDecorate(null, null, _location_used_decorators, { kind: "field", name: "location_used", static: false, private: false, access: { has: function (obj) { return "location_used" in obj; }, get: function (obj) { return obj.location_used; }, set: function (obj, value) { obj.location_used = value; } }, metadata: _metadata }, _location_used_initializers, _location_used_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchMetaDto = SearchMetaDto;
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsOptional, IsString, IsNumber, Min, Max, IsEnum } from 'class-validator';
// import { Type } from 'class-transformer';
// export enum SortBy {
//   PRICE_ASC = 'price_asc',
//   PRICE_DESC = 'price_desc',
//   DISTANCE_ASC = 'distance_asc',
//   RATING_DESC = 'rating_desc',
//   POPULARITY = 'popularity',
// }
// export class SearchServicesDto {
//   @ApiPropertyOptional({ description: 'Search query (service name)', example: 'Express Wash' })
//   @IsOptional()
//   @IsString()
//   query?: string;
//   @ApiPropertyOptional({ description: 'Category filter', example: 'Wash' })
//   @IsOptional()
//   @IsString()
//   category?: string;
//   @ApiPropertyOptional({ description: 'Location latitude', example: 30.0444 })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   latitude?: number;
//   @ApiPropertyOptional({ description: 'Location longitude', example: 31.2357 })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   longitude?: number;
//   @ApiPropertyOptional({ description: 'Search radius in km', example: 10, default: 20 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Max(100)
//   @Type(() => Number)
//   radius?: number = 20;
//   @ApiPropertyOptional({ description: 'Minimum price', example: 50 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   min_price?: number;
//   @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   max_price?: number;
//   @ApiPropertyOptional({ description: 'Minimum rating', example: 4, minimum: 0, maximum: 5 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   @Type(() => Number)
//   min_rating?: number;
//   @ApiPropertyOptional({ enum: SortBy, description: 'Sort by', default: SortBy.PRICE_ASC })
//   @IsOptional()
//   @IsEnum(SortBy)
//   sort_by?: SortBy = SortBy.PRICE_ASC;
//   @ApiPropertyOptional({ description: 'Page number', default: 1 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;
//   @ApiPropertyOptional({ description: 'Items per page', default: 20, maximum: 50 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Max(50)
//   @Type(() => Number)
//   limit?: number = 20;
// }
// export class ServiceOfferDto {
//   @ApiProperty()
//   business_service_id: string;
//   @ApiProperty()
//   business_id: string;
//   @ApiProperty()
//   business_name: string;
//   @ApiProperty()
//   business_address: string;
//   @ApiPropertyOptional()
//   business_phone?: string;
//   @ApiProperty()
//   distance_km: number;
//   @ApiProperty()
//   price: number;
//   @ApiProperty()
//   duration_minutes: number;
//   @ApiProperty()
//   average_rating: number;
//   @ApiProperty()
//   total_reviews: number;
//   @ApiProperty()
//   is_open: boolean;
//   @ApiPropertyOptional()
//   operating_hours_today?: string;
// }
// export class ServiceDiscoveryResponseDto {
//   @ApiProperty()
//   service_id: string;
//   @ApiProperty()
//   service_name: string;
//   @ApiPropertyOptional()
//   service_description?: string;
//   @ApiProperty()
//   category_id: string;
//   @ApiProperty()
//   category_name: string;
//   @ApiProperty()
//   total_offers: number;
//   @ApiProperty()
//   price_range: {
//     min: number;
//     max: number;
//   };
//   @ApiProperty({ type: [ServiceOfferDto] })
//   offers: ServiceOfferDto[];
// }
// export class SearchSuggestionsDto {
//   @ApiProperty()
//   query: string;
//   @ApiProperty({ type: [String] })
//   service_suggestions: string[];
//   @ApiProperty({ type: [String] })
//   category_suggestions: string[];
// }
// export class PopularServiceDto {
//   @ApiProperty()
//   service_id: string;
//   @ApiProperty()
//   service_name: string;
//   @ApiProperty()
//   category_name: string;
//   @ApiProperty()
//   provider_count: number;
//   @ApiProperty()
//   min_price: number;
//   @ApiProperty()
//   average_rating: number;
// }
