# Glow Fix Backend API - Postman Collection

Complete Postman collection for testing the Glow Fix backend API endpoints in local development.

## Quick Start

### 1. Import Files into Postman

1. Open **Postman**
2. Click **File** → **Import**
3. Select the following files from `docs/postman/`:
   - `glow-fix-api.postman_collection.json` (the API collection)
   - `glow-fix-local.postman_environment.json` (the environment variables)

### 2. Select the Environment

1. In Postman, find the environment dropdown (top-right area, near "No Environment")
2. Select **Glow Fix Local** from the dropdown

### 3. Verify Settings

- **baseUrl**: `http://localhost:3000/api/v1`
- **socketUrl**: `http://localhost:3000`

## Prerequisites

### Local Setup

Ensure the following are running before testing:

1. **API Server**
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:3000/api/v1`

2. **PostgreSQL Database**
   - Must be running and migrated
   - Database schema should be initialized
   - Run migrations if needed:
     ```bash
     npm run prisma:migrate:dev
     ```

3. **Database Seed (Seeded Test Users)**
   ```bash
   npm run prisma:seed
   ```

   This creates test users:
   - **Client**: `client@glowfix.io` / `Client@1234!`
   - **Client 2**: `client2@glowfix.io` / `Client@5678!`
   - **Manager**: `manager@glowfix.io` / `Manager@1234!`
   - **Manager 2**: `manager2@glowfix.io` / `Manager@5678!`
   - **Admin**: `admin@glowfix.io` / `Admin@1234!`

### Optional: Email (SMTP)

- Some endpoints may require email verification (OTP)
- **Mailpit** on `localhost:1025` can be used for local SMTP testing
- If SMTP is unavailable, registration may fail unless a local email fallback is configured
- See the endpoint documentation for details

## Seeded Test Users

All test users below are created by the seed script:

| Role     | Email                    | Password       |
|----------|--------------------------|----------------|
| Client   | client@glowfix.io        | Client@1234!   |
| Client 2 | client2@glowfix.io       | Client@5678!   |
| Manager  | manager@glowfix.io       | Manager@1234!  |
| Manager 2| manager2@glowfix.io      | Manager@5678!  |
| Admin    | admin@glowfix.io         | Admin@1234!    |

## Environment Variables

The **Glow Fix Local** environment includes:

### URLs & Base Configuration
- `baseUrl`: API base URL (default: `http://localhost:3000/api/v1`)
- `socketUrl`: WebSocket base URL (default: `http://localhost:3000`)

### Auth Tokens (Auto-filled by Tests)
- `accessToken`: Set by login requests
- `refreshToken`: Set by login requests
- `clientAccessToken`: Set by client login
- `managerAccessToken`: Set by manager login
- `adminAccessToken`: Set by admin login
- `mfaToken`: Set by MFA flows

### Resource IDs (Auto-filled by Tests)
- `notificationId`: Set by notification list endpoint
- `conversationId`: Set by conversation list or create endpoint
- `messageId`: Set by message list or send endpoint
- `bookingId`: Needs to be manually set from database/response (see below)
- `sessionId`: Set by session list endpoint

### User IDs (Needs Manual Setup)
- `targetUserId`: User ID for general conversation creation (copy from seed or database)
- `participantUserId`: Participant user ID (copy from seed or database)

### Utility Variables
- `invalidUuid`: `00000000-0000-0000-0000-000000000000` (for testing 404 responses)
- All test user credentials (emails and passwords)

## How to Get Missing IDs

Some IDs need to be copied manually:

### `bookingId`
Run this query against your local PostgreSQL:
```sql
SELECT id FROM booking LIMIT 1;
```
Then copy the ID and set it in the Postman environment variable `bookingId`.

### `targetUserId` and `participantUserId`
Get any user ID from the database:
```sql
SELECT id FROM "user" WHERE role = 'CLIENT' LIMIT 1;
```
Copy the ID and set both `targetUserId` and `participantUserId` in the environment.

