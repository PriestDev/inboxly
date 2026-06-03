# Inboxly Real-Time Chat System

A complete, scalable real-time chat system for e-commerce platforms with Node.js/Express backend, React frontend, and WordPress plugin integration.

## Project Overview

This system enables authenticated users to communicate with customer support agents, designers, and merchants in real-time. It supports multiple user types and provides a scalable architecture.

## Architecture

```
├── Backend (Node.js/Express)
│   └── Real-time WebSocket communication
│   └── MongoDB data storage
│   └── JWT authentication
├── Frontend (React)
│   └── Real-time UI updates
│   └── Socket.IO client integration
│   └── Responsive design
└── WordPress Plugin
    └── WP user integration
    └── Settings management
    └── Floating chat widget
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- MongoDB (local or cloud instance)
- React 18+
- WordPress 5.0+ (for plugin)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

The backend will start on `http://localhost:5000`

**Important environment variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Frontend URLs allowed

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update .env with API URL
npm start
```

The frontend will start on `http://localhost:3000`

### 3. WordPress Plugin Setup

1. Copy the `inboxly-chat` folder to your WordPress plugins directory:
   ```
   wp-content/plugins/inboxly-chat/
   ```

2. Activate the plugin in WordPress admin
3. Go to **Inboxly Chat Settings** and configure:
   - Backend API URL
   - Notification preferences
   - File upload settings

## Key Features

### Real-time Communication
- Instant message delivery via WebSocket
- Typing indicators
- Online/offline status
- Read receipts

### Multi-user Support
- **Buyers** - Users making purchases
- **Sellers** - Merchants selling products
- **Designers** - Service providers
- **Agents** - Customer support team

### User Management
- User registration and authentication
- JWT-based token authentication
- WordPress user integration
- User status management (online/offline)

### Conversation Management
- One-to-one conversations
- Group conversations
- Conversation archiving
- Participant management

### Message Features
- Text messages
- File attachments
- Message editing
- Message deletion (soft delete)
- Reactions/Emojis
- Search capabilities

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register      - Register new user
POST /api/auth/login         - Login user
GET  /api/auth/me            - Get current user
```

### User Endpoints

```
GET    /api/users/:userId              - Get user
PUT    /api/users/:userId              - Update user
PATCH  /api/users/:userId/status       - Update status
```

### Chat Endpoints

```
GET    /api/chats                              - Get conversations
POST   /api/chats                              - Create conversation
GET    /api/chats/:conversationId/messages     - Get messages
POST   /api/chats/:conversationId/messages     - Send message
PATCH  /api/chats/:conversationId/read        - Mark as read
```

### WebSocket Events

**Client → Server:**
- `authenticate` - Authenticate connection
- `join_conversation` - Join conversation room
- `send_message` - Send message
- `user_typing` - User typing
- `mark_as_read` - Mark as read

**Server → Client:**
- `new_message` - New message received
- `user_typing` - User typing indicator
- `user_online` - User came online
- `user_offline` - User went offline

## Database Schema

### User Model
- `email` - User email (unique)
- `username` - Display name
- `password` - Hashed password
- `userType` - Role (buyer/seller/designer/agent)
- `status` - Online status
- `avatar` - Profile picture URL
- `lastActive` - Last activity timestamp

### Conversation Model
- `participants` - Array of user IDs and roles
- `type` - Conversation type (direct/group/support)
- `title` - Conversation title
- `subject` - Discussion subject
- `status` - Status (active/archived/closed)
- `lastMessage` - Last message reference
- `lastActivityAt` - Last activity timestamp

### Message Model
- `conversationId` - Parent conversation
- `senderId` - Message sender
- `content` - Message text
- `messageType` - Message type (text/image/file/video)
- `attachments` - File attachments
- `readBy` - Read receipts
- `reactions` - Emoji reactions
- `createdAt` - Created timestamp

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs for secure passwords
- **CORS** - Cross-origin protection
- **Helmet** - HTTP headers security
- **Input Validation** - express-validator
- **Rate Limiting** - Prevent abuse (can be added)

## Deployment

### Backend Deployment (Heroku/DigitalOcean)

```bash
# Push to Heroku
git push heroku main

# Or deploy to DigitalOcean with PM2
pm2 start src/server.js --name "inboxly-chat"
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### WordPress Plugin Deployment

1. Package the plugin folder
2. Upload to WordPress plugin directory
3. Activate in admin panel

## Scalability Considerations

- **Horizontal Scaling** - Add more Node.js instances behind load balancer
- **Message Queue** - Use Redis for pub/sub messaging
- **Database Indexing** - Proper indexing on frequently queried fields
- **Caching** - Redis caching for user data
- **CDN** - Serve static assets via CDN
- **Database Replication** - MongoDB replica sets

## Best Practices

1. **Security**
   - Never commit `.env` files
   - Use environment variables for secrets
   - Implement rate limiting
   - Validate all inputs

2. **Performance**
   - Use database indexes
   - Implement caching
   - Optimize queries
   - Monitor WebSocket connections

3. **Code Quality**
   - Write tests
   - Use linters
   - Follow coding standards
   - Document code

## Troubleshooting

### Connection Issues
- Check if backend is running: `http://localhost:5000/api/health`
- Verify MongoDB connection: Check logs for connection errors
- Check CORS settings in `.env`

### Authentication Issues
- Verify JWT_SECRET in `.env`
- Check token expiration time
- Ensure credentials are correct

### WebSocket Issues
- Verify Socket.IO connection: Check browser console
- Check firewall settings
- Verify CORS configuration

## Future Enhancements

- [ ] Video/Audio calls (WebRTC)
- [ ] Message encryption (E2E)
- [ ] Mobile app (React Native)
- [ ] AI-powered suggestions
- [ ] Advanced search
- [ ] Message threading
- [ ] User blocking/muting
- [ ] Analytics dashboard

## License

MIT License - Feel free to use for your projects

## Support & Resources

- Documentation: See individual README files in each folder
- Issues: Report bugs in the repository
- Design Inspiration: https://dribbble.com

---

**Happy coding!** 🚀
