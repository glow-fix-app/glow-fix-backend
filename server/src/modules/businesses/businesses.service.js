"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessesService = void 0;
var common_1 = require("@nestjs/common");
var business_status_dto_1 = require("./dto/business-status.dto");
var business_document_dto_1 = require("./dto/business-document.dto");
var geocode_1 = require("../../utils/geocode");
var BusinessesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BusinessesService = _classThis = /** @class */ (function () {
        function BusinessesService_1(prisma, eventEmitter, storage, notificationsService) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.storage = storage;
            this.notificationsService = notificationsService;
            this.logger = new common_1.Logger(BusinessesService.name);
        }
        // ==================== BUSINESS CRUD ====================
        BusinessesService_1.prototype.createBusiness = function (managerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingBusiness, city, businesses, businessId, pendingStatus;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findFirst({
                                where: { managerId: managerId },
                            })];
                        case 1:
                            existingBusiness = _b.sent();
                            if (existingBusiness) {
                                throw new common_1.ConflictException('You already have a registered business');
                            }
                            return [4 /*yield*/, (0, geocode_1.reverseGeocodeCity)(dto.location.latitude, dto.location.longitude)];
                        case 2:
                            city = _b.sent();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      INSERT INTO businesses (id, manager_id, business_name, address, city, location, contact_phone, contact_email, description, created_at, updated_at)\n      VALUES (\n        gen_random_uuid(),\n        ", "::uuid,\n        ", ",\n        ", ",\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", ",\n        ", ",\n        ", ",\n        NOW(),\n        NOW()\n      )\n      RETURNING id\n    "], ["\n      INSERT INTO businesses (id, manager_id, business_name, address, city, location, contact_phone, contact_email, description, created_at, updated_at)\n      VALUES (\n        gen_random_uuid(),\n        ", "::uuid,\n        ", ",\n        ", ",\n        ", ",\n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", ",\n        ", ",\n        ", ",\n        NOW(),\n        NOW()\n      )\n      RETURNING id\n    "])), managerId, dto.business_name, dto.address, city, dto.location.longitude, dto.location.latitude, dto.contact_phone, dto.contact_email, dto.description || null)];
                        case 3:
                            businesses = _b.sent();
                            businessId = (_a = businesses[0]) === null || _a === void 0 ? void 0 : _a.id;
                            if (!businessId) {
                                throw new Error('Failed to create business');
                            }
                            if (!(dto.operating_hours && dto.operating_hours.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.createOperatingHours(businessId, dto.operating_hours)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PENDING_REVIEW' },
                            })];
                        case 6:
                            pendingStatus = _b.sent();
                            if (!!pendingStatus) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.status.create({
                                    data: { context: 'PENDING_REVIEW' },
                                })];
                        case 7:
                            pendingStatus = _b.sent();
                            _b.label = 8;
                        case 8: return [4 /*yield*/, this.prisma.businessStatus.create({
                                data: {
                                    businessId: businessId,
                                    statusId: pendingStatus.id,
                                },
                            })];
                        case 9:
                            _b.sent();
                            this.logger.log("Business created: ".concat(businessId, " by manager ").concat(managerId));
                            this.eventEmitter.emit('business.created', {
                                businessId: businessId,
                                managerId: managerId,
                                businessName: dto.business_name,
                            });
                            return [2 /*return*/, this.getBusinessWithDetails(businessId)];
                    }
                });
            });
        };
        BusinessesService_1.prototype.getBusinessWithDetails = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var business, coords, currentStatus, images, logo_url, cover_url, gallery;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findUnique({
                                where: { id: businessId },
                                include: {
                                    manager: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            phone: true,
                                        },
                                    },
                                    operatingHours: true,
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                    documents: {
                                        include: { status: true },
                                    },
                                },
                            })];
                        case 1:
                            business = _e.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('Business not found');
                            }
                            return [4 /*yield*/, this.getBusinessLocation(businessId)];
                        case 2:
                            coords = _e.sent();
                            currentStatus = ((_b = (_a = business.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING_REVIEW';
                            return [4 /*yield*/, this.prisma.image.findMany({
                                    where: {
                                        entityId: businessId,
                                        entityType: { in: ['BUSINESS_LOGO', 'BUSINESS_COVER', 'BUSINESS_GALLERY'] },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                })];
                        case 3:
                            images = _e.sent();
                            logo_url = ((_c = images.find(function (img) { return img.entityType === 'BUSINESS_LOGO'; })) === null || _c === void 0 ? void 0 : _c.url) || undefined;
                            cover_url = ((_d = images.find(function (img) { return img.entityType === 'BUSINESS_COVER'; })) === null || _d === void 0 ? void 0 : _d.url) || undefined;
                            gallery = images.filter(function (img) { return img.entityType === 'BUSINESS_GALLERY'; }).map(function (img) { return img.url; });
                            return [2 /*return*/, {
                                    id: business.id,
                                    manager_id: business.managerId,
                                    manager_name: business.manager.fullName,
                                    business_name: business.businessName,
                                    address: business.address,
                                    latitude: coords.latitude,
                                    longitude: coords.longitude,
                                    contact_phone: business.contactPhone || undefined,
                                    contact_email: business.contactEmail || undefined,
                                    description: business.description || undefined,
                                    bank_name: business.bankName || undefined,
                                    bank_account_name: business.bankAccountName || undefined,
                                    bank_account_number: business.bankAccountNumber || undefined,
                                    swift_iban: business.swiftIban || undefined,
                                    current_status: currentStatus,
                                    operating_hours: business.operatingHours,
                                    documents: business.documents.map(function (doc) {
                                        var _a;
                                        return ({
                                            id: doc.id,
                                            type: doc.type,
                                            url: doc.url,
                                            status: ((_a = doc.status) === null || _a === void 0 ? void 0 : _a.context) || 'PENDING',
                                            created_at: doc.createdAt,
                                        });
                                    }),
                                    logo_url: logo_url,
                                    cover_url: cover_url,
                                    gallery: gallery,
                                    created_at: business.createdAt,
                                    updated_at: business.updatedAt,
                                }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.getMyBusiness = function (managerId) {
            return __awaiter(this, void 0, void 0, function () {
                var business;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.business.findFirst({
                                where: { managerId: managerId },
                            })];
                        case 1:
                            business = _a.sent();
                            if (!business) {
                                throw new common_1.NotFoundException('You do not have a registered business');
                            }
                            return [2 /*return*/, this.getBusinessWithDetails(business.id)];
                    }
                });
            });
        };
        BusinessesService_1.prototype.updateBusiness = function (managerId, businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var sets, params, paramIndex, city;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _b.sent();
                            sets = [];
                            params = [];
                            paramIndex = 1;
                            if (dto.business_name) {
                                sets.push("business_name = $".concat(paramIndex++));
                                params.push(dto.business_name);
                            }
                            if (dto.address) {
                                sets.push("address = $".concat(paramIndex++));
                                params.push(dto.address);
                            }
                            if (dto.contact_phone) {
                                sets.push("contact_phone = $".concat(paramIndex++));
                                params.push(dto.contact_phone);
                            }
                            if (dto.contact_email) {
                                sets.push("contact_email = $".concat(paramIndex++));
                                params.push(dto.contact_email);
                            }
                            if (dto.description !== undefined) {
                                sets.push("description = $".concat(paramIndex++));
                                params.push(dto.description);
                            }
                            if (dto.bank_name !== undefined) {
                                sets.push("bank_name = $".concat(paramIndex++));
                                params.push(dto.bank_name);
                            }
                            if (dto.bank_account_name !== undefined) {
                                sets.push("bank_account_name = $".concat(paramIndex++));
                                params.push(dto.bank_account_name);
                            }
                            if (dto.bank_account_number !== undefined) {
                                sets.push("bank_account_number = $".concat(paramIndex++));
                                params.push(dto.bank_account_number);
                            }
                            if (dto.swift_iban !== undefined) {
                                sets.push("swift_iban = $".concat(paramIndex++));
                                params.push(dto.swift_iban);
                            }
                            if (!dto.location) return [3 /*break*/, 3];
                            sets.push("location = ST_SetSRID(ST_MakePoint($".concat(paramIndex++, ", $").concat(paramIndex++, "), 4326)::geography"));
                            params.push(dto.location.longitude, dto.location.latitude);
                            return [4 /*yield*/, (0, geocode_1.reverseGeocodeCity)(dto.location.latitude, dto.location.longitude)];
                        case 2:
                            city = _b.sent();
                            if (city) {
                                sets.push("city = $".concat(paramIndex++));
                                params.push(city);
                            }
                            _b.label = 3;
                        case 3:
                            if (!(sets.length > 0)) return [3 /*break*/, 5];
                            sets.push("updated_at = NOW()");
                            params.push(businessId);
                            return [4 /*yield*/, (_a = this.prisma).$executeRawUnsafe.apply(_a, __spreadArray(["UPDATE businesses SET ".concat(sets.join(', '), " WHERE id = $").concat(paramIndex, "::uuid")], params, false))];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            if (!dto.operating_hours) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.updateOperatingHours(businessId, dto.operating_hours)];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            this.logger.log("Business updated: ".concat(businessId, " by manager ").concat(managerId));
                            this.eventEmitter.emit('business.updated', {
                                businessId: businessId,
                                managerId: managerId,
                                updates: Object.keys(dto),
                            });
                            return [2 /*return*/, this.getBusinessWithDetails(businessId)];
                    }
                });
            });
        };
        BusinessesService_1.prototype.deleteBusiness = function (managerId, businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var bookingsCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.booking.count({
                                    where: { businessId: businessId },
                                })];
                        case 2:
                            bookingsCount = _a.sent();
                            if (bookingsCount > 0) {
                                throw new common_1.BadRequestException("Cannot delete business with ".concat(bookingsCount, " existing booking(s). Contact support to close your business."));
                            }
                            return [4 /*yield*/, this.updateBusinessStatus(businessId, {
                                    status: business_status_dto_1.BusinessStatus.SUSPENDED,
                                    rejection_reason: 'Business closed by owner',
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Business deleted (suspended): ".concat(businessId, " by manager ").concat(managerId));
                            this.eventEmitter.emit('business.deleted', {
                                businessId: businessId,
                                managerId: managerId,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Business closed successfully',
                                }];
                    }
                });
            });
        };
        // ==================== BUSINESS STATUS ====================
        BusinessesService_1.prototype.updateBusinessStatus = function (businessId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var business, status;
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
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: dto.status },
                                })];
                        case 2:
                            status = _a.sent();
                            if (!!status) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.status.create({
                                    data: { context: dto.status },
                                })];
                        case 3:
                            status = _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.businessStatus.create({
                                data: {
                                    businessId: businessId,
                                    statusId: status.id,
                                },
                            })];
                        case 5:
                            _a.sent();
                            if (!(dto.rejection_reason && dto.status === business_status_dto_1.BusinessStatus.REJECTED)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.rejectionReason.create({
                                    data: {
                                        entityType: 'BUSINESS',
                                        entityId: businessId,
                                        reasonText: dto.rejection_reason,
                                    },
                                })];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            this.logger.log("Business status updated: ".concat(businessId, " -> ").concat(dto.status));
                            this.eventEmitter.emit('business.status_changed', {
                                businessId: businessId,
                                newStatus: dto.status,
                                reason: dto.rejection_reason,
                            });
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Business status updated to ".concat(dto.status),
                                }];
                    }
                });
            });
        };
        // ==================== OPERATING HOURS ====================
        BusinessesService_1.prototype.createOperatingHours = function (businessId, hours) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, hours_1, hour;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, hours_1 = hours;
                            _a.label = 1;
                        case 1:
                            if (!(_i < hours_1.length)) return [3 /*break*/, 4];
                            hour = hours_1[_i];
                            return [4 /*yield*/, this.prisma.operatingHour.create({
                                    data: {
                                        businessId: businessId,
                                        dayOfWeek: hour.day_of_week,
                                        openTime: hour.is_closed ? null : hour.open_time,
                                        closeTime: hour.is_closed ? null : hour.close_time,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BusinessesService_1.prototype.updateOperatingHours = function (businessId, hours) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, hours_2, hour;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.operatingHour.deleteMany({
                                where: { businessId: businessId },
                            })];
                        case 1:
                            _a.sent();
                            _i = 0, hours_2 = hours;
                            _a.label = 2;
                        case 2:
                            if (!(_i < hours_2.length)) return [3 /*break*/, 5];
                            hour = hours_2[_i];
                            return [4 /*yield*/, this.prisma.operatingHour.create({
                                    data: {
                                        businessId: businessId,
                                        dayOfWeek: hour.day_of_week,
                                        openTime: hour.is_closed ? null : hour.open_time,
                                        closeTime: hour.is_closed ? null : hour.close_time,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            this.logger.log("Operating hours updated for business ".concat(businessId));
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Operating hours updated successfully',
                                }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.getOperatingHours = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.operatingHour.findMany({
                            where: { businessId: businessId },
                            orderBy: { dayOfWeek: 'asc' },
                        })];
                });
            });
        };
        BusinessesService_1.prototype.isBusinessOpen = function (businessId, dateTime) {
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
                            if (!hours || !hours.openTime || !hours.closeTime) {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, timeStr >= hours.openTime && timeStr <= hours.closeTime];
                    }
                });
            });
        };
        // ==================== BUSINESS DOCUMENTS ====================
        BusinessesService_1.prototype.uploadDocument = function (managerId, businessId, file, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingDoc, pendingStatus, fileUrl, document, admins, business, _i, admins_1, admin, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessDocument.findFirst({
                                    where: {
                                        businessId: businessId,
                                        type: dto.type,
                                    },
                                })];
                        case 2:
                            existingDoc = _a.sent();
                            if (!existingDoc) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.businessDocument.delete({
                                    where: { id: existingDoc.id },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.status.findFirst({
                                where: { context: 'PENDING_REVIEW' },
                            })];
                        case 5:
                            pendingStatus = _a.sent();
                            if (!!pendingStatus) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.status.create({
                                    data: { context: 'PENDING_REVIEW' },
                                })];
                        case 6:
                            pendingStatus = _a.sent();
                            _a.label = 7;
                        case 7: return [4 /*yield*/, this.storage.uploadFile(file.buffer, "businesses/".concat(businessId, "/documents"), file.mimetype, file.originalname)];
                        case 8:
                            fileUrl = (_a.sent()).url;
                            return [4 /*yield*/, this.prisma.businessDocument.create({
                                    data: {
                                        businessId: businessId,
                                        type: dto.type,
                                        url: fileUrl,
                                        statusId: pendingStatus.id,
                                    },
                                    include: { status: true },
                                })];
                        case 9:
                            document = _a.sent();
                            this.logger.log("Document uploaded for business ".concat(businessId, ": ").concat(dto.type));
                            this.eventEmitter.emit('business.document_uploaded', {
                                businessId: businessId,
                                managerId: managerId,
                                documentType: dto.type,
                            });
                            return [4 /*yield*/, this.prisma.user.findMany({ where: { role: 'ADMIN', isActive: true, deletedAt: null } })];
                        case 10:
                            admins = _a.sent();
                            return [4 /*yield*/, this.prisma.business.findUnique({ where: { id: businessId } })];
                        case 11:
                            business = _a.sent();
                            if (!business) return [3 /*break*/, 17];
                            _i = 0, admins_1 = admins;
                            _a.label = 12;
                        case 12:
                            if (!(_i < admins_1.length)) return [3 /*break*/, 17];
                            admin = admins_1[_i];
                            _a.label = 13;
                        case 13:
                            _a.trys.push([13, 15, , 16]);
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: admin.id,
                                    actorUserId: managerId,
                                    typeCode: 'SYSTEM_ALERT',
                                    title: 'Document Uploaded',
                                    body: "Business \"".concat(business.businessName, "\" has uploaded a ").concat(dto.type, " document for review."),
                                    actionUrl: "/admin/businesses/".concat(businessId),
                                })];
                        case 14:
                            _a.sent();
                            return [3 /*break*/, 16];
                        case 15:
                            err_1 = _a.sent();
                            this.logger.error("Failed to send notification to admin ".concat(admin.id, ": ").concat(err_1.message));
                            return [3 /*break*/, 16];
                        case 16:
                            _i++;
                            return [3 /*break*/, 12];
                        case 17: return [2 /*return*/, {
                                id: document.id,
                                business_id: document.businessId,
                                type: document.type,
                                url: document.url,
                                status: document.status.context,
                                created_at: document.createdAt,
                            }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.updateDocumentStatus = function (documentId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var document, status, allBusinessDocs, requiredTypes, approvedDocTypes_1, allRequiredApproved, approvedBusinessStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.businessDocument.findUnique({
                                where: { id: documentId },
                                include: { business: true },
                            })];
                        case 1:
                            document = _a.sent();
                            if (!document) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: dto.status },
                                })];
                        case 2:
                            status = _a.sent();
                            if (!!status) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.status.create({
                                    data: { context: dto.status },
                                })];
                        case 3:
                            status = _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.businessDocument.update({
                                where: { id: documentId },
                                data: {
                                    statusId: status.id,
                                    updatedAt: new Date(),
                                },
                            })];
                        case 5:
                            _a.sent();
                            if (!(dto.rejection_reason && dto.status === business_document_dto_1.DocumentStatus.REJECTED)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.rejectionReason.create({
                                    data: {
                                        entityType: 'BUSINESS_DOCUMENT',
                                        entityId: documentId,
                                        reasonText: dto.rejection_reason,
                                    },
                                })];
                        case 6:
                            _a.sent();
                            // Notify manager of rejection
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: document.business.managerId,
                                    actorUserId: document.business.managerId, // System/Admin action
                                    typeCode: 'SYSTEM_ALERT',
                                    title: 'Document Rejected',
                                    body: "Your document (".concat(document.type, ") was rejected. Reason: ").concat(dto.rejection_reason, ". Please re-upload it in the Settings."),
                                    actionUrl: "/provider/settings",
                                })];
                        case 7:
                            // Notify manager of rejection
                            _a.sent();
                            return [3 /*break*/, 16];
                        case 8:
                            if (!(dto.status === business_document_dto_1.DocumentStatus.ACCEPTED)) return [3 /*break*/, 16];
                            // Notify manager of approval
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: document.business.managerId,
                                    actorUserId: document.business.managerId,
                                    typeCode: 'SYSTEM_ALERT',
                                    title: 'Document Approved',
                                    body: "Your document (".concat(document.type, ") has been approved."),
                                    actionUrl: "/provider/settings",
                                })];
                        case 9:
                            // Notify manager of approval
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessDocument.findMany({
                                    where: { businessId: document.businessId },
                                    include: { status: true },
                                })];
                        case 10:
                            allBusinessDocs = _a.sent();
                            requiredTypes = [
                                'BUSINESS_REGISTRATION',
                                'OWNER_ID',
                                'INSURANCE_CERTIFICATE',
                                'SERVICE_LICENSE',
                            ];
                            approvedDocTypes_1 = allBusinessDocs
                                .filter(function (d) { return d.status.context === business_document_dto_1.DocumentStatus.ACCEPTED; })
                                .map(function (d) { return d.type; });
                            allRequiredApproved = requiredTypes.every(function (type) {
                                return approvedDocTypes_1.includes(type);
                            });
                            if (!allRequiredApproved) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'APPROVED' },
                                })];
                        case 11:
                            approvedBusinessStatus = _a.sent();
                            if (!!approvedBusinessStatus) return [3 /*break*/, 13];
                            return [4 /*yield*/, this.prisma.status.create({
                                    data: { context: 'APPROVED' },
                                })];
                        case 12:
                            approvedBusinessStatus = _a.sent();
                            _a.label = 13;
                        case 13: return [4 /*yield*/, this.prisma.businessStatus.create({
                                data: {
                                    businessId: document.businessId,
                                    statusId: approvedBusinessStatus.id,
                                },
                            })];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, this.notificationsService.createNotification({
                                    recipientUserId: document.business.managerId,
                                    actorUserId: document.business.managerId,
                                    typeCode: 'SYSTEM_ALERT',
                                    title: 'Business Account Approved',
                                    body: "Congratulations! All your verification documents have been approved. Your business account is now fully active.",
                                    actionUrl: "/provider/dashboard",
                                })];
                        case 15:
                            _a.sent();
                            this.logger.log("Business ".concat(document.businessId, " auto-approved after all documents were approved."));
                            _a.label = 16;
                        case 16:
                            this.logger.log("Document status updated: ".concat(documentId, " -> ").concat(dto.status));
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Document status updated to ".concat(dto.status),
                                }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.deleteDocument = function (managerId, businessId, documentId) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.verifyBusinessOwnership(managerId, businessId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.businessDocument.findFirst({
                                    where: {
                                        id: documentId,
                                        businessId: businessId,
                                    },
                                })];
                        case 2:
                            document = _a.sent();
                            if (!document) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            return [4 /*yield*/, this.prisma.businessDocument.delete({
                                    where: { id: documentId },
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Document deleted: ".concat(documentId, " from business ").concat(businessId));
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Document deleted successfully',
                                }];
                    }
                });
            });
        };
        // ==================== BUSINESS STATISTICS ====================
        BusinessesService_1.prototype.getBusinessStats = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var bookings, completedBookings, cancelledBookings, totalRevenue, totalPlatformFees, _i, bookings_1, booking, latestStatus, reviews, averageRating, activeServices;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.booking.findMany({
                                where: { businessId: businessId },
                                include: {
                                    statusHistory: {
                                        include: { status: true },
                                        orderBy: { createdAt: 'desc' },
                                        take: 1,
                                    },
                                    payment: true,
                                },
                            })];
                        case 1:
                            bookings = _c.sent();
                            completedBookings = 0;
                            cancelledBookings = 0;
                            totalRevenue = 0;
                            totalPlatformFees = 0;
                            for (_i = 0, bookings_1 = bookings; _i < bookings_1.length; _i++) {
                                booking = bookings_1[_i];
                                latestStatus = ((_b = (_a = booking.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING';
                                if (latestStatus === 'COMPLETED') {
                                    completedBookings++;
                                    totalRevenue += Number(booking.totalPrice);
                                    totalPlatformFees += Number(booking.commission);
                                }
                                else if (latestStatus === 'CANCELLED') {
                                    cancelledBookings++;
                                }
                            }
                            return [4 /*yield*/, this.prisma.review.findMany({
                                    where: { booking: { businessId: businessId } },
                                })];
                        case 2:
                            reviews = _c.sent();
                            averageRating = reviews.length > 0
                                ? reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / reviews.length
                                : 0;
                            return [4 /*yield*/, this.prisma.businessService.count({
                                    where: {
                                        businessId: businessId,
                                        isActive: true,
                                    },
                                })];
                        case 3:
                            activeServices = _c.sent();
                            return [2 /*return*/, {
                                    total_bookings: bookings.length,
                                    completed_bookings: completedBookings,
                                    cancelled_bookings: cancelledBookings,
                                    total_revenue: totalRevenue,
                                    platform_fees: totalPlatformFees,
                                    net_revenue: totalRevenue - totalPlatformFees,
                                    average_rating: Math.round(averageRating * 10) / 10,
                                    total_reviews: reviews.length,
                                    active_services: activeServices,
                                }];
                    }
                });
            });
        };
        // ==================== PUBLIC DISCOVERY ENDPOINTS ====================
        BusinessesService_1.prototype.getApprovedBusinesses = function () {
            return __awaiter(this, arguments, void 0, function (page, limit, search) {
                var skip, take, approvedStatus, where, _a, businesses, total, ids, coordsMap;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'APPROVED' },
                                })];
                        case 1:
                            approvedStatus = _b.sent();
                            if (!approvedStatus) {
                                return [2 /*return*/, { data: [], meta: { total: 0, page: page, limit: limit, totalPages: 0 } }];
                            }
                            where = {
                                statusHistory: {
                                    some: {
                                        statusId: approvedStatus.id,
                                    },
                                },
                            };
                            if (search) {
                                where.businessName = { contains: search, mode: 'insensitive' };
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.business.findMany({
                                        where: where,
                                        include: {
                                            operatingHours: true,
                                            manager: {
                                                select: { fullName: true },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        skip: skip,
                                        take: take,
                                    }),
                                    this.prisma.business.count({ where: where }),
                                ])];
                        case 2:
                            _a = _b.sent(), businesses = _a[0], total = _a[1];
                            ids = businesses.map(function (b) { return b.id; });
                            return [4 /*yield*/, this.getBusinessLocationsBatch(ids)];
                        case 3:
                            coordsMap = _b.sent();
                            return [2 /*return*/, {
                                    data: businesses.map(function (b) {
                                        var coords = coordsMap.get(b.id) || { latitude: 0, longitude: 0 };
                                        return {
                                            id: b.id,
                                            business_name: b.businessName,
                                            address: b.address,
                                            latitude: coords.latitude,
                                            longitude: coords.longitude,
                                            contact_phone: b.contactPhone,
                                            manager_name: b.manager.fullName,
                                            operating_hours: b.operatingHours,
                                        };
                                    }),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.getNearbyBusinesses = function (latitude_1, longitude_1) {
            return __awaiter(this, arguments, void 0, function (latitude, longitude, radiusKm, page, limit) {
                var skip, limitNum, radiusMeters, approvedStatus, results, totalResult, total, now, businessesWithOpenStatus;
                var _this = this;
                var _a;
                if (radiusKm === void 0) { radiusKm = 10; }
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            limitNum = Math.min(limit, 50);
                            radiusMeters = radiusKm * 1000;
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: 'APPROVED' },
                                })];
                        case 1:
                            approvedStatus = _b.sent();
                            if (!approvedStatus) {
                                return [2 /*return*/, { data: [], meta: { total: 0, page: page, limit: limit, totalPages: 0 } }];
                            }
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.contact_phone,\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n      GROUP BY b.id\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "], ["\n      SELECT \n        b.id,\n        b.business_name,\n        b.address,\n        b.contact_phone,\n        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography) / 1000)::numeric, 2) as distance_km,\n        COALESCE(AVG(r.rating), 0) as average_rating,\n        COUNT(r.id) as total_reviews\n      FROM businesses b\n      LEFT JOIN bookings bk ON b.id = bk.business_id\n      LEFT JOIN reviews r ON bk.id = r.booking_id\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n      GROUP BY b.id\n      ORDER BY distance_km\n      LIMIT ", "\n      OFFSET ", "\n    "])), longitude, latitude, approvedStatus.id, longitude, latitude, radiusMeters, limitNum, skip)];
                        case 2:
                            results = _b.sent();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT COUNT(*)::int as count\n      FROM businesses b\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n    "], ["\n      SELECT COUNT(*)::int as count\n      FROM businesses b\n      WHERE EXISTS (\n        SELECT 1 FROM business_status bs \n        WHERE bs.business_id = b.id \n          AND bs.status_id = ", "\n      )\n      AND ST_DWithin(\n        b.location, \n        ST_SetSRID(ST_MakePoint(", ", ", "), 4326)::geography,\n        ", "\n      )\n    "])), approvedStatus.id, longitude, latitude, radiusMeters)];
                        case 3:
                            totalResult = _b.sent();
                            total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
                            now = new Date();
                            return [4 /*yield*/, Promise.all(results.map(function (b) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = {
                                                    id: b.id,
                                                    business_name: b.business_name,
                                                    address: b.address,
                                                    distance_km: parseFloat(b.distance_km),
                                                    contact_phone: b.contact_phone,
                                                    average_rating: Math.round(parseFloat(b.average_rating) * 10) / 10,
                                                    total_reviews: parseInt(b.total_reviews, 10)
                                                };
                                                return [4 /*yield*/, this.isBusinessOpen(b.id, now)];
                                            case 1: return [2 /*return*/, (_a.is_open = _b.sent(),
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        case 4:
                            businessesWithOpenStatus = _b.sent();
                            return [2 /*return*/, {
                                    data: businessesWithOpenStatus,
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        BusinessesService_1.prototype.getAllBusinesses = function (status_1) {
            return __awaiter(this, arguments, void 0, function (status, page, limit) {
                var skip, take, where, statusRecord, _a, businesses, total;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            skip = (page - 1) * limit;
                            take = Math.min(limit, 50);
                            where = {};
                            if (!status) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.status.findFirst({
                                    where: { context: status },
                                })];
                        case 1:
                            statusRecord = _b.sent();
                            if (statusRecord) {
                                where.statusHistory = {
                                    some: { statusId: statusRecord.id },
                                };
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, Promise.all([
                                this.prisma.business.findMany({
                                    where: where,
                                    include: {
                                        manager: {
                                            select: {
                                                fullName: true,
                                                email: true,
                                                phone: true,
                                            },
                                        },
                                        operatingHours: true,
                                        statusHistory: {
                                            include: { status: true },
                                            orderBy: { createdAt: 'desc' },
                                            take: 1,
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    skip: skip,
                                    take: take,
                                }),
                                this.prisma.business.count({ where: where }),
                            ])];
                        case 3:
                            _a = _b.sent(), businesses = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: businesses.map(function (b) {
                                        var _a, _b;
                                        return ({
                                            id: b.id,
                                            business_name: b.businessName,
                                            manager_name: b.manager.fullName,
                                            manager_email: b.manager.email,
                                            address: b.address,
                                            contact_phone: b.contactPhone,
                                            current_status: ((_b = (_a = b.statusHistory[0]) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.context) || 'PENDING_REVIEW',
                                            created_at: b.createdAt,
                                        });
                                    }),
                                    meta: {
                                        total: total,
                                        page: page,
                                        limit: limit,
                                        totalPages: Math.ceil(total / limit),
                                    },
                                }];
                    }
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        BusinessesService_1.prototype.verifyBusinessOwnership = function (managerId, businessId) {
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
        BusinessesService_1.prototype.getBusinessLocation = function (businessId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT \n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ", "::uuid\n    "], ["\n      SELECT \n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ", "::uuid\n    "])), businessId)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result[0] || { latitude: 0, longitude: 0 }];
                    }
                });
            });
        };
        BusinessesService_1.prototype.getBusinessLocationsBatch = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var results, map, _i, results_1, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ids.length === 0)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      SELECT \n        id,\n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ANY(", "::uuid[])\n    "], ["\n      SELECT \n        id,\n        ST_Y(location::geometry) as latitude,\n        ST_X(location::geometry) as longitude\n      FROM businesses\n      WHERE id = ANY(", "::uuid[])\n    "])), ids)];
                        case 1:
                            results = _a.sent();
                            map = new Map();
                            for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                                row = results_1[_i];
                                map.set(row.id, { latitude: row.latitude, longitude: row.longitude });
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        BusinessesService_1.prototype.uploadBusinessImage = function (managerId, file, type) {
            return __awaiter(this, void 0, void 0, function () {
                var business, allowedMimeTypes, maxBytes, resizeOptions, entityType, folderName, _a, storageKey, url, existing;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getMyBusiness(managerId)];
                        case 1:
                            business = _b.sent();
                            allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
                            if (!allowedMimeTypes.has(file.mimetype)) {
                                throw new common_1.BadRequestException('Unsupported file type. Allowed: JPEG, PNG, WebP, GIF');
                            }
                            maxBytes = 10 * 1024 * 1024;
                            if (file.size > maxBytes) {
                                throw new common_1.BadRequestException('File size too large. Maximum is 10 MB.');
                            }
                            resizeOptions = {};
                            entityType = '';
                            folderName = "businesses/".concat(business.id);
                            if (type === 'logo') {
                                resizeOptions = { width: 256, height: 256, quality: 85 };
                                entityType = 'BUSINESS_LOGO';
                                folderName += '/logo';
                            }
                            else if (type === 'cover') {
                                resizeOptions = { width: 1200, height: 400, quality: 85 };
                                entityType = 'BUSINESS_COVER';
                                folderName += '/cover';
                            }
                            else if (type === 'gallery') {
                                resizeOptions = { width: 1024, height: 768, quality: 85 };
                                entityType = 'BUSINESS_GALLERY';
                                folderName += '/gallery';
                            }
                            else {
                                throw new common_1.BadRequestException('Invalid image type');
                            }
                            return [4 /*yield*/, this.storage.uploadImage(file.buffer, folderName, resizeOptions)];
                        case 2:
                            _a = _b.sent(), storageKey = _a.storageKey, url = _a.url;
                            if (!(type === 'logo' || type === 'cover')) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.image.findFirst({
                                    where: {
                                        entityType: entityType,
                                        entityId: business.id,
                                    },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (!existing) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.image.delete({ where: { id: existing.id } })];
                        case 4:
                            _b.sent();
                            if (!existing.storageKey) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.storage.deleteByKey(existing.storageKey)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: 
                        // Save image to DB
                        return [4 /*yield*/, this.prisma.image.create({
                                data: {
                                    url: url,
                                    storageKey: storageKey,
                                    entityType: entityType,
                                    entityId: business.id,
                                },
                            })];
                        case 7:
                            // Save image to DB
                            _b.sent();
                            return [2 /*return*/, this.getBusinessWithDetails(business.id)];
                    }
                });
            });
        };
        BusinessesService_1.prototype.deleteGalleryImage = function (managerId, url) {
            return __awaiter(this, void 0, void 0, function () {
                var business, image;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMyBusiness(managerId)];
                        case 1:
                            business = _a.sent();
                            return [4 /*yield*/, this.prisma.image.findFirst({
                                    where: {
                                        entityId: business.id,
                                        entityType: 'BUSINESS_GALLERY',
                                        url: url,
                                    },
                                })];
                        case 2:
                            image = _a.sent();
                            if (!image) {
                                throw new common_1.NotFoundException('Gallery image not found');
                            }
                            return [4 /*yield*/, this.prisma.image.delete({ where: { id: image.id } })];
                        case 3:
                            _a.sent();
                            if (!image.storageKey) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.storage.deleteByKey(image.storageKey)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, this.getBusinessWithDetails(business.id)];
                    }
                });
            });
        };
        BusinessesService_1.prototype.reorderGallery = function (managerId, urls) {
            return __awaiter(this, void 0, void 0, function () {
                var business, images, urlToIndex, baseTime, _i, images_1, image, index, newCreatedAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMyBusiness(managerId)];
                        case 1:
                            business = _a.sent();
                            return [4 /*yield*/, this.prisma.image.findMany({
                                    where: {
                                        entityId: business.id,
                                        entityType: 'BUSINESS_GALLERY',
                                    },
                                })];
                        case 2:
                            images = _a.sent();
                            urlToIndex = new Map(urls.map(function (url, i) { return [url, i]; }));
                            baseTime = new Date();
                            _i = 0, images_1 = images;
                            _a.label = 3;
                        case 3:
                            if (!(_i < images_1.length)) return [3 /*break*/, 6];
                            image = images_1[_i];
                            index = urlToIndex.get(image.url);
                            if (!(index !== undefined)) return [3 /*break*/, 5];
                            newCreatedAt = new Date(baseTime.getTime() + index * 1000);
                            return [4 /*yield*/, this.prisma.image.update({
                                    where: { id: image.id },
                                    data: { createdAt: newCreatedAt },
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/, this.getBusinessWithDetails(business.id)];
                    }
                });
            });
        };
        return BusinessesService_1;
    }());
    __setFunctionName(_classThis, "BusinessesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BusinessesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BusinessesService = _classThis;
}();
exports.BusinessesService = BusinessesService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
