"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderDiscoveryService = void 0;
// modules/businesses/provider-discovery.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var provider_discovery_dto_1 = require("./dto/provider-discovery.dto");
var ProviderDiscoveryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProviderDiscoveryService = _classThis = /** @class */ (function () {
        function ProviderDiscoveryService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ProviderDiscoveryService.name);
        }
        /**
         * Search and discover providers with filters and sorting
         */
        ProviderDiscoveryService_1.prototype.searchProviders = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var search, latitude, longitude, filters, _a, sort_by, _b, page, _c, limit, skip, take, userLat, userLng, clientLocation, approvedStatus, approvedStatusId, sql, activeCategories, categoryConditions, cityConditions, havingConditions, providers, filteredProviders, total, businessIds, locationsMap, logosMap, formattedProviders, filterOptions;
                var _d;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            search = dto.search, latitude = dto.latitude, longitude = dto.longitude, filters = dto.filters, _a = dto.sort_by, sort_by = _a === void 0 ? provider_discovery_dto_1.ProviderSortBy.HIGHEST_RATED : _a, _b = dto.page, page = _b === void 0 ? 1 : _b, _c = dto.limit, limit = _c === void 0 ? 20 : _c;
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            userLat = latitude;
                            userLng = longitude;
                            if (!(userId && !userLat && !userLng)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getClientLocation(userId)];
                        case 1:
                            clientLocation = _e.sent();
                            if (clientLocation) {
                                userLat = clientLocation.latitude;
                                userLng = clientLocation.longitude;
                            }
                            _e.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'APPROVED' },
                            })];
                        case 3:
                            approvedStatus = _e.sent();
                            if (!!approvedStatus) return [3 /*break*/, 5];
                            _d = {
                                data: [],
                                meta: {
                                    total: 0,
                                    page: page,
                                    limit: limit,
                                    total_pages: 0,
                                    location_used: false,
                                }
                            };
                            return [4 /*yield*/, this.getFilterOptions(userLat, userLng)];
                        case 4: return [2 /*return*/, (_d.filters = _e.sent(),
                                _d)];
                        case 5:
                            approvedStatusId = approvedStatus.id;
                            sql = client_1.Prisma.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.city,\n        b.contact_phone,\n        b.contact_email,\n        b.created_at,\n    "], ["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.city,\n        b.contact_phone,\n        b.contact_email,\n        b.created_at,\n    "])));
                            // Add distance calculation if location provided
                            if (userLat && userLng) {
                                sql = client_1.Prisma.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        ", "\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 1) as distance_km,\n      "], ["\n        ", "\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 1) as distance_km,\n      "])), sql, userLng, userLat);
                            }
                            else {
                                sql = client_1.Prisma.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        ", "\n        NULL as distance_km,\n      "], ["\n        ", "\n        NULL as distance_km,\n      "])), sql);
                            }
                            // Add aggregates, subqueries, FROM, and WHERE — but NO GROUP BY here
                            sql = client_1.Prisma.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      ", "\n      COALESCE(AVG(r.rating), 0) as average_rating,\n      COUNT(DISTINCT r.id) as total_reviews,\n      EXISTS (\n        SELECT 1 FROM business_documents bd \n        WHERE bd.business_id = b.id \n        AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)\n      ) as is_verified,\n      EXISTS (\n        SELECT 1 FROM operating_hours oh \n        WHERE oh.business_id = b.id \n        AND oh.day_of_week = EXTRACT(DOW FROM NOW())\n        AND oh.open_time::time <= CURRENT_TIME\n        AND oh.close_time::time >= CURRENT_TIME\n      ) as is_open,\n      (\n        SELECT COALESCE(json_agg(\n          json_build_object(\n            'business_service_id', bs.id,\n            'service_id', s.id,\n            'service_name', s.title,\n            'category_name', c.name,\n            'price', bs.price / 100,\n            'duration_minutes', bs.average_duration\n          )\n        ), '[]'::json)\n        FROM business_service bs\n        JOIN services s ON bs.service_id = s.id\n        JOIN categories c ON s.category_id = c.id\n        WHERE bs.business_id = b.id AND bs.is_active = true\n      ) as offers\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE (\n        SELECT status_id FROM business_status bs \n        WHERE bs.business_id = b.id \n        ORDER BY created_at DESC LIMIT 1\n      ) = ", "::uuid\n    "], ["\n      ", "\n      COALESCE(AVG(r.rating), 0) as average_rating,\n      COUNT(DISTINCT r.id) as total_reviews,\n      EXISTS (\n        SELECT 1 FROM business_documents bd \n        WHERE bd.business_id = b.id \n        AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)\n      ) as is_verified,\n      EXISTS (\n        SELECT 1 FROM operating_hours oh \n        WHERE oh.business_id = b.id \n        AND oh.day_of_week = EXTRACT(DOW FROM NOW())\n        AND oh.open_time::time <= CURRENT_TIME\n        AND oh.close_time::time >= CURRENT_TIME\n      ) as is_open,\n      (\n        SELECT COALESCE(json_agg(\n          json_build_object(\n            'business_service_id', bs.id,\n            'service_id', s.id,\n            'service_name', s.title,\n            'category_name', c.name,\n            'price', bs.price / 100,\n            'duration_minutes', bs.average_duration\n          )\n        ), '[]'::json)\n        FROM business_service bs\n        JOIN services s ON bs.service_id = s.id\n        JOIN categories c ON s.category_id = c.id\n        WHERE bs.business_id = b.id AND bs.is_active = true\n      ) as offers\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE (\n        SELECT status_id FROM business_status bs \n        WHERE bs.business_id = b.id \n        ORDER BY created_at DESC LIMIT 1\n      ) = ", "::uuid\n    "])), sql, approvedStatusId);
                            // Apply search filter
                            if (search) {
                                sql = client_1.Prisma.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n        ", "\n        AND b.business_name ILIKE ", "\n      "], ["\n        ", "\n        AND b.business_name ILIKE ", "\n      "])), sql, "%".concat(search, "%"));
                            }
                            activeCategories = filters === null || filters === void 0 ? void 0 : filters.categories;
                            if (typeof activeCategories === 'string') {
                                activeCategories = [activeCategories];
                            }
                            if (activeCategories && activeCategories.length > 0) {
                                categoryConditions = activeCategories.map(function (cat) { return client_1.Prisma.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n          EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = ", "\n          )\n        "], ["\n          EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = ", "\n          )\n        "])), cat); });
                                sql = client_1.Prisma.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n        ", "\n        AND (", ")\n      "], ["\n        ", "\n        AND (", ")\n      "])), sql, client_1.Prisma.join(categoryConditions, ' OR '));
                            }
                            // Apply service type filter
                            if (filters === null || filters === void 0 ? void 0 : filters.service) {
                                if (filters.service === provider_discovery_dto_1.ServiceType.WASH) {
                                    sql = client_1.Prisma.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n          AND NOT EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n        "], ["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n          AND NOT EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n        "])), sql);
                                }
                                else if (filters.service === provider_discovery_dto_1.ServiceType.REPAIR) {
                                    sql = client_1.Prisma.sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n          AND NOT EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n        "], ["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n          AND NOT EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n        "])), sql);
                                }
                                else if (filters.service === provider_discovery_dto_1.ServiceType.BOTH) {
                                    sql = client_1.Prisma.sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n        "], ["\n          ", "\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Wash'\n          )\n          AND EXISTS (\n            SELECT 1 FROM business_service bs \n            JOIN services s ON bs.service_id = s.id \n            JOIN categories c ON s.category_id = c.id \n            WHERE bs.business_id = b.id \n            AND c.name = 'Repair'\n          )\n        "])), sql);
                                }
                            }
                            // Apply city filter (uses the structured `city` column and the freeform `address` as fallback)
                            if (filters === null || filters === void 0 ? void 0 : filters.city) {
                                sql = client_1.Prisma.sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n        ", "\n        AND (b.city ILIKE ", " OR b.address ILIKE ", ")\n      "], ["\n        ", "\n        AND (b.city ILIKE ", " OR b.address ILIKE ", ")\n      "])), sql, "%".concat(filters.city, "%"), "%".concat(filters.city, "%"));
                            }
                            else if ((filters === null || filters === void 0 ? void 0 : filters.locations) && filters.locations.length > 0) {
                                cityConditions = filters.locations.map(function (loc) { return client_1.Prisma.sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["(b.city ILIKE ", " OR b.address ILIKE ", ")"], ["(b.city ILIKE ", " OR b.address ILIKE ", ")"])), "%".concat(loc, "%"), "%".concat(loc, "%")); });
                                sql = client_1.Prisma.sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n        ", "\n        AND (", ")\n      "], ["\n        ", "\n        AND (", ")\n      "])), sql, client_1.Prisma.join(cityConditions, ' OR '));
                            }
                            // Apply open now filter
                            if (filters === null || filters === void 0 ? void 0 : filters.open_now) {
                                sql = client_1.Prisma.sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n        ", "\n        AND EXISTS (\n          SELECT 1 FROM operating_hours oh \n          WHERE oh.business_id = b.id \n          AND oh.day_of_week = EXTRACT(DOW FROM NOW())\n          AND oh.open_time::time <= CURRENT_TIME\n          AND oh.close_time::time >= CURRENT_TIME\n        )\n      "], ["\n        ", "\n        AND EXISTS (\n          SELECT 1 FROM operating_hours oh \n          WHERE oh.business_id = b.id \n          AND oh.day_of_week = EXTRACT(DOW FROM NOW())\n          AND oh.open_time::time <= CURRENT_TIME\n          AND oh.close_time::time >= CURRENT_TIME\n        )\n      "])), sql);
                            }
                            // Apply verified only filter
                            if (filters === null || filters === void 0 ? void 0 : filters.verified_only) {
                                sql = client_1.Prisma.sql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n        ", "\n        AND EXISTS (\n          SELECT 1 FROM business_documents bd \n          WHERE bd.business_id = b.id \n          AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)\n        )\n      "], ["\n        ", "\n        AND EXISTS (\n          SELECT 1 FROM business_documents bd \n          WHERE bd.business_id = b.id \n          AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)\n        )\n      "])), sql);
                            }
                            // GROUP BY comes after all WHERE/AND conditions
                            sql = client_1.Prisma.sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n      ", "\n      GROUP BY b.id\n    "], ["\n      ", "\n      GROUP BY b.id\n    "])), sql);
                            havingConditions = [];
                            if (filters === null || filters === void 0 ? void 0 : filters.min_rating) {
                                havingConditions.push("AVG(r.rating) >= ".concat(filters.min_rating));
                            }
                            if (havingConditions.length > 0) {
                                sql = client_1.Prisma.sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n        ", "\n        HAVING ", "\n      "], ["\n        ", "\n        HAVING ", "\n      "])), sql, client_1.Prisma.raw(havingConditions.join(' AND ')));
                            }
                            // Apply sorting
                            sql = client_1.Prisma.sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n      ", "\n      ", "\n    "], ["\n      ", "\n      ", "\n    "])), sql, client_1.Prisma.raw(this.getSortingClause(sort_by, userLat, userLng)));
                            // Apply pagination
                            sql = client_1.Prisma.sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n      ", "\n      LIMIT ", " OFFSET ", "\n    "], ["\n      ", "\n      LIMIT ", " OFFSET ", "\n    "])), sql, take, skip);
                            return [4 /*yield*/, this.prisma.$queryRaw(sql)];
                        case 6:
                            providers = _e.sent();
                            filteredProviders = providers;
                            if (userLat && userLng && (filters === null || filters === void 0 ? void 0 : filters.max_distance)) {
                                filteredProviders = providers.filter(function (p) { return p.distance_km !== null && p.distance_km <= filters.max_distance; });
                            }
                            total = filteredProviders.length;
                            businessIds = filteredProviders.map(function (p) { return p.id; });
                            return [4 /*yield*/, this.getBusinessLocationsBatch(businessIds)];
                        case 7:
                            locationsMap = _e.sent();
                            return [4 /*yield*/, this.getBusinessLogosBatch(businessIds)];
                        case 8:
                            logosMap = _e.sent();
                            return [4 /*yield*/, Promise.all(filteredProviders.map(function (provider) { return __awaiter(_this, void 0, void 0, function () {
                                    var coords, serviceType, offers, hasWash, hasRepair;
                                    var _a;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                coords = locationsMap.get(provider.id) || {
                                                    latitude: 0,
                                                    longitude: 0,
                                                };
                                                serviceType = 'both';
                                                offers = provider.offers || [];
                                                hasWash = offers.some(function (o) { var _a; return (_a = o === null || o === void 0 ? void 0 : o.service_name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('wash'); });
                                                hasRepair = offers.some(function (o) {
                                                    return (o === null || o === void 0 ? void 0 : o.service_name) && !o.service_name.toLowerCase().includes('wash');
                                                });
                                                if (hasWash && !hasRepair)
                                                    serviceType = 'Wash';
                                                else if (!hasWash && hasRepair)
                                                    serviceType = 'Repair';
                                                else if (hasWash && hasRepair)
                                                    serviceType = 'both';
                                                _a = {
                                                    id: provider.id,
                                                    business_name: provider.business_name,
                                                    address: provider.address,
                                                    logo_url: logosMap.get(provider.id),
                                                    city: (_b = provider.city) !== null && _b !== void 0 ? _b : null,
                                                    contact_phone: provider.contact_phone || undefined,
                                                    contact_email: provider.contact_email || undefined,
                                                    distance_km: provider.distance_km
                                                        ? parseFloat(provider.distance_km)
                                                        : 0,
                                                    average_rating: Math.round(parseFloat(provider.average_rating) * 10) / 10,
                                                    total_reviews: parseInt(provider.total_reviews, 10),
                                                    is_open: provider.is_open === true ||
                                                        provider.is_open === 1 ||
                                                        provider.is_open === 't',
                                                    is_verified: provider.is_verified === true ||
                                                        provider.is_verified === 1 ||
                                                        provider.is_verified === 't',
                                                    service_type: serviceType,
                                                    offers: (provider.offers || []).map(function (offer) { return ({
                                                        business_service_id: offer === null || offer === void 0 ? void 0 : offer.business_service_id,
                                                        service_id: offer === null || offer === void 0 ? void 0 : offer.service_id,
                                                        service_name: (offer === null || offer === void 0 ? void 0 : offer.service_name) || 'Service',
                                                        category_name: offer === null || offer === void 0 ? void 0 : offer.category_name,
                                                        price: parseFloat((offer === null || offer === void 0 ? void 0 : offer.price) || 0),
                                                        duration_minutes: (offer === null || offer === void 0 ? void 0 : offer.duration_minutes) || 60,
                                                    }); })
                                                };
                                                return [4 /*yield*/, this.getOperatingHoursToday(provider.id)];
                                            case 1: return [2 /*return*/, (_a.operating_hours_today = _c.sent(),
                                                    _a.latitude = coords.latitude,
                                                    _a.longitude = coords.longitude,
                                                    _a.created_at = provider.created_at,
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        case 9:
                            formattedProviders = _e.sent();
                            // Fall back to rating sort if nearest requested but no location
                            if (sort_by === provider_discovery_dto_1.ProviderSortBy.NEAREST && !userLat && !userLng) {
                                formattedProviders.sort(function (a, b) { return b.average_rating - a.average_rating; });
                            }
                            return [4 /*yield*/, this.getFilterOptions(userLat, userLng)];
                        case 10:
                            filterOptions = _e.sent();
                            return [2 /*return*/, {
                                    data: formattedProviders.slice(0, take),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        total_pages: Math.ceil(total / limit),
                                        location_used: !!(userLat && userLng),
                                        latitude: userLat,
                                        longitude: userLng,
                                    },
                                    filters: filterOptions,
                                }];
                    }
                });
            });
        };
        /**
         * Get filter options for UI
         */
        ProviderDiscoveryService_1.prototype.getFilterOptions = function (latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var approvedStatus, approvedStatusId, serviceTypeCounts, ratingDistribution, distanceRanges, cityCounts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'APPROVED' },
                            })];
                        case 1:
                            approvedStatus = _a.sent();
                            if (!approvedStatus) {
                                return [2 /*return*/, {
                                        service_types: [],
                                        rating_ranges: [],
                                        distance_ranges: [],
                                        locations: [],
                                    }];
                            }
                            approvedStatusId = approvedStatus.id;
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n      SELECT \n        CASE \n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')\n            AND EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')\n          THEN 'both'\n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')\n          THEN 'Wash'\n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')\n          THEN 'Repair'\n          ELSE 'unknown'\n        END as service_type,\n        COUNT(*) as count\n      FROM businesses b\n      WHERE (\n        SELECT status_id FROM business_status bs \n        WHERE bs.business_id = b.id \n        ORDER BY created_at DESC LIMIT 1\n      ) = ", "::uuid\n      GROUP BY service_type\n    "], ["\n      SELECT \n        CASE \n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')\n            AND EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')\n          THEN 'both'\n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')\n          THEN 'Wash'\n          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')\n          THEN 'Repair'\n          ELSE 'unknown'\n        END as service_type,\n        COUNT(*) as count\n      FROM businesses b\n      WHERE (\n        SELECT status_id FROM business_status bs \n        WHERE bs.business_id = b.id \n        ORDER BY created_at DESC LIMIT 1\n      ) = ", "::uuid\n      GROUP BY service_type\n    "])), approvedStatusId)];
                        case 2:
                            serviceTypeCounts = _a.sent();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n      SELECT \n        rating_range,\n        COUNT(*) as count\n      FROM (\n        SELECT \n          b.id,\n          CASE \n            WHEN COALESCE(AVG(r.rating), 0) >= 4.5 THEN '4.5+'\n            WHEN COALESCE(AVG(r.rating), 0) >= 4 THEN '4+'\n            WHEN COALESCE(AVG(r.rating), 0) >= 3 THEN '3+'\n            ELSE 'Any'\n          END as rating_range\n        FROM businesses b\n        LEFT JOIN bookings bk ON b.id = bk.business_id\n        LEFT JOIN reviews r ON bk.id = r.booking_id\n        WHERE (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n        GROUP BY b.id\n      ) sub\n      GROUP BY rating_range\n    "], ["\n      SELECT \n        rating_range,\n        COUNT(*) as count\n      FROM (\n        SELECT \n          b.id,\n          CASE \n            WHEN COALESCE(AVG(r.rating), 0) >= 4.5 THEN '4.5+'\n            WHEN COALESCE(AVG(r.rating), 0) >= 4 THEN '4+'\n            WHEN COALESCE(AVG(r.rating), 0) >= 3 THEN '3+'\n            ELSE 'Any'\n          END as rating_range\n        FROM businesses b\n        LEFT JOIN bookings bk ON b.id = bk.business_id\n        LEFT JOIN reviews r ON bk.id = r.booking_id\n        WHERE (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n        GROUP BY b.id\n      ) sub\n      GROUP BY rating_range\n    "])), approvedStatusId)];
                        case 3:
                            ratingDistribution = _a.sent();
                            distanceRanges = [];
                            if (!(latitude && longitude)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n        SELECT \n          CASE \n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 10 THEN '\u2264 10 km'\n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 25 THEN '\u2264 25 km'\n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 50 THEN '\u2264 50 km'\n            ELSE '> 50 km'\n          END as distance_range,\n          COUNT(*) as count\n        FROM businesses b\n        WHERE (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n        GROUP BY distance_range\n      "], ["\n        SELECT \n          CASE \n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 10 THEN '\u2264 10 km'\n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 25 THEN '\u2264 25 km'\n            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000 <= 50 THEN '\u2264 50 km'\n            ELSE '> 50 km'\n          END as distance_range,\n          COUNT(*) as count\n        FROM businesses b\n        WHERE (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n        GROUP BY distance_range\n      "])), longitude, latitude, longitude, latitude, longitude, latitude, approvedStatusId)];
                        case 4:
                            distanceRanges = _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n      SELECT \n        b.city,\n        COUNT(*) as count\n      FROM businesses b\n      WHERE b.city IS NOT NULL\n        AND (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n      GROUP BY b.city\n      ORDER BY count DESC, b.city ASC\n    "], ["\n      SELECT \n        b.city,\n        COUNT(*) as count\n      FROM businesses b\n      WHERE b.city IS NOT NULL\n        AND (\n          SELECT status_id FROM business_status bs \n          WHERE bs.business_id = b.id \n          ORDER BY created_at DESC LIMIT 1\n        ) = ", "::uuid\n      GROUP BY b.city\n      ORDER BY count DESC, b.city ASC\n    "])), approvedStatusId)];
                        case 6:
                            cityCounts = _a.sent();
                            return [2 /*return*/, {
                                    service_types: serviceTypeCounts.map(function (st) { return ({
                                        name: st.service_type === 'both' ? 'Wash & Repair' : st.service_type,
                                        count: Number(st.count),
                                        selected: false,
                                    }); }),
                                    rating_ranges: [
                                        { name: 'Any', min: 0, max: 5, count: 0, selected: false },
                                        { name: '4.5+', min: 4.5, max: 5, count: 0, selected: false },
                                        { name: '4+', min: 4, max: 5, count: 0, selected: false },
                                        { name: '3+', min: 3, max: 5, count: 0, selected: false },
                                    ].map(function (range) {
                                        var dist = ratingDistribution.find(function (r) { return r.rating_range === range.name; });
                                        return __assign(__assign({}, range), { count: dist ? Number(dist.count) : 0, selected: false });
                                    }),
                                    distance_ranges: distanceRanges.map(function (dr) {
                                        var _a;
                                        return ({
                                            name: dr.distance_range,
                                            max_km: parseFloat(((_a = dr.distance_range.match(/\d+/)) === null || _a === void 0 ? void 0 : _a.toString()) || '0'),
                                            count: Number(dr.count),
                                            selected: false,
                                        });
                                    }),
                                    locations: cityCounts.map(function (c) { return ({
                                        name: c.city,
                                        count: Number(c.count),
                                        selected: false,
                                    }); }),
                                }];
                    }
                });
            });
        };
        /**
         * Get sorting clause for SQL query
         */
        ProviderDiscoveryService_1.prototype.getSortingClause = function (sortBy, latitude, longitude) {
            switch (sortBy) {
                case provider_discovery_dto_1.ProviderSortBy.HIGHEST_RATED:
                    return ' ORDER BY average_rating DESC, total_reviews DESC ';
                case provider_discovery_dto_1.ProviderSortBy.NEAREST:
                    if (latitude && longitude) {
                        return ' ORDER BY distance_km NULLS LAST ';
                    }
                    return ' ORDER BY average_rating DESC ';
                case provider_discovery_dto_1.ProviderSortBy.MOST_REVIEWS:
                    return ' ORDER BY total_reviews DESC, average_rating DESC ';
                case provider_discovery_dto_1.ProviderSortBy.NEWEST:
                    return ' ORDER BY b.created_at DESC ';
                case provider_discovery_dto_1.ProviderSortBy.OLDEST:
                    return ' ORDER BY b.created_at ASC ';
                default:
                    return ' ORDER BY average_rating DESC ';
            }
        };
        /**
         * Get client location from database
         */
        ProviderDiscoveryService_1.prototype.getClientLocation = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n      SELECT \n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM clients \n      WHERE user_id = ", "::uuid\n    "], ["\n      SELECT \n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM clients \n      WHERE user_id = ", "::uuid\n    "])), userId)];
                        case 1:
                            result = _a.sent();
                            if (!result || result.length === 0 || result[0].latitude === null || result[0].longitude === null) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    latitude: result[0].latitude,
                                    longitude: result[0].longitude,
                                }];
                    }
                });
            });
        };
        /**
         * Get business locations in batch
         */
        ProviderDiscoveryService_1.prototype.getBusinessLocationsBatch = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var results, map, _i, results_1, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ids.length === 0)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n      SELECT \n        id,\n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ANY(", "::uuid[])\n    "], ["\n      SELECT \n        id,\n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ANY(", "::uuid[])\n    "])), ids)];
                        case 1:
                            results = _a.sent();
                            map = new Map();
                            for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                                row = results_1[_i];
                                map.set(row.id, {
                                    latitude: Number(row.latitude),
                                    longitude: Number(row.longitude),
                                });
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        /**
         * Get business logos in batch
         */
        ProviderDiscoveryService_1.prototype.getBusinessLogosBatch = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var images, map, _i, images_1, img;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ids.length === 0)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.prisma.image.findMany({
                                    where: {
                                        entityId: { in: ids },
                                        entityType: 'BUSINESS_LOGO'
                                    }
                                })];
                        case 1:
                            images = _a.sent();
                            map = new Map();
                            for (_i = 0, images_1 = images; _i < images_1.length; _i++) {
                                img = images_1[_i];
                                map.set(img.entityId, img.url);
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        /**
         * Get operating hours for today as readable string
         */
        ProviderDiscoveryService_1.prototype.getOperatingHoursToday = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, hours;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date().getDay();
                            return [4 /*yield*/, this.prisma.operatingHour.findFirst({
                                    where: {
                                        businessId: businessId,
                                        dayOfWeek: today,
                                    },
                                })];
                        case 1:
                            hours = _a.sent();
                            if (!hours || !hours.openTime || !hours.closeTime) {
                                return [2 /*return*/, 'Closed'];
                            }
                            return [2 /*return*/, "".concat(hours.openTime, " - ").concat(hours.closeTime)];
                    }
                });
            });
        };
        return ProviderDiscoveryService_1;
    }());
    __setFunctionName(_classThis, "ProviderDiscoveryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProviderDiscoveryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProviderDiscoveryService = _classThis;
}();
exports.ProviderDiscoveryService = ProviderDiscoveryService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
