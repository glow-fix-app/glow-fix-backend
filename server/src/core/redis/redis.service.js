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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = __importDefault(require("ioredis"));
var RedisService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RedisService = _classThis = /** @class */ (function () {
        function RedisService_1(configService, logger) {
            var _this = this;
            this.configService = configService;
            this.logger = logger;
            // Initialize with default config (will be overridden in onModuleInit if needed)
            var tlsConfig = this.configService.get('redis.tls');
            var tlsEnabled = tlsConfig === true || tlsConfig === 'true';
            this.client = new ioredis_1.default({
                host: this.configService.get('redis.host'),
                port: this.configService.get('redis.port'),
                password: this.configService.get('redis.password'),
                tls: tlsEnabled ? {} : undefined,
                maxRetriesPerRequest: 3,
                retryStrategy: function (times) {
                    if (times > 3) {
                        _this.logger.error('Redis connection failed after 3 retries', '', 'RedisService');
                        return null;
                    }
                    return Math.min(times * 200, 2000);
                },
                enableReadyCheck: true,
                lazyConnect: false,
            });
            // Set up event listeners
            this.client.on('connect', function () {
                _this.logger.log('✅ Redis connected', 'RedisService');
            });
            this.client.on('error', function (error) {
                _this.logger.error("Redis error: ".concat(error.message), error.stack, 'RedisService');
            });
        }
        RedisService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tlsConfig, tlsEnabled;
                var _this = this;
                return __generator(this, function (_a) {
                    tlsConfig = this.configService.get('redis.tls');
                    tlsEnabled = tlsConfig === true || tlsConfig === 'true';
                    this.client = new ioredis_1.default({
                        host: this.configService.get('redis.host'),
                        port: this.configService.get('redis.port'),
                        password: this.configService.get('redis.password'),
                        tls: tlsEnabled ? {} : undefined,
                        maxRetriesPerRequest: 3,
                        retryStrategy: function (times) {
                            if (times > 3) {
                                _this.logger.error('Redis connection failed after 3 retries', '', 'RedisService');
                                return null;
                            }
                            return Math.min(times * 200, 2000);
                        },
                        enableReadyCheck: true,
                        lazyConnect: false,
                    });
                    this.client.on('connect', function () {
                        _this.logger.log('✅ Redis connected', 'RedisService');
                    });
                    this.client.on('error', function (error) {
                        _this.logger.error("Redis error: ".concat(error.message), error.stack, 'RedisService');
                    });
                    return [2 /*return*/];
                });
            });
        };
        RedisService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.quit()];
                        case 1:
                            _a.sent();
                            this.logger.log('Redis disconnected', 'RedisService');
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.getClient = function () {
            return this.client;
        };
        // ─── Basic Operations ───
        RedisService_1.prototype.get = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.get(key)];
                });
            });
        };
        RedisService_1.prototype.set = function (key, value, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ttlSeconds) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.client.setex(key, ttlSeconds, value)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.client.set(key, value)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.del = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, (_a = this.client).del.apply(_a, (Array.isArray(key) ? key : [key]))];
                });
            });
        };
        RedisService_1.prototype.exists = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.exists(key)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result === 1];
                    }
                });
            });
        };
        RedisService_1.prototype.expire = function (key, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.expire(key, ttlSeconds)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.ttl = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.ttl(key)];
                });
            });
        };
        // ─── JSON Operations ───
        RedisService_1.prototype.getJson = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.get(key)];
                        case 1:
                            data = _a.sent();
                            if (!data)
                                return [2 /*return*/, null];
                            try {
                                return [2 /*return*/, JSON.parse(data)];
                            }
                            catch (_b) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.setJson = function (key, value, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var serialized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serialized = JSON.stringify(value);
                            return [4 /*yield*/, this.set(key, serialized, ttlSeconds)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Counter Operations ───
        RedisService_1.prototype.incr = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.incr(key)];
                });
            });
        };
        RedisService_1.prototype.incrBy = function (key, amount) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.incrby(key, amount)];
                });
            });
        };
        RedisService_1.prototype.decr = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.decr(key)];
                });
            });
        };
        // ─── Hash Operations ───
        RedisService_1.prototype.hget = function (key, field) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.hget(key, field)];
                });
            });
        };
        RedisService_1.prototype.hset = function (key, field, value) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.hset(key, field, value)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.hgetall = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.hgetall(key)];
                });
            });
        };
        RedisService_1.prototype.hdel = function (key) {
            var fields = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                fields[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, (_a = this.client).hdel.apply(_a, __spreadArray([key], fields, false))];
                });
            });
        };
        // ─── Set Operations ───
        RedisService_1.prototype.sadd = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, (_a = this.client).sadd.apply(_a, __spreadArray([key], members, false))];
                });
            });
        };
        RedisService_1.prototype.srem = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, (_a = this.client).srem.apply(_a, __spreadArray([key], members, false))];
                });
            });
        };
        RedisService_1.prototype.smembers = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.smembers(key)];
                });
            });
        };
        RedisService_1.prototype.sismember = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.sismember(key, member)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result === 1];
                    }
                });
            });
        };
        // ─── Sorted Set Operations (for queue positions) ───
        RedisService_1.prototype.zadd = function (key, score, member) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.zadd(key, score, member)];
                });
            });
        };
        RedisService_1.prototype.zrank = function (key, member) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.zrank(key, member)];
                });
            });
        };
        RedisService_1.prototype.zrem = function (key) {
            var members = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                members[_i - 1] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, (_a = this.client).zrem.apply(_a, __spreadArray([key], members, false))];
                });
            });
        };
        RedisService_1.prototype.zrange = function (key, start, stop) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.zrange(key, start, stop)];
                });
            });
        };
        RedisService_1.prototype.zcard = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.zcard(key)];
                });
            });
        };
        // ─── Pub/Sub (for real-time updates) ───
        RedisService_1.prototype.publish = function (channel, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.publish(channel, message)];
                });
            });
        };
        RedisService_1.prototype.createSubscriber = function () {
            return this.client.duplicate();
        };
        // ─── Pattern-Based Operations ───
        RedisService_1.prototype.keys = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.client.keys(pattern)];
                });
            });
        };
        RedisService_1.prototype.scan = function (pattern_1) {
            return __awaiter(this, arguments, void 0, function (pattern, count) {
                var results, cursor, _a, nextCursor, keys;
                if (count === void 0) { count = 100; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            results = [];
                            cursor = '0';
                            _b.label = 1;
                        case 1: return [4 /*yield*/, this.client.scan(cursor, 'MATCH', pattern, 'COUNT', count)];
                        case 2:
                            _a = _b.sent(), nextCursor = _a[0], keys = _a[1];
                            cursor = nextCursor;
                            results.push.apply(results, keys);
                            _b.label = 3;
                        case 3:
                            if (cursor !== '0') return [3 /*break*/, 1];
                            _b.label = 4;
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        RedisService_1.prototype.deleteByPattern = function (pattern) {
            return __awaiter(this, void 0, void 0, function () {
                var keys;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.scan(pattern)];
                        case 1:
                            keys = _b.sent();
                            if (keys.length === 0)
                                return [2 /*return*/, 0];
                            return [2 /*return*/, (_a = this.client).del.apply(_a, keys)];
                    }
                });
            });
        };
        // ─── Rate Limiting ───
        RedisService_1.prototype.checkRateLimit = function (key, maxAttempts, windowSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var current, ttl, remaining;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.incr(key)];
                        case 1:
                            current = _a.sent();
                            if (!(current === 1)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.expire(key, windowSeconds)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.ttl(key)];
                        case 4:
                            ttl = _a.sent();
                            remaining = Math.max(0, maxAttempts - current);
                            return [2 /*return*/, {
                                    allowed: current <= maxAttempts,
                                    remaining: remaining,
                                    resetAt: Date.now() + ttl * 1000,
                                }];
                    }
                });
            });
        };
        // ─── Distributed Lock ───
        RedisService_1.prototype.acquireLock = function (lockKey_1, ttlSeconds_1) {
            return __awaiter(this, arguments, void 0, function (lockKey, ttlSeconds, retryCount, retryDelayMs) {
                var lockValue, i, result;
                if (retryCount === void 0) { retryCount = 3; }
                if (retryDelayMs === void 0) { retryDelayMs = 200; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            lockValue = "lock:".concat(Date.now(), ":").concat(Math.random().toString(36).slice(2));
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < retryCount)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.client.set(lockKey, lockValue, 'EX', ttlSeconds, 'NX')];
                        case 2:
                            result = _a.sent();
                            if (result === 'OK') {
                                return [2 /*return*/, lockValue];
                            }
                            if (!(i < retryCount - 1)) return [3 /*break*/, 4];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelayMs); })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, null];
                    }
                });
            });
        };
        RedisService_1.prototype.releaseLock = function (lockKey, lockValue) {
            return __awaiter(this, void 0, void 0, function () {
                var script, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            script = "\n      if redis.call(\"get\", KEYS[1]) == ARGV[1] then\n        return redis.call(\"del\", KEYS[1])\n      else\n        return 0\n      end\n    ";
                            return [4 /*yield*/, this.client.eval(script, 1, lockKey, lockValue)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result === 1];
                    }
                });
            });
        };
        // ─── Cache Helpers ───
        RedisService_1.prototype.getOrSet = function (key, factory, ttlSeconds) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getJson(key)];
                        case 1:
                            cached = _a.sent();
                            if (cached !== null)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, factory()];
                        case 2:
                            value = _a.sent();
                            return [4 /*yield*/, this.setJson(key, value, ttlSeconds)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, value];
                    }
                });
            });
        };
        RedisService_1.prototype.invalidateCache = function (patterns) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, patterns_1, pattern;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, patterns_1 = patterns;
                            _a.label = 1;
                        case 1:
                            if (!(_i < patterns_1.length)) return [3 /*break*/, 4];
                            pattern = patterns_1[_i];
                            return [4 /*yield*/, this.deleteByPattern(pattern)];
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
        // ─── Health Check ───
        RedisService_1.prototype.ping = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.client.ping()];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, result === 'PONG'];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        RedisService_1.prototype.getInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info, serverInfo, clientInfo, parseField;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.info('memory')];
                        case 1:
                            info = _a.sent();
                            return [4 /*yield*/, this.client.info('server')];
                        case 2:
                            serverInfo = _a.sent();
                            return [4 /*yield*/, this.client.info('clients')];
                        case 3:
                            clientInfo = _a.sent();
                            parseField = function (text, field) {
                                var match = text.match(new RegExp("".concat(field, ":(.+)")));
                                return match ? match[1].trim() : 'unknown';
                            };
                            return [2 /*return*/, {
                                    usedMemory: parseField(info, 'used_memory_human'),
                                    connectedClients: parseField(clientInfo, 'connected_clients'),
                                    uptimeInSeconds: parseField(serverInfo, 'uptime_in_seconds'),
                                }];
                    }
                });
            });
        };
        return RedisService_1;
    }());
    __setFunctionName(_classThis, "RedisService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedisService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedisService = _classThis;
}();
exports.RedisService = RedisService;
// import { ConfigService } from '@nestjs/config';
// import type Redis from 'ioredis';
// import { REDIS_CLIENT } from '../../constants/redis.constants';
// //import type { Redis as RedisClient } from 'ioredis';
// @Injectable()
// export class RedisService {
//   constructor(
//     @Inject(REDIS_CLIENT) private readonly redis: Redis,
//     //@Inject(REDIS_CLIENT) private readonly redis: RedisClient,
//     private readonly configService: ConfigService,
//   ) {}
//   // ─── Basic Operations ───
//   async get(key: string): Promise<string | null> {
//     return this.redis.get(key);
//   }
//   async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
//     if (ttlSeconds) {
//       await this.redis.setex(key, ttlSeconds, value);
//     } else {
//       await this.redis.set(key, value);
//     }
//   }
//   async del(key: string): Promise<void> {
//     await this.redis.del(key);
//   }
//   async exists(key: string): Promise<boolean> {
//     const result = await this.redis.exists(key);
//     return result === 1;
//   }
//   async ttl(key: string): Promise<number> {
//     return this.redis.ttl(key);
//   }
//   async expire(key: string, seconds: number): Promise<void> {
//     await this.redis.expire(key, seconds);
//   }
//   // ─── JSON Helpers ───
//   async getJson<T>(key: string): Promise<T | null> {
//     const value = await this.redis.get(key);
//     if (!value) return null;
//     try {
//       return JSON.parse(value) as T;
//     } catch {
//       return null;
//     }
//   }
//   async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
//     await this.set(key, JSON.stringify(value), ttlSeconds);
//   }
//   // ─── Distributed Lock ───
//   async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
//     const lockKey = `lock:${key}`;
//     const result = await this.redis.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
//     return result === 'OK';
//   }
//   async releaseLock(key: string): Promise<void> {
//     await this.redis.del(`lock:${key}`);
//   }
//   // ─── Token Blacklisting ───
//   async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
//     const prefix = this.configService.get<string>(
//       'redis.keyPrefixes.tokenBlacklist',
//     );
//     await this.redis.setex(`${prefix}${jti}`, ttlSeconds, '1');
//   }
//   async isTokenBlacklisted(jti: string): Promise<boolean> {
//     const prefix = this.configService.get<string>(
//       'redis.keyPrefixes.tokenBlacklist',
//     );
//     return this.exists(`${prefix}${jti}`);
//   }
//   // ─── OTP Storage ───
//   async storeOtp(
//     identifier: string,
//     code: string,
//     ttlSeconds: number,
//   ): Promise<void> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     await this.redis.setex(`${prefix}${identifier}`, ttlSeconds, code);
//   }
//   async getOtp(identifier: string): Promise<string | null> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     return this.redis.get(`${prefix}${identifier}`);
//   }
//   async deleteOtp(identifier: string): Promise<void> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     await this.redis.del(`${prefix}${identifier}`);
//   }
//   // ─── Rate Limiting Helpers ───
//   async incrementCounter(key: string, ttlSeconds: number): Promise<number> {
//     const multi = this.redis.multi();
//     multi.incr(key);
//     multi.expire(key, ttlSeconds);
//     const results = await multi.exec();
//     return (results?.[0]?.[1] as number) || 0;
//   }
//   // ─── Health Check ───
//   async ping(): Promise<boolean> {
//     try {
//       const result = await this.redis.ping();
//       return result === 'PONG';
//     } catch {
//       return false;
//     }
//   }
// }
