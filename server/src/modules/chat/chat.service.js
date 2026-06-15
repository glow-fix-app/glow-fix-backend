"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var chat_presenter_1 = require("./chat.presenter");
var create_conversation_dto_1 = require("./dto/create-conversation.dto");
var encryption_util_1 = require("../../core/utils/encryption.util");
// ─── Service ──────────────────────────────────────────────────────────────────
var ChatService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ChatService = _classThis = /** @class */ (function () {
        function ChatService_1(prisma, redis, storage, gateway) {
            this.prisma = prisma;
            this.redis = redis;
            this.storage = storage;
            this.gateway = gateway;
            // ── Status lookup (cached per process lifetime) ──
            this.statusCache = new Map();
        }
        ChatService_1.prototype.getStatusId = function (context, name) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cachedPromise;
                var _this = this;
                return __generator(this, function (_a) {
                    cacheKey = "".concat(context, ":").concat(name);
                    cachedPromise = this.statusCache.get(cacheKey);
                    if (cachedPromise) {
                        return [2 /*return*/, cachedPromise];
                    }
                    cachedPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var status;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.prisma.status.findFirst({ where: { context: name } })];
                                case 1:
                                    status = _a.sent();
                                    if (!!status) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.prisma.status.create({ data: { context: name } })];
                                case 2:
                                    status = _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, status.id];
                            }
                        });
                    }); })();
                    this.statusCache.set(cacheKey, cachedPromise);
                    return [2 /*return*/, cachedPromise];
                });
            });
        };
        // ── Conversations ────────────────────────────────
        ChatService_1.prototype.listConversations = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var records;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.conversation.findMany({
                                where: { participants: { some: { userId: userId, leftAt: null } } },
                                select: chat_presenter_1.chatConversationSelect,
                                orderBy: { updatedAt: 'desc' },
                            })];
                        case 1:
                            records = _a.sent();
                            return [2 /*return*/, records.map(chat_presenter_1.presentConversation)];
                    }
                });
            });
        };
        ChatService_1.prototype.getConversation = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var record;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.conversation.findFirst({
                                where: { id: id, participants: { some: { userId: userId, leftAt: null } } },
                                select: chat_presenter_1.chatConversationSelect,
                            })];
                        case 1:
                            record = _a.sent();
                            if (!record) {
                                throw new common_1.ForbiddenException('Conversation not found or access denied');
                            }
                            return [2 /*return*/, (0, chat_presenter_1.presentConversation)(record)];
                    }
                });
            });
        };
        ChatService_1.prototype.createConversation = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (input.type === create_conversation_dto_1.ConversationCreateType.BOOKING) {
                        return [2 /*return*/, this.createBookingConversation(input)];
                    }
                    return [2 /*return*/, this.createDirectConversation(input)];
                });
            });
        };
        // ── Messages ─────────────────────────────────────
        ChatService_1.prototype.listMessages = function (conversationId, userId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, records, total, data, nextCursor;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.assertParticipant(conversationId, userId)];
                        case 1:
                            _b.sent();
                            where = { conversationId: conversationId };
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.message.findMany(__assign({ where: where, select: chat_presenter_1.chatMessageSelect, orderBy: { createdAt: 'desc' }, take: query.limit }, (query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : query.page > 1 ? { skip: (query.page - 1) * query.limit } : {}))),
                                    this.prisma.message.count({ where: where }),
                                ])];
                        case 2:
                            _a = _b.sent(), records = _a[0], total = _a[1];
                            data = records.reverse().map(chat_presenter_1.presentMessage);
                            nextCursor = records.length > 0 ? records[0].id : null;
                            return [2 /*return*/, {
                                    data: data,
                                    meta: {
                                        page: query.page,
                                        limit: query.limit,
                                        total: total,
                                        totalPages: Math.max(1, Math.ceil(total / query.limit)),
                                        cursor: data.length > 0 ? data[0].id : null,
                                    },
                                }];
                    }
                });
            });
        };
        ChatService_1.prototype.sendMessage = function (conversationId, userId, userRole, body) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedBody, encryptedBody, statusId, now, record, dto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertParticipant(conversationId, userId)];
                        case 1:
                            _a.sent();
                            trimmedBody = this.normalizeBody(body);
                            encryptedBody = (0, encryption_util_1.encryptMessage)(trimmedBody);
                            return [4 /*yield*/, this.getStatusId('MESSAGE', 'SENT')];
                        case 2:
                            statusId = _a.sent();
                            now = new Date();
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.message.create({
                                        data: {
                                            conversationId: conversationId,
                                            senderUserId: userId,
                                            senderRole: this.toParticipantRole(userRole),
                                            type: 'TEXT',
                                            body: encryptedBody,
                                            statusId: statusId,
                                        },
                                        select: chat_presenter_1.chatMessageSelect,
                                    }),
                                    this.prisma.conversation.update({
                                        where: { id: conversationId },
                                        data: { updatedAt: now },
                                        select: { id: true },
                                    }),
                                ])];
                        case 3:
                            record = (_a.sent())[0];
                            dto = (0, chat_presenter_1.presentMessage)(record);
                            this.gateway.emitMessageCreated(conversationId, dto);
                            return [2 /*return*/, dto];
                    }
                });
            });
        };
        ChatService_1.prototype.sendFileMessage = function (conversationId, userId, userRole, buffer, mimetype, originalName, caption) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, url, storageKey, statusId, now, body, encryptedBody, record, dto;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.assertParticipant(conversationId, userId)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.storage.uploadFile(buffer, 'chat-attachments', mimetype, originalName)];
                        case 2:
                            _a = _b.sent(), url = _a.url, storageKey = _a.storageKey;
                            return [4 /*yield*/, this.getStatusId('MESSAGE', 'SENT')];
                        case 3:
                            statusId = _b.sent();
                            now = new Date();
                            body = JSON.stringify({ url: url, storageKey: storageKey, caption: caption !== null && caption !== void 0 ? caption : null });
                            encryptedBody = (0, encryption_util_1.encryptMessage)(body);
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.message.create({
                                        data: {
                                            conversationId: conversationId,
                                            senderUserId: userId,
                                            senderRole: this.toParticipantRole(userRole),
                                            type: 'FILE',
                                            body: encryptedBody,
                                            statusId: statusId,
                                        },
                                        select: chat_presenter_1.chatMessageSelect,
                                    }),
                                    this.prisma.conversation.update({
                                        where: { id: conversationId },
                                        data: { updatedAt: now },
                                        select: { id: true },
                                    }),
                                ])];
                        case 4:
                            record = (_b.sent())[0];
                            dto = (0, chat_presenter_1.presentMessage)(record);
                            this.gateway.emitMessageCreated(conversationId, dto);
                            return [2 /*return*/, dto];
                    }
                });
            });
        };
        ChatService_1.prototype.markRead = function (conversationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var now;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertParticipant(conversationId, userId)];
                        case 1:
                            _a.sent();
                            now = new Date();
                            return [4 /*yield*/, this.prisma.conversationParticipant.updateMany({
                                    where: { conversationId: conversationId, userId: userId, leftAt: null },
                                    data: { lastReadAt: now },
                                })];
                        case 2:
                            _a.sent();
                            this.gateway.emitMessageRead(conversationId, { userId: userId, lastReadAt: now });
                            return [2 /*return*/, { message: 'Conversation marked as read' }];
                    }
                });
            });
        };
        ChatService_1.prototype.markMessageDelivered = function (messageId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var record, now;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.message.findUnique({
                                where: { id: messageId },
                                select: { conversationId: true, deliveredAt: true },
                            })];
                        case 1:
                            record = _a.sent();
                            if (!record)
                                return [2 /*return*/];
                            if (!!record.deliveredAt) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.assertParticipant(record.conversationId, userId)];
                        case 2:
                            _a.sent();
                            now = new Date();
                            return [4 /*yield*/, this.prisma.message.update({
                                    where: { id: messageId },
                                    data: { deliveredAt: now },
                                })];
                        case 3:
                            _a.sent();
                            this.gateway.emitMessageDelivered(record.conversationId, { messageId: messageId, deliveredAt: now });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ChatService_1.prototype.markMessageReadStatus = function (messageId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var record, now;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.message.findUnique({
                                where: { id: messageId },
                                select: { conversationId: true, readAt: true, deliveredAt: true },
                            })];
                        case 1:
                            record = _c.sent();
                            if (!record)
                                return [2 /*return*/];
                            if (!!record.readAt) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.assertParticipant(record.conversationId, userId)];
                        case 2:
                            _c.sent();
                            now = new Date();
                            return [4 /*yield*/, this.prisma.message.update({
                                    where: { id: messageId },
                                    data: { readAt: now, deliveredAt: (_a = record.deliveredAt) !== null && _a !== void 0 ? _a : now },
                                })];
                        case 3:
                            _c.sent();
                            this.gateway.emitMessageReadStatus(record.conversationId, { messageId: messageId, readAt: now, deliveredAt: (_b = record.deliveredAt) !== null && _b !== void 0 ? _b : now });
                            _c.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ChatService_1.prototype.editMessage = function (messageId, userId, body) {
            return __awaiter(this, void 0, void 0, function () {
                var record, now, updated, dto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.message.findUnique({
                                where: { id: messageId },
                                select: { id: true, conversationId: true, senderUserId: true, deletedAt: true, type: true },
                            })];
                        case 1:
                            record = _a.sent();
                            if (!record) {
                                throw new common_1.NotFoundException('Message not found');
                            }
                            return [4 /*yield*/, this.assertParticipant(record.conversationId, userId)];
                        case 2:
                            _a.sent();
                            if (record.senderUserId !== userId) {
                                throw new common_1.ForbiddenException('Only the original sender can edit this message');
                            }
                            if (record.deletedAt) {
                                throw new common_1.BadRequestException('Deleted messages cannot be edited');
                            }
                            if (record.type === 'FILE') {
                                throw new common_1.BadRequestException('File messages cannot be edited');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.prisma.message.update({
                                    where: { id: messageId },
                                    data: {
                                        body: (0, encryption_util_1.encryptMessage)(this.normalizeBody(body)),
                                        editedAt: now,
                                        updatedAt: now,
                                    },
                                    select: chat_presenter_1.chatMessageSelect,
                                })];
                        case 3:
                            updated = _a.sent();
                            dto = (0, chat_presenter_1.presentMessage)(updated);
                            this.gateway.emitMessageEdited(record.conversationId, dto);
                            return [2 /*return*/, dto];
                    }
                });
            });
        };
        ChatService_1.prototype.deleteMessage = function (messageId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var record, deletedStatusId, now, updated, dto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.message.findUnique({
                                where: { id: messageId },
                                select: { id: true, conversationId: true, senderUserId: true, deletedAt: true },
                            })];
                        case 1:
                            record = _a.sent();
                            if (!record) {
                                throw new common_1.NotFoundException('Message not found');
                            }
                            return [4 /*yield*/, this.assertParticipant(record.conversationId, userId)];
                        case 2:
                            _a.sent();
                            if (record.senderUserId !== userId) {
                                throw new common_1.ForbiddenException('Only the original sender can delete this message');
                            }
                            if (record.deletedAt) {
                                throw new common_1.BadRequestException('Message already deleted');
                            }
                            return [4 /*yield*/, this.getStatusId('MESSAGE', 'DELETED')];
                        case 3:
                            deletedStatusId = _a.sent();
                            now = new Date();
                            return [4 /*yield*/, this.prisma.message.update({
                                    where: { id: messageId },
                                    data: {
                                        deletedAt: now,
                                        statusId: deletedStatusId,
                                        body: null,
                                    },
                                    select: chat_presenter_1.chatMessageSelect,
                                })];
                        case 4:
                            updated = _a.sent();
                            dto = (0, chat_presenter_1.presentMessage)(updated);
                            this.gateway.emitMessageDeleted(record.conversationId, dto);
                            return [2 /*return*/, dto];
                    }
                });
            });
        };
        // ── Public Utilities (used by Gateway) ──────────
        ChatService_1.prototype.assertParticipant = function (conversationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var participant;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.conversationParticipant.findFirst({
                                where: { conversationId: conversationId, userId: userId, leftAt: null },
                                select: { id: true },
                            })];
                        case 1:
                            participant = _a.sent();
                            if (!participant) {
                                throw new common_1.ForbiddenException('Access denied');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ChatService_1.prototype.setTyping = function (conversationId, userId, active) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = "typing:".concat(conversationId, ":").concat(userId);
                            if (!active) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.set(key, '1', 10)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, this.redis.del(key)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── Private Helpers ──────────────────────────────
        ChatService_1.prototype.createBookingConversation = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var booking, isClientOwner, isManagerOwner, isAdmin, openStatusId, requiredParticipants, conversation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!input.bookingId) {
                                throw new common_1.BadRequestException('bookingId is required for BOOKING conversations');
                            }
                            return [4 /*yield*/, this.prisma.booking.findUnique({
                                    where: { id: input.bookingId },
                                    select: {
                                        id: true,
                                        vehicle: { select: { client: { select: { userId: true } } } },
                                        business: { select: { managerId: true } },
                                    },
                                })];
                        case 1:
                            booking = _a.sent();
                            if (!booking) {
                                throw new common_1.NotFoundException('Booking not found');
                            }
                            isClientOwner = booking.vehicle.client.userId === input.userId;
                            isManagerOwner = booking.business.managerId === input.userId;
                            isAdmin = input.userRole === 'ADMIN';
                            if (!isClientOwner && !isManagerOwner && !isAdmin) {
                                throw new common_1.ForbiddenException('You cannot access this booking conversation');
                            }
                            return [4 /*yield*/, this.getStatusId('CONVERSATION', 'OPEN')];
                        case 2:
                            openStatusId = _a.sent();
                            requiredParticipants = this.uniqueParticipants(__spreadArray([
                                { userId: booking.vehicle.client.userId, role: client_1.ParticipantRole.CLIENT },
                                { userId: booking.business.managerId, role: client_1.ParticipantRole.MANAGER }
                            ], (isAdmin ? [{ userId: input.userId, role: client_1.ParticipantRole.ADMIN }] : []), true));
                            return [4 /*yield*/, this.prisma.conversation.findFirst({
                                    where: {
                                        bookingId: input.bookingId,
                                        type: create_conversation_dto_1.ConversationCreateType.BOOKING,
                                        statusId: openStatusId,
                                        closedAt: null,
                                    },
                                    select: { id: true },
                                })];
                        case 3:
                            conversation = _a.sent();
                            if (!conversation) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.ensureParticipants(conversation.id, requiredParticipants)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.prisma.conversation.create({
                                data: {
                                    type: create_conversation_dto_1.ConversationCreateType.BOOKING,
                                    bookingId: input.bookingId,
                                    statusId: openStatusId,
                                    participants: {
                                        create: requiredParticipants.map(function (p) { return ({
                                            user: { connect: { id: p.userId } },
                                            role: p.role,
                                        }); }),
                                    },
                                },
                                select: { id: true },
                            })];
                        case 6:
                            conversation = _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, this.fetchConversationById(conversation.id)];
                    }
                });
            });
        };
        ChatService_1.prototype.createDirectConversation = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var explicitParticipantIds, admin, msg, uniqueIds, users, usersById, participants, statusId, participantIds, existingConversations, existing, conversation;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            require('fs').appendFileSync('chat_debug.log', JSON.stringify(input) + '\\n');
                            explicitParticipantIds = __spreadArray(__spreadArray([], (input.targetUserId ? [input.targetUserId] : []), true), ((_a = input.participantUserIds) !== null && _a !== void 0 ? _a : []), true);
                            if (!(input.type === create_conversation_dto_1.ConversationCreateType.SUPPORT && explicitParticipantIds.length === 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { role: 'ADMIN', isActive: true, deletedAt: null },
                                    select: { id: true },
                                })];
                        case 1:
                            admin = _b.sent();
                            require('fs').appendFileSync('chat_debug.log', 'Found admin: ' + ((admin === null || admin === void 0 ? void 0 : admin.id) || 'null') + '\\n');
                            if (admin) {
                                explicitParticipantIds = [admin.id];
                            }
                            _b.label = 2;
                        case 2:
                            require('fs').appendFileSync('chat_debug.log', 'explicitParticipantIds: ' + JSON.stringify(explicitParticipantIds) + '\\n');
                            if (explicitParticipantIds.length === 0) {
                                msg = input.type === create_conversation_dto_1.ConversationCreateType.SUPPORT
                                    ? 'Support conversations require targetUserId or participantUserIds'
                                    : 'General conversations require targetUserId or participantUserIds';
                                throw new common_1.BadRequestException(msg);
                            }
                            uniqueIds = Array.from(new Set(__spreadArray([input.userId], explicitParticipantIds, true)));
                            if (uniqueIds.length < 2) {
                                throw new common_1.BadRequestException('Conversation must include at least one other participant');
                            }
                            return [4 /*yield*/, this.prisma.user.findMany({
                                    where: { id: { in: uniqueIds }, isActive: true, deletedAt: null },
                                    select: { id: true, role: true },
                                })];
                        case 3:
                            users = _b.sent();
                            if (users.length !== uniqueIds.length) {
                                throw new common_1.BadRequestException('One or more participants could not be found');
                            }
                            usersById = new Map(users.map(function (u) { return [u.id, u.role]; }));
                            participants = uniqueIds.map(function (participantId) {
                                var role = usersById.get(participantId);
                                if (!role)
                                    throw new common_1.BadRequestException('One or more participants could not be found');
                                return { userId: participantId, role: _this.toParticipantRole(role) };
                            });
                            return [4 /*yield*/, this.getStatusId('CONVERSATION', 'OPEN')];
                        case 4:
                            statusId = _b.sent();
                            participantIds = participants.map(function (p) { return p.userId; }).sort();
                            return [4 /*yield*/, this.prisma.conversation.findMany({
                                    where: {
                                        bookingId: null,
                                        type: input.type,
                                        statusId: statusId,
                                        closedAt: null,
                                        participants: {
                                            every: { userId: { in: participantIds } },
                                        },
                                    },
                                    select: {
                                        id: true,
                                        _count: { select: { participants: true } },
                                    },
                                })];
                        case 5:
                            existingConversations = _b.sent();
                            existing = existingConversations.find(function (c) { return c._count.participants === participantIds.length; });
                            if (!existing) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.ensureParticipants(existing.id, participants)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, this.fetchConversationById(existing.id)];
                        case 7: return [4 /*yield*/, this.prisma.conversation.create({
                                data: {
                                    type: input.type,
                                    bookingId: null,
                                    statusId: statusId,
                                    participants: {
                                        create: participants.map(function (p) { return ({
                                            user: { connect: { id: p.userId } },
                                            role: p.role,
                                        }); }),
                                    },
                                },
                                select: { id: true },
                            })];
                        case 8:
                            conversation = _b.sent();
                            return [2 /*return*/, this.fetchConversationById(conversation.id)];
                    }
                });
            });
        };
        ChatService_1.prototype.fetchConversationById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var record;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.conversation.findUniqueOrThrow({
                                where: { id: id },
                                select: chat_presenter_1.chatConversationSelect,
                            })];
                        case 1:
                            record = _a.sent();
                            return [2 /*return*/, (0, chat_presenter_1.presentConversation)(record)];
                    }
                });
            });
        };
        ChatService_1.prototype.ensureParticipants = function (conversationId, participants) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, existingById, _i, participants_1, participant, found;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.conversationParticipant.findMany({
                                where: { conversationId: conversationId, userId: { in: participants.map(function (p) { return p.userId; }) } },
                                select: { id: true, userId: true, leftAt: true, role: true },
                            })];
                        case 1:
                            existing = _a.sent();
                            existingById = new Map(existing.map(function (p) { return [p.userId, p]; }));
                            _i = 0, participants_1 = participants;
                            _a.label = 2;
                        case 2:
                            if (!(_i < participants_1.length)) return [3 /*break*/, 7];
                            participant = participants_1[_i];
                            found = existingById.get(participant.userId);
                            if (!!found) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.conversationParticipant.create({
                                    data: {
                                        conversation: { connect: { id: conversationId } },
                                        user: { connect: { id: participant.userId } },
                                        role: participant.role,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            if (!(found.leftAt || found.role !== participant.role)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.conversationParticipant.update({
                                    where: { id: found.id },
                                    data: { role: participant.role, leftAt: null },
                                })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        ChatService_1.prototype.normalizeBody = function (body) {
            var trimmed = body.trim();
            if (!trimmed) {
                throw new common_1.BadRequestException('Message body cannot be empty');
            }
            return trimmed;
        };
        ChatService_1.prototype.uniqueParticipants = function (participants) {
            return Array.from(participants.reduce(function (acc, p) {
                acc.set(p.userId, p);
                return acc;
            }, new Map())).map(function (_a) {
                var p = _a[1];
                return p;
            });
        };
        ChatService_1.prototype.toParticipantRole = function (role) {
            if (role === client_1.ParticipantRole.CLIENT ||
                role === client_1.ParticipantRole.MANAGER ||
                role === client_1.ParticipantRole.ADMIN) {
                return role;
            }
            return client_1.ParticipantRole.SYSTEM;
        };
        return ChatService_1;
    }());
    __setFunctionName(_classThis, "ChatService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatService = _classThis;
}();
exports.ChatService = ChatService;
