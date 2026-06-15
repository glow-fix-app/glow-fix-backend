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
exports.NotificationsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var NotificationsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Notifications'), (0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.Controller)({ path: 'notifications', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _unreadCount_decorators;
    var _markRead_decorators;
    var _markAllRead_decorators;
    var _remove_decorators;
    var NotificationsController = _classThis = /** @class */ (function () {
        function NotificationsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        NotificationsController_1.prototype.list = function (user, query) {
            return this.service.listForUser(user.id, query);
        };
        NotificationsController_1.prototype.unreadCount = function (user) {
            return this.service.unreadCount(user.id).then(function (count) { return ({ count: count }); });
        };
        NotificationsController_1.prototype.markRead = function (user, id) {
            return this.service.markRead(id, user.id);
        };
        NotificationsController_1.prototype.markAllRead = function (user) {
            return this.service.markAllRead(user.id);
        };
        NotificationsController_1.prototype.remove = function (user, id) {
            return this.service.delete(id, user.id).then(function () { return ({ message: 'Deleted' }); });
        };
        return NotificationsController_1;
    }());
    __setFunctionName(_classThis, "NotificationsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)()];
        _unreadCount_decorators = [(0, common_1.Get)('unread-count')];
        _markRead_decorators = [(0, common_1.Patch)(':id/read')];
        _markAllRead_decorators = [(0, common_1.Patch)('read-all')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unreadCount_decorators, { kind: "method", name: "unreadCount", static: false, private: false, access: { has: function (obj) { return "unreadCount" in obj; }, get: function (obj) { return obj.unreadCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markRead_decorators, { kind: "method", name: "markRead", static: false, private: false, access: { has: function (obj) { return "markRead" in obj; }, get: function (obj) { return obj.markRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAllRead_decorators, { kind: "method", name: "markAllRead", static: false, private: false, access: { has: function (obj) { return "markAllRead" in obj; }, get: function (obj) { return obj.markAllRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsController = _classThis;
}();
exports.NotificationsController = NotificationsController;
