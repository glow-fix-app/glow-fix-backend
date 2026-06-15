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
exports.ChatParticipantEntity = void 0;
var swagger_1 = require("@nestjs/swagger");
var chat_user_entity_1 = require("./chat-user.entity");
var ChatParticipantEntity = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _conversationId_decorators;
    var _conversationId_initializers = [];
    var _conversationId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _lastReadAt_decorators;
    var _lastReadAt_initializers = [];
    var _lastReadAt_extraInitializers = [];
    var _joinedAt_decorators;
    var _joinedAt_initializers = [];
    var _joinedAt_extraInitializers = [];
    var _leftAt_decorators;
    var _leftAt_initializers = [];
    var _leftAt_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ChatParticipantEntity() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.conversationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conversationId_initializers, void 0));
                this.userId = (__runInitializers(this, _conversationId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.role = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.lastReadAt = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _lastReadAt_initializers, void 0));
                this.joinedAt = (__runInitializers(this, _lastReadAt_extraInitializers), __runInitializers(this, _joinedAt_initializers, void 0));
                this.leftAt = (__runInitializers(this, _joinedAt_extraInitializers), __runInitializers(this, _leftAt_initializers, void 0));
                this.user = (__runInitializers(this, _leftAt_extraInitializers), __runInitializers(this, _user_initializers, void 0));
                __runInitializers(this, _user_extraInitializers);
            }
            return ChatParticipantEntity;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Participant record ID' })];
            _conversationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conversation ID' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID of the participant' })];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Participant role' })];
            _lastReadAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when participant last read the messages', type: Date, nullable: true })];
            _joinedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp when participant joined the conversation', type: Date })];
            _leftAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when participant left the conversation', type: Date, nullable: true })];
            _user_decorators = [(0, swagger_1.ApiProperty)({ description: 'User details', type: function () { return chat_user_entity_1.ChatUserEntity; } })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _conversationId_decorators, { kind: "field", name: "conversationId", static: false, private: false, access: { has: function (obj) { return "conversationId" in obj; }, get: function (obj) { return obj.conversationId; }, set: function (obj, value) { obj.conversationId = value; } }, metadata: _metadata }, _conversationId_initializers, _conversationId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _lastReadAt_decorators, { kind: "field", name: "lastReadAt", static: false, private: false, access: { has: function (obj) { return "lastReadAt" in obj; }, get: function (obj) { return obj.lastReadAt; }, set: function (obj, value) { obj.lastReadAt = value; } }, metadata: _metadata }, _lastReadAt_initializers, _lastReadAt_extraInitializers);
            __esDecorate(null, null, _joinedAt_decorators, { kind: "field", name: "joinedAt", static: false, private: false, access: { has: function (obj) { return "joinedAt" in obj; }, get: function (obj) { return obj.joinedAt; }, set: function (obj, value) { obj.joinedAt = value; } }, metadata: _metadata }, _joinedAt_initializers, _joinedAt_extraInitializers);
            __esDecorate(null, null, _leftAt_decorators, { kind: "field", name: "leftAt", static: false, private: false, access: { has: function (obj) { return "leftAt" in obj; }, get: function (obj) { return obj.leftAt; }, set: function (obj, value) { obj.leftAt = value; } }, metadata: _metadata }, _leftAt_initializers, _leftAt_extraInitializers);
            __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ChatParticipantEntity = ChatParticipantEntity;
