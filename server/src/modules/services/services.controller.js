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
exports.ServicesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var service_discovery_dto_1 = require("./dto/service-discovery.dto");
var ServicesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Services'), (0, common_1.Controller)({ path: 'services', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllCategories_decorators;
    var _getCategoryById_decorators;
    var _createCategory_decorators;
    var _deleteCategory_decorators;
    var _searchServices_decorators;
    var _getFilterOptions_decorators;
    var _getSearchSuggestions_decorators;
    var _getPopularServices_decorators;
    var _getAllServices_decorators;
    var _getServiceById_decorators;
    var _getServiceWithProviders_decorators;
    var _createService_decorators;
    var _updateService_decorators;
    var _deleteService_decorators;
    var _getUnassignedServices_decorators;
    var _getBusinessServices_decorators;
    var _getBusinessServicesByCategory_decorators;
    var _getMyAssignedServices_decorators;
    var _assignServiceToBusiness_decorators;
    var _bulkAssignServicesToBusiness_decorators;
    var _getBusinessServiceById_decorators;
    var _updateBusinessService_decorators;
    var _toggleServiceStatus_decorators;
    var _removeServiceFromBusiness_decorators;
    var ServicesController = _classThis = /** @class */ (function () {
        function ServicesController_1(servicesService, serviceDiscoveryService) {
            this.servicesService = (__runInitializers(this, _instanceExtraInitializers), servicesService);
            this.serviceDiscoveryService = serviceDiscoveryService;
        }
        // ==================== CATEGORY ENDPOINTS ====================
        ServicesController_1.prototype.getAllCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getAllCategories()];
                });
            });
        };
        ServicesController_1.prototype.getCategoryById = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getCategoryById(categoryId)];
                });
            });
        };
        ServicesController_1.prototype.createCategory = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.createCategory(user.id, dto)];
                });
            });
        };
        ServicesController_1.prototype.deleteCategory = function (user, categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.deleteCategory(user.id, categoryId)];
                });
            });
        };
        // ==================== SERVICE DISCOVERY (CLIENT SEARCH) ====================
        ServicesController_1.prototype.searchServices = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceDiscoveryService.searchServices((user === null || user === void 0 ? void 0 : user.id) || null, dto)];
                });
            });
        };
        ServicesController_1.prototype.getFilterOptions = function (query, latitude, longitude, radius) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceDiscoveryService.getFilterOptions(query, latitude ? parseFloat(latitude) : undefined, longitude ? parseFloat(longitude) : undefined, radius ? parseFloat(radius) : undefined)];
                });
            });
        };
        ServicesController_1.prototype.getSearchSuggestions = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceDiscoveryService.getSearchSuggestions(query)];
                });
            });
        };
        ServicesController_1.prototype.getPopularServices = function (limit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceDiscoveryService.getPopularServices(limit ? parseInt(limit, 10) : 6)];
                });
            });
        };
        // ==================== SERVICE CATALOG ENDPOINTS (Admin) ====================
        ServicesController_1.prototype.getAllServices = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getAllServices(categoryId)];
                });
            });
        };
        // NOTE: @Get(':serviceId') comes AFTER all /discover/* and /business/* routes
        // to prevent NestJS from swallowing those literal paths as UUID params.
        ServicesController_1.prototype.getServiceById = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getServiceById(serviceId)];
                });
            });
        };
        ServicesController_1.prototype.getServiceWithProviders = function (serviceId, user, latitude, longitude) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.serviceDiscoveryService.getServiceWithProviders(serviceId, (user === null || user === void 0 ? void 0 : user.id) || null, latitude ? parseFloat(latitude) : undefined, longitude ? parseFloat(longitude) : undefined)];
                });
            });
        };
        ServicesController_1.prototype.createService = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.createService(user.id, dto)];
                });
            });
        };
        ServicesController_1.prototype.updateService = function (user, serviceId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.updateService(user.id, serviceId, dto)];
                });
            });
        };
        ServicesController_1.prototype.deleteService = function (user, serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.deleteService(user.id, serviceId)];
                });
            });
        };
        // ==================== BUSINESS SERVICE ASSIGNMENT (Manager) ====================
        ServicesController_1.prototype.getUnassignedServices = function (user, businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getUnassignedServicesForBusiness(user.id, businessId)];
                });
            });
        };
        ServicesController_1.prototype.getBusinessServices = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getAvailableServicesForBusiness(businessId)];
                });
            });
        };
        ServicesController_1.prototype.getBusinessServicesByCategory = function (businessId, categoryName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getAvailableServicesByCategory(businessId, categoryName)];
                });
            });
        };
        ServicesController_1.prototype.getMyAssignedServices = function (user, businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.servicesService.verifyBusinessOwnership(user.id, businessId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.servicesService.getBusinessServices(businessId, true)];
                    }
                });
            });
        };
        ServicesController_1.prototype.assignServiceToBusiness = function (user, businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.assignServiceToBusiness(user.id, businessId, dto)];
                });
            });
        };
        ServicesController_1.prototype.bulkAssignServicesToBusiness = function (user, businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.bulkAssignServicesToBusiness(user.id, businessId, dto)];
                });
            });
        };
        ServicesController_1.prototype.getBusinessServiceById = function (businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.getBusinessServiceById(businessServiceId)];
                });
            });
        };
        ServicesController_1.prototype.updateBusinessService = function (user, businessId, businessServiceId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.updateBusinessService(user.id, businessId, businessServiceId, dto)];
                });
            });
        };
        ServicesController_1.prototype.toggleServiceStatus = function (user, businessId, businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.toggleServiceStatus(user.id, businessId, businessServiceId)];
                });
            });
        };
        ServicesController_1.prototype.removeServiceFromBusiness = function (user, businessId, businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.servicesService.removeServiceFromBusiness(user.id, businessId, businessServiceId)];
                });
            });
        };
        return ServicesController_1;
    }());
    __setFunctionName(_classThis, "ServicesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllCategories_decorators = [(0, common_1.Get)('categories'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all service categories' })];
        _getCategoryById_decorators = [(0, common_1.Get)('categories/:categoryId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' })];
        _createCategory_decorators = [(0, common_1.Post)('categories'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new category (admin only)' })];
        _deleteCategory_decorators = [(0, common_1.Delete)('categories/:categoryId'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete category (admin only)' })];
        _searchServices_decorators = [(0, common_1.Get)('discover/search'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({
                summary: 'Search services across all providers (client discovery)',
            }), (0, swagger_1.ApiQuery)({ name: 'query', required: false, description: 'Service name to search' }), (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Single category filter (shorthand)' }), (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number, description: 'User latitude' }), (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number, description: 'User longitude' }), (0, swagger_1.ApiQuery)({ name: 'filters[radius]', required: false, type: Number, description: 'Search radius in km (default: 20)' }), (0, swagger_1.ApiQuery)({ name: 'filters[min_price]', required: false, type: Number, description: 'Minimum price (EGP)' }), (0, swagger_1.ApiQuery)({ name: 'filters[max_price]', required: false, type: Number, description: 'Maximum price (EGP)' }), (0, swagger_1.ApiQuery)({ name: 'filters[min_rating]', required: false, type: Number, description: 'Minimum rating (0-5)' }), (0, swagger_1.ApiQuery)({ name: 'filters[open_now]', required: false, type: Boolean, description: 'Only show open businesses' }), (0, swagger_1.ApiQuery)({ name: 'filters[verified_only]', required: false, type: Boolean, description: 'Only verified providers' }), (0, swagger_1.ApiQuery)({ name: 'filters[categories][]', required: false, type: [String], description: 'Category filter list' }), (0, swagger_1.ApiQuery)({ name: 'filters[locations][]', required: false, type: [String], description: 'Location filter list' }), (0, swagger_1.ApiQuery)({ name: 'sort_by', required: false, enum: service_discovery_dto_1.SortBy, description: 'Sort order' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 50)' })];
        _getFilterOptions_decorators = [(0, common_1.Get)('discover/filters'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get available filter options (categories, locations, price ranges)' }), (0, swagger_1.ApiQuery)({ name: 'query', required: false, description: 'Optional search query to scope filters' }), (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number })];
        _getSearchSuggestions_decorators = [(0, common_1.Get)('discover/suggestions'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get search suggestions for autocomplete' }), (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Search query (min 2 chars)' })];
        _getPopularServices_decorators = [(0, common_1.Get)('discover/popular'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get popular services for homepage' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of results (default: 6)' })];
        _getAllServices_decorators = [(0, common_1.Get)(), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all services from catalog (no prices)' }), (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false })];
        _getServiceById_decorators = [(0, common_1.Get)(':serviceId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get service by ID from catalog' })];
        _getServiceWithProviders_decorators = [(0, common_1.Get)(':serviceId/providers'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all providers for a specific service' }), (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'Service UUID' }), (0, swagger_1.ApiQuery)({ name: 'latitude', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'longitude', required: false, type: Number })];
        _createService_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new service in catalog (admin only - no price)' })];
        _updateService_decorators = [(0, common_1.Put)(':serviceId'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update service in catalog (admin only)' })];
        _deleteService_decorators = [(0, common_1.Delete)(':serviceId'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete service from catalog (admin only)' })];
        _getUnassignedServices_decorators = [(0, common_1.Get)('business/:businessId/unassigned'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get unassigned services for my business (manager only)' })];
        _getBusinessServices_decorators = [(0, common_1.Get)('business/:businessId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get available services for a business (public - with prices)' })];
        _getBusinessServicesByCategory_decorators = [(0, common_1.Get)('business/:businessId/category/:categoryName'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get services by category for a business (public)' })];
        _getMyAssignedServices_decorators = [(0, common_1.Get)('business/:businessId/assigned'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get all assigned services with prices for my business (manager only)' })];
        _assignServiceToBusiness_decorators = [(0, common_1.Post)('business/:businessId/assign'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Assign a service to my business with price (manager only)' })];
        _bulkAssignServicesToBusiness_decorators = [(0, common_1.Post)('business/:businessId/assign/bulk'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Bulk assign services to my business (manager only)' })];
        _getBusinessServiceById_decorators = [(0, common_1.Get)('assigned/:businessServiceId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get assigned service details by ID' })];
        _updateBusinessService_decorators = [(0, common_1.Put)('business/:businessId/assigned/:businessServiceId'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update assigned service price/duration (manager only)' })];
        _toggleServiceStatus_decorators = [(0, common_1.Patch)('business/:businessId/assigned/:businessServiceId/toggle'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Toggle service active status (manager only)' })];
        _removeServiceFromBusiness_decorators = [(0, common_1.Delete)('business/:businessId/assigned/:businessServiceId'), (0, roles_decorator_1.Roles)('MANAGER'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Remove service from business (manager only)' })];
        __esDecorate(_classThis, null, _getAllCategories_decorators, { kind: "method", name: "getAllCategories", static: false, private: false, access: { has: function (obj) { return "getAllCategories" in obj; }, get: function (obj) { return obj.getAllCategories; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCategoryById_decorators, { kind: "method", name: "getCategoryById", static: false, private: false, access: { has: function (obj) { return "getCategoryById" in obj; }, get: function (obj) { return obj.getCategoryById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCategory_decorators, { kind: "method", name: "createCategory", static: false, private: false, access: { has: function (obj) { return "createCategory" in obj; }, get: function (obj) { return obj.createCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteCategory_decorators, { kind: "method", name: "deleteCategory", static: false, private: false, access: { has: function (obj) { return "deleteCategory" in obj; }, get: function (obj) { return obj.deleteCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchServices_decorators, { kind: "method", name: "searchServices", static: false, private: false, access: { has: function (obj) { return "searchServices" in obj; }, get: function (obj) { return obj.searchServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFilterOptions_decorators, { kind: "method", name: "getFilterOptions", static: false, private: false, access: { has: function (obj) { return "getFilterOptions" in obj; }, get: function (obj) { return obj.getFilterOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSearchSuggestions_decorators, { kind: "method", name: "getSearchSuggestions", static: false, private: false, access: { has: function (obj) { return "getSearchSuggestions" in obj; }, get: function (obj) { return obj.getSearchSuggestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPopularServices_decorators, { kind: "method", name: "getPopularServices", static: false, private: false, access: { has: function (obj) { return "getPopularServices" in obj; }, get: function (obj) { return obj.getPopularServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllServices_decorators, { kind: "method", name: "getAllServices", static: false, private: false, access: { has: function (obj) { return "getAllServices" in obj; }, get: function (obj) { return obj.getAllServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServiceById_decorators, { kind: "method", name: "getServiceById", static: false, private: false, access: { has: function (obj) { return "getServiceById" in obj; }, get: function (obj) { return obj.getServiceById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServiceWithProviders_decorators, { kind: "method", name: "getServiceWithProviders", static: false, private: false, access: { has: function (obj) { return "getServiceWithProviders" in obj; }, get: function (obj) { return obj.getServiceWithProviders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createService_decorators, { kind: "method", name: "createService", static: false, private: false, access: { has: function (obj) { return "createService" in obj; }, get: function (obj) { return obj.createService; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateService_decorators, { kind: "method", name: "updateService", static: false, private: false, access: { has: function (obj) { return "updateService" in obj; }, get: function (obj) { return obj.updateService; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteService_decorators, { kind: "method", name: "deleteService", static: false, private: false, access: { has: function (obj) { return "deleteService" in obj; }, get: function (obj) { return obj.deleteService; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUnassignedServices_decorators, { kind: "method", name: "getUnassignedServices", static: false, private: false, access: { has: function (obj) { return "getUnassignedServices" in obj; }, get: function (obj) { return obj.getUnassignedServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessServices_decorators, { kind: "method", name: "getBusinessServices", static: false, private: false, access: { has: function (obj) { return "getBusinessServices" in obj; }, get: function (obj) { return obj.getBusinessServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessServicesByCategory_decorators, { kind: "method", name: "getBusinessServicesByCategory", static: false, private: false, access: { has: function (obj) { return "getBusinessServicesByCategory" in obj; }, get: function (obj) { return obj.getBusinessServicesByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyAssignedServices_decorators, { kind: "method", name: "getMyAssignedServices", static: false, private: false, access: { has: function (obj) { return "getMyAssignedServices" in obj; }, get: function (obj) { return obj.getMyAssignedServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignServiceToBusiness_decorators, { kind: "method", name: "assignServiceToBusiness", static: false, private: false, access: { has: function (obj) { return "assignServiceToBusiness" in obj; }, get: function (obj) { return obj.assignServiceToBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bulkAssignServicesToBusiness_decorators, { kind: "method", name: "bulkAssignServicesToBusiness", static: false, private: false, access: { has: function (obj) { return "bulkAssignServicesToBusiness" in obj; }, get: function (obj) { return obj.bulkAssignServicesToBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBusinessServiceById_decorators, { kind: "method", name: "getBusinessServiceById", static: false, private: false, access: { has: function (obj) { return "getBusinessServiceById" in obj; }, get: function (obj) { return obj.getBusinessServiceById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBusinessService_decorators, { kind: "method", name: "updateBusinessService", static: false, private: false, access: { has: function (obj) { return "updateBusinessService" in obj; }, get: function (obj) { return obj.updateBusinessService; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleServiceStatus_decorators, { kind: "method", name: "toggleServiceStatus", static: false, private: false, access: { has: function (obj) { return "toggleServiceStatus" in obj; }, get: function (obj) { return obj.toggleServiceStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeServiceFromBusiness_decorators, { kind: "method", name: "removeServiceFromBusiness", static: false, private: false, access: { has: function (obj) { return "removeServiceFromBusiness" in obj; }, get: function (obj) { return obj.removeServiceFromBusiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServicesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServicesController = _classThis;
}();
exports.ServicesController = ServicesController;
// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Patch,
//   Delete,
//   Body,
//   Param,
//   Query,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiQuery,
//   ApiParam,
// } from '@nestjs/swagger';
// import { ServicesService } from './services.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { CreateServiceDto } from './dto/create-service.dto';
// import { UpdateServiceDto } from './dto/update-service.dto';
// import {
//   AssignServiceToBusinessDto,
//   BulkAssignServicesDto,
// } from './dto/assign-service-to-business.dto';
// import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
// import {
//   ServiceCatalogResponseDto,
//   AssignedBusinessServiceResponseDto,
//   CategoryResponseDto,
//   BulkAssignResponseDto,
//   AvailableServiceDto,
// } from './dto/service-response.dto';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Public } from '../../common/decorators/public.decorator';
// import {
//   FilterCategoriesResponseDto,
//   PopularServiceDto,
//   SearchServicesDto,
//   SearchSuggestionsDto,
//   ServiceDiscoveryResponseDto,
//   SortBy,
// } from './dto/service-discovery.dto';
// import { ServiceDiscoveryService } from './service-discovery.service';
// @ApiTags('Services')
// @Controller({ path: 'services', version: '1' })
// export class ServicesController {
//   constructor(
//     private readonly servicesService: ServicesService,
//     private readonly serviceDiscoveryService: ServiceDiscoveryService,
//   ) {}
//   // ==================== CATEGORY ENDPOINTS (Admin) ====================
//   @Get('categories')
//   @Public()
//   @ApiOperation({ summary: 'Get all service categories' })
//   async getAllCategories(): Promise<CategoryResponseDto[]> {
//     return this.servicesService.getAllCategories();
//   }
//   @Get('categories/:categoryId')
//   @Public()
//   @ApiOperation({ summary: 'Get category by ID' })
//   async getCategoryById(
//     @Param('categoryId', ParseUUIDPipe) categoryId: string,
//   ): Promise<CategoryResponseDto> {
//     return this.servicesService.getCategoryById(categoryId);
//   }
//   @Post('categories')
//   @Roles('ADMIN')
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Create a new category (admin only)' })
//   async createCategory(
//     @CurrentUser() user: any,
//     @Body() dto: CreateCategoryDto,
//   ): Promise<CategoryResponseDto> {
//     return this.servicesService.createCategory(user.id, dto);
//   }
//   @Delete('categories/:categoryId')
//   @Roles('ADMIN')
//   @ApiBearerAuth()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete category (admin only)' })
//   async deleteCategory(
//     @CurrentUser() user: any,
//     @Param('categoryId', ParseUUIDPipe) categoryId: string,
//   ): Promise<{ message: string }> {
//     return this.servicesService.deleteCategory(user.id, categoryId);
//   }
//   // ==================== SERVICE CATALOG ENDPOINTS (Admin only) ====================
//   @Get()
//   @Public()
//   @ApiOperation({ summary: 'Get all services from catalog (no prices)' })
//   @ApiQuery({ name: 'categoryId', required: false })
//   async getAllServices(
//     @Query('categoryId') categoryId?: string,
//   ): Promise<ServiceCatalogResponseDto[]> {
//     return this.servicesService.getAllServices(categoryId);
//   }
//   @Get(':serviceId')
//   @Public()
//   @ApiOperation({ summary: 'Get service by ID from catalog' })
//   async getServiceById(
//     @Param('serviceId', ParseUUIDPipe) serviceId: string,
//   ): Promise<ServiceCatalogResponseDto> {
//     return this.servicesService.getServiceById(serviceId);
//   }
//   @Post()
//   @Roles('ADMIN')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Create a new service in catalog (admin only - no price)',
//   })
//   async createService(
//     @CurrentUser() user: any,
//     @Body() dto: CreateServiceDto,
//   ): Promise<ServiceCatalogResponseDto> {
//     return this.servicesService.createService(user.id, dto);
//   }
//   @Put(':serviceId')
//   @Roles('ADMIN')
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Update service in catalog (admin only)' })
//   async updateService(
//     @CurrentUser() user: any,
//     @Param('serviceId', ParseUUIDPipe) serviceId: string,
//     @Body() dto: UpdateServiceDto,
//   ): Promise<ServiceCatalogResponseDto> {
//     return this.servicesService.updateService(user.id, serviceId, dto);
//   }
//   @Delete(':serviceId')
//   @Roles('ADMIN')
//   @ApiBearerAuth()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete service from catalog (admin only)' })
//   async deleteService(
//     @CurrentUser() user: any,
//     @Param('serviceId', ParseUUIDPipe) serviceId: string,
//   ): Promise<{ message: string }> {
//     return this.servicesService.deleteService(user.id, serviceId);
//   }
//   // ==================== BUSINESS SERVICE ASSIGNMENT (Manager - adds price) ====================
//   @Get('business/:businessId/unassigned')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Get unassigned services for my business (manager only)',
//   })
//   async getUnassignedServices(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//   ): Promise<ServiceCatalogResponseDto[]> {
//     return this.servicesService.getUnassignedServicesForBusiness(
//       user.id,
//       businessId,
//     );
//   }
//   @Get('business/:businessId')
//   @Public()
//   @ApiOperation({
//     summary: 'Get available services for a business (public - with prices)',
//   })
//   async getBusinessServices(
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//   ): Promise<AvailableServiceDto[]> {
//     return this.servicesService.getAvailableServicesForBusiness(businessId);
//   }
//   @Get('business/:businessId/category/:categoryName')
//   @Public()
//   @ApiOperation({ summary: 'Get services by category for a business (public)' })
//   async getBusinessServicesByCategory(
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Param('categoryName') categoryName: string,
//   ): Promise<AvailableServiceDto[]> {
//     return this.servicesService.getAvailableServicesByCategory(
//       businessId,
//       categoryName,
//     );
//   }
//   @Get('business/:businessId/assigned')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary:
//       'Get all assigned services with prices for my business (manager only)',
//   })
//   async getMyAssignedServices(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//   ): Promise<AssignedBusinessServiceResponseDto[]> {
//     await this.servicesService.verifyBusinessOwnership(user.id, businessId);
//     return this.servicesService.getBusinessServices(businessId, true);
//   }
//   @Post('business/:businessId/assign')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Assign a service to my business with price (manager only)',
//   })
//   async assignServiceToBusiness(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Body() dto: AssignServiceToBusinessDto,
//   ): Promise<AssignedBusinessServiceResponseDto> {
//     return this.servicesService.assignServiceToBusiness(
//       user.id,
//       businessId,
//       dto,
//     );
//   }
//   @Post('business/:businessId/assign/bulk')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Bulk assign services to my business (manager only)',
//   })
//   async bulkAssignServicesToBusiness(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Body() dto: BulkAssignServicesDto,
//   ): Promise<BulkAssignResponseDto> {
//     return this.servicesService.bulkAssignServicesToBusiness(
//       user.id,
//       businessId,
//       dto,
//     );
//   }
//   @Get('assigned/:businessServiceId')
//   @Public()
//   @ApiOperation({ summary: 'Get assigned service details by ID' })
//   async getBusinessServiceById(
//     @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
//   ): Promise<AssignedBusinessServiceResponseDto> {
//     return this.servicesService.getBusinessServiceById(businessServiceId);
//   }
//   @Put('business/:businessId/assigned/:businessServiceId')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @ApiOperation({
//     summary: 'Update assigned service price/duration (manager only)',
//   })
//   async updateBusinessService(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
//     @Body() dto: UpdateBusinessServiceDto,
//   ): Promise<AssignedBusinessServiceResponseDto> {
//     return this.servicesService.updateBusinessService(
//       user.id,
//       businessId,
//       businessServiceId,
//       dto,
//     );
//   }
//   @Patch('business/:businessId/assigned/:businessServiceId/toggle')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Toggle service active status (manager only)' })
//   async toggleServiceStatus(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
//   ): Promise<{ is_active: boolean; message: string }> {
//     return this.servicesService.toggleServiceStatus(
//       user.id,
//       businessId,
//       businessServiceId,
//     );
//   }
//   @Delete('business/:businessId/assigned/:businessServiceId')
//   @Roles('MANAGER')
//   @ApiBearerAuth()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Remove service from business (manager only)' })
//   async removeServiceFromBusiness(
//     @CurrentUser() user: any,
//     @Param('businessId', ParseUUIDPipe) businessId: string,
//     @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
//   ): Promise<{ message: string }> {
//     return this.servicesService.removeServiceFromBusiness(
//       user.id,
//       businessId,
//       businessServiceId,
//     );
//   }
//   // ==================== SERVICE DISCOVERY (CLIENT SEARCH) ====================
//   @Get('discover/search')
//   @ApiOperation({
//     summary: 'Search services across all providers (client discovery)',
//   })
//   @ApiQuery({
//     name: 'query',
//     required: false,
//     description: 'Service name to search',
//   })
//   @ApiQuery({
//     name: 'category',
//     required: false,
//     description: 'Category filter',
//   })
//   @ApiQuery({
//     name: 'latitude',
//     required: false,
//     type: Number,
//     description: 'User latitude',
//   })
//   @ApiQuery({
//     name: 'longitude',
//     required: false,
//     type: Number,
//     description: 'User longitude',
//   })
//   @ApiQuery({
//     name: 'radius',
//     required: false,
//     type: Number,
//     description: 'Search radius in km',
//   })
//   @ApiQuery({
//     name: 'min_price',
//     required: false,
//     type: Number,
//     description: 'Minimum price',
//   })
//   @ApiQuery({
//     name: 'max_price',
//     required: false,
//     type: Number,
//     description: 'Maximum price',
//   })
//   @ApiQuery({
//     name: 'min_rating',
//     required: false,
//     type: Number,
//     description: 'Minimum rating (0-5)',
//   })
//   @ApiQuery({
//     name: 'sort_by',
//     required: false,
//     enum: SortBy,
//     description: 'Sort by',
//   })
//   @ApiQuery({
//     name: 'page',
//     required: false,
//     type: Number,
//     description: 'Page number',
//   })
//   @ApiQuery({
//     name: 'limit',
//     required: false,
//     type: Number,
//     description: 'Items per page',
//   })
//   async searchServices(
//     @CurrentUser() user: any,
//     @Query() dto: SearchServicesDto,
//   ): Promise<{ data: ServiceDiscoveryResponseDto[]; meta: any }> {
//     return this.serviceDiscoveryService.searchServices(user?.id || null, dto);
//   }
//   @Get('discover/suggestions')
//   @Public()
//   @ApiOperation({ summary: 'Get search suggestions for autocomplete' })
//   @ApiQuery({ name: 'q', required: true, description: 'Search query' })
//   async getSearchSuggestions(
//     @Query('q') query: string,
//   ): Promise<SearchSuggestionsDto> {
//     return this.serviceDiscoveryService.getSearchSuggestions(query);
//   }
//   @Get('discover/popular')
//   @Public()
//   @ApiOperation({ summary: 'Get popular services for homepage' })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   async getPopularServices(
//     @Query('limit') limit: number = 6,
//   ): Promise<PopularServiceDto[]> {
//     return this.serviceDiscoveryService.getPopularServices(limit);
//   }
//   @Get(':serviceId/providers')
//   @Public()
//   @ApiOperation({ summary: 'Get all providers for a specific service' })
//   @ApiParam({ name: 'serviceId', description: 'Service UUID' })
//   @ApiQuery({ name: 'latitude', required: false, type: Number })
//   @ApiQuery({ name: 'longitude', required: false, type: Number })
//   async getServiceWithProviders(
//     @Param('serviceId', ParseUUIDPipe) serviceId: string,
//     @CurrentUser() user: any,
//     @Query('latitude') latitude?: string,
//     @Query('longitude') longitude?: string,
//   ): Promise<ServiceDiscoveryResponseDto> {
//     return this.serviceDiscoveryService.getServiceWithProviders(
//       serviceId,
//       user?.id || null,
//       latitude ? parseFloat(latitude) : undefined,
//       longitude ? parseFloat(longitude) : undefined,
//     );
//   }
//   // ==================== FILTERS ====================
//   @Get('discover/filters')
//   @Public()
//   @ApiOperation({ summary: 'Get available filter options (categories, locations, price ranges)' })
//   @ApiQuery({ name: 'query', required: false, description: 'Search query' })
//   @ApiQuery({ name: 'latitude', required: false, type: Number })
//   @ApiQuery({ name: 'longitude', required: false, type: Number })
//   @ApiQuery({ name: 'radius', required: false, type: Number })
//   async getFilterOptions(
//     @Query('query') query?: string,
//     @Query('latitude') latitude?: string,
//     @Query('longitude') longitude?: string,
//     @Query('radius') radius?: string,
//   ): Promise<FilterCategoriesResponseDto> {
//     return this.serviceDiscoveryService.getFilterOptions(
//       query,
//       latitude ? parseFloat(latitude) : undefined,
//       longitude ? parseFloat(longitude) : undefined,
//       radius ? parseFloat(radius) : undefined,
//     );
//   }
// }
