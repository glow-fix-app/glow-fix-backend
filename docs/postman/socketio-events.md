# Socket.IO / WebSocket Events - Glow Fix Chat

Real-time communication events for the Glow Fix chat system.

**Note**: Postman has **limited native Socket.IO support**. Use tools like:
- [Socket.IO Client Tester](https://socket.io/docs/socket-io-client/), or
- WebSocket browser dev tools, or  
- [Insomnia WebSocket tester](https://insomnia.rest/), or
- Custom Node.js/Python client

## Connection

### Namespace
```
/chat
```

### Connection URL
```
http://localhost:3000
```
or
```
ws://localhost:3000/socket.io/?transport=websocket
```

### Authentication

Send auth token in connection query:

```json
{
  "token": "{{accessToken}}"
}
```

**Example (Socket.IO JavaScript client)**:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  namespace: '/chat',
  auth: {
    token: 'your_access_token_here'
  },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

## Client → Server Events

### 1. conversation.join

Join a conversation to receive real-time updates.

**Event Name**: `conversation.join`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Response**: Server broadcasts `message.created` and `typing.*` events for this conversation to all participants.

**Example**:
```javascript
socket.emit('conversation.join', {
  conversationId: '123e4567-e89b-12d3-a456-426614174000'
});
```

### 2. conversation.leave

Leave a conversation (stop receiving updates).

**Event Name**: `conversation.leave`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Example**:
```javascript
socket.emit('conversation.leave', {
  conversationId: '123e4567-e89b-12d3-a456-426614174000'
});
```

### 3. message.send

Send a real-time message in a conversation.

**Event Name**: `message.send`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "body": "Hello! This is a real-time message"
}
```

**Response**: 
- Server broadcasts `message.created` to all participants in the conversation
- Includes full message object with `id`, `senderUserId`, `senderRole`, timestamps, etc.

**Example**:
```javascript
socket.emit('message.send', {
  conversationId: '123e4567-e89b-12d3-a456-426614174000',
  body: 'Hey, are you there?'
});
```

### 4. typing.start

Notify other participants that you're typing.

**Event Name**: `typing.start`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Response**: 
- Server broadcasts `typing.start` to other participants
- Payload includes sender's `userId` and `role`

**Example**:
```javascript
socket.emit('typing.start', {
  conversationId: '123e4567-e89b-12d3-a456-426614174000'
});
```

### 5. typing.stop

Notify other participants that you stopped typing.

**Event Name**: `typing.stop`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Response**: 
- Server broadcasts `typing.stop` to other participants

**Example**:
```javascript
socket.emit('typing.stop', {
  conversationId: '123e4567-e89b-12d3-a456-426614174000'
});
```

## Server → Client Broadcasts

### 1. message.created

Broadcast when a new message is sent in a conversation you're in.

**Event Name**: `message.created`

**Payload**:
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "body": "Hello from another participant",
  "senderUserId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "senderRole": "CLIENT",
  "createdAt": "2026-05-29T12:34:56.000Z",
  "editedAt": null,
  "deletedAt": null
}
```

**Listen Example**:
```javascript
socket.on('message.created', (message) => {
  console.log('New message:', message.body);
  // Update UI with new message
});
```

### 2. message.read

Broadcast when a message is marked as read.

**Event Name**: `message.read`

**Payload**:
```json
{
  "messageId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "readBy": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "readAt": "2026-05-29T12:35:00.000Z"
}
```

**Listen Example**:
```javascript
socket.on('message.read', (data) => {
  console.log(`Message ${data.messageId} read by ${data.readBy}`);
  // Update message status in UI
});
```

### 3. typing.start

Broadcast when another participant starts typing.

**Event Name**: `typing.start`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "role": "MANAGER"
}
```

**Listen Example**:
```javascript
socket.on('typing.start', (data) => {
  console.log(`${data.role} user is typing...`);
  // Show "User is typing..." indicator
});
```

### 4. typing.stop

Broadcast when another participant stops typing.

**Event Name**: `typing.stop`

**Payload**:
```json
{
  "conversationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "role": "MANAGER"
}
```

**Listen Example**:
```javascript
socket.on('typing.stop', (data) => {
  console.log(`${data.role} user stopped typing`);
  // Remove "User is typing..." indicator
});
```

## Complete Example - Node.js Client

```javascript
import io from 'socket.io-client';

