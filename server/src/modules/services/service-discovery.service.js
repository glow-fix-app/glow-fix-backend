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
exports.ServiceDiscoveryService = void 0;
// modules/services/service-discovery.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var service_discovery_dto_1 = require("./dto/service-discovery.dto");
var ServiceDiscoveryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ServiceDiscoveryService = _classThis = /** @class */ (function () {
        function ServiceDiscoveryService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ServiceDiscoveryService.name);
        }
        /**
         * Search services across all providers with full filters
         */
        ServiceDiscoveryService_1.prototype.searchServices = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var query, category, latitude, longitude, filters, _a, sort_by, _b, page, _c, limit, pageNum, limitNum, skip, userLat, userLng, clientLocation, minPrice, maxPrice, radius, minRating, openNow, verifiedOnly, selectedCategories, selectedLocations, serviceWhere, services, results, totalOffersCount, _i, services_1, service, activeOffers, offersWithDetails, validOffers, totalOffers, prices, fromPrice, totalServices, paginatedResults, filterOptions;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            query = dto.query, category = dto.category, latitude = dto.latitude, longitude = dto.longitude, filters = dto.filters, _a = dto.sort_by, sort_by = _a === void 0 ? service_discovery_dto_1.SortBy.PRICE_ASC : _a, _b = dto.page, page = _b === void 0 ? 1 : _b, _c = dto.limit, limit = _c === void 0 ? 20 : _c;
                            pageNum = Number(page);
                            limitNum = Math.min(Number(limit), 50);
                            skip = (pageNum - 1) * limitNum;
                            userLat = latitude ? Number(latitude) : undefined;
                            userLng = longitude ? Number(longitude) : undefined;
                            if (!(userId && !userLat && !userLng)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getClientLocation(userId)];
                        case 1:
                            clientLocation = _d.sent();
                            if (clientLocation) {
                                userLat = clientLocation.latitude;
                                userLng = clientLocation.longitude;
                            }
                            _d.label = 2;
                        case 2:
                            minPrice = (filters === null || filters === void 0 ? void 0 : filters.min_price) !== undefined ? Number(filters.min_price) : undefined;
                            maxPrice = (filters === null || filters === void 0 ? void 0 : filters.max_price) !== undefined ? Number(filters.max_price) : undefined;
                            radius = (filters === null || filters === void 0 ? void 0 : filters.radius) ? Number(filters.radius) : 20;
                            minRating = (filters === null || filters === void 0 ? void 0 : filters.min_rating) !== undefined
                                ? Number(filters.min_rating)
                                : undefined;
                            openNow = filters === null || filters === void 0 ? void 0 : filters.open_now;
                            verifiedOnly = filters === null || filters === void 0 ? void 0 : filters.verified_only;
                            selectedCategories = (filters === null || filters === void 0 ? void 0 : filters.categories) || (category ? [category] : []);
                            selectedLocations = (filters === null || filters === void 0 ? void 0 : filters.locations) || [];
                            serviceWhere = {};
                            if (query) {
                                serviceWhere.title = {
                                    contains: query,
                                    mode: 'insensitive',
                                };
                            }
                            if (selectedCategories.length > 0) {
                                serviceWhere.category = {
                                    name: {
                                        in: selectedCategories,
                                        mode: 'insensitive',
                                    },
                                };
                            }
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: serviceWhere,
                                    include: {
                                        category: true,
                                        businessServices: {
                                            where: __assign(__assign({ isActive: true }, (minPrice !== undefined && { price: { gte: minPrice } })), (maxPrice !== undefined && { price: { lte: maxPrice } })),
                                            include: {
                                                business: {
                                                    include: {
                                                        statusHistory: {
                                                            include: { status: true },
                                                            orderBy: { createdAt: 'desc' },
                                                            take: 1,
                                                        },
                                                        operatingHours: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 3:
                            services = _d.sent();
                            results = [];
                            totalOffersCount = 0;
                            _i = 0, services_1 = services;
                            _d.label = 4;
                        case 4:
                            if (!(_i < services_1.length)) return [3 /*break*/, 7];
                            service = services_1[_i];
                            activeOffers = service.businessServices.filter(function (bs) {
                                var _a, _b;
                                var latestStatus = (_b = (_a = bs.business.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context;
                                return latestStatus === 'APPROVED';
                            });
                            if (activeOffers.length === 0)
                                return [3 /*break*/, 6];
                            return [4 /*yield*/, Promise.all(activeOffers.map(function (bs) { return __awaiter(_this, void 0, void 0, function () {
                                    var distance, businessLocation, _a, ratingSummary, isOpen, isVerified, businessLogo, operatingHoursToday, businessCity_1, matchesLocation, isNearYou;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                distance = 0;
                                                if (!(userLat !== undefined && userLng !== undefined)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.getBusinessLocation(bs.businessId)];
                                            case 1:
                                                businessLocation = _b.sent();
                                                if (businessLocation) {
                                                    distance = this.calculateDistance(userLat, userLng, businessLocation.latitude, businessLocation.longitude);
                                                }
                                                _b.label = 2;
                                            case 2:
                                                // Apply radius filter early to skip unnecessary DB calls
                                                if (userLat !== undefined &&
                                                    userLng !== undefined &&
                                                    distance > radius) {
                                                    return [2 /*return*/, null];
                                                }
                                                return [4 /*yield*/, Promise.all([
                                                        this.getBusinessRatingSummary(bs.businessId),
                                                        this.isBusinessOpen(bs.businessId, new Date()),
                                                        this.isBusinessVerified(bs.businessId),
                                                        this.getBusinessLogo(bs.businessId),
                                                    ])];
                                            case 3:
                                                _a = _b.sent(), ratingSummary = _a[0], isOpen = _a[1], isVerified = _a[2], businessLogo = _a[3];
                                                operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);
                                                // Apply filters
                                                if (minRating !== undefined &&
                                                    ratingSummary.average_rating < minRating)
                                                    return [2 /*return*/, null];
                                                if (openNow && !isOpen)
                                                    return [2 /*return*/, null];
                                                if (verifiedOnly && !isVerified)
                                                    return [2 /*return*/, null];
                                                // Apply location filter using the real city column (matches discover page)
                                                if (selectedLocations.length > 0) {
                                                    businessCity_1 = bs.business.city || this.extractCityFromAddress(bs.business.address);
                                                    matchesLocation = selectedLocations.some(function (loc) { return businessCity_1.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(businessCity_1.toLowerCase()); });
                                                    isNearYou = selectedLocations.includes('Near you') && distance <= 5;
                                                    if (!matchesLocation && !isNearYou)
                                                        return [2 /*return*/, null];
                                                }
                                                return [2 /*return*/, {
                                                        business_service_id: bs.id,
                                                        business_id: bs.businessId,
                                                        business_name: bs.business.businessName,
                                                        business_address: bs.business.address,
                                                        business_phone: bs.business.contactPhone || undefined,
                                                        distance_km: Math.round(distance * 10) / 10,
                                                        price: Number(bs.price),
                                                        duration_minutes: bs.averageDuration,
                                                        average_rating: ratingSummary.average_rating,
                                                        total_reviews: ratingSummary.total_reviews,
                                                        is_open: isOpen,
                                                        is_verified: isVerified,
                                                        business_logo: businessLogo,
                                                        operating_hours_today: operatingHoursToday,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 5:
                            offersWithDetails = _d.sent();
                            validOffers = offersWithDetails.filter(function (o) { return o !== null; });
                            if (validOffers.length === 0)
                                return [3 /*break*/, 6];
                            this.sortOffers(validOffers, sort_by);
                            totalOffers = validOffers.length;
                            totalOffersCount += totalOffers;
                            prices = validOffers.map(function (o) { return o.price; });
                            fromPrice = Math.min.apply(Math, prices);
                            results.push({
                                service_id: service.id,
                                service_name: service.title,
                                service_description: service.description || undefined,
                                category_id: service.categoryId,
                                category_name: service.category.name,
                                total_offers: totalOffers,
                                provider_count: validOffers.length,
                                from_price: fromPrice,
                                price_range: {
                                    min: Math.min.apply(Math, prices),
                                    max: Math.max.apply(Math, prices),
                                },
                                offers: validOffers,
                            });
                            _d.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7:
                            this.sortResults(results, sort_by);
                            totalServices = results.length;
                            paginatedResults = results.slice(skip, skip + limitNum);
                            return [4 /*yield*/, this.getFilterOptions(query, userLat, userLng, radius)];
                        case 8:
                            filterOptions = _d.sent();
                            return [2 /*return*/, {
                                    data: paginatedResults,
                                    meta: {
                                        total_services: totalServices,
                                        total_offers: totalOffersCount,
                                        page: pageNum,
                                        limit: limitNum,
                                        total_pages: Math.ceil(totalServices / limitNum),
                                        location_used: !!(userLat !== undefined && userLng !== undefined),
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
         * Get filter options (categories, locations, price ranges)
         */
        ServiceDiscoveryService_1.prototype.getFilterOptions = function (query, latitude, longitude, radius) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceWhere, services, categoryCount, locationCount, _i, services_2, service, _a, _b, bs, latestStatus, categoryName, city, _c, _d, categories, locations, priceRanges;
                var _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            serviceWhere = {};
                            if (query) {
                                serviceWhere.title = {
                                    contains: query,
                                    mode: 'insensitive',
                                };
                            }
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: serviceWhere,
                                    include: {
                                        category: true,
                                        businessServices: {
                                            where: { isActive: true },
                                            include: {
                                                business: {
                                                    include: {
                                                        statusHistory: {
                                                            include: { status: true },
                                                            orderBy: { createdAt: 'desc' },
                                                            take: 1,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            services = _g.sent();
                            categoryCount = {};
                            locationCount = {};
                            for (_i = 0, services_2 = services; _i < services_2.length; _i++) {
                                service = services_2[_i];
                                for (_a = 0, _b = service.businessServices; _a < _b.length; _a++) {
                                    bs = _b[_a];
                                    latestStatus = (_f = (_e = bs.business.statusHistory[0]) === null || _e === void 0 ? void 0 : _e.status) === null || _f === void 0 ? void 0 : _f.context;
                                    if (latestStatus !== 'APPROVED')
                                        continue;
                                    categoryName = service.category.name;
                                    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
                                    city = bs.business.city || this.extractCityFromAddress(bs.business.address);
                                    if (city) {
                                        locationCount[city] = (locationCount[city] || 0) + 1;
                                    }
                                }
                            }
                            if (!(latitude !== undefined && longitude !== undefined)) return [3 /*break*/, 3];
                            _c = locationCount;
                            _d = 'Near you';
                            return [4 /*yield*/, this.countNearbyLocations(latitude, longitude, radius || 10)];
                        case 2:
                            _c[_d] = _g.sent();
                            _g.label = 3;
                        case 3:
                            categories = Object.entries(categoryCount)
                                .map(function (_a) {
                                var name = _a[0], count = _a[1];
                                return ({ name: name, count: count, selected: false });
                            })
                                .sort(function (a, b) { return b.count - a.count; });
                            locations = Object.entries(locationCount)
                                .map(function (_a) {
                                var name = _a[0], count = _a[1];
                                return ({ name: name, count: count, selected: false });
                            })
                                .sort(function (a, b) { return b.count - a.count; });
                            return [4 /*yield*/, this.getPriceRangeCounts(query)];
                        case 4:
                            priceRanges = _g.sent();
                            return [2 /*return*/, {
                                    categories: categories,
                                    locations: locations,
                                    price_ranges: priceRanges,
                                }];
                    }
                });
            });
        };
        /**
         * Get search suggestions for autocomplete
         */
        ServiceDiscoveryService_1.prototype.getSearchSuggestions = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, services, categories;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!query || query.length < 2) {
                                return [2 /*return*/, {
                                        query: query,
                                        service_suggestions: [],
                                        category_suggestions: [],
                                    }];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.service.findMany({
                                        where: {
                                            title: { contains: query, mode: 'insensitive' },
                                        },
                                        take: 5,
                                        select: { title: true },
                                    }),
                                    this.prisma.category.findMany({
                                        where: {
                                            name: { contains: query, mode: 'insensitive' },
                                        },
                                        take: 3,
                                        select: { name: true },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), services = _a[0], categories = _a[1];
                            return [2 /*return*/, {
                                    query: query,
                                    service_suggestions: services.map(function (s) { return s.title; }),
                                    category_suggestions: categories.map(function (c) { return c.name; }),
                                }];
                    }
                });
            });
        };
        /**
         * Get popular services for homepage
         * FIX: Use Prisma.sql`` tagged template to ensure proper parameter typing
         */
        ServiceDiscoveryService_1.prototype.getPopularServices = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var safeLimit, results;
                if (limit === void 0) { limit = 6; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            safeLimit = Math.max(1, Math.min(Number(limit) || 6, 50));
                            return [4 /*yield*/, this.prisma.$queryRaw(client_1.Prisma.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT \n      s.id AS service_id,\n      s.title AS service_name,\n      c.name AS category_name,\n\n      COUNT(DISTINCT bs.business_id)::int AS provider_count,\n\n      MIN(bs.price)::float AS min_price,\n\n      COALESCE(AVG(r.rating), 0)::float AS average_rating\n\n    FROM services s\n    JOIN categories c \n      ON s.category_id = c.id\n\n    JOIN business_services bs \n      ON s.id = bs.service_id\n\n    LEFT JOIN bookings b \n      ON bs.id = b.business_service_id\n\n    LEFT JOIN reviews r \n      ON b.id = r.booking_id\n\n    WHERE bs.is_active = true\n\n    GROUP BY s.id, s.title, c.name\n\n    ORDER BY provider_count DESC, average_rating DESC\n\n    LIMIT ", "\n  "], ["\n    SELECT \n      s.id AS service_id,\n      s.title AS service_name,\n      c.name AS category_name,\n\n      COUNT(DISTINCT bs.business_id)::int AS provider_count,\n\n      MIN(bs.price)::float AS min_price,\n\n      COALESCE(AVG(r.rating), 0)::float AS average_rating\n\n    FROM services s\n    JOIN categories c \n      ON s.category_id = c.id\n\n    JOIN business_services bs \n      ON s.id = bs.service_id\n\n    LEFT JOIN bookings b \n      ON bs.id = b.business_service_id\n\n    LEFT JOIN reviews r \n      ON b.id = r.booking_id\n\n    WHERE bs.is_active = true\n\n    GROUP BY s.id, s.title, c.name\n\n    ORDER BY provider_count DESC, average_rating DESC\n\n    LIMIT ", "\n  "])), client_1.Prisma.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), safeLimit)))];
                        case 1:
                            results = _a.sent();
                            // const results = await this.prisma.$queryRaw<Array<any>>(
                            //   Prisma.sql`
                            //     SELECT
                            //       s.id AS service_id,
                            //       s.title AS service_name,
                            //       c.name AS category_name,
                            //       COUNT(DISTINCT bs.business_id)::int AS provider_count,
                            //       (MIN(bs.price) / 100.0)::float AS min_price,
                            //       COALESCE(AVG(r.rating), 0)::float AS average_rating
                            //     FROM services s
                            //     JOIN categories c ON s.category_id = c.id
                            //     JOIN business_services bs ON s.id = bs.service_id
                            //     LEFT JOIN bookings b ON bs.id = b.business_service_id
                            //     LEFT JOIN reviews r ON b.id = r.booking_id
                            //     WHERE bs.is_active = true
                            //     GROUP BY s.id, s.title, c.name
                            //     ORDER BY provider_count DESC, average_rating DESC
                            //     LIMIT ${safeLimit}
                            //   `,
                            // );
                            return [2 /*return*/, results.map(function (r) { return ({
                                    service_id: r.service_id,
                                    service_name: r.service_name,
                                    category_name: r.category_name,
                                    provider_count: Number(r.provider_count),
                                    min_price: parseFloat(r.min_price),
                                    average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
                                }); })];
                    }
                });
            });
        };
        /**
         * Get single service details with all providers
         */
        ServiceDiscoveryService_1.prototype.getServiceWithProviders = function (serviceId, userId, latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                var service, userLat, userLng, clientLocation, approvedOffers, offers, prices;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.service.findUnique({
                                where: { id: serviceId },
                                include: {
                                    category: true,
                                    businessServices: {
                                        where: { isActive: true },
                                        include: {
                                            business: {
                                                include: {
                                                    statusHistory: {
                                                        include: { status: true },
                                                        orderBy: { createdAt: 'desc' },
                                                        take: 1,
                                                    },
                                                    operatingHours: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            service = _a.sent();
                            if (!service) {
                                throw new common_1.NotFoundException('Service not found');
                            }
                            userLat = latitude !== undefined ? Number(latitude) : undefined;
                            userLng = longitude !== undefined ? Number(longitude) : undefined;
                            if (!(userId && userLat === undefined && userLng === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getClientLocation(userId)];
                        case 2:
                            clientLocation = _a.sent();
                            if (clientLocation) {
                                userLat = clientLocation.latitude;
                                userLng = clientLocation.longitude;
                            }
                            _a.label = 3;
                        case 3:
                            approvedOffers = service.businessServices.filter(function (bs) {
                                var _a, _b;
                                var latestStatus = (_b = (_a = bs.business.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context;
                                return latestStatus === 'APPROVED';
                            });
                            return [4 /*yield*/, Promise.all(approvedOffers.map(function (bs) { return __awaiter(_this, void 0, void 0, function () {
                                    var distance, businessLocation, _a, ratingSummary, isOpen, isVerified, businessLogo, operatingHoursToday;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                distance = 0;
                                                if (!(userLat !== undefined && userLng !== undefined)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.getBusinessLocation(bs.businessId)];
                                            case 1:
                                                businessLocation = _b.sent();
                                                if (businessLocation) {
                                                    distance = this.calculateDistance(userLat, userLng, businessLocation.latitude, businessLocation.longitude);
                                                }
                                                _b.label = 2;
                                            case 2: return [4 /*yield*/, Promise.all([
                                                    this.getBusinessRatingSummary(bs.businessId),
                                                    this.isBusinessOpen(bs.businessId, new Date()),
                                                    this.isBusinessVerified(bs.businessId),
                                                    this.getBusinessLogo(bs.businessId),
                                                ])];
                                            case 3:
                                                _a = _b.sent(), ratingSummary = _a[0], isOpen = _a[1], isVerified = _a[2], businessLogo = _a[3];
                                                operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);
                                                return [2 /*return*/, {
                                                        business_service_id: bs.id,
                                                        business_id: bs.businessId,
                                                        business_name: bs.business.businessName,
                                                        business_address: bs.business.address,
                                                        business_phone: bs.business.contactPhone || undefined,
                                                        distance_km: Math.round(distance * 10) / 10,
                                                        price: Number(bs.price),
                                                        duration_minutes: bs.averageDuration,
                                                        average_rating: ratingSummary.average_rating,
                                                        total_reviews: ratingSummary.total_reviews,
                                                        is_open: isOpen,
                                                        is_verified: isVerified,
                                                        business_logo: businessLogo,
                                                        operating_hours_today: operatingHoursToday,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 4:
                            offers = _a.sent();
                            offers.sort(function (a, b) { return a.price - b.price; });
                            prices = offers.map(function (o) { return o.price; });
                            return [2 /*return*/, {
                                    service_id: service.id,
                                    service_name: service.title,
                                    service_description: service.description || undefined,
                                    category_id: service.categoryId,
                                    category_name: service.category.name,
                                    total_offers: offers.length,
                                    provider_count: offers.length,
                                    from_price: prices.length > 0 ? Math.min.apply(Math, prices) : 0,
                                    price_range: {
                                        min: prices.length > 0 ? Math.min.apply(Math, prices) : 0,
                                        max: prices.length > 0 ? Math.max.apply(Math, prices) : 0,
                                    },
                                    offers: offers,
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        /**
         * FIX: Use Prisma.sql with explicit ::uuid cast to avoid "uuid = text" operator error
         */
        ServiceDiscoveryService_1.prototype.getClientLocation = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!userId)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.prisma.$queryRaw(client_1.Prisma.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        SELECT\n          ST_Y(location::geometry) AS latitude,\n          ST_X(location::geometry) AS longitude\n        FROM clients\n        WHERE user_id = ", "::uuid\n      "], ["\n        SELECT\n          ST_Y(location::geometry) AS latitude,\n          ST_X(location::geometry) AS longitude\n        FROM clients\n        WHERE user_id = ", "::uuid\n      "])), userId))];
                        case 1:
                            result = _a.sent();
                            if (!result || result.length === 0)
                                return [2 /*return*/, null];
                            return [2 /*return*/, {
                                    latitude: Number(result[0].latitude),
                                    longitude: Number(result[0].longitude),
                                }];
                    }
                });
            });
        };
        /**
         * FIX: Use Prisma.sql with explicit ::uuid cast to avoid "uuid = text" operator error
         */
        ServiceDiscoveryService_1.prototype.getBusinessLocation = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!businessId)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.prisma.$queryRaw(client_1.Prisma.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    SELECT\n      ST_Y(location::geometry) AS latitude,\n      ST_X(location::geometry) AS longitude\n    FROM businesses\n    WHERE id = ", "::uuid\n    LIMIT 1\n  "], ["\n    SELECT\n      ST_Y(location::geometry) AS latitude,\n      ST_X(location::geometry) AS longitude\n    FROM businesses\n    WHERE id = ", "::uuid\n    LIMIT 1\n  "])), businessId))];
                        case 1:
                            result = _a.sent();
                            if (!result || result.length === 0)
                                return [2 /*return*/, null];
                            return [2 /*return*/, {
                                    latitude: Number(result[0].latitude),
                                    longitude: Number(result[0].longitude),
                                }];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.calculateDistance = function (lat1, lon1, lat2, lon2) {
            var R = 6371;
            var dLat = this.toRadians(lat2 - lat1);
            var dLon = this.toRadians(lon2 - lon1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(lat1)) *
                    Math.cos(this.toRadians(lat2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        ServiceDiscoveryService_1.prototype.toRadians = function (degrees) {
            return degrees * (Math.PI / 180);
        };
        ServiceDiscoveryService_1.prototype.getBusinessRatingSummary = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.review.aggregate({
                                where: {
                                    booking: { businessId: businessId },
                                },
                                _avg: { rating: true },
                                _count: { _all: true },
                            })];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, {
                                    average_rating: Math.round((((_a = result._avg) === null || _a === void 0 ? void 0 : _a.rating) || 0) * 10) / 10,
                                    total_reviews: ((_b = result._count) === null || _b === void 0 ? void 0 : _b._all) || 0,
                                }];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.isBusinessOpen = function (businessId, dateTime) {
            return __awaiter(this, void 0, void 0, function () {
                var dayOfWeek, timeStr, hours;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dayOfWeek = dateTime.getDay();
                            timeStr = dateTime.toTimeString().slice(0, 5);
                            return [4 /*yield*/, this.prisma.operatingHour.findFirst({
                                    where: {
                                        businessId: businessId,
                                        dayOfWeek: dayOfWeek,
                                    },
                                })];
                        case 1:
                            hours = _a.sent();
                            if (!(hours === null || hours === void 0 ? void 0 : hours.openTime) || !(hours === null || hours === void 0 ? void 0 : hours.closeTime))
                                return [2 /*return*/, false];
                            return [2 /*return*/, timeStr >= hours.openTime && timeStr <= hours.closeTime];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.getOperatingHoursToday = function (operatingHours) {
            var today = new Date().getDay();
            var todayHours = operatingHours.find(function (h) { return h.dayOfWeek === today; });
            if (!(todayHours === null || todayHours === void 0 ? void 0 : todayHours.openTime) || !(todayHours === null || todayHours === void 0 ? void 0 : todayHours.closeTime))
                return 'Closed';
            return "".concat(todayHours.openTime, " - ").concat(todayHours.closeTime);
        };
        ServiceDiscoveryService_1.prototype.isBusinessVerified = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.businessDocument.count({
                                where: {
                                    businessId: businessId,
                                    status: {
                                        context: 'DOC_ACCEPTED',
                                    },
                                },
                            })];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count >= 2];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.getBusinessLogo = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var image;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.image.findFirst({
                                where: {
                                    entityId: businessId,
                                    entityType: 'BUSINESS_LOGO',
                                },
                            })];
                        case 1:
                            image = _a.sent();
                            return [2 /*return*/, image === null || image === void 0 ? void 0 : image.url];
                    }
                });
            });
        };
        /**
         * Lightweight fallback: extract a usable city label from a freeform address
         * string when the structured `city` column is empty.
         * Returns the first comma-separated token that looks like a place name,
         * or an empty string so callers can decide how to handle it.
         */
        ServiceDiscoveryService_1.prototype.extractCityFromAddress = function (address) {
            if (!address)
                return '';
            // Take the first non-numeric, non-empty token separated by commas or slashes
            var parts = address.split(/[,\/]/).map(function (s) { return s.trim(); }).filter(Boolean);
            // Skip pure number / street-number tokens and pick the first meaningful word
            var city = parts.find(function (p) { return isNaN(Number(p)) && p.length > 2; });
            return city !== null && city !== void 0 ? city : '';
        };
        /**
         * FIX: Use Prisma.sql for proper UUID and numeric parameter handling
         */
        ServiceDiscoveryService_1.prototype.countNearbyLocations = function (latitude, longitude, radiusKm) {
            return __awaiter(this, void 0, void 0, function () {
                var radiusMeters, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            radiusMeters = radiusKm * 1000;
                            if (!latitude || !longitude || !radiusMeters)
                                return [2 /*return*/, 0];
                            return [4 /*yield*/, this.prisma.$queryRaw(client_1.Prisma.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    SELECT COUNT(*)::int AS count\n    FROM businesses b\n    JOIN business_status bs ON bs.business_id = b.id\n    JOIN statuses s ON bs.status_id = s.id\n    WHERE s.context = 'APPROVED'\n      AND ST_DWithin(\n        b.location::geography,\n        ST_SetSRID(\n          ST_MakePoint(", "::float8, ", "::float8),\n          4326\n        )::geography,\n        ", "::float8\n      )\n  "], ["\n    SELECT COUNT(*)::int AS count\n    FROM businesses b\n    JOIN business_status bs ON bs.business_id = b.id\n    JOIN statuses s ON bs.status_id = s.id\n    WHERE s.context = 'APPROVED'\n      AND ST_DWithin(\n        b.location::geography,\n        ST_SetSRID(\n          ST_MakePoint(", "::float8, ", "::float8),\n          4326\n        )::geography,\n        ", "::float8\n      )\n  "])), longitude, latitude, radiusMeters))];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, Number((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.getPriceRangeCounts = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceWhere, ranges, priceRanges;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serviceWhere = {};
                            if (query) {
                                serviceWhere.title = { contains: query, mode: 'insensitive' };
                            }
                            ranges = [
                                { name: 'Under EGP 100', min: 0, max: 100 },
                                { name: 'EGP 100 - 300', min: 100, max: 300 },
                                { name: 'EGP 300 - 500', min: 300, max: 500 },
                                { name: 'EGP 500 - 1000', min: 500, max: 1000 },
                                { name: 'Above EGP 1000', min: 1000, max: null },
                            ];
                            return [4 /*yield*/, Promise.all(ranges.map(function (range) { return __awaiter(_this, void 0, void 0, function () {
                                    var count;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.prisma.service.count({
                                                    where: __assign(__assign({}, serviceWhere), { businessServices: {
                                                            some: {
                                                                isActive: true,
                                                                price: __assign({ gte: range.min }, (range.max !== null && { lte: range.max })),
                                                                business: {
                                                                    statusHistory: {
                                                                        some: {
                                                                            status: { context: 'APPROVED' },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        } }),
                                                })];
                                            case 1:
                                                count = _a.sent();
                                                return [2 /*return*/, { name: range.name, count: count, selected: false }];
                                        }
                                    });
                                }); }))];
                        case 1:
                            priceRanges = _a.sent();
                            return [2 /*return*/, priceRanges];
                    }
                });
            });
        };
        ServiceDiscoveryService_1.prototype.sortOffers = function (offers, sortBy) {
            switch (sortBy) {
                case service_discovery_dto_1.SortBy.PRICE_ASC:
                    offers.sort(function (a, b) { return a.price - b.price; });
                    break;
                case service_discovery_dto_1.SortBy.PRICE_DESC:
                    offers.sort(function (a, b) { return b.price - a.price; });
                    break;
                case service_discovery_dto_1.SortBy.DISTANCE_ASC:
                    offers.sort(function (a, b) { return a.distance_km - b.distance_km; });
                    break;
                case service_discovery_dto_1.SortBy.RATING_DESC:
                    offers.sort(function (a, b) { return b.average_rating - a.average_rating; });
                    break;
                case service_discovery_dto_1.SortBy.POPULARITY:
                    offers.sort(function (a, b) { return b.total_reviews - a.total_reviews; });
                    break;
            }
        };
        ServiceDiscoveryService_1.prototype.sortResults = function (results, sortBy) {
            switch (sortBy) {
                case service_discovery_dto_1.SortBy.PRICE_ASC:
                    results.sort(function (a, b) { return a.from_price - b.from_price; });
                    break;
                case service_discovery_dto_1.SortBy.PRICE_DESC:
                    results.sort(function (a, b) { return b.from_price - a.from_price; });
                    break;
                case service_discovery_dto_1.SortBy.RATING_DESC:
                    results.sort(function (a, b) {
                        var avgA = a.offers.length > 0
                            ? a.offers.reduce(function (s, o) { return s + o.average_rating; }, 0) /
                                a.offers.length
                            : 0;
                        var avgB = b.offers.length > 0
                            ? b.offers.reduce(function (s, o) { return s + o.average_rating; }, 0) /
                                b.offers.length
                            : 0;
                        return avgB - avgA;
                    });
                    break;
                default:
                    break;
            }
        };
        return ServiceDiscoveryService_1;
    }());
    __setFunctionName(_classThis, "ServiceDiscoveryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServiceDiscoveryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServiceDiscoveryService = _classThis;
}();
exports.ServiceDiscoveryService = ServiceDiscoveryService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import {
//   SearchServicesDto,
//   SortBy,
//   ServiceDiscoveryResponseDto,
//   ServiceOfferDto,
//   SearchSuggestionsDto,
//   PopularServiceDto,
//   FilterCategoriesResponseDto,
//   FilterOptionDto,
//   SearchMetaDto,
// } from './dto/service-discovery.dto';
// @Injectable()
// export class ServiceDiscoveryService {
//   private readonly logger = new Logger(ServiceDiscoveryService.name);
//   constructor(private readonly prisma: PrismaService) {}
//   /**
//    * Search services across all providers with full filters
//    */
//   async searchServices(
//     userId: string | null,
//     dto: SearchServicesDto,
//   ): Promise<{ data: ServiceDiscoveryResponseDto[]; meta: SearchMetaDto; filters: FilterCategoriesResponseDto }> {
//     const {
//       query,
//       category,
//       latitude,
//       longitude,
//       filters,
//       sort_by = SortBy.PRICE_ASC,
//       page = 1,
//       limit = 20,
//     } = dto;
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);
//     // Get client location if authenticated
//     let userLat = latitude;
//     let userLng = longitude;
//     if (userId && !userLat && !userLng) {
//       const clientLocation = await this.getClientLocation(userId);
//       if (clientLocation) {
//         userLat = clientLocation.latitude;
//         userLng = clientLocation.longitude;
//       }
//     }
//     // Apply filters from nested filters object or top-level params
//     const minPrice = filters?.min_price;
//     const maxPrice = filters?.max_price;
//     const radius = filters?.radius || 20;
//     const minRating = filters?.min_rating;
//     const openNow = filters?.open_now;
//     const verifiedOnly = filters?.verified_only;
//     const selectedCategories = filters?.categories || (category ? [category] : []);
//     const selectedLocations = filters?.locations || [];
//     // Build service search query
//     const serviceWhere: any = {};
//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }
//     if (selectedCategories.length > 0) {
//       serviceWhere.category = {
//         name: {
//           in: selectedCategories,
//           mode: 'insensitive',
//         },
//       };
//     }
//     // Get matching services
//     const services = await this.prisma.service.findMany({
//       where: serviceWhere,
//       include: {
//         category: true,
//         businessServices: {
//           where: {
//             isActive: true,
//             ...(minPrice !== undefined && { price: { gte: minPrice * 100 } }),
//             ...(maxPrice !== undefined && { price: { lte: maxPrice * 100 } }),
//           },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//                 operatingHours: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     // Process each service and its offers
//     const results: ServiceDiscoveryResponseDto[] = [];
//     let totalOffersCount = 0;
//     for (const service of services) {
//       // Filter businesses by approval status
//       let activeOffers = service.businessServices.filter(bs => {
//         const latestStatus = bs.business.statusHistory[0]?.status?.context;
//         return latestStatus === 'APPROVED';
//       });
//       if (activeOffers.length === 0) continue;
//       // Calculate distance and details for each offer
//       let offersWithDetails = await Promise.all(
//         activeOffers.map(async (bs) => {
//           let distance = 0;
//           let isOpen = false;
//           let operatingHoursToday = '';
//           let isVerified = false;
//           // Get business location and calculate distance
//           if (userLat && userLng) {
//             const businessLocation = await this.getBusinessLocation(bs.businessId);
//             if (businessLocation) {
//               distance = this.calculateDistance(
//                 userLat,
//                 userLng,
//                 businessLocation.latitude,
//                 businessLocation.longitude,
//               );
//             }
//           }
//           // Check if open
//           isOpen = await this.isBusinessOpen(bs.businessId, new Date());
//           operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);
//           // Check if verified
//           isVerified = await this.isBusinessVerified(bs.businessId);
//           const ratingSummary = await this.getBusinessRatingSummary(bs.businessId);
//           // Apply radius filter
//           if (userLat && userLng && radius && distance > radius) {
//             return null;
//           }
//           // Apply min rating filter
//           if (minRating && ratingSummary.average_rating < minRating) {
//             return null;
//           }
//           // Apply open now filter
//           if (openNow && !isOpen) {
//             return null;
//           }
//           // Apply verified only filter
//           if (verifiedOnly && !isVerified) {
//             return null;
//           }
//           // Apply location filter (by area name)
//           if (selectedLocations.length > 0) {
//             const businessArea = this.extractLocationArea(bs.business.address);
//             if (!selectedLocations.includes(businessArea) && !selectedLocations.includes('Near you')) {
//               return null;
//             }
//             // Special "Near you" filter - within 5km
//             if (selectedLocations.includes('Near you') && distance > 5) {
//               return null;
//             }
//           }
//           return {
//             business_service_id: bs.id,
//             business_id: bs.businessId,
//             business_name: bs.business.businessName,
//             business_address: bs.business.address,
//             business_phone: bs.business.contactPhone || undefined,
//             distance_km: Math.round(distance * 10) / 10,
//             price: Number(bs.price) / 100,
//             duration_minutes: bs.averageDuration,
//             average_rating: ratingSummary.average_rating,
//             total_reviews: ratingSummary.total_reviews,
//             is_open: isOpen,
//             is_verified: isVerified,
//             operating_hours_today: operatingHoursToday,
//           };
//         }),
//       );
//       // Remove null offers
//       const validOffers = offersWithDetails.filter(o => o !== null) as ServiceOfferDto[];
//       if (validOffers.length === 0) continue;
//       // Apply sorting to offers
//       this.sortOffers(validOffers, sort_by);
//       // Paginate offers for this service
//       const paginatedOffers = validOffers.slice(0, take);
//       const totalOffers = validOffers.length;
//       totalOffersCount += totalOffers;
//       // Calculate price range
//       const prices = validOffers.map(o => o.price);
//       const fromPrice = Math.min(...prices);
//       results.push({
//         service_id: service.id,
//         service_name: service.title,
//         service_description: service.description || undefined,
//         category_id: service.categoryId,
//         category_name: service.category.name,
//         total_offers: totalOffers,
//         provider_count: validOffers.length,
//         from_price: fromPrice,
//         price_range: {
//           min: Math.min(...prices),
//           max: Math.max(...prices),
//         },
//         offers: paginatedOffers,
//       });
//     }
//     // Sort results
//     this.sortResults(results, sort_by);
//     // Apply pagination to results
//     const paginatedResults = results.slice(skip, skip + take);
//     const totalServices = results.length;
//     // Get filter options
//     const filterOptions = await this.getFilterOptions(query, userLat, userLng, radius);
//     return {
//       data: paginatedResults,
//       meta: {
//         total_services: totalServices,
//         total_offers: totalOffersCount,
//         page,
//         limit,
//         total_pages: Math.ceil(totalServices / limit),
//         location_used: !!(userLat && userLng),
//         latitude: userLat,
//         longitude: userLng,
//       },
//       filters: filterOptions,
//     };
//   }
//   /**
//    * Get filter options (categories, locations, price ranges)
//    */
//   async getFilterOptions(
//     query?: string,
//     latitude?: number,
//     longitude?: number,
//     radius?: number,
//   ): Promise<FilterCategoriesResponseDto> {
//     // Build base query for services
//     const serviceWhere: any = {};
//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }
//     // Get services with their business_services
//     const services = await this.prisma.service.findMany({
//       where: serviceWhere,
//       include: {
//         category: true,
//         businessServices: {
//           where: { isActive: true },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//     // Count categories
//     const categoryCount: Record<string, number> = {};
//     const locationCount: Record<string, number> = {};
//     for (const service of services) {
//       for (const bs of service.businessServices) {
//         const latestStatus = bs.business.statusHistory[0]?.status?.context;
//         if (latestStatus !== 'APPROVED') continue;
//         // Count category
//         const categoryName = service.category.name;
//         categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
//         // Count location
//         const locationArea = this.extractLocationArea(bs.business.address);
//         if (locationArea) {
//           locationCount[locationArea] = (locationCount[locationArea] || 0) + 1;
//         }
//       }
//     }
//     // Add "Near you" location if coordinates provided
//     if (latitude && longitude) {
//       locationCount['Near you'] = await this.countNearbyLocations(latitude, longitude, radius || 10);
//     }
//     // Format categories
//     const categories: FilterOptionDto[] = Object.entries(categoryCount)
//       .map(([name, count]) => ({ name, count, selected: false }))
//       .sort((a, b) => b.count - a.count);
//     // Format locations
//     const locations: FilterOptionDto[] = Object.entries(locationCount)
//       .map(([name, count]) => ({ name, count, selected: false }))
//       .sort((a, b) => b.count - a.count);
//     // Price ranges with counts
//     const priceRanges = await this.getPriceRangeCounts(query);
//     return {
//       categories,
//       locations,
//       price_ranges: priceRanges,
//     };
//   }
//   /**
//    * Get search suggestions for autocomplete
//    */
//   async getSearchSuggestions(query: string): Promise<SearchSuggestionsDto> {
//     if (!query || query.length < 2) {
//       return {
//         query,
//         service_suggestions: [],
//         category_suggestions: [],
//       };
//     }
//     // Search services
//     const services = await this.prisma.service.findMany({
//       where: {
//         title: {
//           contains: query,
//           mode: 'insensitive',
//         },
//       },
//       take: 5,
//     });
//     // Search categories
//     const categories = await this.prisma.category.findMany({
//       where: {
//         name: {
//           contains: query,
//           mode: 'insensitive',
//         },
//       },
//       take: 3,
//     });
//     return {
//       query,
//       service_suggestions: services.map(s => s.title),
//       category_suggestions: categories.map(c => c.name),
//     };
//   }
//   /**
//    * Get popular services for homepage
//    */
//   async getPopularServices(limit: number = 6): Promise<PopularServiceDto[]> {
//     const results = await this.prisma.$queryRaw<Array<any>>`
//       SELECT
//         s.id as service_id,
//         s.title as service_name,
//         c.name as category_name,
//         COUNT(DISTINCT bs.business_id) as provider_count,
//         MIN(bs.price) / 100 as min_price,
//         COALESCE(AVG(r.rating), 0) as average_rating
//       FROM services s
//       JOIN categories c ON s.category_id = c.id
//       JOIN business_service bs ON s.id = bs.service_id
//       LEFT JOIN bookings b ON bs.id = b.business_service_id
//       LEFT JOIN reviews r ON b.id = r.booking_id
//       WHERE bs.is_active = true
//       GROUP BY s.id, c.name
//       ORDER BY provider_count DESC, average_rating DESC
//       LIMIT ${limit}
//     `;
//     return results.map(r => ({
//       service_id: r.service_id,
//       service_name: r.service_name,
//       category_name: r.category_name,
//       provider_count: parseInt(r.provider_count, 10),
//       min_price: parseFloat(r.min_price),
//       average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
//     }));
//   }
//   /**
//    * Get single service details with all providers
//    */
//   async getServiceWithProviders(
//     serviceId: string,
//     userId: string | null,
//     latitude?: number,
//     longitude?: number,
//   ): Promise<ServiceDiscoveryResponseDto> {
//     const service = await this.prisma.service.findUnique({
//       where: { id: serviceId },
//       include: {
//         category: true,
//         businessServices: {
//           where: { isActive: true },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//                 operatingHours: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     if (!service) {
//       throw new Error('Service not found');
//     }
//     // Get client location if not provided
//     let userLat = latitude;
//     let userLng = longitude;
//     if (userId && !userLat && !userLng) {
//       const clientLocation = await this.getClientLocation(userId);
//       if (clientLocation) {
//         userLat = clientLocation.latitude;
//         userLng = clientLocation.longitude;
//       }
//     }
//     // Filter approved businesses
//     const approvedOffers = service.businessServices.filter(bs => {
//       const latestStatus = bs.business.statusHistory[0]?.status?.context;
//       return latestStatus === 'APPROVED';
//     });
//     // Build offers with details
//     const offers = await Promise.all(
//       approvedOffers.map(async (bs) => {
//         let distance = 0;
//         if (userLat && userLng) {
//           const businessLocation = await this.getBusinessLocation(bs.businessId);
//           if (businessLocation) {
//             distance = this.calculateDistance(
//               userLat,
//               userLng,
//               businessLocation.latitude,
//               businessLocation.longitude,
//             );
//           }
//         }
//         const ratingSummary = await this.getBusinessRatingSummary(bs.businessId);
//         const isOpen = await this.isBusinessOpen(bs.businessId, new Date());
//         const operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);
//         const isVerified = await this.isBusinessVerified(bs.businessId);
//         return {
//           business_service_id: bs.id,
//           business_id: bs.businessId,
//           business_name: bs.business.businessName,
//           business_address: bs.business.address,
//           business_phone: bs.business.contactPhone || undefined,
//           distance_km: Math.round(distance * 10) / 10,
//           price: Number(bs.price) / 100,
//           duration_minutes: bs.averageDuration,
//           average_rating: ratingSummary.average_rating,
//           total_reviews: ratingSummary.total_reviews,
//           is_open: isOpen,
//           is_verified: isVerified,
//           operating_hours_today: operatingHoursToday,
//         };
//       }),
//     );
//     // Sort by price by default
//     offers.sort((a: ServiceOfferDto, b: ServiceOfferDto) => a.price - b.price);
//     const prices = offers.map((o: ServiceOfferDto) => o.price);
//     return {
//       service_id: service.id,
//       service_name: service.title,
//       service_description: service.description || undefined,
//       category_id: service.categoryId,
//       category_name: service.category.name,
//       total_offers: offers.length,
//       provider_count: offers.length,
//       from_price: prices.length > 0 ? Math.min(...prices) : 0,
//       price_range: {
//         min: prices.length > 0 ? Math.min(...prices) : 0,
//         max: prices.length > 0 ? Math.max(...prices) : 0,
//       },
//       offers,
//     };
//   }
//   // ==================== PRIVATE HELPERS ====================
//   private async getClientLocation(userId: string): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number }>>`
//       SELECT
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM clients
//       WHERE user_id = ${userId}
//     `;
//     if (!result || result.length === 0) {
//       return null;
//     }
//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }
//   private async getBusinessLocation(businessId: string): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number }>>`
//       SELECT
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM businesses
//       WHERE id = ${businessId}
//     `;
//     if (!result || result.length === 0) {
//       return null;
//     }
//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }
//   private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//     const R = 6371;
//     const dLat = this.toRadians(lat2 - lat1);
//     const dLon = this.toRadians(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }
//   private toRadians(degrees: number): number {
//     return degrees * (Math.PI / 180);
//   }
//   private async getBusinessRatingSummary(businessId: string): Promise<{ average_rating: number; total_reviews: number }> {
//     const result = await this.prisma.review.aggregate({
//       where: {
//         booking: { businessId: businessId },
//       },
//       _avg: { rating: true },
//       _count: { _all: true },
//     });
//     return {
//       average_rating: Math.round((result._avg?.rating || 0) * 10) / 10,
//       total_reviews: result._count?._all || 0,
//     };
//   }
//   private async isBusinessOpen(businessId: string, dateTime: Date): Promise<boolean> {
//     const dayOfWeek = dateTime.getDay();
//     const timeStr = dateTime.toTimeString().slice(0, 5);
//     const hours = await this.prisma.operatingHour.findFirst({
//       where: {
//         businessId: businessId,
//         dayOfWeek: dayOfWeek,
//       },
//     });
//     if (!hours || !hours.openTime || !hours.closeTime) {
//       return false;
//     }
//     return timeStr >= hours.openTime && timeStr <= hours.closeTime;
//   }
//   private getOperatingHoursToday(operatingHours: any[]): string {
//     const today = new Date().getDay();
//     const todayHours = operatingHours.find(h => h.dayOfWeek === today);
//     if (!todayHours || !todayHours.openTime || !todayHours.closeTime) {
//       return 'Closed';
//     }
//     return `${todayHours.openTime} - ${todayHours.closeTime}`;
//   }
//   private async isBusinessVerified(businessId: string): Promise<boolean> {
//     const documents = await this.prisma.businessDocument.findMany({
//       where: {
//         businessId: businessId,
//         status: {
//           context: 'DOC_ACCEPTED',
//         },
//       },
//     });
//     return documents.length >= 2;
//   }
//   private extractLocationArea(address: string): string {
//     const areas = ['Zamalek', 'Maadi', 'Heliopolis', 'Downtown', 'Mohandessin', 'Nasr City', 'New Cairo'];
//     for (const area of areas) {
//       if (address.toLowerCase().includes(area.toLowerCase())) {
//         return area;
//       }
//     }
//     return 'Other';
//   }
//   private async countNearbyLocations(latitude: number, longitude: number, radiusKm: number): Promise<number> {
//     const radiusMeters = radiusKm * 1000;
//     const result = await this.prisma.$queryRaw<Array<{ count: number }>>`
//       SELECT COUNT(*)::int as count
//       FROM businesses b
//       WHERE EXISTS (
//         SELECT 1 FROM business_status bs
//         WHERE bs.business_id = b.id
//           AND bs.status_id = (SELECT id FROM statuses WHERE context = 'APPROVED')
//       )
//       AND ST_DWithin(
//         b.location,
//         ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//         ${radiusMeters}
//       )
//     `;
//     return result[0]?.count || 0;
//   }
//   private async getPriceRangeCounts(query?: string): Promise<FilterOptionDto[]> {
//     const serviceWhere: any = {};
//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }
//     const ranges = [
//       { name: 'Under EGP 100', min: 0, max: 100 },
//       { name: 'EGP 100 - 300', min: 100, max: 300 },
//       { name: 'EGP 300 - 500', min: 300, max: 500 },
//       { name: 'EGP 500 - 1000', min: 500, max: 1000 },
//       { name: 'Above EGP 1000', min: 1000, max: null },
//     ];
//     const priceRanges: FilterOptionDto[] = [];
//     for (const range of ranges) {
//       const whereCondition: any = {
//         ...serviceWhere,
//         businessServices: {
//           some: {
//             isActive: true,
//             price: {
//               ...(range.min !== undefined && { gte: range.min * 100 }),
//               ...(range.max != null && { lte: range.max * 100 }),
//             },
//             business: {
//               statusHistory: {
//                 some: {
//                   status: { context: 'APPROVED' },
//                 },
//               },
//             },
//           },
//         },
//       };
//       const count = await this.prisma.service.count({ where: whereCondition });
//       priceRanges.push({
//         name: range.name,
//         count,
//         selected: false,
//       });
//     }
//     return priceRanges;
//   }
//   private sortOffers(offers: ServiceOfferDto[], sortBy: SortBy): void {
//     switch (sortBy) {
//       case SortBy.PRICE_ASC:
//         offers.sort((a, b) => a.price - b.price);
//         break;
//       case SortBy.PRICE_DESC:
//         offers.sort((a, b) => b.price - a.price);
//         break;
//       case SortBy.DISTANCE_ASC:
//         offers.sort((a, b) => a.distance_km - b.distance_km);
//         break;
//       case SortBy.RATING_DESC:
//         offers.sort((a, b) => b.average_rating - a.average_rating);
//         break;
//       case SortBy.POPULARITY:
//         offers.sort((a, b) => b.total_reviews - a.total_reviews);
//         break;
//     }
//   }
//   private sortResults(results: ServiceDiscoveryResponseDto[], sortBy: SortBy): void {
//     switch (sortBy) {
//       case SortBy.PRICE_ASC:
//         results.sort((a, b) => a.from_price - b.from_price);
//         break;
//       case SortBy.PRICE_DESC:
//         results.sort((a, b) => b.from_price - a.from_price);
//         break;
//       case SortBy.RATING_DESC:
//         results.sort((a, b) => {
//           const avgRatingA = a.offers.reduce((sum, o) => sum + o.average_rating, 0) / a.offers.length;
//           const avgRatingB = b.offers.reduce((sum, o) => sum + o.average_rating, 0) / b.offers.length;
//           return avgRatingB - avgRatingA;
//         });
//         break;
//       default:
//         break;
//     }
//   }
// }
