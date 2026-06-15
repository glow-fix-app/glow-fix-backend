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
exports.NearbyBusinessDto = exports.ClientResponseDto = void 0;
// dto/client-response.dto.ts
var swagger_1 = require("@nestjs/swagger");
var client_entity_1 = require("../entities/client.entity");
var ClientResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _user_id_decorators;
    var _user_id_initializers = [];
    var _user_id_extraInitializers = [];
    var _full_name_decorators;
    var _full_name_initializers = [];
    var _full_name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _avatar_url_decorators;
    var _avatar_url_initializers = [];
    var _avatar_url_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClientResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.user_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _user_id_initializers, void 0));
                this.full_name = (__runInitializers(this, _user_id_extraInitializers), __runInitializers(this, _full_name_initializers, void 0));
                this.email = (__runInitializers(this, _full_name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.avatar_url = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _avatar_url_initializers, void 0));
                this.location = (__runInitializers(this, _avatar_url_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.created_at = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
                this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
                __runInitializers(this, _updated_at_extraInitializers);
            }
            return ClientResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _user_id_decorators = [(0, swagger_1.ApiProperty)()];
            _full_name_decorators = [(0, swagger_1.ApiProperty)()];
            _email_decorators = [(0, swagger_1.ApiProperty)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _avatar_url_decorators = [(0, swagger_1.ApiPropertyOptional)()];
            _location_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: client_entity_1.ClientLocation })];
            _created_at_decorators = [(0, swagger_1.ApiProperty)()];
            _updated_at_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _user_id_decorators, { kind: "field", name: "user_id", static: false, private: false, access: { has: function (obj) { return "user_id" in obj; }, get: function (obj) { return obj.user_id; }, set: function (obj, value) { obj.user_id = value; } }, metadata: _metadata }, _user_id_initializers, _user_id_extraInitializers);
            __esDecorate(null, null, _full_name_decorators, { kind: "field", name: "full_name", static: false, private: false, access: { has: function (obj) { return "full_name" in obj; }, get: function (obj) { return obj.full_name; }, set: function (obj, value) { obj.full_name = value; } }, metadata: _metadata }, _full_name_initializers, _full_name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _avatar_url_decorators, { kind: "field", name: "avatar_url", static: false, private: false, access: { has: function (obj) { return "avatar_url" in obj; }, get: function (obj) { return obj.avatar_url; }, set: function (obj, value) { obj.avatar_url = value; } }, metadata: _metadata }, _avatar_url_initializers, _avatar_url_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
            __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClientResponseDto = ClientResponseDto;
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
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// export class ClientLocationResponseDto {
//   @ApiProperty()
//   latitude: number;
//   @ApiProperty()
//   longitude: number;
// }
// export class ClientResponseDto {
//   @ApiProperty()
//   id: string;
//   @ApiProperty()
//   user_id: string;
//   @ApiProperty()
//   full_name: string;
//   @ApiProperty()
//   email: string;
//   @ApiPropertyOptional()
//   phone?: string;
//   @ApiPropertyOptional()
//   avatar_url?: string;
//   @ApiProperty()
//   email_verified: boolean;
//   @ApiProperty()
//   phone_verified: boolean;
//   @ApiPropertyOptional({ type: ClientLocationResponseDto })
//   location?: ClientLocationResponseDto;
//   @ApiProperty()
//   total_bookings: number;
//   @ApiProperty()
//   total_spent: number;
//   @ApiProperty()
//   loyalty_points: number;
//   @ApiProperty()
//   vehicles_count: number;
//   @ApiProperty()
//   created_at: Date;
//   @ApiProperty()
//   updated_at: Date;
// }
// export class NearbyClientDto {
//   @ApiProperty()
//   id: string;
//   @ApiProperty()
//   user_id: string;
//   @ApiProperty()
//   full_name: string;
//   @ApiProperty()
//   email: string;
//   @ApiPropertyOptional()
//   phone?: string;
//   @ApiPropertyOptional()
//   avatar_url?: string;
//   @ApiProperty()
//   distance_km: number;
//   @ApiProperty()
//   total_bookings: number;
//   @ApiProperty()
//   average_rating: number;
// }