const accessToken = 'your_token_from_login_endpoint';
const conversationId = '123e4567-e89b-12d3-a456-426614174000';

// Connect
const socket = io('http://localhost:3000', {
  namespace: '/chat',
  auth: {
    token: accessToken
  },
  transports: ['websocket']
});

// Connection handlers
socket.on('connect', () => {
  console.log('✅ Connected to chat');
  
  // Join conversation
  socket.emit('conversation.join', { conversationId });
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from chat');
});

socket.on('error', (error) => {
  console.error('⚠️ Socket error:', error);
});

// Listen for incoming messages
socket.on('message.created', (message) => {
  console.log(`📨 New message from ${message.senderRole}: ${message.body}`);
});

// Listen for typing indicators
socket.on('typing.start', (data) => {
  console.log(`✍️ ${data.role} is typing...`);
});

socket.on('typing.stop', (data) => {
  console.log(`✋ ${data.role} stopped typing`);
});

// Listen for read receipts
socket.on('message.read', (data) => {
  console.log(`👁️ Message read by ${data.readBy}`);
});

// Send a message
function sendMessage(body) {
  socket.emit('message.send', {
    conversationId,
    body
  });
}

// Typing indicator
let typingTimeout;
function notifyTyping() {
  socket.emit('typing.start', { conversationId });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing.stop', { conversationId });
  }, 3000); // Stop typing after 3 seconds of inactivity
}

// Usage
sendMessage('Hello! This is a test message');
notifyTyping();

// Cleanup
process.on('SIGINT', () => {
  socket.disconnect();
  process.exit();
});
```

## Complete Example - Browser (JavaScript)

```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
<script>
  const accessToken = 'your_token_from_login_endpoint';
  const conversationId = 'YOUR_CONVERSATION_ID';

  const socket = io('http://localhost:3000', {
    namespace: '/chat',
    auth: {
      token: accessToken
    }
  });

  socket.on('connect', () => {
    console.log('Connected');
    socket.emit('conversation.join', { conversationId });
  });

  socket.on('message.created', (message) => {
    const messageEl = document.createElement('div');
    messageEl.textContent = `${message.senderRole}: ${message.body}`;
    document.getElementById('messages').appendChild(messageEl);
  });

  // Send message on form submit
  document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    socket.emit('message.send', {
      conversationId,
      body: input.value
    });
    input.value = '';
  });

  // Typing indicator
  document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('typing.start', { conversationId });
  });
</script>
```

## Testing Checklist

- [ ] Connect to `/chat` namespace with valid token
- [ ] Join conversation successfully
- [ ] Send message and receive `message.created` broadcast
- [ ] Verify typing indicators (`typing.start` / `typing.stop`)
- [ ] Check read receipts with `message.read`
- [ ] Leave conversation and stop receiving events
- [ ] Handle reconnection gracefully
- [ ] Verify error handling with invalid token
- [ ] Test multiple clients in same conversation
- [ ] Verify message order (FIFO)

## Troubleshooting

### "Auth failed" or "403 Forbidden"
- Verify `accessToken` is valid (not expired)
- Ensure token is passed in connection `auth` parameter
- Re-login to get a fresh token

### "Connection refused"
- Ensure API is running on `http://localhost:3000`
- Check firewall/network settings
- Verify WebSocket protocol is not blocked

### Messages not being received
- Confirm `conversation.join` was sent first
- Verify you're listening to `message.created` event
- Check browser console for errors

### Typing indicators not showing
- Ensure both clients are in the same `conversationId`
- Verify `typing.start` and `typing.stop` are emitted
- Check that listeners are registered before events fire

## API Response Format

All events use JSON payloads. Numbers are integers or floats. Timestamps are ISO 8601 strings (UTC).

### User Fields in Broadcasts

User info in broadcasts is sanitized (no `passwordHash`, `twoFactorSecret`, etc.):
- `userId`: UUID
- `role`: `CLIENT`, `MANAGER`, or `ADMIN`
- (optionally) `firstName`, `lastName`, `email`

### Timestamp Format

All timestamps follow ISO 8601:
```
2026-05-29T12:34:56.000Z
```

---

**Last Updated**: May 29, 2026  
**API Version**: v1  
**WebSocket Namespace**: `/chat`  
**Status**: Production Ready
