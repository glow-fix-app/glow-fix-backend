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
exports.ClientsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var client_response_dto_1 = require("./dto/client-response.dto");
var client_stats_dto_1 = require("./dto/client-stats.dto");
var ClientsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Clients'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'clients', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMyProfile_decorators;
    var _getMyLocation_decorators;
    var _updateMyLocation_decorators;
    var _getMyStats_decorators;
    var _getMyLoyalty_decorators;
    var _getNearbyBusinesses_decorators;
    var _getMyVehicles_decorators;
    var ClientsController = _classThis = /** @class */ (function () {
        function ClientsController_1(clientsService) {
            this.clientsService = (__runInitializers(this, _instanceExtraInitializers), clientsService);
        }
        // ==================== CLIENT PROFILE ====================
        ClientsController_1.prototype.getMyProfile = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getClientByUserId(user.id)];
                });
            });
        };
        // ==================== LOCATION MANAGEMENT ====================
        ClientsController_1.prototype.getMyLocation = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getLocation(user.id)];
                });
            });
        };
        ClientsController_1.prototype.updateMyLocation = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.updateLocation(user.id, dto)];
                });
            });
        };
        // ==================== STATISTICS ====================
        ClientsController_1.prototype.getMyStats = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getClientStats(user.id)];
                });
            });
        };
        // ==================== LOYALTY POINTS ====================
        ClientsController_1.prototype.getMyLoyalty = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getLoyaltySummary(user.id)];
                });
            });
        };
        // ==================== NEARBY DISCOVERY ====================
        ClientsController_1.prototype.getNearbyBusinesses = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, radius, page, limit) {
                if (radius === void 0) { radius = '10'; }
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getNearbyBusinesses(user.id, parseFloat(radius), page, limit)];
                });
            });
        };
        // ==================== VEHICLES (Read-only reference) ====================
        ClientsController_1.prototype.getMyVehicles = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.clientsService.getClientVehicles(user.id)];
                });
            });
        };
        return ClientsController_1;
    }());
    __setFunctionName(_classThis, "ClientsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMyProfile_decorators = [(0, common_1.Get)('me'), (0, swagger_1.ApiOperation)({ summary: 'Get client profile' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile', type: client_response_dto_1.ClientResponseDto })];
        _getMyLocation_decorators = [(0, common_1.Get)('me/location'), (0, swagger_1.ApiOperation)({ summary: 'Get current location' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Client location' })];
        _updateMyLocation_decorators = [(0, common_1.Put)('me/location'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Update current location' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated' })];
        _getMyStats_decorators = [(0, common_1.Get)('me/stats'), (0, swagger_1.ApiOperation)({ summary: 'Get client statistics' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Client statistics', type: client_stats_dto_1.ClientStatsDto })];
        _getMyLoyalty_decorators = [(0, common_1.Get)('me/loyalty'), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty points summary' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Loyalty summary', type: client_stats_dto_1.LoyaltySummaryDto })];
        _getNearbyBusinesses_decorators = [(0, common_1.Get)('me/nearby'), (0, swagger_1.ApiOperation)({ summary: 'Find nearby businesses' }), (0, swagger_1.ApiQuery)({ name: 'radius', required: false, type: Number, description: 'Radius in km', example: 10 }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby businesses', type: [client_response_dto_1.NearbyBusinessDto] })];
        _getMyVehicles_decorators = [(0, common_1.Get)('me/vehicles'), (0, swagger_1.ApiOperation)({ summary: 'Get client vehicles (reference only - full CRUD in Vehicles module)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vehicles' })];
        __esDecorate(_classThis, null, _getMyProfile_decorators, { kind: "method", name: "getMyProfile", static: false, private: false, access: { has: function (obj) { return "getMyProfile" in obj; }, get: function (obj) { return obj.getMyProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyLocation_decorators, { kind: "method", name: "getMyLocation", static: false, private: false, access: { has: function (obj) { return "getMyLocation" in obj; }, get: function (obj) { return obj.getMyLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMyLocation_decorators, { kind: "method", name: "updateMyLocation", static: false, private: false, access: { has: function (obj) { return "updateMyLocation" in obj; }, get: function (obj) { return obj.updateMyLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyStats_decorators, { kind: "method", name: "getMyStats", static: false, private: false, access: { has: function (obj) { return "getMyStats" in obj; }, get: function (obj) { return obj.getMyStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyLoyalty_decorators, { kind: "method", name: "getMyLoyalty", static: false, private: false, access: { has: function (obj) { return "getMyLoyalty" in obj; }, get: function (obj) { return obj.getMyLoyalty; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNearbyBusinesses_decorators, { kind: "method", name: "getNearbyBusinesses", static: false, private: false, access: { has: function (obj) { return "getNearbyBusinesses" in obj; }, get: function (obj) { return obj.getNearbyBusinesses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyVehicles_decorators, { kind: "method", name: "getMyVehicles", static: false, private: false, access: { has: function (obj) { return "getMyVehicles" in obj; }, get: function (obj) { return obj.getMyVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientsController = _classThis;
}();
exports.ClientsController = ClientsController;
// import {
//   Controller,
//   Get,
//   Put,
//   Delete,
//   Body,
//   Param,
//   Query,
//   HttpCode,
//   HttpStatus,
//   ParseUUIDPipe,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiQuery,
//   ApiParam,
// } from '@nestjs/swagger';
// import { ClientsService } from './clients.service';
// import { UpdateClientLocationDto } from './dto/client-location.dto';
// import { ClientResponseDto, NearbyClientDto } from './dto/client-response.dto';
// import { ClientStatsDto } from './dto/client-stats.dto';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Public } from '../../common/decorators/public.decorator';
// @ApiTags('Clients')
// @ApiBearerAuth()
// @Controller({ path: 'clients', version: '1' })
// export class ClientsController {
//   constructor(private readonly clientsService: ClientsService) {}
//   // ==================== CLIENT SELF-SERVICE ENDPOINTS ====================
//   @Get('me')
//   @ApiOperation({ summary: 'Get current client profile' })
//   @ApiResponse({ status: 200, description: 'Client profile returned', type: ClientResponseDto })
//   async getMyProfile(@CurrentUser() user: any): Promise<ClientResponseDto> {
//     return this.clientsService.getClientByUserId(user.id);
//   }
//   @Get('me/stats')
//   @ApiOperation({ summary: 'Get current client statistics' })
//   @ApiResponse({ status: 200, description: 'Client statistics', type: ClientStatsDto })
//   async getMyStats(@CurrentUser() user: any): Promise<ClientStatsDto> {
//     const client = await this.clientsService.getClientByUserId(user.id);
//     return this.clientsService.getClientStats(client.id);
//   }
//   @Get('me/location')
//   @ApiOperation({ summary: 'Get current client location' })
//   @ApiResponse({ status: 200, description: 'Client location' })
//   async getMyLocation(@CurrentUser() user: any): Promise<{ latitude: number; longitude: number } | null> {
//     return this.clientsService.getLocation(user.id);
//   }
//   @Put('me/location')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Update current client location' })
//   @ApiResponse({ status: 200, description: 'Location updated' })
//   async updateMyLocation(
//     @CurrentUser() user: any,
//     @Body() dto: UpdateClientLocationDto,
//   ): Promise<{ success: boolean; location: { latitude: number; longitude: number } }> {
//     return this.clientsService.updateLocation(user.id, dto);
//   }
//   @Get('me/bookings')
//   @ApiOperation({ summary: 'Get current client booking history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
//   async getMyBookings(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('status') status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     return this.clientsService.getBookingHistory(user.id, page, limit, status);
//   }
//   @Get('me/favorite-services')
//   @ApiOperation({ summary: 'Get client favorite services' })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   async getMyFavoriteServices(
//     @CurrentUser() user: any,
//     @Query('limit') limit: number = 10,
//   ): Promise<Array<{ service_id: string; service_name: string; category: string; booking_count: number }>> {
//     return this.clientsService.getFavoriteServices(user.id, limit);
//   }
//   @Get('me/loyalty')
//   @ApiOperation({ summary: 'Get client loyalty points history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   async getMyLoyaltyHistory(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//   ): Promise<{ data: any[]; meta: any }> {
//     return this.clientsService.getLoyaltyHistory(user.id, page, limit);
//   }
//   @Delete('me')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete current client account' })
//   @ApiResponse({ status: 200, description: 'Account deleted' })
//   async deleteMyAccount(@CurrentUser() user: any): Promise<{ success: boolean; message: string }> {
//     return this.clientsService.deleteClient(user.id, user.id, user.role);
//   }
//   // ==================== ADMIN/MANAGER ENDPOINTS ====================
//   @Get()
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get all clients with filters (admin/manager only)' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or phone' })
//   async getAllClients(
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('search') search?: string,
//   ): Promise<{ data: ClientResponseDto[]; meta: any }> {
//     if (search) {
//       return this.clientsService.searchClients(search, page, limit);
//     }
//     // Return all clients with pagination
//     return this.clientsService.searchClients('', page, limit);
//   }
//   @Get('nearby')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get nearby clients based on location (admin/manager only)' })
//   @ApiQuery({ name: 'lat', required: true, type: Number })
//   @ApiQuery({ name: 'lng', required: true, type: Number })
//   @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km', example: 10 })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 50 })
//   async getNearbyClients(
//     @Query('lat') lat: string,
//     @Query('lng') lng: string,
//     @Query('radius') radius: string = '10',
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 50,
//   ): Promise<{ data: NearbyClientDto[]; total: number; page: number; limit: number; totalPages: number }> {
//     return this.clientsService.getNearbyClients(
//       parseFloat(lat),
//       parseFloat(lng),
//       parseFloat(radius),
//       limit,
//       page,
//     );
//   }
//   @Get('top-spenders')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Get top clients by spending (admin only)' })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   @ApiQuery({ name: 'startDate', required: false, type: String })
//   @ApiQuery({ name: 'endDate', required: false, type: String })
//   async getTopSpenders(
//     @Query('limit') limit: number = 10,
//     @Query('startDate') startDate?: string,
//     @Query('endDate') endDate?: string,
//   ): Promise<ClientResponseDto[]> {
//     return this.clientsService.getTopClientsBySpending(
//       limit,
//       startDate ? new Date(startDate) : undefined,
//       endDate ? new Date(endDate) : undefined,
//     );
//   }
//   @Get(':clientId')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client profile', type: ClientResponseDto })
//   @ApiResponse({ status: 404, description: 'Client not found' })
//   async getClientById(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//   ): Promise<ClientResponseDto> {
//     const client = await this.clientsService.getClientById(clientId);
//     const stats = await this.clientsService.getClientStats(client.id);
//     return {
//       id: client.id,
//       user_id: client.user_id,
//       full_name: client.user.full_name,
//       email: client.user.email,
//       phone: client.user.phone,
//       avatar_url: client.user.avatar_url,
//       email_verified: client.user.email_verified,
//       phone_verified: client.user.phone_verified,
//       total_bookings: stats.total_bookings,
//       total_spent: stats.total_spent,
//       loyalty_points: stats.loyalty_points,
//       vehicles_count: stats.vehicles_count,
//       created_at: client.created_at,
//       updated_at: client.updated_at,
//     };
//   }
//   @Get(':clientId/stats')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client statistics by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client statistics', type: ClientStatsDto })
//   async getClientStatsById(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//   ): Promise<ClientStatsDto> {
//     return this.clientsService.getClientStats(clientId);
//   }
//   @Get(':clientId/bookings')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client booking history by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'status', required: false })
//   async getClientBookings(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('status') status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.clientsService.getClientById(clientId);
//     return this.clientsService.getBookingHistory(client.user_id, page, limit, status);
//   }
//   @Delete(':clientId')
//   @Roles('ADMIN')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete client by ID (admin only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client deleted' })
//   async deleteClient(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//     @CurrentUser() user: any,
//   ): Promise<{ success: boolean; message: string }> {
//     const client = await this.clientsService.getClientById(clientId);
//     return this.clientsService.deleteClient(client.user_id, user.id, user.role);
//   }
// }
