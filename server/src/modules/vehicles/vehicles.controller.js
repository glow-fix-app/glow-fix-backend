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
exports.VehiclesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var vehicle_response_dto_1 = require("./dto/vehicle-response.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var VehiclesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Vehicles'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'vehicles', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createVehicle_decorators;
    var _getUserVehicles_decorators;
    var _getVehicle_decorators;
    var _updateVehicle_decorators;
    var _deleteVehicle_decorators;
    var _getVehicleBookings_decorators;
    var _getUpcomingBookings_decorators;
    var _getAllVehicles_decorators;
    var _getMostUsedVehicles_decorators;
    var _getVehiclesByClient_decorators;
    var _getVehicleByIdAdmin_decorators;
    var _archiveVehicle_decorators;
    var VehiclesController = _classThis = /** @class */ (function () {
        function VehiclesController_1(vehiclesService) {
            this.vehiclesService = (__runInitializers(this, _instanceExtraInitializers), vehiclesService);
        }
        // ==================== CLIENT ENDPOINTS ====================
        VehiclesController_1.prototype.createVehicle = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.createVehicle(user.id, dto)];
                });
            });
        };
        VehiclesController_1.prototype.getUserVehicles = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getUserVehicles(user.id)];
                });
            });
        };
        VehiclesController_1.prototype.getVehicle = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getVehicle(user.id, vehicleId)];
                });
            });
        };
        VehiclesController_1.prototype.updateVehicle = function (user, vehicleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.updateVehicle(user.id, vehicleId, dto)];
                });
            });
        };
        VehiclesController_1.prototype.deleteVehicle = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.deleteVehicle(user.id, vehicleId)];
                });
            });
        };
        VehiclesController_1.prototype.getVehicleBookings = function (user_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (user, vehicleId, page, limit, status) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getVehicleBookingHistory(user.id, vehicleId, page, limit, status)];
                });
            });
        };
        VehiclesController_1.prototype.getUpcomingBookings = function (user_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (user, vehicleId, limit) {
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getUpcomingBookings(user.id, vehicleId, limit)];
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        VehiclesController_1.prototype.getAllVehicles = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getAllVehicles(query)];
                });
            });
        };
        VehiclesController_1.prototype.getMostUsedVehicles = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getMostUsedVehicles(limit)];
                });
            });
        };
        VehiclesController_1.prototype.getVehiclesByClient = function (clientId_1) {
            return __awaiter(this, arguments, void 0, function (clientId, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getVehiclesByClient(clientId, page, limit)];
                });
            });
        };
        VehiclesController_1.prototype.getVehicleByIdAdmin = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.getVehicleByIdAdmin(vehicleId)];
                });
            });
        };
        VehiclesController_1.prototype.archiveVehicle = function (vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.vehiclesService.archiveVehicle(vehicleId)];
                });
            });
        };
        return VehiclesController_1;
    }());
    __setFunctionName(_classThis, "VehiclesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createVehicle_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Add a new vehicle' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Vehicle created', type: vehicle_response_dto_1.VehicleResponseDto }), (0, swagger_1.ApiResponse)({ status: 409, description: 'License plate already exists' })];
        _getUserVehicles_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all my vehicles' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vehicles', type: [vehicle_response_dto_1.VehicleResponseDto] })];
        _getVehicle_decorators = [(0, common_1.Get)(':vehicleId'), (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by ID with statistics' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle details', type: vehicle_response_dto_1.VehicleWithStatsResponseDto }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' })];
        _updateVehicle_decorators = [(0, common_1.Put)(':vehicleId'), (0, swagger_1.ApiOperation)({ summary: 'Update vehicle' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle updated', type: vehicle_response_dto_1.VehicleResponseDto }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'License plate already exists' })];
        _deleteVehicle_decorators = [(0, common_1.Delete)(':vehicleId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Delete vehicle (only if no bookings)' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle deleted' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Vehicle has existing bookings' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' })];
        _getVehicleBookings_decorators = [(0, common_1.Get)(':vehicleId/bookings'), (0, swagger_1.ApiOperation)({ summary: 'Get vehicle booking history' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by booking status' })];
        _getUpcomingBookings_decorators = [(0, common_1.Get)(':vehicleId/upcoming'), (0, swagger_1.ApiOperation)({ summary: 'Get upcoming bookings for vehicle' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 5 })];
        _getAllVehicles_decorators = [(0, common_1.Get)('admin/all'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get all vehicles (admin/manager only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated vehicle list' })];
        _getMostUsedVehicles_decorators = [(0, common_1.Get)('admin/most-used'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Get most used vehicles across platform (admin only)' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 })];
        _getVehiclesByClient_decorators = [(0, common_1.Get)('admin/client/:clientId'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get vehicles by client ID (admin/manager only)' }), (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client UUID' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 })];
        _getVehicleByIdAdmin_decorators = [(0, common_1.Get)('admin/:vehicleId'), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'), (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by ID (admin/manager only)' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' })];
        _archiveVehicle_decorators = [(0, common_1.Put)('admin/:vehicleId/archive'), (0, roles_decorator_1.Roles)('ADMIN'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Archive vehicle (admin only)' }), (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'Vehicle UUID' })];
        __esDecorate(_classThis, null, _createVehicle_decorators, { kind: "method", name: "createVehicle", static: false, private: false, access: { has: function (obj) { return "createVehicle" in obj; }, get: function (obj) { return obj.createVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserVehicles_decorators, { kind: "method", name: "getUserVehicles", static: false, private: false, access: { has: function (obj) { return "getUserVehicles" in obj; }, get: function (obj) { return obj.getUserVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicle_decorators, { kind: "method", name: "getVehicle", static: false, private: false, access: { has: function (obj) { return "getVehicle" in obj; }, get: function (obj) { return obj.getVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVehicle_decorators, { kind: "method", name: "updateVehicle", static: false, private: false, access: { has: function (obj) { return "updateVehicle" in obj; }, get: function (obj) { return obj.updateVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteVehicle_decorators, { kind: "method", name: "deleteVehicle", static: false, private: false, access: { has: function (obj) { return "deleteVehicle" in obj; }, get: function (obj) { return obj.deleteVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicleBookings_decorators, { kind: "method", name: "getVehicleBookings", static: false, private: false, access: { has: function (obj) { return "getVehicleBookings" in obj; }, get: function (obj) { return obj.getVehicleBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUpcomingBookings_decorators, { kind: "method", name: "getUpcomingBookings", static: false, private: false, access: { has: function (obj) { return "getUpcomingBookings" in obj; }, get: function (obj) { return obj.getUpcomingBookings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllVehicles_decorators, { kind: "method", name: "getAllVehicles", static: false, private: false, access: { has: function (obj) { return "getAllVehicles" in obj; }, get: function (obj) { return obj.getAllVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMostUsedVehicles_decorators, { kind: "method", name: "getMostUsedVehicles", static: false, private: false, access: { has: function (obj) { return "getMostUsedVehicles" in obj; }, get: function (obj) { return obj.getMostUsedVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehiclesByClient_decorators, { kind: "method", name: "getVehiclesByClient", static: false, private: false, access: { has: function (obj) { return "getVehiclesByClient" in obj; }, get: function (obj) { return obj.getVehiclesByClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicleByIdAdmin_decorators, { kind: "method", name: "getVehicleByIdAdmin", static: false, private: false, access: { has: function (obj) { return "getVehicleByIdAdmin" in obj; }, get: function (obj) { return obj.getVehicleByIdAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _archiveVehicle_decorators, { kind: "method", name: "archiveVehicle", static: false, private: false, access: { has: function (obj) { return "archiveVehicle" in obj; }, get: function (obj) { return obj.archiveVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VehiclesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VehiclesController = _classThis;
}();
exports.VehiclesController = VehiclesController;
