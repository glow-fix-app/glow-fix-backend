"use strict";
/**
 * Chat presenter — selects and typed output shapes for all chat entities.
 *
 * Following the same pattern as notifications.presenter.ts:
 *   1. Prisma `select` objects (type-safe at compile time)
 *   2. Inferred `*Record` types via `Prisma.XxxGetPayload`
 *   3. Sanitised output classes stripped of internal DB fields
 *   4. Pure presenter functions with no side-effects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatConversationSelect = exports.chatMessageSelect = exports.chatParticipantSelect = exports.chatStatusSelect = exports.chatUserSelect = void 0;
exports.presentConversation = presentConversation;
exports.presentMessage = presentMessage;
var encryption_util_1 = require("../../core/utils/encryption.util");
var entities_1 = require("./entities");
var conversation_response_dto_1 = require("./dto/conversation-response.dto");
var message_response_dto_1 = require("./dto/message-response.dto");
// ─── Select Objects ───────────────────────────────────────────────────────────
exports.chatUserSelect = {
    id: true,
    fullName: true,
    email: true,
    role: true,
};
exports.chatStatusSelect = {
    id: true,
    context: true,
};
exports.chatParticipantSelect = {
    id: true,
    conversationId: true,
    userId: true,
    role: true,
    lastReadAt: true,
    joinedAt: true,
    leftAt: true,
    user: { select: exports.chatUserSelect },
};
exports.chatMessageSelect = {
    id: true,
    conversationId: true,
    senderUserId: true,
    senderRole: true,
    type: true,
    body: true,
    statusId: true,
    deliveredAt: true,
    readAt: true,
    editedAt: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
    status: { select: exports.chatStatusSelect },
    sender: { select: exports.chatUserSelect },
};
exports.chatConversationSelect = {
    id: true,
    bookingId: true,
    type: true,
    statusId: true,
    closedAt: true,
    createdAt: true,
    updatedAt: true,
    status: { select: exports.chatStatusSelect },
    participants: {
        where: { leftAt: null },
        select: exports.chatParticipantSelect,
    },
    messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: exports.chatMessageSelect,
    },
};
// ─── Presenter Functions ──────────────────────────────────────────────────────
function presentConversation(record) {
    var _a;
    var conversation = new conversation_response_dto_1.ConversationResponseDto();
    conversation.id = record.id;
    conversation.bookingId = record.bookingId;
    conversation.type = record.type;
    conversation.statusId = record.statusId;
    conversation.closedAt = record.closedAt;
    conversation.createdAt = record.createdAt;
    conversation.updatedAt = record.updatedAt;
    var status = new entities_1.ChatStatusEntity();
    status.id = record.status.id;
    status.context = record.status.context;
    conversation.status = status;
    conversation.participants = record.participants.map(function (p) {
        var participant = new entities_1.ChatParticipantEntity();
        participant.id = p.id;
        participant.conversationId = p.conversationId;
        participant.userId = p.userId;
        participant.role = p.role;
        participant.lastReadAt = p.lastReadAt;
        participant.joinedAt = p.joinedAt;
        participant.leftAt = p.leftAt;
        var user = new entities_1.ChatUserEntity();
        user.id = p.user.id;
        user.fullName = p.user.fullName;
        user.email = p.user.email;
        user.role = p.user.role;
        participant.user = user;
        return participant;
    });
    // Attach last message preview
    var lastMsgRecord = (_a = record.messages) === null || _a === void 0 ? void 0 : _a[0];
    conversation.lastMessage = lastMsgRecord ? presentMessage(lastMsgRecord) : null;
    return conversation;
}
function presentMessage(record) {
    var _a;
    var body = null;
    if (!record.deletedAt && record.body) {
        var decryptedBody = (0, encryption_util_1.decryptMessage)(record.body);
        if (record.type === 'FILE') {
            // Parse attachment JSON safely; fall back to raw string if malformed
            try {
                var parsed = JSON.parse(decryptedBody);
                var attachment = new entities_1.AttachmentPayloadEntity();
                attachment.url = parsed.url;
                attachment.storageKey = parsed.storageKey;
                attachment.caption = parsed.caption || null;
                body = attachment;
            }
            catch (_b) {
                body = decryptedBody;
            }
        }
        else {
            body = decryptedBody;
        }
    }
    var message = new message_response_dto_1.MessageResponseDto();
    message.id = record.id;
    message.conversationId = record.conversationId;
    message.senderUserId = (_a = record.senderUserId) !== null && _a !== void 0 ? _a : '';
    message.senderRole = record.senderRole;
    message.type = record.type;
    message.body = body;
    message.statusId = record.statusId;
    message.deliveredAt = record.deliveredAt;
    message.readAt = record.readAt;
    message.editedAt = record.editedAt;
    message.deletedAt = record.deletedAt;
    message.createdAt = record.createdAt;
    message.updatedAt = record.updatedAt;
    var status = new entities_1.ChatStatusEntity();
    status.id = record.status.id;
    status.context = record.status.context;
    message.status = status;
    var sender = new entities_1.ChatUserEntity();
    if (record.sender) {
        sender.id = record.sender.id;
        sender.fullName = record.sender.fullName;
        sender.email = record.sender.email;
        sender.role = record.sender.role;
    }
    else {
        sender.id = 'system';
        sender.fullName = 'System';
        sender.email = 'system@glowfix.com';
        sender.role = 'SYSTEM';
    }
    message.sender = sender;
    return message;
}
