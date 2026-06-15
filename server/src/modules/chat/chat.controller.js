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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ALLOWED_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
var MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
var ChatController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Chat'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)({ path: 'chat', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _getOne_decorators;
    var _create_decorators;
    var _messages_decorators;
    var _send_decorators;
    var _uploadAttachment_decorators;
    var _read_decorators;
    var _edit_decorators;
    var _remove_decorators;
    var ChatController = _classThis = /** @class */ (function () {
        function ChatController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        ChatController_1.prototype.list = function (user) {
            return this.service.listConversations(user.id);
        };
        ChatController_1.prototype.getOne = function (user, id) {
            return this.service.getConversation(id, user.id);
        };
        ChatController_1.prototype.create = function (user, dto) {
            return this.service.createConversation({
                userId: user.id,
                userRole: user.role,
                type: dto.type,
                bookingId: dto.bookingId,
                targetUserId: dto.targetUserId,
                participantUserIds: dto.participantUserIds,
            });
        };
        ChatController_1.prototype.messages = function (user, id, query) {
            return this.service.listMessages(id, user.id, query);
        };
        ChatController_1.prototype.send = function (user, id, dto) {
            return this.service.sendMessage(id, user.id, user.role, dto.body);
        };
        ChatController_1.prototype.uploadAttachment = function (user, id, file, dto) {
            if (!file) {
                throw new common_1.BadRequestException('File is required');
            }
            if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
                throw new common_1.BadRequestException("Unsupported file type \"".concat(file.mimetype, "\". Allowed: images, PDF, Word documents."));
            }
            return this.service.sendFileMessage(id, user.id, user.role, file.buffer, file.mimetype, file.originalname, dto.caption);
        };
        ChatController_1.prototype.read = function (user, id) {
            return this.service.markRead(id, user.id);
        };
        ChatController_1.prototype.edit = function (user, id, dto) {
            return this.service.editMessage(id, user.id, dto.body);
        };
        ChatController_1.prototype.remove = function (user, id) {
            return this.service.deleteMessage(id, user.id);
        };
        return ChatController_1;
    }());
    __setFunctionName(_classThis, "ChatController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)('conversations')];
        _getOne_decorators = [(0, common_1.Get)('conversations/:id')];
        _create_decorators = [(0, common_1.Post)('conversations')];
        _messages_decorators = [(0, common_1.Get)('conversations/:id/messages')];
        _send_decorators = [(0, common_1.Post)('conversations/:id/messages')];
        _uploadAttachment_decorators = [(0, common_1.Post)('conversations/:id/messages/upload'), (0, swagger_1.ApiOperation)({ summary: 'Upload a file attachment to a conversation' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: MAX_FILE_SIZE_BYTES },
            }))];
        _read_decorators = [(0, common_1.Patch)('conversations/:id/read')];
        _edit_decorators = [(0, common_1.Patch)('messages/:id')];
        _remove_decorators = [(0, common_1.Delete)('messages/:id')];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOne_decorators, { kind: "method", name: "getOne", static: false, private: false, access: { has: function (obj) { return "getOne" in obj; }, get: function (obj) { return obj.getOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _messages_decorators, { kind: "method", name: "messages", static: false, private: false, access: { has: function (obj) { return "messages" in obj; }, get: function (obj) { return obj.messages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _send_decorators, { kind: "method", name: "send", static: false, private: false, access: { has: function (obj) { return "send" in obj; }, get: function (obj) { return obj.send; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadAttachment_decorators, { kind: "method", name: "uploadAttachment", static: false, private: false, access: { has: function (obj) { return "uploadAttachment" in obj; }, get: function (obj) { return obj.uploadAttachment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _read_decorators, { kind: "method", name: "read", static: false, private: false, access: { has: function (obj) { return "read" in obj; }, get: function (obj) { return obj.read; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _edit_decorators, { kind: "method", name: "edit", static: false, private: false, access: { has: function (obj) { return "edit" in obj; }, get: function (obj) { return obj.edit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatController = _classThis;
}();
exports.ChatController = ChatController;
