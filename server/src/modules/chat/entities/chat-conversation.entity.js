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
exports.ChatConversationEntity = void 0;
var swagger_1 = require("@nestjs/swagger");
var chat_status_entity_1 = require("./chat-status.entity");
var chat_participant_entity_1 = require("./chat-participant.entity");
var message_response_dto_1 = require("../dto/message-response.dto");
var ChatConversationEntity = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _bookingId_decorators;
    var _bookingId_initializers = [];
    var _bookingId_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _statusId_decorators;
    var _statusId_initializers = [];
    var _statusId_extraInitializers = [];
    var _closedAt_decorators;
    var _closedAt_initializers = [];
    var _closedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _participants_decorators;
    var _participants_initializers = [];
    var _participants_extraInitializers = [];
    var _lastMessage_decorators;
    var _lastMessage_initializers = [];
    var _lastMessage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ChatConversationEntity() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.bookingId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _bookingId_initializers, void 0));
                this.type = (__runInitializers(this, _bookingId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.statusId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _statusId_initializers, void 0));
                this.closedAt = (__runInitializers(this, _statusId_extraInitializers), __runInitializers(this, _closedAt_initializers, void 0));
                this.createdAt = (__runInitializers(this, _closedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.status = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.participants = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
                this.lastMessage = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _lastMessage_initializers, void 0));
                __runInitializers(this, _lastMessage_extraInitializers);
            }
            return ChatConversationEntity;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversation ID' })];
            _bookingId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Optional booking ID associated with the conversation', type: String, nullable: true })];
            _type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversation type (SUPPORT, GENERAL, BOOKING)' })];
            _statusId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status ID' })];
            _closedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when conversation was closed', type: Date, nullable: true })];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp when conversation was created', type: Date })];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp when conversation was last updated', type: Date })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversation status details', type: function () { return chat_status_entity_1.ChatStatusEntity; } })];
            _participants_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of active participants', type: function () { return [chat_participant_entity_1.ChatParticipantEntity]; } })];
            _lastMessage_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last message in the conversation', type: function () { return message_response_dto_1.MessageResponseDto; }, nullable: true })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _bookingId_decorators, { kind: "field", name: "bookingId", static: false, private: false, access: { has: function (obj) { return "bookingId" in obj; }, get: function (obj) { return obj.bookingId; }, set: function (obj, value) { obj.bookingId = value; } }, metadata: _metadata }, _bookingId_initializers, _bookingId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _statusId_decorators, { kind: "field", name: "statusId", static: false, private: false, access: { has: function (obj) { return "statusId" in obj; }, get: function (obj) { return obj.statusId; }, set: function (obj, value) { obj.statusId = value; } }, metadata: _metadata }, _statusId_initializers, _statusId_extraInitializers);
            __esDecorate(null, null, _closedAt_decorators, { kind: "field", name: "closedAt", static: false, private: false, access: { has: function (obj) { return "closedAt" in obj; }, get: function (obj) { return obj.closedAt; }, set: function (obj, value) { obj.closedAt = value; } }, metadata: _metadata }, _closedAt_initializers, _closedAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: function (obj) { return "participants" in obj; }, get: function (obj) { return obj.participants; }, set: function (obj, value) { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
            __esDecorate(null, null, _lastMessage_decorators, { kind: "field", name: "lastMessage", static: false, private: false, access: { has: function (obj) { return "lastMessage" in obj; }, get: function (obj) { return obj.lastMessage; }, set: function (obj, value) { obj.lastMessage = value; } }, metadata: _metadata }, _lastMessage_initializers, _lastMessage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ChatConversationEntity = ChatConversationEntity;
