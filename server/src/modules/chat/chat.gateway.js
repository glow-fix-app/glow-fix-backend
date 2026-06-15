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
exports.ChatGateway = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var chatAllowedOrigins = (function () {
    var configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(function (origin) { return origin.trim(); })
        .filter(Boolean);
    if (configuredOrigins.length > 0) {
        return configuredOrigins;
    }
    if (process.env.NODE_ENV === 'production') {
        return false;
    }
    return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
})();
var ChatGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            namespace: '/chat',
            cors: {
                origin: chatAllowedOrigins,
                credentials: true,
            },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _joinConversation_decorators;
    var _leaveConversation_decorators;
    var _sendMessage_decorators;
    var _messageDelivered_decorators;
    var _messageRead_decorators;
    var _typingStart_decorators;
    var _typingStop_decorators;
    var ChatGateway = _classThis = /** @class */ (function () {
        function ChatGateway_1(prisma, tokenService, redis, chatService, metrics) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.tokenService = tokenService;
            this.redis = redis;
            this.chatService = chatService;
            this.metrics = metrics;
            this.server = __runInitializers(this, _server_initializers, void 0);
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger(ChatGateway.name));
            this.authenticatedSocketIds = new Set();
            this.socketUsers = new Map();
            this.typingConversationsBySocket = new Map();
        }
        ChatGateway_1.prototype.handleConnection = function (client) {
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
                            this.socketUsers.set(client.id, user);
                            client.data.userId = user.id;
                            client.data.userRole = user.role;
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
        ChatGateway_1.prototype.handleDisconnect = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.clearTypingState(client)];
                        case 1:
                            _a.sent();
                            this.socketUsers.delete(client.id);
                            this.typingConversationsBySocket.delete(client.id);
                            if (!this.authenticatedSocketIds.delete(client.id)) {
                                return [2 /*return*/];
                            }
                            this.metrics.websocketConnections.dec();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ChatGateway_1.prototype.joinConversation = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            }
                            return [4 /*yield*/, this.chatService.assertParticipant(payload.conversationId, user.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, client.join("conversation:".concat(payload.conversationId))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.leaveConversation = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            }
                            return [4 /*yield*/, this.chatService.assertParticipant(payload.conversationId, user.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.chatService.setTyping(payload.conversationId, user.id, false)];
                        case 3:
                            _a.sent();
                            this.untrackTypingConversation(client.id, payload.conversationId);
                            return [4 /*yield*/, client.leave("conversation:".concat(payload.conversationId))];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.sendMessage = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            }
                            return [2 /*return*/, this.chatService.sendMessage(payload.conversationId, user.id, user.role, payload.body)];
                    }
                });
            });
        };
        ChatGateway_1.prototype.messageDelivered = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            return [4 /*yield*/, this.chatService.markMessageDelivered(payload.messageId, user.id)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.messageRead = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            return [4 /*yield*/, this.chatService.markMessageReadStatus(payload.messageId, user.id)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.typingStart = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            }
                            return [4 /*yield*/, this.chatService.assertParticipant(payload.conversationId, user.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.chatService.setTyping(payload.conversationId, user.id, true)];
                        case 3:
                            _a.sent();
                            this.trackTypingConversation(client.id, payload.conversationId);
                            this.server.to("conversation:".concat(payload.conversationId)).emit('typing.start', { userId: user.id });
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.typingStop = function (client, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authenticateSocket(client)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { ok: false, error: 'Unauthorized' }];
                            }
                            return [4 /*yield*/, this.chatService.assertParticipant(payload.conversationId, user.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.chatService.setTyping(payload.conversationId, user.id, false)];
                        case 3:
                            _a.sent();
                            this.untrackTypingConversation(client.id, payload.conversationId);
                            this.server.to("conversation:".concat(payload.conversationId)).emit('typing.stop', { userId: user.id });
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.emitMessageCreated = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.created', payload);
        };
        ChatGateway_1.prototype.emitMessageEdited = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.edited', payload);
        };
        ChatGateway_1.prototype.emitMessageDeleted = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.deleted', payload);
        };
        ChatGateway_1.prototype.emitMessageRead = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.read', payload);
        };
        ChatGateway_1.prototype.emitMessageDelivered = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.delivered', payload);
        };
        ChatGateway_1.prototype.emitMessageReadStatus = function (conversationId, payload) {
            this.server.to("conversation:".concat(conversationId)).emit('message.readStatus', payload);
        };
        ChatGateway_1.prototype.authenticate = function (client) {
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
                        case 5: return [2 /*return*/, { id: user.id, role: payload.role }];
                    }
                });
            });
        };
        ChatGateway_1.prototype.authenticateSocket = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                var user, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.authenticate(client)];
                        case 1:
                            user = _a.sent();
                            this.socketUsers.set(client.id, user);
                            return [2 /*return*/, user];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.warn("Socket event authentication failed: ".concat(error_2.message));
                            client.disconnect(true);
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ChatGateway_1.prototype.trackTypingConversation = function (socketId, conversationId) {
            var _a;
            var conversations = (_a = this.typingConversationsBySocket.get(socketId)) !== null && _a !== void 0 ? _a : new Set();
            conversations.add(conversationId);
            this.typingConversationsBySocket.set(socketId, conversations);
        };
        ChatGateway_1.prototype.untrackTypingConversation = function (socketId, conversationId) {
            var conversations = this.typingConversationsBySocket.get(socketId);
            if (!conversations) {
                return;
            }
            conversations.delete(conversationId);
            if (conversations.size === 0) {
                this.typingConversationsBySocket.delete(socketId);
            }
        };
        ChatGateway_1.prototype.clearTypingState = function (client) {
            return __awaiter(this, void 0, void 0, function () {
                var user, conversations;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = this.socketUsers.get(client.id);
                            conversations = this.typingConversationsBySocket.get(client.id);
                            if (!user || !conversations || conversations.size === 0) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all(Array.from(conversations).map(function (conversationId) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.chatService.setTyping(conversationId, user.id, false)];
                                            case 1:
                                                _a.sent();
                                                this.server.to("conversation:".concat(conversationId)).emit('typing.stop', { userId: user.id });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ChatGateway_1;
    }());
    __setFunctionName(_classThis, "ChatGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _joinConversation_decorators = [(0, websockets_1.SubscribeMessage)('conversation.join')];
        _leaveConversation_decorators = [(0, websockets_1.SubscribeMessage)('conversation.leave')];
        _sendMessage_decorators = [(0, websockets_1.SubscribeMessage)('message.send')];
        _messageDelivered_decorators = [(0, websockets_1.SubscribeMessage)('message.delivered')];
        _messageRead_decorators = [(0, websockets_1.SubscribeMessage)('message.read')];
        _typingStart_decorators = [(0, websockets_1.SubscribeMessage)('typing.start')];
        _typingStop_decorators = [(0, websockets_1.SubscribeMessage)('typing.stop')];
        __esDecorate(_classThis, null, _joinConversation_decorators, { kind: "method", name: "joinConversation", static: false, private: false, access: { has: function (obj) { return "joinConversation" in obj; }, get: function (obj) { return obj.joinConversation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _leaveConversation_decorators, { kind: "method", name: "leaveConversation", static: false, private: false, access: { has: function (obj) { return "leaveConversation" in obj; }, get: function (obj) { return obj.leaveConversation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMessage_decorators, { kind: "method", name: "sendMessage", static: false, private: false, access: { has: function (obj) { return "sendMessage" in obj; }, get: function (obj) { return obj.sendMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _messageDelivered_decorators, { kind: "method", name: "messageDelivered", static: false, private: false, access: { has: function (obj) { return "messageDelivered" in obj; }, get: function (obj) { return obj.messageDelivered; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _messageRead_decorators, { kind: "method", name: "messageRead", static: false, private: false, access: { has: function (obj) { return "messageRead" in obj; }, get: function (obj) { return obj.messageRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _typingStart_decorators, { kind: "method", name: "typingStart", static: false, private: false, access: { has: function (obj) { return "typingStart" in obj; }, get: function (obj) { return obj.typingStart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _typingStop_decorators, { kind: "method", name: "typingStop", static: false, private: false, access: { has: function (obj) { return "typingStop" in obj; }, get: function (obj) { return obj.typingStop; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatGateway = _classThis;
}();
exports.ChatGateway = ChatGateway;
