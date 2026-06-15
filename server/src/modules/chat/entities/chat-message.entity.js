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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageEntity = exports.AttachmentPayloadEntity = void 0;
var swagger_1 = require("@nestjs/swagger");
var chat_status_entity_1 = require("./chat-status.entity");
var chat_user_entity_1 = require("./chat-user.entity");
var AttachmentPayloadEntity = function () {
    var _a;
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _storageKey_decorators;
    var _storageKey_initializers = [];
    var _storageKey_extraInitializers = [];
    var _caption_decorators;
    var _caption_initializers = [];
    var _caption_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AttachmentPayloadEntity() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.storageKey = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _storageKey_initializers, void 0));
                this.caption = (__runInitializers(this, _storageKey_extraInitializers), __runInitializers(this, _caption_initializers, void 0));
                __runInitializers(this, _caption_extraInitializers);
            }
            return AttachmentPayloadEntity;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, swagger_1.ApiProperty)({ description: 'URL of the uploaded attachment' })];
            _storageKey_decorators = [(0, swagger_1.ApiProperty)({ description: 'S3/R2 storage key' })];
            _caption_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional text caption', type: String, nullable: true })];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _storageKey_decorators, { kind: "field", name: "storageKey", static: false, private: false, access: { has: function (obj) { return "storageKey" in obj; }, get: function (obj) { return obj.storageKey; }, set: function (obj, value) { obj.storageKey = value; } }, metadata: _metadata }, _storageKey_initializers, _storageKey_extraInitializers);
            __esDecorate(null, null, _caption_decorators, { kind: "field", name: "caption", static: false, private: false, access: { has: function (obj) { return "caption" in obj; }, get: function (obj) { return obj.caption; }, set: function (obj, value) { obj.caption = value; } }, metadata: _metadata }, _caption_initializers, _caption_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AttachmentPayloadEntity = AttachmentPayloadEntity;
var ChatMessageEntity = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _conversationId_decorators;
    var _conversationId_initializers = [];
    var _conversationId_extraInitializers = [];
    var _senderUserId_decorators;
    var _senderUserId_initializers = [];
    var _senderUserId_extraInitializers = [];
    var _senderRole_decorators;
    var _senderRole_initializers = [];
    var _senderRole_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _statusId_decorators;
    var _statusId_initializers = [];
    var _statusId_extraInitializers = [];
    var _deliveredAt_decorators;
    var _deliveredAt_initializers = [];
    var _deliveredAt_extraInitializers = [];
    var _readAt_decorators;
    var _readAt_initializers = [];
    var _readAt_extraInitializers = [];
    var _editedAt_decorators;
    var _editedAt_initializers = [];
    var _editedAt_extraInitializers = [];
    var _deletedAt_decorators;
    var _deletedAt_initializers = [];
    var _deletedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _sender_decorators;
    var _sender_initializers = [];
    var _sender_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ChatMessageEntity() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.conversationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conversationId_initializers, void 0));
                this.senderUserId = (__runInitializers(this, _conversationId_extraInitializers), __runInitializers(this, _senderUserId_initializers, void 0));
                this.senderRole = (__runInitializers(this, _senderUserId_extraInitializers), __runInitializers(this, _senderRole_initializers, void 0));
                this.type = (__runInitializers(this, _senderRole_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.body = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _body_initializers, void 0));
                this.statusId = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _statusId_initializers, void 0));
                this.deliveredAt = (__runInitializers(this, _statusId_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
                this.readAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _readAt_initializers, void 0));
                this.editedAt = (__runInitializers(this, _readAt_extraInitializers), __runInitializers(this, _editedAt_initializers, void 0));
                this.deletedAt = (__runInitializers(this, _editedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
                this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.status = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.sender = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sender_initializers, void 0));
                __runInitializers(this, _sender_extraInitializers);
            }
            return ChatMessageEntity;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message ID' })];
            _conversationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversation ID' })];
            _senderUserId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID of the sender' })];
            _senderRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role of the sender' })];
            _type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message type (TEXT, FILE, SYSTEM)' })];
            _body_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Message text body or attachment metadata object',
                    type: 'object',
                    nullable: true,
                })];
            _statusId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status ID' })];
            _deliveredAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when message was delivered', type: Date, nullable: true })];
            _readAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when message was read', type: Date, nullable: true })];
            _editedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when message was edited', type: Date, nullable: true })];
            _deletedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when message was deleted', type: Date, nullable: true })];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp when message was created', type: Date })];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp when message was last updated', type: Date })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Message status details', type: function () { return chat_status_entity_1.ChatStatusEntity; } })];
            _sender_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sender user details', type: function () { return chat_user_entity_1.ChatUserEntity; } })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _conversationId_decorators, { kind: "field", name: "conversationId", static: false, private: false, access: { has: function (obj) { return "conversationId" in obj; }, get: function (obj) { return obj.conversationId; }, set: function (obj, value) { obj.conversationId = value; } }, metadata: _metadata }, _conversationId_initializers, _conversationId_extraInitializers);
            __esDecorate(null, null, _senderUserId_decorators, { kind: "field", name: "senderUserId", static: false, private: false, access: { has: function (obj) { return "senderUserId" in obj; }, get: function (obj) { return obj.senderUserId; }, set: function (obj, value) { obj.senderUserId = value; } }, metadata: _metadata }, _senderUserId_initializers, _senderUserId_extraInitializers);
            __esDecorate(null, null, _senderRole_decorators, { kind: "field", name: "senderRole", static: false, private: false, access: { has: function (obj) { return "senderRole" in obj; }, get: function (obj) { return obj.senderRole; }, set: function (obj, value) { obj.senderRole = value; } }, metadata: _metadata }, _senderRole_initializers, _senderRole_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
            __esDecorate(null, null, _statusId_decorators, { kind: "field", name: "statusId", static: false, private: false, access: { has: function (obj) { return "statusId" in obj; }, get: function (obj) { return obj.statusId; }, set: function (obj, value) { obj.statusId = value; } }, metadata: _metadata }, _statusId_initializers, _statusId_extraInitializers);
            __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: function (obj) { return "deliveredAt" in obj; }, get: function (obj) { return obj.deliveredAt; }, set: function (obj, value) { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
            __esDecorate(null, null, _readAt_decorators, { kind: "field", name: "readAt", static: false, private: false, access: { has: function (obj) { return "readAt" in obj; }, get: function (obj) { return obj.readAt; }, set: function (obj, value) { obj.readAt = value; } }, metadata: _metadata }, _readAt_initializers, _readAt_extraInitializers);
            __esDecorate(null, null, _editedAt_decorators, { kind: "field", name: "editedAt", static: false, private: false, access: { has: function (obj) { return "editedAt" in obj; }, get: function (obj) { return obj.editedAt; }, set: function (obj, value) { obj.editedAt = value; } }, metadata: _metadata }, _editedAt_initializers, _editedAt_extraInitializers);
            __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: function (obj) { return "deletedAt" in obj; }, get: function (obj) { return obj.deletedAt; }, set: function (obj, value) { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: function (obj) { return "sender" in obj; }, get: function (obj) { return obj.sender; }, set: function (obj, value) { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ChatMessageEntity = ChatMessageEntity;
