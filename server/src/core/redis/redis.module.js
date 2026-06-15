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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var redis_service_1 = require("./redis.service");
var ioredis_1 = __importDefault(require("ioredis"));
//import { REDIS_CLIENT } from '../../constants/redis.constants';
exports.REDIS_CLIENT = 'REDIS_CLIENT';
var RedisModule = function () {
    var _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [config_1.ConfigModule],
            providers: [
                {
                    provide: exports.REDIS_CLIENT,
                    useFactory: function (configService) {
                        var client = new ioredis_1.default({
                            host: configService.get('redis.host'),
                            port: configService.get('redis.port'),
                            password: configService.get('redis.password'),
                            db: configService.get('redis.db'),
                            tls: configService.get('redis.tls') === 'true' ||
                                configService.get('redis.tls') === true
                                ? {}
                                : undefined,
                            maxRetriesPerRequest: 3,
                            enableReadyCheck: true,
                            lazyConnect: false,
                            retryStrategy: function (times) {
                                if (times > 10)
                                    return null; // stop retrying
                                return Math.min(times * 200, 2000);
                            },
                        });
                        client.on('connect', function () { return console.log('✅ Redis connected'); });
                        client.on('error', function (err) { return console.error('❌ Redis error:', err); });
                        return client;
                    },
                    inject: [config_1.ConfigService],
                },
                redis_service_1.RedisService,
            ],
            exports: [exports.REDIS_CLIENT, redis_service_1.RedisService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RedisModule = _classThis = /** @class */ (function () {
        function RedisModule_1() {
        }
        return RedisModule_1;
    }());
    __setFunctionName(_classThis, "RedisModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedisModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedisModule = _classThis;
}();
exports.RedisModule = RedisModule;
