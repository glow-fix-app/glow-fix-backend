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
exports.NotificationsGateway = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var notificationAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);
var NotificationsGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            namespace: '/notifications',
            cors: {
                origin: notificationAllowedOrigins.length > 0 ? notificationAllowedOrigins : false,
                credentials: true,
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var NotificationsGateway = _classThis = /** @class */ (function () {
        function NotificationsGateway_1(tokenService, prisma, redis, metrics) {
            this.tokenService = tokenService;
            this.prisma = prisma;
            this.redis = redis;
            this.metrics = metrics;
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger(NotificationsGateway.name));
            this.authenticatedSocketIds = new Set();
        }
        NotificationsGateway_1.prototype.handleConnection = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                var user, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.authenticate(client)];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, client.join("user:".concat(user.id))];
                        case 2:
                            _a.sent();
                            this.authenticatedSocketIds.add(client.id);
                            this.metrics.websocketConnections.inc();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.warn("Socket authentication failed: ".concat(error_1.message));
                            client.disconnect(true);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        NotificationsGateway_1.prototype.handleDisconnect = function (client) {
            if (!this.authenticatedSocketIds.delete(client.id)) {
                return;
            }
            this.metrics.websocketConnections.dec();
        };
        NotificationsGateway_1.prototype.emitNotificationCreated = function (userId, payload) {
            this.server.to("user:".concat(userId)).emit('notification.created', payload);
        };
        NotificationsGateway_1.prototype.emitNotificationRead = function (userId, payload) {
            this.server.to("user:".concat(userId)).emit('notification.read', payload);
        };
        NotificationsGateway_1.prototype.emitNotificationReadAll = function (userId, payload) {
            this.server.to("user:".concat(userId)).emit('notification.read_all', payload);
        };
        NotificationsGateway_1.prototype.emitNotificationDeleted = function (userId, payload) {
            this.server.to("user:".concat(userId)).emit('notification.deleted', payload);
        };
        NotificationsGateway_1.prototype.authenticate = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                var token, payload, user, sessionKey, cachedSession, session;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            token = ((_a = client.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) ||
                                ((_b = client.handshake.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace(/^Bearer\s+/i, ''));
                            if (!token) {
                                throw new Error('Missing JWT token');
                            }
                            payload = this.tokenService.verifyAccessToken(token);
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { id: payload.sub, isActive: true, deletedAt: null },
                                    select: { id: true },
                                })];
                        case 1:
                            user = _c.sent();
                            if (!user) {
                                throw new Error('Unauthorized');
                            }
                            sessionKey = "ws:session:".concat(payload.sessionId);
                            return [4 /*yield*/, this.redis.get(sessionKey)];
                        case 2:
                            cachedSession = _c.sent();
                            if (!!cachedSession) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.userSession.findUnique({
                                    where: { id: payload.sessionId },
                                    select: { id: true, expiresAt: true },
                                })];
                        case 3:
                            session = _c.sent();
                            if (!session || session.expiresAt <= new Date()) {
                                throw new Error('Session expired');
                            }
                            return [4 /*yield*/, this.redis.set(sessionKey, '1', 300)];
                        case 4:
                            _c.sent(); // Cache for 5 minutes
                            _c.label = 5;
                        case 5: return [2 /*return*/, user];
                    }
                });
            });
        };
        return NotificationsGateway_1;
    }());
    __setFunctionName(_classThis, "NotificationsGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsGateway = _classThis;
}();
exports.NotificationsGateway = NotificationsGateway;
