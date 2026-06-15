"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.BusinessesController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_1 = require("multer");
var business_response_dto_1 = require("./dto/business-response.dto");
var provider_discovery_dto_1 = require("./dto/provider-discovery.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var BusinessesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Businesses'), (0, common_1.Controller)({ path: 'businesses', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createBusiness_decorators;
    var _getMyBusiness_decorators;
    var _updateMyBusiness_decorators;
    var _deleteMyBusiness_decorators;
    var _discoverProviders_decorators;
    var _getDiscoveryFilters_decorators;
    var _getMyHours_decorators;
    var _updateMyHours_decorators;
    var _uploadDocument_decorators;
    var _getMyDocuments_decorators;
    var _deleteDocument_decorators;
    var _getMyStats_decorators;
    var _uploadLogo_decorators;
    var _uploadCover_decorators;
    var _uploadGalleryImage_decorators;
    var _deleteGalleryImage_decorators;
    var _reorderGallery_decorators;
    var _getAllBusinesses_decorators;
    var _getNearbyBusinesses_decorators;
    var _getBusinessById_decorators;
    var _getBusinessHours_decorators;
    var _getAllBusinessesAdmin_decorators;
    var _updateBusinessStatus_decorators;
    var _updateDocumentStatus_decorators;
    var _getBusinessStats_decorators;
    var BusinessesController = _classThis = /** @class */ (function () {
        function BusinessesController_1(businessesService, providerDiscoveryService) {
            this.businessesService = (__runInitializers(this, _instanceExtraInitializers), businessesService);
            this.providerDiscoveryService = providerDiscoveryService;
        }
        // ==================== MANAGER ENDPOINTS ====================
        BusinessesController_1.prototype.createBusiness = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.createBusiness(user.id, dto)];
                });
            });
        };
        BusinessesController_1.prototype.getMyBusiness = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getMyBusiness(user.id)];
                });
            });
        };
        BusinessesController_1.prototype.updateMyBusiness = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.updateBusiness(user.id, business.id, dto)];
                    }
                });
            });
        };
        BusinessesController_1.prototype.deleteMyBusiness = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.deleteBusiness(user.id, business.id)];
                    }
                });
            });
        };
        // ==================== PROVIDER DISCOVERY (CLIENT) ====================
        BusinessesController_1.prototype.discoverProviders = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.providerDiscoveryService.searchProviders((user === null || user === void 0 ? void 0 : user.id) || null, dto)];
                });
            });
        };
        BusinessesController_1.prototype.getDiscoveryFilters = function (latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.providerDiscoveryService.getFilterOptions(latitude ? parseFloat(latitude) : undefined, longitude ? parseFloat(longitude) : undefined)];
                });
            });
        };
        // ==================== OPERATING HOURS ====================
        BusinessesController_1.prototype.getMyHours = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.getOperatingHours(business.id)];
                    }
                });
            });
        };
        BusinessesController_1.prototype.updateMyHours = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.updateOperatingHours(business.id, dto.hours)];
                    }
                });
            });
        };
        // ==================== BUSINESS DOCUMENTS ====================
        BusinessesController_1.prototype.uploadDocument = function (user, file, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('File is required');
                            }
                            return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.uploadDocument(user.id, business.id, file, dto)];
                    }
                });
            });
        };
        BusinessesController_1.prototype.getMyDocuments = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var business, fullBusiness;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [4 /*yield*/, this.businessesService.getBusinessWithDetails(business.id)];
                        case 2:
                            fullBusiness = _a.sent();
                            return [2 /*return*/, fullBusiness.documents];
                    }
                });
            });
        };
        BusinessesController_1.prototype.deleteDocument = function (user, documentId) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.deleteDocument(user.id, business.id, documentId)];
                    }
                });
            });
        };
        // ==================== BUSINESS STATISTICS ====================
        BusinessesController_1.prototype.getMyStats = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.businessesService.getMyBusiness(user.id)];
                        case 1:
                            business = _a.sent();
                            return [2 /*return*/, this.businessesService.getBusinessStats(business.id)];
                    }
                });
            });
        };
        BusinessesController_1.prototype.uploadLogo = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!file) {
                        throw new common_1.BadRequestException('File is required');
                    }
                    return [2 /*return*/, this.businessesService.uploadBusinessImage(user.id, file, 'logo')];
                });
            });
        };
        BusinessesController_1.prototype.uploadCover = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!file) {
                        throw new common_1.BadRequestException('File is required');
                    }
                    return [2 /*return*/, this.businessesService.uploadBusinessImage(user.id, file, 'cover')];
                });
            });
        };
        BusinessesController_1.prototype.uploadGalleryImage = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!file) {
                        throw new common_1.BadRequestException('File is required');
                    }
                    return [2 /*return*/, this.businessesService.uploadBusinessImage(user.id, file, 'gallery')];
                });
            });
        };
        BusinessesController_1.prototype.deleteGalleryImage = function (user, url) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!url) {
                        throw new common_1.BadRequestException('URL is required');
                    }
                    return [2 /*return*/, this.businessesService.deleteGalleryImage(user.id, url)];
                });
            });
        };
        BusinessesController_1.prototype.reorderGallery = function (user, urls) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!urls || !Array.isArray(urls)) {
                        throw new common_1.BadRequestException('URLs array is required');
                    }
                    return [2 /*return*/, this.businessesService.reorderGallery(user.id, urls)];
                });
            });
        };
        // ==================== PUBLIC ENDPOINTS ====================
        BusinessesController_1.prototype.getAllBusinesses = function () {
            return __awaiter(this, arguments, void 0, function (page, limit, search) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getApprovedBusinesses(page, limit, search)];
                });
            });
        };
        BusinessesController_1.prototype.getNearbyBusinesses = function (lat_1, lng_1) {
            return __awaiter(this, arguments, void 0, function (lat, lng, radius, page, limit) {
                if (radius === void 0) { radius = '10'; }
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getNearbyBusinesses(parseFloat(lat), parseFloat(lng), parseFloat(radius), page, limit)];
                });
            });
        };
        BusinessesController_1.prototype.getBusinessById = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getBusinessWithDetails(businessId)];
                });
            });
        };
        BusinessesController_1.prototype.getBusinessHours = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getOperatingHours(businessId)];
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        BusinessesController_1.prototype.getAllBusinessesAdmin = function (status_1) {
            return __awaiter(this, arguments, void 0, function (status, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getAllBusinesses(status, page, limit)];
                });
            });
        };
        BusinessesController_1.prototype.updateBusinessStatus = function (businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.updateBusinessStatus(businessId, dto)];
                });
            });
        };
        BusinessesController_1.prototype.updateDocumentStatus = function (documentId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.updateDocumentStatus(documentId, dto)];
                });
            });
        };
        BusinessesController_1.prototype.getBusinessStats = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.businessesService.getBusinessStats(businessId)];
                });
            });
        };
        return BusinessesController_1;
    }());
    __setFunctionName(_classThis, "BusinessesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createBusiness_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Register a new business (manager only)' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Business created',
                type: business_response_dto_1.BusinessResponseDto,
            })];
        _getMyBusiness_decorators = [(0, common_1.Get)('me'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get my business' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Business details',
                type: business_response_dto_1.BusinessResponseDto,
            })];
        _updateMyBusiness_decorators = [(0, common_1.Put)('me'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update my business' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Business updated',
                type: business_response_dto_1.BusinessResponseDto,
            })];
        _deleteMyBusiness_decorators = [(0, common_1.Delete)('me'), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Close my business' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Business closed' })];
        _discoverProviders_decorators = [(0, common_1.Get)('discover'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({
                summary: 'Discover providers with search, filters, and sorting',
            }), (0, swagger_1.ApiQuery)({
                name: 'search',
                required: false,
                description: 'Search by business name',
            }), (0, swagger_1.ApiQuery)({
                name: 'latitude',
                required: false,
                type: Number,
                description: 'User latitude',
            }), (0, swagger_1.ApiQuery)({
                name: 'longitude',
                required: false,
                type: Number,
                description: 'User longitude',
            }), (0, swagger_1.ApiQuery)({
                name: 'filters[service]',
                required: false,
                enum: ['Wash', 'Repair', 'both'],
                description: 'Service type filter',
            }), (0, swagger_1.ApiQuery)({
                name: 'filters[max_distance]',
                required: false,
                type: Number,
                description: 'Maximum distance in km',
            }), (0, swagger_1.ApiQuery)({
                name: 'filters[min_rating]',
                required: false,
                type: Number,
                description: 'Minimum rating (0-5)',
            }), (0, swagger_1.ApiQuery)({
                name: 'filters[open_now]',
                required: false,
                type: Boolean,
                description: 'Only show open now',
            }), (0, swagger_1.ApiQuery)({
                name: 'filters[verified_only]',
                required: false,
                type: Boolean,
                description: 'Only verified providers',
            }), (0, swagger_1.ApiQuery)({
                name: 'sort_by',
                required: false,
                enum: ['highest_rated', 'nearest', 'most_reviews', 'newest', 'oldest'],
                description: 'Sort by',
            }), (0, swagger_1.ApiQuery)({
                name: 'page',
                required: false,
                type: Number,
                description: 'Page number',
            }), (0, swagger_1.ApiQuery)({
                name: 'limit',
                required: false,
                type: Number,
                description: 'Page size',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Providers found',
                type: provider_discovery_dto_1.ProviderDiscoveryResponseDto,
            })];
        _getDiscoveryFilters_decorators = [(0, common_1.Get)('discover/filters'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get filter options for provider discovery' }), (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Filter options' })];
        _getMyHours_decorators = [(0, common_1.Get)('me/hours'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get my business operating hours' })];
        _updateMyHours_decorators = [(0, common_1.Put)('me/hours'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update my business operating hours' })];
        _uploadDocument_decorators = [(0, common_1.Post)('me/documents'), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Upload business document' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['file', 'type'],
                    properties: {
                        file: { type: 'string', format: 'binary' },
                        type: {
                            type: 'string',
                            enum: [
                                'BUSINESS_REGISTRATION',
                                'OWNER_ID',
                                'INSURANCE_CERTIFICATE',
                                'SERVICE_LICENSE',
                            ],
                        },
                    },
                },
            })];
        _getMyDocuments_decorators = [(0, common_1.Get)('me/documents'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get my business documents' })];
        _deleteDocument_decorators = [(0, common_1.Delete)('me/documents/:documentId'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete business document' })];
        _getMyStats_decorators = [(0, common_1.Get)('me/stats'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get my business statistics' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Business statistics',
                type: business_response_dto_1.BusinessStatsDto,
            })];
        _uploadLogo_decorators = [(0, common_1.Put)('me/logo'), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Upload or replace business logo' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                    },
                    required: ['file'],
                },
            })];
        _uploadCover_decorators = [(0, common_1.Put)('me/cover'), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Upload or replace business cover photo' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                    },
                    required: ['file'],
                },
            })];
        _uploadGalleryImage_decorators = [(0, common_1.Post)('me/gallery'), (0, roles_decorator_1.Roles)('MANAGER'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Upload an image to business gallery' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                    },
                    required: ['file'],
                },
            })];
        _deleteGalleryImage_decorators = [(0, common_1.Delete)('me/gallery'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete a gallery image by URL' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        url: { type: 'string' },
                    },
                    required: ['url'],
                },
            })];
        _reorderGallery_decorators = [(0, common_1.Put)('me/gallery/reorder'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Reorder business gallery images' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        urls: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['urls'],
                },
            })];
        _getAllBusinesses_decorators = [(0, common_1.Get)(), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all approved businesses (public)' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiQuery)({
                name: 'search',
                required: false,
                description: 'Search by business name',
            })];
        _getNearbyBusinesses_decorators = [(0, common_1.Get)('nearby'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Find nearby businesses (public)' }), (0, swagger_1.ApiQuery)({ name: 'lat', required: true, type: Number }), (0, swagger_1.ApiQuery)({ name: 'lng', required: true, type: Number }), (0, swagger_1.ApiQuery)({
                name: 'radius',
                required: false,
                type: Number,
                description: 'Radius in km',
                example: 10,
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _getBusinessById_decorators = [(0, common_1.Get)('details/:businessId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get business by ID (public)' }), (0, swagger_1.ApiParam)({ name: 'businessId', description: 'Business UUID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Business details',
                type: business_response_dto_1.BusinessResponseDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' })];
        _getBusinessHours_decorators = [(0, common_1.Get)(':businessId/hours'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get business operating hours' })];
        _getAllBusinessesAdmin_decorators = [(0, common_1.Get)('admin/all'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get all businesses with filters (admin only)' }), (0, swagger_1.ApiQuery)({
                name: 'status',
                required: false,
                enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'],
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _updateBusinessStatus_decorators = [(0, common_1.Put)('admin/:businessId/status'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update business status (admin only)' })];
        _updateDocumentStatus_decorators = [(0, common_1.Put)('admin/documents/:documentId/status'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update document status (admin only)' })];
        _getBusinessStats_decorators = [(0, common_1.Get)('admin/:businessId/stats'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get business statistics (admin/manager)' })];
        __esDecorate(_classThis, null, _createBusiness_decorators, { kind: "method", name: "createBusiness", static: false, private: false, access: { has: function (obj) { return "createBusiness" in obj; }, get: function (obj) { return obj.createBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyBusiness_decorators, { kind: "method", name: "getMyBusiness", static: false, private: false, access: { has: function (obj) { return "getMyBusiness" in obj; }, get: function (obj) { return obj.getMyBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMyBusiness_decorators, { kind: "method", name: "updateMyBusiness", static: false, private: false, access: { has: function (obj) { return "updateMyBusiness" in obj; }, get: function (obj) { return obj.updateMyBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteMyBusiness_decorators, { kind: "method", name: "deleteMyBusiness", static: false, private: false, access: { has: function (obj) { return "deleteMyBusiness" in obj; }, get: function (obj) { return obj.deleteMyBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _discoverProviders_decorators, { kind: "method", name: "discoverProviders", static: false, private: false, access: { has: function (obj) { return "discoverProviders" in obj; }, get: function (obj) { return obj.discoverProviders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDiscoveryFilters_decorators, { kind: "method", name: "getDiscoveryFilters", static: false, private: false, access: { has: function (obj) { return "getDiscoveryFilters" in obj; }, get: function (obj) { return obj.getDiscoveryFilters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyHours_decorators, { kind: "method", name: "getMyHours", static: false, private: false, access: { has: function (obj) { return "getMyHours" in obj; }, get: function (obj) { return obj.getMyHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMyHours_decorators, { kind: "method", name: "updateMyHours", static: false, private: false, access: { has: function (obj) { return "updateMyHours" in obj; }, get: function (obj) { return obj.updateMyHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadDocument_decorators, { kind: "method", name: "uploadDocument", static: false, private: false, access: { has: function (obj) { return "uploadDocument" in obj; }, get: function (obj) { return obj.uploadDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyDocuments_decorators, { kind: "method", name: "getMyDocuments", static: false, private: false, access: { has: function (obj) { return "getMyDocuments" in obj; }, get: function (obj) { return obj.getMyDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteDocument_decorators, { kind: "method", name: "deleteDocument", static: false, private: false, access: { has: function (obj) { return "deleteDocument" in obj; }, get: function (obj) { return obj.deleteDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyStats_decorators, { kind: "method", name: "getMyStats", static: false, private: false, access: { has: function (obj) { return "getMyStats" in obj; }, get: function (obj) { return obj.getMyStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadLogo_decorators, { kind: "method", name: "uploadLogo", static: false, private: false, access: { has: function (obj) { return "uploadLogo" in obj; }, get: function (obj) { return obj.uploadLogo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadCover_decorators, { kind: "method", name: "uploadCover", static: false, private: false, access: { has: function (obj) { return "uploadCover" in obj; }, get: function (obj) { return obj.uploadCover; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadGalleryImage_decorators, { kind: "method", name: "uploadGalleryImage", static: false, private: false, access: { has: function (obj) { return "uploadGalleryImage" in obj; }, get: function (obj) { return obj.uploadGalleryImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteGalleryImage_decorators, { kind: "method", name: "deleteGalleryImage", static: false, private: false, access: { has: function (obj) { return "deleteGalleryImage" in obj; }, get: function (obj) { return obj.deleteGalleryImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reorderGallery_decorators, { kind: "method", name: "reorderGallery", static: false, private: false, access: { has: function (obj) { return "reorderGallery" in obj; }, get: function (obj) { return obj.reorderGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllBusinesses_decorators, { kind: "method", name: "getAllBusinesses", static: false, private: false, access: { has: function (obj) { return "getAllBusinesses" in obj; }, get: function (obj) { return obj.getAllBusinesses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNearbyBusinesses_decorators, { kind: "method", name: "getNearbyBusinesses", static: false, private: false, access: { has: function (obj) { return "getNearbyBusinesses" in obj; }, get: function (obj) { return obj.getNearbyBusinesses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessById_decorators, { kind: "method", name: "getBusinessById", static: false, private: false, access: { has: function (obj) { return "getBusinessById" in obj; }, get: function (obj) { return obj.getBusinessById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessHours_decorators, { kind: "method", name: "getBusinessHours", static: false, private: false, access: { has: function (obj) { return "getBusinessHours" in obj; }, get: function (obj) { return obj.getBusinessHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllBusinessesAdmin_decorators, { kind: "method", name: "getAllBusinessesAdmin", static: false, private: false, access: { has: function (obj) { return "getAllBusinessesAdmin" in obj; }, get: function (obj) { return obj.getAllBusinessesAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBusinessStatus_decorators, { kind: "method", name: "updateBusinessStatus", static: false, private: false, access: { has: function (obj) { return "updateBusinessStatus" in obj; }, get: function (obj) { return obj.updateBusinessStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDocumentStatus_decorators, { kind: "method", name: "updateDocumentStatus", static: false, private: false, access: { has: function (obj) { return "updateDocumentStatus" in obj; }, get: function (obj) { return obj.updateDocumentStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessStats_decorators, { kind: "method", name: "getBusinessStats", static: false, private: false, access: { has: function (obj) { return "getBusinessStats" in obj; }, get: function (obj) { return obj.getBusinessStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BusinessesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BusinessesController = _classThis;
}();
exports.BusinessesController = BusinessesController;
