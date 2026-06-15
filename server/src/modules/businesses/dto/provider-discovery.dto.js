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
exports.ProviderDiscoveryResponseDto = exports.ProviderDiscoveryMetaDto = exports.ProviderFilterOptionsDto = exports.LocationFilterOptionDto = exports.DistanceRangeFilterOptionDto = exports.RatingRangeFilterOptionDto = exports.ServiceTypeFilterOptionDto = exports.ProviderResponseDto = exports.ProviderOfferDto = exports.SearchProvidersDto = exports.ProviderFiltersDto = exports.ServiceType = exports.ProviderSortBy = void 0;
// modules/businesses/dto/provider-discovery.dto.ts
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ProviderSortBy;
(function (ProviderSortBy) {
    ProviderSortBy["HIGHEST_RATED"] = "highest_rated";
    ProviderSortBy["NEAREST"] = "nearest";
    ProviderSortBy["MOST_REVIEWS"] = "most_reviews";
    ProviderSortBy["NEWEST"] = "newest";
    ProviderSortBy["OLDEST"] = "oldest";
})(ProviderSortBy || (exports.ProviderSortBy = ProviderSortBy = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["WASH"] = "Wash";
    ServiceType["REPAIR"] = "Repair";
    ServiceType["BOTH"] = "both";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
// ==================== REQUEST DTOS ====================
var ProviderFiltersDto = function () {
    var _a;
    var _service_decorators;
    var _service_initializers = [];
    var _service_extraInitializers = [];
    var _categories_decorators;
    var _categories_initializers = [];
    var _categories_extraInitializers = [];
    var _locations_decorators;
    var _locations_initializers = [];
    var _locations_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _max_distance_decorators;
    var _max_distance_initializers = [];
    var _max_distance_extraInitializers = [];
    var _min_rating_decorators;
    var _min_rating_initializers = [];
    var _min_rating_extraInitializers = [];
    var _open_now_decorators;
    var _open_now_initializers = [];
    var _open_now_extraInitializers = [];
    var _verified_only_decorators;
    var _verified_only_initializers = [];
    var _verified_only_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProviderFiltersDto() {
                this.service = __runInitializers(this, _service_initializers, void 0);
                this.categories = (__runInitializers(this, _service_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
                this.locations = (__runInitializers(this, _categories_extraInitializers), __runInitializers(this, _locations_initializers, void 0));
                this.city = (__runInitializers(this, _locations_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.max_distance = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _max_distance_initializers, void 0));
                this.min_rating = (__runInitializers(this, _max_distance_extraInitializers), __runInitializers(this, _min_rating_initializers, void 0));
                this.open_now = (__runInitializers(this, _min_rating_extraInitializers), __runInitializers(this, _open_now_initializers, void 0));
                this.verified_only = (__runInitializers(this, _open_now_extraInitializers), __runInitializers(this, _verified_only_initializers, void 0));
                __runInitializers(this, _verified_only_extraInitializers);
            }
            return ProviderFiltersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ServiceType, description: 'Service type filter', example: 'Wash' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ServiceType)];
            _categories_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Categories filter', type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _locations_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Location names', type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'City name filter (uses stored city column)', example: 'Zamalek' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _max_distance_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum distance in km', example: 50 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(500), (0, class_transformer_1.Type)(function () { return Number; })];
            _min_rating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum rating', example: 4, minimum: 0, maximum: 5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(5), (0, class_transformer_1.Type)(function () { return Number; })];
            _open_now_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Only show open now', example: true }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true' || value === true;
                }), (0, class_validator_1.IsBoolean)()];
            _verified_only_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Only show verified providers', example: true }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value === 'true' || value === true;
                }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _service_decorators, { kind: "field", name: "service", static: false, private: false, access: { has: function (obj) { return "service" in obj; }, get: function (obj) { return obj.service; }, set: function (obj, value) { obj.service = value; } }, metadata: _metadata }, _service_initializers, _service_extraInitializers);
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: function (obj) { return "categories" in obj; }, get: function (obj) { return obj.categories; }, set: function (obj, value) { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            __esDecorate(null, null, _locations_decorators, { kind: "field", name: "locations", static: false, private: false, access: { has: function (obj) { return "locations" in obj; }, get: function (obj) { return obj.locations; }, set: function (obj, value) { obj.locations = value; } }, metadata: _metadata }, _locations_initializers, _locations_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _max_distance_decorators, { kind: "field", name: "max_distance", static: false, private: false, access: { has: function (obj) { return "max_distance" in obj; }, get: function (obj) { return obj.max_distance; }, set: function (obj, value) { obj.max_distance = value; } }, metadata: _metadata }, _max_distance_initializers, _max_distance_extraInitializers);
            __esDecorate(null, null, _min_rating_decorators, { kind: "field", name: "min_rating", static: false, private: false, access: { has: function (obj) { return "min_rating" in obj; }, get: function (obj) { return obj.min_rating; }, set: function (obj, value) { obj.min_rating = value; } }, metadata: _metadata }, _min_rating_initializers, _min_rating_extraInitializers);
            __esDecorate(null, null, _open_now_decorators, { kind: "field", name: "open_now", static: false, private: false, access: { has: function (obj) { return "open_now" in obj; }, get: function (obj) { return obj.open_now; }, set: function (obj, value) { obj.open_now = value; } }, metadata: _metadata }, _open_now_initializers, _open_now_extraInitializers);
            __esDecorate(null, null, _verified_only_decorators, { kind: "field", name: "verified_only", static: false, private: false, access: { has: function (obj) { return "verified_only" in obj; }, get: function (obj) { return obj.verified_only; }, set: function (obj, value) { obj.verified_only = value; } }, metadata: _metadata }, _verified_only_initializers, _verified_only_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProviderFiltersDto = ProviderFiltersDto;
var SearchProvidersDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
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
            function SearchProvidersDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.latitude = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.filters = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                this.sort_by = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _sort_by_initializers, ProviderSortBy.HIGHEST_RATED));
                this.page = (__runInitializers(this, _sort_by_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                __runInitializers(this, _limit_extraInitializers);
            }
            return SearchProvidersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search by business name', example: 'GlowFix' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User latitude', example: 30.0444 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'User longitude', example: 31.2357 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter options', type: ProviderFiltersDto }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return ProviderFiltersDto; })];
            _sort_by_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ProviderSortBy, default: ProviderSortBy.HIGHEST_RATED, description: 'Sort by' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ProviderSortBy)];
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, example: 1 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(function () { return Number; })];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20, maximum: 50, example: 20 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
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
exports.SearchProvidersDto = SearchProvidersDto;
// ==================== RESPONSE DTOS ====================
var ProviderOfferDto = function () {
    var _a;
    var _business_service_id_decorators;
    var _business_service_id_initializers = [];
    var _business_service_id_extraInitializers = [];
    var _service_id_decorators;
    var _service_id_initializers = [];
    var _service_id_extraInitializers = [];
    var _service_name_decorators;
    var _service_name_initializers = [];
    var _service_name_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _duration_minutes_decorators;
    var _duration_minutes_initializers = [];
    var _duration_minutes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProviderOfferDto() {
                this.business_service_id = __runInitializers(this, _business_service_id_initializers, void 0);
                this.service_id = (__runInitializers(this, _business_service_id_extraInitializers), __runInitializers(this, _service_id_initializers, void 0));
                this.service_name = (__runInitializers(this, _service_id_extraInitializers), __runInitializers(this, _service_name_initializers, void 0));
                this.price = (__runInitializers(this, _service_name_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.duration_minutes = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
                __runInitializers(this, _duration_minutes_extraInitializers);
            }
            return ProviderOfferDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_service_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business service ID' })];
            _service_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service ID' })];
            _service_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service name', example: 'Express Wash' })];
            _price_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price in EGP', example: 120 })];
            _duration_minutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes', example: 30 })];
            __esDecorate(null, null, _business_service_id_decorators, { kind: "field", name: "business_service_id", static: false, private: false, access: { has: function (obj) { return "business_service_id" in obj; }, get: function (obj) { return obj.business_service_id; }, set: function (obj, value) { obj.business_service_id = value; } }, metadata: _metadata }, _business_service_id_initializers, _business_service_id_extraInitializers);
            __esDecorate(null, null, _service_id_decorators, { kind: "field", name: "service_id", static: false, private: false, access: { has: function (obj) { return "service_id" in obj; }, get: function (obj) { return obj.service_id; }, set: function (obj, value) { obj.service_id = value; } }, metadata: _metadata }, _service_id_initializers, _service_id_extraInitializers);
            __esDecorate(null, null, _service_name_decorators, { kind: "field", name: "service_name", static: false, private: false, access: { has: function (obj) { return "service_name" in obj; }, get: function (obj) { return obj.service_name; }, set: function (obj, value) { obj.service_name = value; } }, metadata: _metadata }, _service_name_initializers, _service_name_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: function (obj) { return "duration_minutes" in obj; }, get: function (obj) { return obj.duration_minutes; }, set: function (obj, value) { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProviderOfferDto = ProviderOfferDto;
var ProviderResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _logo_url_decorators;
    var _logo_url_initializers = [];
    var _logo_url_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _contact_phone_decorators;
    var _contact_phone_initializers = [];
    var _contact_phone_extraInitializers = [];
    var _contact_email_decorators;
    var _contact_email_initializers = [];
    var _contact_email_extraInitializers = [];
    var _distance_km_decorators;
    var _distance_km_initializers = [];
    var _distance_km_extraInitializers = [];
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
    var _service_type_decorators;
    var _service_type_initializers = [];
    var _service_type_extraInitializers = [];
    var _offers_decorators;
    var _offers_initializers = [];
    var _offers_extraInitializers = [];
    var _operating_hours_today_decorators;
    var _operating_hours_today_initializers = [];
    var _operating_hours_today_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProviderResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.logo_url = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _logo_url_initializers, void 0));
                this.city = (__runInitializers(this, _logo_url_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.contact_phone = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _contact_phone_initializers, void 0));
                this.contact_email = (__runInitializers(this, _contact_phone_extraInitializers), __runInitializers(this, _contact_email_initializers, void 0));
                this.distance_km = (__runInitializers(this, _contact_email_extraInitializers), __runInitializers(this, _distance_km_initializers, void 0));
                this.average_rating = (__runInitializers(this, _distance_km_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.is_open = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _is_open_initializers, void 0));
                this.is_verified = (__runInitializers(this, _is_open_extraInitializers), __runInitializers(this, _is_verified_initializers, void 0));
                this.service_type = (__runInitializers(this, _is_verified_extraInitializers), __runInitializers(this, _service_type_initializers, void 0));
                this.offers = (__runInitializers(this, _service_type_extraInitializers), __runInitializers(this, _offers_initializers, void 0));
                this.operating_hours_today = (__runInitializers(this, _offers_extraInitializers), __runInitializers(this, _operating_hours_today_initializers, void 0));
                this.latitude = (__runInitializers(this, _operating_hours_today_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.created_at = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                __runInitializers(this, _created_at_extraInitializers);
            }
            return ProviderResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business ID' })];
            _business_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business name', example: 'GlowFix Zamalek Detailing' })];
            _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business address', example: '22 26th of July St, Zamalek, Cairo' })];
            _logo_url_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Business logo URL' })];
            _city_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'City derived from lat/lng at registration', example: 'Zamalek' })];
            _contact_phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact phone', example: '+20123456789' })];
            _contact_email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contact email', example: 'contact@glowfix.com' })];
            _distance_km_decorators = [(0, swagger_1.ApiProperty)({ description: 'Distance from user in km', example: 10.5 })];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average rating', example: 4.7 })];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of reviews', example: 3 })];
            _is_open_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is business open now' })];
            _is_verified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is business verified' })];
            _service_type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['Wash', 'Repair', 'both'], description: 'Service type' })];
            _offers_decorators = [(0, swagger_1.ApiProperty)({ type: [ProviderOfferDto], description: 'Available services/offers' })];
            _operating_hours_today_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Operating hours for today', example: '09:00 - 22:00' })];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business latitude' })];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business longitude' })];
            _created_at_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created at timestamp' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _logo_url_decorators, { kind: "field", name: "logo_url", static: false, private: false, access: { has: function (obj) { return "logo_url" in obj; }, get: function (obj) { return obj.logo_url; }, set: function (obj, value) { obj.logo_url = value; } }, metadata: _metadata }, _logo_url_initializers, _logo_url_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _contact_phone_decorators, { kind: "field", name: "contact_phone", static: false, private: false, access: { has: function (obj) { return "contact_phone" in obj; }, get: function (obj) { return obj.contact_phone; }, set: function (obj, value) { obj.contact_phone = value; } }, metadata: _metadata }, _contact_phone_initializers, _contact_phone_extraInitializers);
            __esDecorate(null, null, _contact_email_decorators, { kind: "field", name: "contact_email", static: false, private: false, access: { has: function (obj) { return "contact_email" in obj; }, get: function (obj) { return obj.contact_email; }, set: function (obj, value) { obj.contact_email = value; } }, metadata: _metadata }, _contact_email_initializers, _contact_email_extraInitializers);
            __esDecorate(null, null, _distance_km_decorators, { kind: "field", name: "distance_km", static: false, private: false, access: { has: function (obj) { return "distance_km" in obj; }, get: function (obj) { return obj.distance_km; }, set: function (obj, value) { obj.distance_km = value; } }, metadata: _metadata }, _distance_km_initializers, _distance_km_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _is_open_decorators, { kind: "field", name: "is_open", static: false, private: false, access: { has: function (obj) { return "is_open" in obj; }, get: function (obj) { return obj.is_open; }, set: function (obj, value) { obj.is_open = value; } }, metadata: _metadata }, _is_open_initializers, _is_open_extraInitializers);
            __esDecorate(null, null, _is_verified_decorators, { kind: "field", name: "is_verified", static: false, private: false, access: { has: function (obj) { return "is_verified" in obj; }, get: function (obj) { return obj.is_verified; }, set: function (obj, value) { obj.is_verified = value; } }, metadata: _metadata }, _is_verified_initializers, _is_verified_extraInitializers);
            __esDecorate(null, null, _service_type_decorators, { kind: "field", name: "service_type", static: false, private: false, access: { has: function (obj) { return "service_type" in obj; }, get: function (obj) { return obj.service_type; }, set: function (obj, value) { obj.service_type = value; } }, metadata: _metadata }, _service_type_initializers, _service_type_extraInitializers);
            __esDecorate(null, null, _offers_decorators, { kind: "field", name: "offers", static: false, private: false, access: { has: function (obj) { return "offers" in obj; }, get: function (obj) { return obj.offers; }, set: function (obj, value) { obj.offers = value; } }, metadata: _metadata }, _offers_initializers, _offers_extraInitializers);
            __esDecorate(null, null, _operating_hours_today_decorators, { kind: "field", name: "operating_hours_today", static: false, private: false, access: { has: function (obj) { return "operating_hours_today" in obj; }, get: function (obj) { return obj.operating_hours_today; }, set: function (obj, value) { obj.operating_hours_today = value; } }, metadata: _metadata }, _operating_hours_today_initializers, _operating_hours_today_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProviderResponseDto = ProviderResponseDto;
// ==================== FILTER OPTIONS DTOS ====================
var ServiceTypeFilterOptionDto = function () {
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
            function ServiceTypeFilterOptionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.count = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.selected = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                __runInitializers(this, _selected_extraInitializers);
            }
            return ServiceTypeFilterOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter name', example: 'Wash' })];
            _count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of providers matching this filter', example: 8 })];
            _selected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether this filter is currently selected' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: function (obj) { return "selected" in obj; }, get: function (obj) { return obj.selected; }, set: function (obj, value) { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ServiceTypeFilterOptionDto = ServiceTypeFilterOptionDto;
var RatingRangeFilterOptionDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _min_decorators;
    var _min_initializers = [];
    var _min_extraInitializers = [];
    var _max_decorators;
    var _max_initializers = [];
    var _max_extraInitializers = [];
    var _count_decorators;
    var _count_initializers = [];
    var _count_extraInitializers = [];
    var _selected_decorators;
    var _selected_initializers = [];
    var _selected_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RatingRangeFilterOptionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.min = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _min_initializers, void 0));
                this.max = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, void 0));
                this.count = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.selected = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                __runInitializers(this, _selected_extraInitializers);
            }
            return RatingRangeFilterOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter name', example: '4.5+' })];
            _min_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum rating', example: 4.5 })];
            _max_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum rating', example: 5 })];
            _count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of providers matching this filter', example: 5 })];
            _selected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether this filter is currently selected' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _min_decorators, { kind: "field", name: "min", static: false, private: false, access: { has: function (obj) { return "min" in obj; }, get: function (obj) { return obj.min; }, set: function (obj, value) { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(null, null, _max_decorators, { kind: "field", name: "max", static: false, private: false, access: { has: function (obj) { return "max" in obj; }, get: function (obj) { return obj.max; }, set: function (obj, value) { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: function (obj) { return "selected" in obj; }, get: function (obj) { return obj.selected; }, set: function (obj, value) { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RatingRangeFilterOptionDto = RatingRangeFilterOptionDto;
var DistanceRangeFilterOptionDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _max_km_decorators;
    var _max_km_initializers = [];
    var _max_km_extraInitializers = [];
    var _count_decorators;
    var _count_initializers = [];
    var _count_extraInitializers = [];
    var _selected_decorators;
    var _selected_initializers = [];
    var _selected_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DistanceRangeFilterOptionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.max_km = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _max_km_initializers, void 0));
                this.count = (__runInitializers(this, _max_km_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.selected = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                __runInitializers(this, _selected_extraInitializers);
            }
            return DistanceRangeFilterOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filter name', example: '≤ 10 km' })];
            _max_km_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum distance in km', example: 10 })];
            _count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of providers matching this filter', example: 3 })];
            _selected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether this filter is currently selected' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _max_km_decorators, { kind: "field", name: "max_km", static: false, private: false, access: { has: function (obj) { return "max_km" in obj; }, get: function (obj) { return obj.max_km; }, set: function (obj, value) { obj.max_km = value; } }, metadata: _metadata }, _max_km_initializers, _max_km_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: function (obj) { return "selected" in obj; }, get: function (obj) { return obj.selected; }, set: function (obj, value) { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DistanceRangeFilterOptionDto = DistanceRangeFilterOptionDto;
var LocationFilterOptionDto = function () {
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
            function LocationFilterOptionDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.count = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                this.selected = (__runInitializers(this, _count_extraInitializers), __runInitializers(this, _selected_initializers, void 0));
                __runInitializers(this, _selected_extraInitializers);
            }
            return LocationFilterOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'City name', example: 'Zamalek' })];
            _count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of providers in this city', example: 5 })];
            _selected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether this filter is currently selected' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: function (obj) { return "count" in obj; }, get: function (obj) { return obj.count; }, set: function (obj, value) { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, null, _selected_decorators, { kind: "field", name: "selected", static: false, private: false, access: { has: function (obj) { return "selected" in obj; }, get: function (obj) { return obj.selected; }, set: function (obj, value) { obj.selected = value; } }, metadata: _metadata }, _selected_initializers, _selected_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LocationFilterOptionDto = LocationFilterOptionDto;