## Recommended Test Order

Run endpoints in this sequence to avoid dependency issues:

### 1. **Health Checks** (No auth required)
   - `Health > GET /health/live`
   - `Health > GET /health/ready`
   - `Health > GET /health/detailed` (optional, may require auth)

### 2. **Authentication**
   - `Auth - Login > POST /auth/login (Client)` ← This saves `accessToken` and `clientAccessToken`
   - `Auth - Login > POST /auth/login (Manager)` ← Saves `managerAccessToken`
   - `Auth - Login > POST /auth/login (Admin)` ← Saves `adminAccessToken`

### 3. **User Profile** (Uses `accessToken` from Client login)
   - `Users > GET /users/me`

### 4. **Notifications** (Uses `accessToken`)
   - `Notifications > GET /notifications (all)` ← Saves `notificationId`
   - `Notifications > GET /notifications (unread only)`
   - `Notifications > GET /notifications/unread-count`
   - `Notifications > PATCH /notifications/{{notificationId}}/read`
   - `Notifications > PATCH /notifications/read-all`

### 5. **Chat - Conversations** (Uses `accessToken`)
   - `Chat - Conversations > GET /conversations` ← Saves `conversationId`
   - `Chat - Conversations > GET /conversations/{{conversationId}}`
   - `Chat - Conversations > POST /conversations (BOOKING type)` ← Requires `bookingId` (set manually)

### 6. **Chat - Messages** (Uses `conversationId` from step 5)
   - `Chat - Messages > GET /conversations/{{conversationId}}/messages` ← Saves `messageId`
   - `Chat - Messages > POST /conversations/{{conversationId}}/messages` ← Creates new message
   - `Chat - Messages > PATCH /messages/{{messageId}}` ← Edit the message
   - `Chat - Messages > DELETE /messages/{{messageId}}` ⚠️ **Deletes data**

### 7. **Chat - Conversation State**
   - `Chat - Conversation State > PATCH /conversations/{{conversationId}}/read`

### 8. **Auth - Sessions** (Optional)
   - `Auth - Sessions > GET /auth/sessions`
   - `Auth - Sessions > POST /auth/logout`

### 9. **Security Tests** (Tests without/with invalid tokens)
   - `Security Tests > GET /notifications without token (401)`
   - `Security Tests > GET /notifications with invalid token (401)`
   - `Security Tests > GET /conversations/{{invalidUuid}} (404/403)`

## Important Notes

### ⚠️ Destructive Operations

These endpoints **delete or modify data**:
- `DELETE /notifications/{{notificationId}}` — Removes a notification
- `DELETE /messages/{{messageId}}` — Soft-deletes a message
- `POST /auth/logout-all` — Invalidates all sessions

Use these carefully in local development only.

### Response Format Variations

The API may wrap responses differently:
```json
{ "data": {...} }        // Wrapped response
{ "success": true, "data": {...} }  // Success wrapper
{...}                    // Direct response
[...]                    // Array directly
```

Postman test scripts handle these variations automatically.

### Token Auto-Save

The following endpoints automatically save tokens to environment variables:
- `POST /auth/login (Client)` → saves `accessToken`, `clientAccessToken`, `refreshToken`
- `POST /auth/login (Manager)` → saves `managerAccessToken`
- `POST /auth/login (Admin)` → saves `adminAccessToken`

### ID Auto-Save

Endpoints automatically save IDs:
- `GET /notifications` → saves first `notificationId`
- `GET /conversations` → saves first `conversationId`
- `GET /conversations/.../messages` → saves first `messageId`
- `POST /conversations` → saves new `conversationId`
- `POST /conversations/.../messages` → saves new `messageId`

## WebSocket / Socket.IO Testing

Postman has **limited Socket.IO support**. For WebSocket testing, see [socketio-events.md](./socketio-events.md).

### Quick Socket.IO Reference

**Namespace**: `/chat`

**Authentication**:
```json
{
  "token": "{{accessToken}}"
}
```

