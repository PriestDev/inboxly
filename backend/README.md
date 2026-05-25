# WorkNoon Chat Backend

Real-time chat backend for the e-commerce chat system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure MongoDB:
- Make sure MongoDB is running
- Update `MONGODB_URI` in `.env`

4. Run the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user profile
- `PATCH /api/users/:userId/status` - Update user status

### Chats
- `GET /api/chats` - Get all user conversations
- `POST /api/chats` - Create new conversation
- `GET /api/chats/:conversationId/messages` - Get conversation messages
- `POST /api/chats/:conversationId/messages` - Send message
- `PATCH /api/chats/:conversationId/read` - Mark messages as read

## WebSocket Events

### Client to Server
- `authenticate` - Authenticate socket connection
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `mark_as_read` - Mark messages as read

### Server to Client
- `new_message` - New message received
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `messages_read` - Messages marked as read
- `user_online` - User came online
- `user_offline` - User went offline

## Database Models

- **User** - User information and status
- **Conversation** - Chat conversations
- **Message** - Chat messages

## Environment Variables

See `.env.example` for all available configurations.

## Architecture

```
backend/
├── src/
│   ├── config/       - Configuration files
│   ├── controllers/  - Request handlers
│   ├── models/       - Mongoose models
│   ├── routes/       - API routes
│   ├── middleware/   - Express middleware
│   ├── sockets/      - Socket.IO handlers
│   ├── utils/        - Utility functions
│   └── server.js     - Main server file
└── package.json
```