var ProviderFilterOptionsDto = function () {
    var _a;
    var _service_types_decorators;
    var _service_types_initializers = [];
    var _service_types_extraInitializers = [];
    var _rating_ranges_decorators;
    var _rating_ranges_initializers = [];
    var _rating_ranges_extraInitializers = [];
    var _distance_ranges_decorators;
    var _distance_ranges_initializers = [];
    var _distance_ranges_extraInitializers = [];
    var _locations_decorators;
    var _locations_initializers = [];
    var _locations_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProviderFilterOptionsDto() {
                this.service_types = __runInitializers(this, _service_types_initializers, void 0);
                this.rating_ranges = (__runInitializers(this, _service_types_extraInitializers), __runInitializers(this, _rating_ranges_initializers, void 0));
                this.distance_ranges = (__runInitializers(this, _rating_ranges_extraInitializers), __runInitializers(this, _distance_ranges_initializers, void 0));
                this.locations = (__runInitializers(this, _distance_ranges_extraInitializers), __runInitializers(this, _locations_initializers, void 0));
                __runInitializers(this, _locations_extraInitializers);
            }
            return ProviderFilterOptionsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _service_types_decorators = [(0, swagger_1.ApiProperty)({ type: [ServiceTypeFilterOptionDto], description: 'Service type filter options' })];
            _rating_ranges_decorators = [(0, swagger_1.ApiProperty)({ type: [RatingRangeFilterOptionDto], description: 'Rating range filter options' })];
            _distance_ranges_decorators = [(0, swagger_1.ApiProperty)({ type: [DistanceRangeFilterOptionDto], description: 'Distance range filter options' })];
            _locations_decorators = [(0, swagger_1.ApiProperty)({ type: [LocationFilterOptionDto], description: 'City location filter options' })];
            __esDecorate(null, null, _service_types_decorators, { kind: "field", name: "service_types", static: false, private: false, access: { has: function (obj) { return "service_types" in obj; }, get: function (obj) { return obj.service_types; }, set: function (obj, value) { obj.service_types = value; } }, metadata: _metadata }, _service_types_initializers, _service_types_extraInitializers);
            __esDecorate(null, null, _rating_ranges_decorators, { kind: "field", name: "rating_ranges", static: false, private: false, access: { has: function (obj) { return "rating_ranges" in obj; }, get: function (obj) { return obj.rating_ranges; }, set: function (obj, value) { obj.rating_ranges = value; } }, metadata: _metadata }, _rating_ranges_initializers, _rating_ranges_extraInitializers);
            __esDecorate(null, null, _distance_ranges_decorators, { kind: "field", name: "distance_ranges", static: false, private: false, access: { has: function (obj) { return "distance_ranges" in obj; }, get: function (obj) { return obj.distance_ranges; }, set: function (obj, value) { obj.distance_ranges = value; } }, metadata: _metadata }, _distance_ranges_initializers, _distance_ranges_extraInitializers);
            __esDecorate(null, null, _locations_decorators, { kind: "field", name: "locations", static: false, private: false, access: { has: function (obj) { return "locations" in obj; }, get: function (obj) { return obj.locations; }, set: function (obj, value) { obj.locations = value; } }, metadata: _metadata }, _locations_initializers, _locations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProviderFilterOptionsDto = ProviderFilterOptionsDto;
// ==================== MAIN RESPONSE DTO ====================
var ProviderDiscoveryMetaDto = function () {
    var _a;
    var _total_decorators;
    var _total_initializers = [];
    var _total_extraInitializers = [];
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
            function ProviderDiscoveryMetaDto() {
                this.total = __runInitializers(this, _total_initializers, void 0);
                this.page = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.total_pages = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _total_pages_initializers, void 0));
                this.location_used = (__runInitializers(this, _total_pages_extraInitializers), __runInitializers(this, _location_used_initializers, void 0));
                this.latitude = (__runInitializers(this, _location_used_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return ProviderDiscoveryMetaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of providers' })];
            _page_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current page number' })];
            _limit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Items per page' })];
            _total_pages_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total number of pages' })];
            _location_used_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether location was used for distance calculation' })];
            _latitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Latitude used for distance calculation' })];
            _longitude_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Longitude used for distance calculation' })];
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
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
exports.ProviderDiscoveryMetaDto = ProviderDiscoveryMetaDto;
var ProviderDiscoveryResponseDto = function () {
    var _a;
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    var _meta_decorators;
    var _meta_initializers = [];
    var _meta_extraInitializers = [];
    var _filters_decorators;
    var _filters_initializers = [];
    var _filters_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ProviderDiscoveryResponseDto() {
                this.data = __runInitializers(this, _data_initializers, void 0);
                this.meta = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _meta_initializers, void 0));
                this.filters = (__runInitializers(this, _meta_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                __runInitializers(this, _filters_extraInitializers);
            }
            return ProviderDiscoveryResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({ type: [ProviderResponseDto], description: 'List of providers' })];
            _meta_decorators = [(0, swagger_1.ApiProperty)({ type: ProviderDiscoveryMetaDto, description: 'Pagination metadata' })];
            _filters_decorators = [(0, swagger_1.ApiProperty)({ type: ProviderFilterOptionsDto, description: 'Available filter options' })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _meta_decorators, { kind: "field", name: "meta", static: false, private: false, access: { has: function (obj) { return "meta" in obj; }, get: function (obj) { return obj.meta; }, set: function (obj, value) { obj.meta = value; } }, metadata: _metadata }, _meta_initializers, _meta_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: function (obj) { return "filters" in obj; }, get: function (obj) { return obj.filters; }, set: function (obj, value) { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProviderDiscoveryResponseDto = ProviderDiscoveryResponseDto;
