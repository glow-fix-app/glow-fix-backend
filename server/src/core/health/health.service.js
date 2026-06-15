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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
var common_1 = require("@nestjs/common");
var HealthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HealthService = _classThis = /** @class */ (function () {
        function HealthService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
        }
        HealthService_1.prototype.checkReadiness = function () {
            return __awaiter(this, void 0, void 0, function () {
                var checks, _a, isHealthy, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            checks = {};
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 2:
                            _c.sent();
                            checks.database = 'ok';
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _c.sent();
                            checks.database = 'error';
                            return [3 /*break*/, 4];
                        case 4:
                            _c.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.redis.ping()];
                        case 5:
                            isHealthy = _c.sent();
                            checks.redis = isHealthy ? 'ok' : 'error';
                            return [3 /*break*/, 7];
                        case 6:
                            _b = _c.sent();
                            checks.redis = 'error';
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, checks];
                    }
                });
            });
        };
        HealthService_1.prototype.getDetailedHealth = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, dbStatus, dbResponseTime, dbConnections, dbStart, dbEnd, poolInfo, _a, redisStatus, redisResponseTime, redisInfo, redisStart, redisEnd, _b, totalTime, uptime;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            startTime = process.hrtime();
                            dbStatus = 'ok';
                            dbResponseTime = 0;
                            dbConnections = { active: 0, max: 0 };
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            dbStart = process.hrtime();
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                        case 2:
                            _c.sent();
                            dbEnd = process.hrtime(dbStart);
                            dbResponseTime = Math.round(dbEnd[0] * 1000 + dbEnd[1] / 1e6);
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT \n        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::int as active,\n        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max"], ["SELECT \n        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::int as active,\n        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max"])))];
                        case 3:
                            poolInfo = _c.sent();
                            if (poolInfo[0]) {
                                dbConnections = { active: poolInfo[0].active, max: poolInfo[0].max };
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _c.sent();
                            dbStatus = 'error';
                            return [3 /*break*/, 5];
                        case 5:
                            redisStatus = 'ok';
                            redisResponseTime = 0;
                            redisInfo = { usedMemory: 'unknown', connectedClients: 'unknown', uptimeInSeconds: 'unknown' };
                            _c.label = 6;
                        case 6:
                            _c.trys.push([6, 9, , 10]);
                            redisStart = process.hrtime();
                            return [4 /*yield*/, this.redis.ping()];
                        case 7:
                            _c.sent();
                            redisEnd = process.hrtime(redisStart);
                            redisResponseTime = Math.round(redisEnd[0] * 1000 + redisEnd[1] / 1e6);
                            return [4 /*yield*/, this.redis.getInfo()];
                        case 8:
                            redisInfo = _c.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _b = _c.sent();
                            redisStatus = 'error';
                            return [3 /*break*/, 10];
                        case 10:
                            totalTime = process.hrtime(startTime);
                            uptime = process.uptime();
                            return [2 /*return*/, {
                                    status: dbStatus === 'ok' && redisStatus === 'ok' ? 'healthy' : 'degraded',
                                    version: '2.0.0',
                                    uptime: Math.round(uptime),
                                    nodeVersion: process.version,
                                    memoryUsage: {
                                        rss: "".concat(Math.round(process.memoryUsage().rss / 1024 / 1024), "MB"),
                                        heapUsed: "".concat(Math.round(process.memoryUsage().heapUsed / 1024 / 1024), "MB"),
                                        heapTotal: "".concat(Math.round(process.memoryUsage().heapTotal / 1024 / 1024), "MB"),
                                    },
                                    checks: {
                                        database: {
                                            status: dbStatus,
                                            responseTime: dbResponseTime,
                                            connections: dbConnections,
                                        },
                                        redis: {
                                            status: redisStatus,
                                            responseTime: redisResponseTime,
                                            memory: redisInfo.usedMemory,
                                            clients: redisInfo.connectedClients,
                                            uptime: redisInfo.uptimeInSeconds,
                                        },
                                    },
                                    responseTime: Math.round(totalTime[0] * 1000 + totalTime[1] / 1e6),
                                    timestamp: new Date().toISOString(),
                                }];
                    }
                });
            });
        };
        return HealthService_1;
    }());
    __setFunctionName(_classThis, "HealthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthService = _classThis;
}();
exports.HealthService = HealthService;
var templateObject_1, templateObject_2, templateObject_3;
