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
exports.LoyaltyController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var loyalty_config_dto_1 = require("./dto/loyalty-config.dto");
var redeem_points_dto_1 = require("./dto/redeem-points.dto");
var loyalty_transaction_dto_1 = require("./dto/loyalty-transaction.dto");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var public_decorator_1 = require("../../common/decorators/public.decorator");
var LoyaltyController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Loyalty'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)({ path: 'loyalty', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSummary_decorators;
    var _getTransactions_decorators;
    var _getQuickRedeemOptions_decorators;
    var _calculateRedemption_decorators;
    var _redeemPoints_decorators;
    var _getLeaderboard_decorators;
    var _getConfig_decorators;
    var _updateConfig_decorators;
    var _getAdminStats_decorators;
    var _adjustPoints_decorators;
    var LoyaltyController = _classThis = /** @class */ (function () {
        function LoyaltyController_1(loyaltyService, prisma) {
            this.loyaltyService = (__runInitializers(this, _instanceExtraInitializers), loyaltyService);
            this.prisma = prisma;
        }
        // ==================== CLIENT ENDPOINTS ====================
        LoyaltyController_1.prototype.getSummary = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientByUserId(user.id)];
                        case 1:
                            client = _a.sent();
                            return [2 /*return*/, this.loyaltyService.getClientSummary(client.id)];
                    }
                });
            });
        };
        LoyaltyController_1.prototype.getTransactions = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, page, limit, type) {
                var client;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientByUserId(user.id)];
                        case 1:
                            client = _a.sent();
                            return [2 /*return*/, this.loyaltyService.getTransactionHistory(client.id, page, limit, type)];
                    }
                });
            });
        };
        LoyaltyController_1.prototype.getQuickRedeemOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.loyaltyService.getQuickRedeemOptions()];
                });
            });
        };
        LoyaltyController_1.prototype.calculateRedemption = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientByUserId(user.id)];
                        case 1:
                            client = _a.sent();
                            return [2 /*return*/, this.loyaltyService.calculateRedemption(client.id, dto.total_amount, dto.points_to_redeem)];
                    }
                });
            });
        };
        LoyaltyController_1.prototype.redeemPoints = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientByUserId(user.id)];
                        case 1:
                            client = _a.sent();
                            if (dto.booking_id) {
                                return [2 /*return*/, this.loyaltyService.redeemPointsForBooking(client.id, dto.booking_id, dto.points)];
                            }
                            else if (dto.points) {
                                return [2 /*return*/, this.loyaltyService.quickRedeem(client.id, dto.points)];
                            }
                            else {
                                // Default to quick redeem with 100 points
                                return [2 /*return*/, this.loyaltyService.quickRedeem(client.id, 100)];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        LoyaltyController_1.prototype.getLeaderboard = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.loyaltyService.getLeaderboard(limit)];
                });
            });
        };
        // ==================== ADMIN ENDPOINTS ====================
        LoyaltyController_1.prototype.getConfig = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loyaltyService.getConfig()];
                        case 1:
                            config = _a.sent();
                            return [2 /*return*/, this.loyaltyService.formatConfigResponse(config)];
                    }
                });
            });
        };
        LoyaltyController_1.prototype.updateConfig = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.loyaltyService.updateConfig(user.id, dto)];
                });
            });
        };
        LoyaltyController_1.prototype.getAdminStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.loyaltyService.getAdminStats()];
                });
            });
        };
        LoyaltyController_1.prototype.adjustPoints = function (user, clientId, points, reason) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.loyaltyService.adjustPoints(user.id, clientId, points, reason)];
                });
            });
        };
        // ==================== PRIVATE HELPERS ====================
        LoyaltyController_1.prototype.getClientByUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.client.findUnique({
                                where: { userId: userId },
                                select: { id: true },
                            })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.NotFoundException('Client profile not found');
                            }
                            return [2 /*return*/, client];
                    }
                });
            });
        };
        return LoyaltyController_1;
    }());
    __setFunctionName(_classThis, "LoyaltyController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSummary_decorators = [(0, common_1.Get)('summary'), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty summary (points balance, tier, etc.)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Loyalty summary', type: loyalty_transaction_dto_1.LoyaltySummaryResponseDto })];
        _getTransactions_decorators = [(0, common_1.Get)('transactions'), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty transaction history' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 20 }), (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['EARNED', 'REDEEMED'] })];
        _getQuickRedeemOptions_decorators = [(0, common_1.Get)('quick-redeem'), (0, swagger_1.ApiOperation)({ summary: 'Get quick redeem options (UI: 100 pts → EGP 10)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Quick redeem options', type: loyalty_transaction_dto_1.QuickRedeemResponseDto })];
        _calculateRedemption_decorators = [(0, common_1.Post)('calculate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Calculate potential redemption for a booking' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption calculation', type: redeem_points_dto_1.RedemptionCalculationResponseDto })];
        _redeemPoints_decorators = [(0, common_1.Post)('redeem'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Redeem points for booking discount or quick coupon' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Redemption result', type: redeem_points_dto_1.RedemptionResultDto })];
        _getLeaderboard_decorators = [(0, common_1.Get)('leaderboard'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty points leaderboard' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 50 })];
        _getConfig_decorators = [(0, common_1.Get)('config'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty configuration (admin only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Loyalty config', type: loyalty_config_dto_1.LoyaltyConfigResponseDto })];
        _updateConfig_decorators = [(0, common_1.Put)('config'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Update loyalty configuration (admin only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Updated config', type: loyalty_config_dto_1.LoyaltyConfigResponseDto })];
        _getAdminStats_decorators = [(0, common_1.Get)('admin/stats'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Get loyalty stats for admin dashboard' })];
        _adjustPoints_decorators = [(0, common_1.Post)('admin/adjust/:clientId'), (0, roles_decorator_1.Roles)('ADMIN'), (0, swagger_1.ApiOperation)({ summary: 'Manually adjust client points (admin only)' }), (0, swagger_1.ApiParam)({ name: 'clientId', description: 'Client UUID' })];
        __esDecorate(_classThis, null, _getSummary_decorators, { kind: "method", name: "getSummary", static: false, private: false, access: { has: function (obj) { return "getSummary" in obj; }, get: function (obj) { return obj.getSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTransactions_decorators, { kind: "method", name: "getTransactions", static: false, private: false, access: { has: function (obj) { return "getTransactions" in obj; }, get: function (obj) { return obj.getTransactions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQuickRedeemOptions_decorators, { kind: "method", name: "getQuickRedeemOptions", static: false, private: false, access: { has: function (obj) { return "getQuickRedeemOptions" in obj; }, get: function (obj) { return obj.getQuickRedeemOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateRedemption_decorators, { kind: "method", name: "calculateRedemption", static: false, private: false, access: { has: function (obj) { return "calculateRedemption" in obj; }, get: function (obj) { return obj.calculateRedemption; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _redeemPoints_decorators, { kind: "method", name: "redeemPoints", static: false, private: false, access: { has: function (obj) { return "redeemPoints" in obj; }, get: function (obj) { return obj.redeemPoints; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLeaderboard_decorators, { kind: "method", name: "getLeaderboard", static: false, private: false, access: { has: function (obj) { return "getLeaderboard" in obj; }, get: function (obj) { return obj.getLeaderboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConfig_decorators, { kind: "method", name: "getConfig", static: false, private: false, access: { has: function (obj) { return "getConfig" in obj; }, get: function (obj) { return obj.getConfig; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateConfig_decorators, { kind: "method", name: "updateConfig", static: false, private: false, access: { has: function (obj) { return "updateConfig" in obj; }, get: function (obj) { return obj.updateConfig; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAdminStats_decorators, { kind: "method", name: "getAdminStats", static: false, private: false, access: { has: function (obj) { return "getAdminStats" in obj; }, get: function (obj) { return obj.getAdminStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adjustPoints_decorators, { kind: "method", name: "adjustPoints", static: false, private: false, access: { has: function (obj) { return "adjustPoints" in obj; }, get: function (obj) { return obj.adjustPoints; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoyaltyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoyaltyController = _classThis;
}();
exports.LoyaltyController = LoyaltyController;
