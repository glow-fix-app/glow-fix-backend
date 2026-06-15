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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDetailsSelect = exports.notificationTypeSelect = exports.notificationUserSelect = void 0;
exports.sanitizeNotification = sanitizeNotification;
exports.notificationUserSelect = {
    id: true,
    fullName: true,
    email: true,
    role: true,
};
exports.notificationTypeSelect = {
    id: true,
    code: true,
    label: true,
};
exports.notificationDetailsSelect = {
    id: true,
    recipientUserId: true,
    actorUserId: true,
    typeId: true,
    title: true,
    body: true,
    actionUrl: true,
    readAt: true,
    sentAt: true,
    createdAt: true,
    type: { select: exports.notificationTypeSelect },
    actor: { select: exports.notificationUserSelect },
    recipient: { select: exports.notificationUserSelect },
};
function sanitizeNotification(notification, options) {
    if (options === void 0) { options = {}; }
    var actor = notification.actor
        ? {
            id: notification.actor.id,
            fullName: notification.actor.fullName,
            email: notification.actor.email,
            role: notification.actor.role,
        }
        : null;
    var sanitized = {
        id: notification.id,
        recipientUserId: notification.recipientUserId,
        actorUserId: notification.actorUserId,
        typeId: notification.typeId,
        title: notification.title,
        body: notification.body,
        actionUrl: notification.actionUrl,
        readAt: notification.readAt,
        sentAt: notification.sentAt,
        createdAt: notification.createdAt,
        type: {
            id: notification.type.id,
            code: notification.type.code,
            label: notification.type.label,
        },
        actor: actor,
    };
    if (options.includeRecipient) {
        return __assign(__assign({}, sanitized), { recipient: notification.recipient
                ? {
                    id: notification.recipient.id,
                    fullName: notification.recipient.fullName,
                    email: notification.recipient.email,
                    role: notification.recipient.role,
                }
                : null });
    }
    return sanitized;
}
