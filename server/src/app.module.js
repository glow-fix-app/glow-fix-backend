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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var throttler_1 = require("@nestjs/throttler");
var event_emitter_1 = require("@nestjs/event-emitter");
var core_1 = require("@nestjs/core");
var configuration_1 = __importDefault(require("./config/configuration"));
// Core modules
var prisma_module_1 = require("./core/prisma/prisma.module");
var redis_module_1 = require("./core/redis/redis.module");
var logger_module_1 = require("./common/logger/logger.module");
var health_module_1 = require("./core/health/health.module");
// Feature modules
var auth_module_1 = require("./modules/auth/auth.module");
var users_module_1 = require("./modules/users/users.module");
// Guards
var jwt_auth_guard_1 = require("./modules/auth/guards/jwt-auth.guard");
// Middleware
var correlation_id_middleware_1 = require("./common/middleware/correlation-id.middleware");
var mail_config_1 = __importDefault(require("./config/mail.config"));
var storage_config_1 = __importDefault(require("./config/storage.config"));
var clients_module_1 = require("./modules/clients/clients.module");
var vehicles_module_1 = require("./modules/vehicles/vehicles.module");
var categories_module_1 = require("./modules/categories/categories.module");
var services_module_1 = require("./modules/services/services.module");
var reviews_module_1 = require("./modules/reviews/reviews.module");
var loyalty_module_1 = require("./modules/loyalty/loyalty.module");
var notifications_module_1 = require("./modules/notifications/notifications.module");
var diagnostic_reports_module_1 = require("./modules/diagnostic-reports/diagnostic-reports.module");
var chat_module_1 = require("./modules/chat/chat.module");
var businesses_module_1 = require("./modules/businesses/businesses.module");
var payments_module_1 = require("./modules/payments/payments.module");
var bookings_module_1 = require("./modules/bookings/bookings.module");
var roles_guard_1 = require("./common/guards/roles.guard");
var analytics_module_1 = require("./modules/analytics/analytics.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // Configuration
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration_1.default, mail_config_1.default, storage_config_1.default],
                    cache: true,
                }),
                // Rate Limiting
                throttler_1.ThrottlerModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, ({
                                    ttl: config.get('throttle.ttl') || 60,
                                    limit: config.get('throttle.limit') || 100,
                                })];
                        });
                    }); },
                }),
                // Event Emitter (global)
                event_emitter_1.EventEmitterModule.forRoot(),
                // Core
                logger_module_1.LoggerModule,
                prisma_module_1.PrismaModule,
                redis_module_1.RedisModule,
                health_module_1.HealthModule,
                // Features
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                clients_module_1.ClientsModule,
                vehicles_module_1.VehiclesModule,
                categories_module_1.CategoriesModule,
                businesses_module_1.BusinessesModule,
                services_module_1.ServicesModule,
                reviews_module_1.ReviewsModule,
                loyalty_module_1.LoyaltyModule,
                notifications_module_1.NotificationsModule,
                diagnostic_reports_module_1.DiagnosticReportsModule,
                chat_module_1.ChatModule,
                payments_module_1.PaymentsModule,
                bookings_module_1.BookingsModule,
                analytics_module_1.AnalyticsModule,
            ],
            providers: [
                jwt_auth_guard_1.JwtAuthGuard,
                {
                    provide: core_1.APP_GUARD,
                    useClass: jwt_auth_guard_1.JwtAuthGuard,
                },
                {
                    provide: core_1.APP_GUARD,
                    useClass: roles_guard_1.RolesGuard,
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        AppModule_1.prototype.configure = function (consumer) {
            consumer.apply(correlation_id_middleware_1.CorrelationIdMiddleware).forRoutes('*');
        };
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