**Supported Events**:
- `conversation.join` — Join a conversation
- `conversation.leave` — Leave a conversation
- `message.send` — Send a real-time message
- `typing.start` — Start typing indicator
- `typing.stop` — Stop typing indicator

**Expected Broadcasts**:
- `message.created` — New message received
- `message.read` — Message marked as read
- `typing.start` — User typing
- `typing.stop` — User stopped typing

See [socketio-events.md](./socketio-events.md) for example payloads.

## Troubleshooting

### Issue: "Cannot GET /api/v1/health/live"
**Fix**: Ensure API is running (`npm run dev`) on `http://localhost:3000`

### Issue: "Connect ECONNREFUSED 127.0.0.1:5432"
**Fix**: Ensure PostgreSQL is running and seeded

### Issue: "Invalid or expired token"
**Fix**: Re-run the login request to get a fresh `accessToken`

### Issue: "401 Unauthorized" on protected endpoints
**Fix**: Ensure `accessToken` is set in the environment and the "Authorization" header is configured correctly

### Issue: "404 Not Found" for conversation/message
**Fix**: Ensure `conversationId` is set. Run `GET /conversations` first to populate it.

### Issue: Email verification fails
**Fix**: If SMTP (Mailpit) is not available, check if the backend has a local email fallback enabled.

## API Endpoint Documentation

### Health
- `GET /health/live` — Simple liveness check
- `GET /health/ready` — Readiness check with dependency status
- `GET /health/detailed` — Full health metrics (admin/auth required)

### Authentication
- `POST /auth/login` — Login with email/phone and password
- `POST /auth/refresh-token` — Refresh access token
- `POST /auth/logout` — Logout current session
- `POST /auth/logout-all` — Logout all sessions
- `POST /auth/change-password` — Change password (requires current password)
- `POST /auth/forgot-password` — Request password reset OTP
- `POST /auth/reset-password` — Reset password with OTP
- `POST /auth/verify-otp` — Verify OTP (email/phone, password reset)
- `POST /auth/resend-otp` — Resend OTP

### Sessions
- `GET /auth/sessions` — List active sessions
- `DELETE /auth/sessions/:sessionId` — Revoke a session

### MFA / Two-Factor Authentication
- `POST /auth/mfa/setup` — Start MFA setup (returns QR code)
- `POST /auth/mfa/verify` — Verify and enable MFA
- `POST /auth/mfa/validate` — Complete MFA login
- `DELETE /auth/mfa/disable` — Disable MFA

### Users
- `GET /users/me` — Get authenticated user profile
- `PUT /users/me/avatar` — Upload user avatar
- `DELETE /users/me/avatar` — Delete user avatar

### Notifications
- `GET /notifications` — List notifications (paginated, filterable)
- `GET /notifications/unread-count` — Get unread notification count
- `PATCH /notifications/:id/read` — Mark single notification as read
- `PATCH /notifications/read-all` — Mark all notifications as read
- `DELETE /notifications/:id` — Delete a notification

### Chat - Conversations
- `GET /conversations` — List conversations
- `GET /conversations/:id` — Get conversation details
- `POST /conversations` — Create new conversation
  - Types: `BOOKING`, `GENERAL`, `SUPPORT`
  - Requires: `type`, and context-specific fields (see docs)

### Chat - Messages
- `GET /conversations/:id/messages` — List messages in conversation
- `POST /conversations/:id/messages` — Send message
- `PATCH /messages/:id` — Edit message
- `DELETE /messages/:id` — Delete message
- `PATCH /conversations/:id/read` — Mark conversation as read

### Metrics
- `GET /metrics` — Prometheus metrics (may be public or auth-required)

## Support

For issues or questions about the API endpoints, check:
1. Backend logs: `npm run dev` output
2. API Swagger docs (if available at `/api/docs`)
3. Controller files in `api/src/modules/`

---

**Last Updated**: May 29, 2026  
**API Version**: v1  
**Environment**: Local Development  
**Branch**: feature/chat-notifications-baseline
