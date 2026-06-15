"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.MetricsService = void 0;
var common_1 = require("@nestjs/common");
var client = __importStar(require("prom-client"));
var MetricsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MetricsService = _classThis = /** @class */ (function () {
        function MetricsService_1(configService) {
            this.configService = configService;
        }
        MetricsService_1.prototype.onModuleInit = function () {
            // Collect default metrics (CPU, memory, event loop, etc.)
            client.collectDefaultMetrics({
                prefix: 'glowfix_',
            });
            // ─── HTTP Metrics ───
            this.httpRequestDuration = new client.Histogram({
                name: 'glowfix_http_request_duration_seconds',
                help: 'Duration of HTTP requests in seconds',
                labelNames: ['method', 'route', 'status_code'],
                buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
            });
            this.httpRequestTotal = new client.Counter({
                name: 'glowfix_http_requests_total',
                help: 'Total number of HTTP requests',
                labelNames: ['method', 'route', 'status_code'],
            });
            this.httpErrorTotal = new client.Counter({
                name: 'glowfix_http_errors_total',
                help: 'Total number of HTTP errors',
                labelNames: ['method', 'route', 'status_code', 'error_code'],
            });
            // ─── Business Metrics ───
            this.activeUsers = new client.Gauge({
                name: 'glowfix_active_users_total',
                help: 'Number of currently active users',
            });
            this.bookingsCreated = new client.Counter({
                name: 'glowfix_bookings_created_total',
                help: 'Total number of bookings created',
                labelNames: ['service_type', 'payment_method', 'car_wash'],
            });
            this.bookingsCompleted = new client.Counter({
                name: 'glowfix_bookings_completed_total',
                help: 'Total number of bookings completed',
                labelNames: ['service_type', 'car_wash'],
            });
            this.revenueTotal = new client.Counter({
                name: 'glowfix_revenue_cents_total',
                help: 'Total revenue in cents',
                labelNames: ['service_type', 'payment_method'],
            });
            this.loyaltyPointsIssued = new client.Counter({
                name: 'glowfix_loyalty_points_issued_total',
                help: 'Total loyalty points issued',
                labelNames: ['type'],
            });
            this.queueLength = new client.Gauge({
                name: 'glowfix_queue_length',
                help: 'Current queue length per car wash',
                labelNames: ['car_wash'],
            });
            this.websocketConnections = new client.Gauge({
                name: 'glowfix_websocket_connections_active',
                help: 'Number of active WebSocket connections',
            });
            // ─── System Metrics ───
            this.dbQueryDuration = new client.Histogram({
                name: 'glowfix_db_query_duration_seconds',
                help: 'Duration of database queries in seconds',
                labelNames: ['operation', 'model'],
                buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
            });
            this.cacheHitRatio = new client.Gauge({
                name: 'glowfix_cache_hit_ratio',
                help: 'Cache hit ratio (0-1)',
                labelNames: ['cache_type'],
            });
            this.jobQueueDepth = new client.Gauge({
                name: 'glowfix_job_queue_depth',
                help: 'Number of jobs in BullMQ queue',
                labelNames: ['queue_name', 'status'],
            });
        };
        MetricsService_1.prototype.getMetrics = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, client.register.metrics()];
                });
            });
        };
        MetricsService_1.prototype.getContentType = function () {
            return client.register.contentType;
        };
        return MetricsService_1;
    }());
    __setFunctionName(_classThis, "MetricsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MetricsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MetricsService = _classThis;
}();
exports.MetricsService = MetricsService;
