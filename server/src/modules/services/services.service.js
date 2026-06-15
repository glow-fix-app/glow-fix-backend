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
exports.ServicesService = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var ServicesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ServicesService = _classThis = /** @class */ (function () {
        function ServicesService_1(prisma, eventEmitter) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(ServicesService.name);
        }
        // ==================== CATEGORY MANAGEMENT (Admin) ====================
        ServicesService_1.prototype.createCategory = function (adminId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedName, existingCategory, category;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedName = dto.name.trim().toUpperCase();
                            return [4 /*yield*/, this.prisma.category.findFirst({
                                    where: {
                                        name: normalizedName,
                                    },
                                })];
                        case 1:
                            existingCategory = _a.sent();
                            if (existingCategory) {
                                throw new common_1.ConflictException("Category '".concat(dto.name, "' already exists"));
                            }
                            return [4 /*yield*/, this.prisma.category.create({
                                    data: {
                                        name: normalizedName,
                                    },
                                })];
                        case 2:
                            category = _a.sent();
                            this.logger.log("Category created: ".concat(category.name, " by admin ").concat(adminId));
                            return [2 /*return*/, {
                                    id: category.id,
                                    name: category.name,
                                    created_at: category.createdAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.getAllCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                var categories;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.category.findMany({
                                orderBy: { name: 'asc' },
                            })];
                        case 1:
                            categories = _a.sent();
                            return [2 /*return*/, categories.map(function (c) { return ({
                                    id: c.id,
                                    name: c.name,
                                    created_at: c.createdAt,
                                }); })];
                    }
                });
            });
        };
        ServicesService_1.prototype.getCategoryById = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var category;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.category.findUnique({
                                where: { id: categoryId },
                            })];
                        case 1:
                            category = _a.sent();
                            if (!category) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            return [2 /*return*/, {
                                    id: category.id,
                                    name: category.name,
                                    created_at: category.createdAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.deleteCategory = function (adminId, categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var category;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.category.findUnique({
                                where: { id: categoryId },
                                include: {
                                    services: {
                                        include: {
                                            businessServices: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            category = _a.sent();
                            if (!category) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            if (category.services.length > 0) {
                                throw new common_1.BadRequestException("Cannot delete category with ".concat(category.services.length, " service(s). Delete or reassign services first."));
                            }
                            return [4 /*yield*/, this.prisma.category.delete({
                                    where: { id: categoryId },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Category deleted: ".concat(category.name, " by admin ").concat(adminId));
                            return [2 /*return*/, { message: 'Category deleted successfully' }];
                    }
                });
            });
        };
        // ==================== SERVICE CATALOG MANAGEMENT (Admin only - NO price) ====================
        ServicesService_1.prototype.createService = function (adminId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var category, service;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.category.findUnique({
                                where: { id: dto.category_id },
                            })];
                        case 1:
                            category = _a.sent();
                            if (!category) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            return [4 /*yield*/, this.prisma.service.create({
                                    data: {
                                        categoryId: dto.category_id,
                                        title: dto.title,
                                        description: dto.description,
                                    },
                                    include: { category: true },
                                })];
                        case 2:
                            service = _a.sent();
                            this.logger.log("Service created in catalog: ".concat(service.title, " by admin ").concat(adminId));
                            return [2 /*return*/, {
                                    id: service.id,
                                    category_id: service.categoryId,
                                    category_name: service.category.name,
                                    title: service.title,
                                    description: service.description || undefined,
                                    created_at: service.createdAt,
                                    updated_at: service.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.getAllServices = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var where, services;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (categoryId) {
                                if (!(0, uuid_1.validate)(categoryId)) {
                                    throw new common_1.BadRequestException('Invalid categoryId format');
                                }
                                where.categoryId = categoryId;
                            }
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: where,
                                    include: {
                                        category: true,
                                    },
                                    orderBy: { title: 'asc' },
                                })];
                        case 1:
                            services = _a.sent();
                            return [2 /*return*/, services.map(function (s) { return ({
                                    id: s.id,
                                    category_id: s.categoryId,
                                    category_name: s.category.name,
                                    title: s.title,
                                    description: s.description || undefined,
                                    created_at: s.createdAt,
                                    updated_at: s.updatedAt,
                                }); })];
                    }
                });
            });
        };
        ServicesService_1.prototype.getServiceById = function (serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                var service;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.service.findUnique({
                                where: { id: serviceId },
                                include: { category: true },
                            })];
                        case 1:
                            service = _a.sent();
                            if (!service) {
                                throw new common_1.NotFoundException('Service not found');
                            }
                            return [2 /*return*/, {
                                    id: service.id,
                                    category_id: service.categoryId,
                                    category_name: service.category.name,
                                    title: service.title,
                                    description: service.description || undefined,
                                    created_at: service.createdAt,
                                    updated_at: service.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.updateService = function (adminId, serviceId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var service, category, updatedService;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.service.findUnique({
                                where: { id: serviceId },
                                include: { category: true },
                            })];
                        case 1:
                            service = _a.sent();
                            if (!service) {
                                throw new common_1.NotFoundException('Service not found');
                            }
                            if (!dto.category_id) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.category.findUnique({
                                    where: { id: dto.category_id },
                                })];
                        case 2:
                            category = _a.sent();
                            if (!category) {
                                throw new common_1.NotFoundException('Target category not found');
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.service.update({
                                where: { id: serviceId },
                                data: {
                                    categoryId: dto.category_id,
                                    title: dto.title,
                                    description: dto.description,
                                },
                                include: { category: true },
                            })];
                        case 4:
                            updatedService = _a.sent();
                            this.logger.log("Service updated in catalog: ".concat(updatedService.title, " by admin ").concat(adminId));
                            return [2 /*return*/, {
                                    id: updatedService.id,
                                    category_id: updatedService.categoryId,
                                    category_name: updatedService.category.name,
                                    title: updatedService.title,
                                    description: updatedService.description || undefined,
                                    created_at: updatedService.createdAt,
                                    updated_at: updatedService.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.deleteService = function (adminId, serviceId) {
            return __awaiter(this, void 0, void 0, function () {
                var service;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.service.findUnique({
                                where: { id: serviceId },
                                include: {
                                    businessServices: true,
                                },
                            })];
                        case 1:
                            service = _a.sent();
                            if (!service) {
                                throw new common_1.NotFoundException('Service not found');
                            }
                            if (service.businessServices.length > 0) {
                                throw new common_1.BadRequestException("Cannot delete service assigned to ".concat(service.businessServices.length, " business(es). Remove assignments first."));
                            }
                            return [4 /*yield*/, this.prisma.service.delete({
                                    where: { id: serviceId },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Service deleted from catalog: ".concat(service.title, " by admin ").concat(adminId));
                            return [2 /*return*/, { message: 'Service deleted successfully' }];
                    }
                });
            });
        };
        // ==================== BUSINESS SERVICE ASSIGNMENT (Manager assigns price & duration) ====================
        ServicesService_1.prototype.assignServiceToBusiness = function (managerId, businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var service, existing, business, businessService;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.prisma.service.findUnique({
                                    where: { id: dto.service_id },
                                    include: { category: true },
                                })];
                        case 2:
                            service = _b.sent();
                            if (!service) {
                                throw new common_1.NotFoundException('Service not found in catalog');
                            }
                            return [4 /*yield*/, this.prisma.businessService.findFirst({
                                    where: {
                                        businessId: businessId,
                                        serviceId: dto.service_id,
                                    },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (existing) {
                                throw new common_1.ConflictException('Service already assigned to this business');
                            }
                            return [4 /*yield*/, this.prisma.business.findUnique({
                                    where: { id: businessId },
                                })];
                        case 4:
                            business = _b.sent();
                            return [4 /*yield*/, this.prisma.businessService.create({
                                    data: {
                                        businessId: businessId,
                                        serviceId: dto.service_id,
                                        price: dto.price, // Store in EGP directly (Decimal)
                                        averageDuration: dto.average_duration,
                                        isActive: (_a = dto.is_active) !== null && _a !== void 0 ? _a : true,
                                    },
                                })];
                        case 5:
                            businessService = _b.sent();
                            this.logger.log("Service \"".concat(service.title, "\" assigned to business ").concat(businessId, " by manager ").concat(managerId, " with price ").concat(dto.price, " EGP"));
                            this.eventEmitter.emit('business.service_assigned', {
                                businessId: businessId,
                                serviceId: dto.service_id,
                                serviceTitle: service.title,
                                price: dto.price,
                                duration: dto.average_duration,
                            });
                            return [2 /*return*/, {
                                    id: businessService.id,
                                    business_id: businessId,
                                    business_name: (business === null || business === void 0 ? void 0 : business.businessName) || '',
                                    service_id: service.id,
                                    service_title: service.title,
                                    service_description: service.description || undefined,
                                    category_id: service.categoryId,
                                    category_name: service.category.name,
                                    price: dto.price,
                                    average_duration: businessService.averageDuration,
                                    is_active: businessService.isActive,
                                    created_at: businessService.createdAt,
                                    updated_at: businessService.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.bulkAssignServicesToBusiness = function (managerId, businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var assignedServices, skippedServices, _i, _a, serviceDto, result, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _b.sent();
                            assignedServices = [];
                            skippedServices = [];
                            _i = 0, _a = dto.services;
                            _b.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            serviceDto = _a[_i];
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.assignServiceToBusiness(managerId, businessId, serviceDto)];
                        case 4:
                            result = _b.sent();
                            assignedServices.push(result);
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _b.sent();
                            skippedServices.push(serviceDto.service_id);
                            this.logger.warn("Failed to assign service ".concat(serviceDto.service_id, ": ").concat(error_1.message));
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, {
                                success: true,
                                assigned_count: assignedServices.length,
                                skipped_count: skippedServices.length,
                                assigned_services: assignedServices,
                                skipped_services: skippedServices,
                            }];
                    }
                });
            });
        };
        // ==================== BUSINESS SERVICE MANAGEMENT ====================
        ServicesService_1.prototype.getBusinessServices = function (businessId_1) {
            return __awaiter(this, arguments, void 0, function (businessId, includeInactive, categoryId) {
                var business, where, businessServices;
                if (includeInactive === void 0) { includeInactive = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findUnique({
                                where: { id: businessId },
                            })];
                        case 1:
                            business = _a.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business not found');
                            }
                            where = {
                                businessId: businessId,
                            };
                            if (!includeInactive) {
                                where.isActive = true;
                            }
                            if (categoryId) {
                                where.service = { categoryId: categoryId };
                            }
                            return [4 /*yield*/, this.prisma.businessService.findMany({
                                    where: where,
                                    include: {
                                        service: {
                                            include: {
                                                category: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                })];
                        case 2:
                            businessServices = _a.sent();
                            return [2 /*return*/, businessServices.map(function (bs) { return ({
                                    id: bs.id,
                                    business_id: businessId,
                                    business_name: business.businessName,
                                    service_id: bs.service.id,
                                    service_title: bs.service.title,
                                    service_description: bs.service.description || undefined,
                                    category_id: bs.service.category.id,
                                    category_name: bs.service.category.name,
                                    price: Number(bs.price), // Convert from Decimal to number
                                    average_duration: bs.averageDuration,
                                    is_active: bs.isActive,
                                    created_at: bs.createdAt,
                                    updated_at: bs.updatedAt,
                                }); })];
                    }
                });
            });
        };
        ServicesService_1.prototype.getBusinessServiceById = function (businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                var businessService;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.businessService.findUnique({
                                where: { id: businessServiceId },
                                include: {
                                    business: true,
                                    service: {
                                        include: {
                                            category: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            businessService = _a.sent();
                            if (!businessService) {
                                throw new common_1.NotFoundException('Business service not found');
                            }
                            return [2 /*return*/, {
                                    id: businessService.id,
                                    business_id: businessService.businessId,
                                    business_name: businessService.business.businessName,
                                    service_id: businessService.service.id,
                                    service_title: businessService.service.title,
                                    service_description: businessService.service.description || undefined,
                                    category_id: businessService.service.category.id,
                                    category_name: businessService.service.category.name,
                                    price: Number(businessService.price),
                                    average_duration: businessService.averageDuration,
                                    is_active: businessService.isActive,
                                    created_at: businessService.createdAt,
                                    updated_at: businessService.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.updateBusinessService = function (managerId, businessId, businessServiceId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var businessService, updateData, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessService.findFirst({
                                    where: {
                                        id: businessServiceId,
                                        businessId: businessId,
                                    },
                                    include: {
                                        business: true,
                                        service: {
                                            include: {
                                                category: true,
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            businessService = _a.sent();
                            if (!businessService) {
                                throw new common_1.NotFoundException('Business service not found');
                            }
                            updateData = {};
                            if (dto.price !== undefined) {
                                updateData.price = dto.price;
                            }
                            if (dto.average_duration !== undefined) {
                                updateData.averageDuration = dto.average_duration;
                            }
                            if (dto.is_active !== undefined) {
                                updateData.isActive = dto.is_active;
                            }
                            return [4 /*yield*/, this.prisma.businessService.update({
                                    where: { id: businessServiceId },
                                    data: updateData,
                                    include: {
                                        business: true,
                                        service: {
                                            include: {
                                                category: true,
                                            },
                                        },
                                    },
                                })];
                        case 3:
                            updated = _a.sent();
                            this.logger.log("Business service ".concat(businessServiceId, " updated by manager ").concat(managerId));
                            this.eventEmitter.emit('business.service_updated', {
                                businessId: businessId,
                                businessServiceId: businessServiceId,
                                updates: Object.keys(dto),
                            });
                            return [2 /*return*/, {
                                    id: updated.id,
                                    business_id: updated.businessId,
                                    business_name: updated.business.businessName,
                                    service_id: updated.service.id,
                                    service_title: updated.service.title,
                                    service_description: updated.service.description || undefined,
                                    category_id: updated.service.category.id,
                                    category_name: updated.service.category.name,
                                    price: Number(updated.price),
                                    average_duration: updated.averageDuration,
                                    is_active: updated.isActive,
                                    created_at: updated.createdAt,
                                    updated_at: updated.updatedAt,
                                }];
                    }
                });
            });
        };
        ServicesService_1.prototype.removeServiceFromBusiness = function (managerId, businessId, businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                var businessService, activeBookings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessService.findFirst({
                                    where: {
                                        id: businessServiceId,
                                        businessId: businessId,
                                    },
                                    include: {
                                        service: true,
                                    },
                                })];
                        case 2:
                            businessService = _a.sent();
                            if (!businessService) {
                                throw new common_1.NotFoundException('Business service not found');
                            }
                            return [4 /*yield*/, this.prisma.bookingItem.findFirst({
                                    where: {
                                        businessServiceId: businessServiceId,
                                        booking: {
                                            statusHistory: {
                                                none: {
                                                    status: { context: { in: ['COMPLETED', 'CANCELLED'] } },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 3:
                            activeBookings = _a.sent();
                            if (!activeBookings) return [3 /*break*/, 5];
                            // Soft delete - just deactivate
                            return [4 /*yield*/, this.prisma.businessService.update({
                                    where: { id: businessServiceId },
                                    data: { isActive: false },
                                })];
                        case 4:
                            // Soft delete - just deactivate
                            _a.sent();
                            return [2 /*return*/, {
                                    message: 'Service deactivated due to existing bookings',
                                }];
                        case 5: 
                        // Hard delete if no bookings
                        return [4 /*yield*/, this.prisma.businessService.delete({
                                where: { id: businessServiceId },
                            })];
                        case 6:
                            // Hard delete if no bookings
                            _a.sent();
                            this.logger.log("Business service ".concat(businessServiceId, " removed by manager ").concat(managerId));
                            this.eventEmitter.emit('business.service_removed', {
                                businessId: businessId,
                                businessServiceId: businessServiceId,
                                serviceTitle: businessService.service.title,
                            });
                            return [2 /*return*/, { message: 'Service removed from business' }];
                    }
                });
            });
        };
        ServicesService_1.prototype.toggleServiceStatus = function (managerId, businessId, businessServiceId) {
            return __awaiter(this, void 0, void 0, function () {
                var businessService, updated, status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessService.findFirst({
                                    where: {
                                        id: businessServiceId,
                                        businessId: businessId,
                                    },
                                })];
                        case 2:
                            businessService = _a.sent();
                            if (!businessService) {
                                throw new common_1.NotFoundException('Business service not found');
                            }
                            return [4 /*yield*/, this.prisma.businessService.update({
                                    where: { id: businessServiceId },
                                    data: {
                                        isActive: !businessService.isActive,
                                    },
                                })];
                        case 3:
                            updated = _a.sent();
                            status = updated.isActive ? 'activated' : 'deactivated';
                            this.logger.log("Business service ".concat(businessServiceId, " ").concat(status, " by manager ").concat(managerId));
                            return [2 /*return*/, {
                                    is_active: updated.isActive,
                                    message: "Service ".concat(status, " successfully"),
                                }];
                    }
                });
            });
        };
        // ==================== PUBLIC DISCOVERY (For Clients) ====================
        ServicesService_1.prototype.getAvailableServicesForBusiness = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var business, businessServices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findUnique({
                                where: { id: businessId },
                            })];
                        case 1:
                            business = _a.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business not found');
                            }
                            return [4 /*yield*/, this.prisma.businessService.findMany({
                                    where: {
                                        businessId: businessId,
                                        isActive: true,
                                    },
                                    include: {
                                        service: {
                                            include: {
                                                category: true,
                                            },
                                        },
                                    },
                                    orderBy: { price: 'asc' },
                                })];
                        case 2:
                            businessServices = _a.sent();
                            return [2 /*return*/, businessServices.map(function (bs) { return ({
                                    business_service_id: bs.id,
                                    service_id: bs.service.id,
                                    title: bs.service.title,
                                    description: bs.service.description || undefined,
                                    category_name: bs.service.category.name,
                                    price: Number(bs.price),
                                    duration_minutes: bs.averageDuration,
                                }); })];
                    }
                });
            });
        };
        ServicesService_1.prototype.getAvailableServicesByCategory = function (businessId, categoryName) {
            return __awaiter(this, void 0, void 0, function () {
                var category, businessServices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.category.findFirst({
                                where: {
                                    name: {
                                        equals: categoryName,
                                        mode: 'insensitive',
                                    },
                                },
                            })];
                        case 1:
                            category = _a.sent();
                            if (!category) {
                                throw new common_1.NotFoundException("Category '".concat(categoryName, "' not found"));
                            }
                            return [4 /*yield*/, this.prisma.businessService.findMany({
                                    where: {
                                        businessId: businessId,
                                        isActive: true,
                                        service: {
                                            categoryId: category.id,
                                        },
                                    },
                                    include: {
                                        service: {
                                            include: {
                                                category: true,
                                            },
                                        },
                                    },
                                    orderBy: { price: 'asc' },
                                })];
                        case 2:
                            businessServices = _a.sent();
                            return [2 /*return*/, businessServices.map(function (bs) { return ({
                                    business_service_id: bs.id,
                                    service_id: bs.service.id,
                                    title: bs.service.title,
                                    description: bs.service.description || undefined,
                                    category_name: bs.service.category.name,
                                    price: Number(bs.price),
                                    duration_minutes: bs.averageDuration,
                                }); })];
                    }
                });
            });
        };
        ServicesService_1.prototype.getUnassignedServicesForBusiness = function (managerId, businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var assignedServices, assignedServiceIds, unassignedServices;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessService.findMany({
                                    where: { businessId: businessId },
                                    select: { serviceId: true },
                                })];
                        case 2:
                            assignedServices = _a.sent();
                            assignedServiceIds = assignedServices.map(function (s) { return s.serviceId; });
                            return [4 /*yield*/, this.prisma.service.findMany({
                                    where: {
                                        id: { notIn: assignedServiceIds },
                                    },
                                    include: {
                                        category: true,
                                    },
                                    orderBy: { title: 'asc' },
                                })];
                        case 3:
                            unassignedServices = _a.sent();
                            return [2 /*return*/, unassignedServices.map(function (s) { return ({
                                    id: s.id,
                                    category_id: s.categoryId,
                                    category_name: s.category.name,
                                    title: s.title,
                                    description: s.description || undefined,
                                    created_at: s.createdAt,
                                    updated_at: s.updatedAt,
                                }); })];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        ServicesService_1.prototype.verifyBusinessOwnership = function (managerId, businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findFirst({
                                where: {
                                    id: businessId,
                                    managerId: managerId,
                                },
                            })];
                        case 1:
                            business = _a.sent();
                            if (!business) {
                                throw new common_1.ForbiddenException('You do not own this business');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ServicesService_1;
    }());
    __setFunctionName(_classThis, "ServicesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServicesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServicesService = _classThis;
}();
exports.ServicesService = ServicesService;
