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
exports.CreateConversationDto = exports.ConversationCreateType = void 0;
var class_validator_1 = require("class-validator");
var ConversationCreateType;
(function (ConversationCreateType) {
    ConversationCreateType["SUPPORT"] = "SUPPORT";
    ConversationCreateType["GENERAL"] = "GENERAL";
    ConversationCreateType["BOOKING"] = "BOOKING";
})(ConversationCreateType || (exports.ConversationCreateType = ConversationCreateType = {}));
var CreateConversationDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _bookingId_decorators;
    var _bookingId_initializers = [];
    var _bookingId_extraInitializers = [];
    var _targetUserId_decorators;
    var _targetUserId_initializers = [];
    var _targetUserId_extraInitializers = [];
    var _participantUserIds_decorators;
    var _participantUserIds_initializers = [];
    var _participantUserIds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateConversationDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.bookingId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _bookingId_initializers, void 0));
                this.targetUserId = (__runInitializers(this, _bookingId_extraInitializers), __runInitializers(this, _targetUserId_initializers, void 0));
                this.participantUserIds = (__runInitializers(this, _targetUserId_extraInitializers), __runInitializers(this, _participantUserIds_initializers, void 0));
                __runInitializers(this, _participantUserIds_extraInitializers);
            }
            return CreateConversationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, class_validator_1.IsEnum)(ConversationCreateType)];
            _bookingId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _targetUserId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _participantUserIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _bookingId_decorators, { kind: "field", name: "bookingId", static: false, private: false, access: { has: function (obj) { return "bookingId" in obj; }, get: function (obj) { return obj.bookingId; }, set: function (obj, value) { obj.bookingId = value; } }, metadata: _metadata }, _bookingId_initializers, _bookingId_extraInitializers);
            __esDecorate(null, null, _targetUserId_decorators, { kind: "field", name: "targetUserId", static: false, private: false, access: { has: function (obj) { return "targetUserId" in obj; }, get: function (obj) { return obj.targetUserId; }, set: function (obj, value) { obj.targetUserId = value; } }, metadata: _metadata }, _targetUserId_initializers, _targetUserId_extraInitializers);
            __esDecorate(null, null, _participantUserIds_decorators, { kind: "field", name: "participantUserIds", static: false, private: false, access: { has: function (obj) { return "participantUserIds" in obj; }, get: function (obj) { return obj.participantUserIds; }, set: function (obj, value) { obj.participantUserIds = value; } }, metadata: _metadata }, _participantUserIds_initializers, _participantUserIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateConversationDto = CreateConversationDto;
