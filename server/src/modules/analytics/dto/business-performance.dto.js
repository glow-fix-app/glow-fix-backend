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
exports.BusinessPerformanceListDto = exports.BusinessPerformanceDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var BusinessPerformanceDto = function () {
    var _a;
    var _business_id_decorators;
    var _business_id_initializers = [];
    var _business_id_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _total_bookings_decorators;
    var _total_bookings_initializers = [];
    var _total_bookings_extraInitializers = [];
    var _completed_bookings_decorators;
    var _completed_bookings_initializers = [];
    var _completed_bookings_extraInitializers = [];
    var _cancelled_bookings_decorators;
    var _cancelled_bookings_initializers = [];
    var _cancelled_bookings_extraInitializers = [];
    var _total_revenue_decorators;
    var _total_revenue_initializers = [];
    var _total_revenue_extraInitializers = [];
    var _platform_fees_decorators;
    var _platform_fees_initializers = [];
    var _platform_fees_extraInitializers = [];
    var _net_revenue_decorators;
    var _net_revenue_initializers = [];
    var _net_revenue_extraInitializers = [];
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    var _total_reviews_decorators;
    var _total_reviews_initializers = [];
    var _total_reviews_extraInitializers = [];
    var _active_services_decorators;
    var _active_services_initializers = [];
    var _active_services_extraInitializers = [];
    var _response_rate_decorators;
    var _response_rate_initializers = [];
    var _response_rate_extraInitializers = [];
    var _growth_percent_decorators;
    var _growth_percent_initializers = [];
    var _growth_percent_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessPerformanceDto() {
                this.business_id = __runInitializers(this, _business_id_initializers, void 0);
                this.business_name = (__runInitializers(this, _business_id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.total_bookings = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _total_bookings_initializers, void 0));
                this.completed_bookings = (__runInitializers(this, _total_bookings_extraInitializers), __runInitializers(this, _completed_bookings_initializers, void 0));
                this.cancelled_bookings = (__runInitializers(this, _completed_bookings_extraInitializers), __runInitializers(this, _cancelled_bookings_initializers, void 0));
                this.total_revenue = (__runInitializers(this, _cancelled_bookings_extraInitializers), __runInitializers(this, _total_revenue_initializers, void 0));
                this.platform_fees = (__runInitializers(this, _total_revenue_extraInitializers), __runInitializers(this, _platform_fees_initializers, void 0));
                this.net_revenue = (__runInitializers(this, _platform_fees_extraInitializers), __runInitializers(this, _net_revenue_initializers, void 0));
                this.average_rating = (__runInitializers(this, _net_revenue_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.active_services = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _active_services_initializers, void 0));
                this.response_rate = (__runInitializers(this, _active_services_extraInitializers), __runInitializers(this, _response_rate_initializers, void 0));
                this.growth_percent = (__runInitializers(this, _response_rate_extraInitializers), __runInitializers(this, _growth_percent_initializers, void 0));
                __runInitializers(this, _growth_percent_extraInitializers);
            }
            return BusinessPerformanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _business_id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _total_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _platform_fees_decorators = [(0, swagger_1.ApiProperty)()];
            _net_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _active_services_decorators = [(0, swagger_1.ApiProperty)()];
            _response_rate_decorators = [(0, swagger_1.ApiProperty)()];
            _growth_percent_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _business_id_decorators, { kind: "field", name: "business_id", static: false, private: false, access: { has: function (obj) { return "business_id" in obj; }, get: function (obj) { return obj.business_id; }, set: function (obj, value) { obj.business_id = value; } }, metadata: _metadata }, _business_id_initializers, _business_id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _total_revenue_decorators, { kind: "field", name: "total_revenue", static: false, private: false, access: { has: function (obj) { return "total_revenue" in obj; }, get: function (obj) { return obj.total_revenue; }, set: function (obj, value) { obj.total_revenue = value; } }, metadata: _metadata }, _total_revenue_initializers, _total_revenue_extraInitializers);
            __esDecorate(null, null, _platform_fees_decorators, { kind: "field", name: "platform_fees", static: false, private: false, access: { has: function (obj) { return "platform_fees" in obj; }, get: function (obj) { return obj.platform_fees; }, set: function (obj, value) { obj.platform_fees = value; } }, metadata: _metadata }, _platform_fees_initializers, _platform_fees_extraInitializers);
            __esDecorate(null, null, _net_revenue_decorators, { kind: "field", name: "net_revenue", static: false, private: false, access: { has: function (obj) { return "net_revenue" in obj; }, get: function (obj) { return obj.net_revenue; }, set: function (obj, value) { obj.net_revenue = value; } }, metadata: _metadata }, _net_revenue_initializers, _net_revenue_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _active_services_decorators, { kind: "field", name: "active_services", static: false, private: false, access: { has: function (obj) { return "active_services" in obj; }, get: function (obj) { return obj.active_services; }, set: function (obj, value) { obj.active_services = value; } }, metadata: _metadata }, _active_services_initializers, _active_services_extraInitializers);
            __esDecorate(null, null, _response_rate_decorators, { kind: "field", name: "response_rate", static: false, private: false, access: { has: function (obj) { return "response_rate" in obj; }, get: function (obj) { return obj.response_rate; }, set: function (obj, value) { obj.response_rate = value; } }, metadata: _metadata }, _response_rate_initializers, _response_rate_extraInitializers);
            __esDecorate(null, null, _growth_percent_decorators, { kind: "field", name: "growth_percent", static: false, private: false, access: { has: function (obj) { return "growth_percent" in obj; }, get: function (obj) { return obj.growth_percent; }, set: function (obj, value) { obj.growth_percent = value; } }, metadata: _metadata }, _growth_percent_initializers, _growth_percent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessPerformanceDto = BusinessPerformanceDto;
var BusinessPerformanceListDto = function () {
    var _a;
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
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
    return _a = /** @class */ (function () {
            function BusinessPerformanceListDto() {
                this.data = __runInitializers(this, _data_initializers, void 0);
                this.total = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _total_initializers, void 0));
                this.page = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.total_pages = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _total_pages_initializers, void 0));
                __runInitializers(this, _total_pages_extraInitializers);
            }
            return BusinessPerformanceListDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, swagger_1.ApiProperty)({ type: [BusinessPerformanceDto] })];
            _total_decorators = [(0, swagger_1.ApiProperty)()];
            _page_decorators = [(0, swagger_1.ApiProperty)()];
            _limit_decorators = [(0, swagger_1.ApiProperty)()];
            _total_pages_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _total_pages_decorators, { kind: "field", name: "total_pages", static: false, private: false, access: { has: function (obj) { return "total_pages" in obj; }, get: function (obj) { return obj.total_pages; }, set: function (obj, value) { obj.total_pages = value; } }, metadata: _metadata }, _total_pages_initializers, _total_pages_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessPerformanceListDto = BusinessPerformanceListDto;
