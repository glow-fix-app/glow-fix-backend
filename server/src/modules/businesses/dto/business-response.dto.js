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
exports.NearbyBusinessDto = exports.BusinessStatsDto = exports.BusinessResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var BusinessResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _manager_id_decorators;
    var _manager_id_initializers = [];
    var _manager_id_extraInitializers = [];
    var _manager_name_decorators;
    var _manager_name_initializers = [];
    var _manager_name_extraInitializers = [];
    var _business_name_decorators;
    var _business_name_initializers = [];
    var _business_name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _contact_phone_decorators;
    var _contact_phone_initializers = [];
    var _contact_phone_extraInitializers = [];
    var _contact_email_decorators;
    var _contact_email_initializers = [];
    var _contact_email_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _bank_name_decorators;
    var _bank_name_initializers = [];
    var _bank_name_extraInitializers = [];
    var _bank_account_name_decorators;
    var _bank_account_name_initializers = [];
    var _bank_account_name_extraInitializers = [];
    var _bank_account_number_decorators;
    var _bank_account_number_initializers = [];
    var _bank_account_number_extraInitializers = [];
    var _swift_iban_decorators;
    var _swift_iban_initializers = [];
    var _swift_iban_extraInitializers = [];
    var _current_status_decorators;
    var _current_status_initializers = [];
    var _current_status_extraInitializers = [];
    var _rejection_reason_decorators;
    var _rejection_reason_initializers = [];
    var _rejection_reason_extraInitializers = [];
    var _operating_hours_decorators;
    var _operating_hours_initializers = [];
    var _operating_hours_extraInitializers = [];
    var _documents_decorators;
    var _documents_initializers = [];
    var _documents_extraInitializers = [];
    var _logo_url_decorators;
    var _logo_url_initializers = [];
    var _logo_url_extraInitializers = [];
    var _cover_url_decorators;
    var _cover_url_initializers = [];
    var _cover_url_extraInitializers = [];
    var _gallery_decorators;
    var _gallery_initializers = [];
    var _gallery_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BusinessResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.manager_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _manager_id_initializers, void 0));
                this.manager_name = (__runInitializers(this, _manager_id_extraInitializers), __runInitializers(this, _manager_name_initializers, void 0));
                this.business_name = (__runInitializers(this, _manager_name_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.latitude = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.contact_phone = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _contact_phone_initializers, void 0));
                this.contact_email = (__runInitializers(this, _contact_phone_extraInitializers), __runInitializers(this, _contact_email_initializers, void 0));
                this.description = (__runInitializers(this, _contact_email_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.bank_name = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _bank_name_initializers, void 0));
                this.bank_account_name = (__runInitializers(this, _bank_name_extraInitializers), __runInitializers(this, _bank_account_name_initializers, void 0));
                this.bank_account_number = (__runInitializers(this, _bank_account_name_extraInitializers), __runInitializers(this, _bank_account_number_initializers, void 0));
                this.swift_iban = (__runInitializers(this, _bank_account_number_extraInitializers), __runInitializers(this, _swift_iban_initializers, void 0));
                this.current_status = (__runInitializers(this, _swift_iban_extraInitializers), __runInitializers(this, _current_status_initializers, void 0));
                this.rejection_reason = (__runInitializers(this, _current_status_extraInitializers), __runInitializers(this, _rejection_reason_initializers, void 0));
                this.operating_hours = (__runInitializers(this, _rejection_reason_extraInitializers), __runInitializers(this, _operating_hours_initializers, void 0));
                this.documents = (__runInitializers(this, _operating_hours_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
                this.logo_url = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _logo_url_initializers, void 0));
                this.cover_url = (__runInitializers(this, _logo_url_extraInitializers), __runInitializers(this, _cover_url_initializers, void 0));
                this.gallery = (__runInitializers(this, _cover_url_extraInitializers), __runInitializers(this, _gallery_initializers, void 0));
                this.created_at = (__runInitializers(this, _gallery_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return BusinessResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _manager_id_decorators = [(0, swagger_1.ApiProperty)()];
            _manager_name_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)()];
            _latitude_decorators = [(0, swagger_1.ApiProperty)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)()];
            _contact_phone_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _contact_email_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _bank_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _bank_account_name_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _bank_account_number_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _swift_iban_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _current_status_decorators = [(0, swagger_1.ApiProperty)()];
            _rejection_reason_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _operating_hours_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _documents_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _logo_url_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _cover_url_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _gallery_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] })];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _manager_id_decorators, { kind: "field", name: "manager_id", static: false, private: false, access: { has: function (obj) { return "manager_id" in obj; }, get: function (obj) { return obj.manager_id; }, set: function (obj, value) { obj.manager_id = value; } }, metadata: _metadata }, _manager_id_initializers, _manager_id_extraInitializers);
            __esDecorate(null, null, _manager_name_decorators, { kind: "field", name: "manager_name", static: false, private: false, access: { has: function (obj) { return "manager_name" in obj; }, get: function (obj) { return obj.manager_name; }, set: function (obj, value) { obj.manager_name = value; } }, metadata: _metadata }, _manager_name_initializers, _manager_name_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _contact_phone_decorators, { kind: "field", name: "contact_phone", static: false, private: false, access: { has: function (obj) { return "contact_phone" in obj; }, get: function (obj) { return obj.contact_phone; }, set: function (obj, value) { obj.contact_phone = value; } }, metadata: _metadata }, _contact_phone_initializers, _contact_phone_extraInitializers);
            __esDecorate(null, null, _contact_email_decorators, { kind: "field", name: "contact_email", static: false, private: false, access: { has: function (obj) { return "contact_email" in obj; }, get: function (obj) { return obj.contact_email; }, set: function (obj, value) { obj.contact_email = value; } }, metadata: _metadata }, _contact_email_initializers, _contact_email_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _bank_name_decorators, { kind: "field", name: "bank_name", static: false, private: false, access: { has: function (obj) { return "bank_name" in obj; }, get: function (obj) { return obj.bank_name; }, set: function (obj, value) { obj.bank_name = value; } }, metadata: _metadata }, _bank_name_initializers, _bank_name_extraInitializers);
            __esDecorate(null, null, _bank_account_name_decorators, { kind: "field", name: "bank_account_name", static: false, private: false, access: { has: function (obj) { return "bank_account_name" in obj; }, get: function (obj) { return obj.bank_account_name; }, set: function (obj, value) { obj.bank_account_name = value; } }, metadata: _metadata }, _bank_account_name_initializers, _bank_account_name_extraInitializers);
            __esDecorate(null, null, _bank_account_number_decorators, { kind: "field", name: "bank_account_number", static: false, private: false, access: { has: function (obj) { return "bank_account_number" in obj; }, get: function (obj) { return obj.bank_account_number; }, set: function (obj, value) { obj.bank_account_number = value; } }, metadata: _metadata }, _bank_account_number_initializers, _bank_account_number_extraInitializers);
            __esDecorate(null, null, _swift_iban_decorators, { kind: "field", name: "swift_iban", static: false, private: false, access: { has: function (obj) { return "swift_iban" in obj; }, get: function (obj) { return obj.swift_iban; }, set: function (obj, value) { obj.swift_iban = value; } }, metadata: _metadata }, _swift_iban_initializers, _swift_iban_extraInitializers);
            __esDecorate(null, null, _current_status_decorators, { kind: "field", name: "current_status", static: false, private: false, access: { has: function (obj) { return "current_status" in obj; }, get: function (obj) { return obj.current_status; }, set: function (obj, value) { obj.current_status = value; } }, metadata: _metadata }, _current_status_initializers, _current_status_extraInitializers);
            __esDecorate(null, null, _rejection_reason_decorators, { kind: "field", name: "rejection_reason", static: false, private: false, access: { has: function (obj) { return "rejection_reason" in obj; }, get: function (obj) { return obj.rejection_reason; }, set: function (obj, value) { obj.rejection_reason = value; } }, metadata: _metadata }, _rejection_reason_initializers, _rejection_reason_extraInitializers);
            __esDecorate(null, null, _operating_hours_decorators, { kind: "field", name: "operating_hours", static: false, private: false, access: { has: function (obj) { return "operating_hours" in obj; }, get: function (obj) { return obj.operating_hours; }, set: function (obj, value) { obj.operating_hours = value; } }, metadata: _metadata }, _operating_hours_initializers, _operating_hours_extraInitializers);
            __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: function (obj) { return "documents" in obj; }, get: function (obj) { return obj.documents; }, set: function (obj, value) { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
            __esDecorate(null, null, _logo_url_decorators, { kind: "field", name: "logo_url", static: false, private: false, access: { has: function (obj) { return "logo_url" in obj; }, get: function (obj) { return obj.logo_url; }, set: function (obj, value) { obj.logo_url = value; } }, metadata: _metadata }, _logo_url_initializers, _logo_url_extraInitializers);
            __esDecorate(null, null, _cover_url_decorators, { kind: "field", name: "cover_url", static: false, private: false, access: { has: function (obj) { return "cover_url" in obj; }, get: function (obj) { return obj.cover_url; }, set: function (obj, value) { obj.cover_url = value; } }, metadata: _metadata }, _cover_url_initializers, _cover_url_extraInitializers);
            __esDecorate(null, null, _gallery_decorators, { kind: "field", name: "gallery", static: false, private: false, access: { has: function (obj) { return "gallery" in obj; }, get: function (obj) { return obj.gallery; }, set: function (obj, value) { obj.gallery = value; } }, metadata: _metadata }, _gallery_initializers, _gallery_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessResponseDto = BusinessResponseDto;
var BusinessStatsDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function BusinessStatsDto() {
                this.total_bookings = __runInitializers(this, _total_bookings_initializers, void 0);
                this.completed_bookings = (__runInitializers(this, _total_bookings_extraInitializers), __runInitializers(this, _completed_bookings_initializers, void 0));
                this.cancelled_bookings = (__runInitializers(this, _completed_bookings_extraInitializers), __runInitializers(this, _cancelled_bookings_initializers, void 0));
                this.total_revenue = (__runInitializers(this, _cancelled_bookings_extraInitializers), __runInitializers(this, _total_revenue_initializers, void 0));
                this.platform_fees = (__runInitializers(this, _total_revenue_extraInitializers), __runInitializers(this, _platform_fees_initializers, void 0));
                this.net_revenue = (__runInitializers(this, _platform_fees_extraInitializers), __runInitializers(this, _net_revenue_initializers, void 0));
                this.average_rating = (__runInitializers(this, _net_revenue_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.active_services = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _active_services_initializers, void 0));
                __runInitializers(this, _active_services_extraInitializers);
            }
            return BusinessStatsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _total_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _completed_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _cancelled_bookings_decorators = [(0, swagger_1.ApiProperty)()];
            _total_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _platform_fees_decorators = [(0, swagger_1.ApiProperty)()];
            _net_revenue_decorators = [(0, swagger_1.ApiProperty)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _active_services_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _total_bookings_decorators, { kind: "field", name: "total_bookings", static: false, private: false, access: { has: function (obj) { return "total_bookings" in obj; }, get: function (obj) { return obj.total_bookings; }, set: function (obj, value) { obj.total_bookings = value; } }, metadata: _metadata }, _total_bookings_initializers, _total_bookings_extraInitializers);
            __esDecorate(null, null, _completed_bookings_decorators, { kind: "field", name: "completed_bookings", static: false, private: false, access: { has: function (obj) { return "completed_bookings" in obj; }, get: function (obj) { return obj.completed_bookings; }, set: function (obj, value) { obj.completed_bookings = value; } }, metadata: _metadata }, _completed_bookings_initializers, _completed_bookings_extraInitializers);
            __esDecorate(null, null, _cancelled_bookings_decorators, { kind: "field", name: "cancelled_bookings", static: false, private: false, access: { has: function (obj) { return "cancelled_bookings" in obj; }, get: function (obj) { return obj.cancelled_bookings; }, set: function (obj, value) { obj.cancelled_bookings = value; } }, metadata: _metadata }, _cancelled_bookings_initializers, _cancelled_bookings_extraInitializers);
            __esDecorate(null, null, _total_revenue_decorators, { kind: "field", name: "total_revenue", static: false, private: false, access: { has: function (obj) { return "total_revenue" in obj; }, get: function (obj) { return obj.total_revenue; }, set: function (obj, value) { obj.total_revenue = value; } }, metadata: _metadata }, _total_revenue_initializers, _total_revenue_extraInitializers);
            __esDecorate(null, null, _platform_fees_decorators, { kind: "field", name: "platform_fees", static: false, private: false, access: { has: function (obj) { return "platform_fees" in obj; }, get: function (obj) { return obj.platform_fees; }, set: function (obj, value) { obj.platform_fees = value; } }, metadata: _metadata }, _platform_fees_initializers, _platform_fees_extraInitializers);
            __esDecorate(null, null, _net_revenue_decorators, { kind: "field", name: "net_revenue", static: false, private: false, access: { has: function (obj) { return "net_revenue" in obj; }, get: function (obj) { return obj.net_revenue; }, set: function (obj, value) { obj.net_revenue = value; } }, metadata: _metadata }, _net_revenue_initializers, _net_revenue_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _active_services_decorators, { kind: "field", name: "active_services", static: false, private: false, access: { has: function (obj) { return "active_services" in obj; }, get: function (obj) { return obj.active_services; }, set: function (obj, value) { obj.active_services = value; } }, metadata: _metadata }, _active_services_initializers, _active_services_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BusinessStatsDto = BusinessStatsDto;
var NearbyBusinessDto = function () {
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
    var _distance_km_decorators;
    var _distance_km_initializers = [];
    var _distance_km_extraInitializers = [];
    var _contact_phone_decorators;
    var _contact_phone_initializers = [];
    var _contact_phone_extraInitializers = [];
    var _average_rating_decorators;
    var _average_rating_initializers = [];
    var _average_rating_extraInitializers = [];
    var _total_reviews_decorators;
    var _total_reviews_initializers = [];
    var _total_reviews_extraInitializers = [];
    var _is_open_decorators;
    var _is_open_initializers = [];
    var _is_open_extraInitializers = [];
    return _a = /** @class */ (function () {
            function NearbyBusinessDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.business_name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _business_name_initializers, void 0));
                this.address = (__runInitializers(this, _business_name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.distance_km = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _distance_km_initializers, void 0));
                this.contact_phone = (__runInitializers(this, _distance_km_extraInitializers), __runInitializers(this, _contact_phone_initializers, void 0));
                this.average_rating = (__runInitializers(this, _contact_phone_extraInitializers), __runInitializers(this, _average_rating_initializers, void 0));
                this.total_reviews = (__runInitializers(this, _average_rating_extraInitializers), __runInitializers(this, _total_reviews_initializers, void 0));
                this.is_open = (__runInitializers(this, _total_reviews_extraInitializers), __runInitializers(this, _is_open_initializers, void 0));
                __runInitializers(this, _is_open_extraInitializers);
            }
            return NearbyBusinessDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _business_name_decorators = [(0, swagger_1.ApiProperty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)()];
            _distance_km_decorators = [(0, swagger_1.ApiProperty)()];
            _contact_phone_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _average_rating_decorators = [(0, swagger_1.ApiProperty)()];
            _total_reviews_decorators = [(0, swagger_1.ApiProperty)()];
            _is_open_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _business_name_decorators, { kind: "field", name: "business_name", static: false, private: false, access: { has: function (obj) { return "business_name" in obj; }, get: function (obj) { return obj.business_name; }, set: function (obj, value) { obj.business_name = value; } }, metadata: _metadata }, _business_name_initializers, _business_name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _distance_km_decorators, { kind: "field", name: "distance_km", static: false, private: false, access: { has: function (obj) { return "distance_km" in obj; }, get: function (obj) { return obj.distance_km; }, set: function (obj, value) { obj.distance_km = value; } }, metadata: _metadata }, _distance_km_initializers, _distance_km_extraInitializers);
            __esDecorate(null, null, _contact_phone_decorators, { kind: "field", name: "contact_phone", static: false, private: false, access: { has: function (obj) { return "contact_phone" in obj; }, get: function (obj) { return obj.contact_phone; }, set: function (obj, value) { obj.contact_phone = value; } }, metadata: _metadata }, _contact_phone_initializers, _contact_phone_extraInitializers);
            __esDecorate(null, null, _average_rating_decorators, { kind: "field", name: "average_rating", static: false, private: false, access: { has: function (obj) { return "average_rating" in obj; }, get: function (obj) { return obj.average_rating; }, set: function (obj, value) { obj.average_rating = value; } }, metadata: _metadata }, _average_rating_initializers, _average_rating_extraInitializers);
            __esDecorate(null, null, _total_reviews_decorators, { kind: "field", name: "total_reviews", static: false, private: false, access: { has: function (obj) { return "total_reviews" in obj; }, get: function (obj) { return obj.total_reviews; }, set: function (obj, value) { obj.total_reviews = value; } }, metadata: _metadata }, _total_reviews_initializers, _total_reviews_extraInitializers);
            __esDecorate(null, null, _is_open_decorators, { kind: "field", name: "is_open", static: false, private: false, access: { has: function (obj) { return "is_open" in obj; }, get: function (obj) { return obj.is_open; }, set: function (obj, value) { obj.is_open = value; } }, metadata: _metadata }, _is_open_initializers, _is_open_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.NearbyBusinessDto = NearbyBusinessDto;
