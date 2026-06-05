const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const socketHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Authentication
    socket.on('authenticate', async (token) => {
      try {
        const decoded = verifyToken(token);
        if (!decoded) {
          socket.emit('error', { message: 'Invalid token' });
          socket.disconnect();
          return;
        }

        socket.userId = decoded.id;
        socket.join(`user_${decoded.id}`);

        // Update user status
        await User.findByIdAndUpdate(decoded.id, {
          status: 'online',
          $addToSet: { socketIds: socket.id }
        });

        io.emit('user_online', { userId: decoded.id });
        console.log(`User ${decoded.id} authenticated`);
        // Notify the client that authentication succeeded
        socket.emit('authenticated', { userId: decoded.id });
      } catch (error) {
        console.error('Authentication error:', error);
      }
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, messageType, attachments } = data;

        const user = await User.findById(socket.userId);
        const message = new Message({
          conversationId,
          senderId: socket.userId,
          senderName: user.username,
          senderAvatar: user.avatar,
          content,
          messageType: messageType || 'text',
          attachments
        });

        await message.save();
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastActivityAt: new Date()
        });
        await message.populate('senderId', 'username avatar');

        // Broadcast to conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', {
          _id: message._id,
          conversationId: conversationId.toString(),
          senderId: message.senderId ? message.senderId.toString() : null,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          content,
          messageType,
          attachments,
          createdAt: message.createdAt,
          readBy: []
        });
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // User typing
    socket.on('user_typing', (data) => {
      const { conversationId } = data;
      io.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // User stopped typing
    socket.on('user_stopped_typing', (data) => {
      const { conversationId } = data;
      io.to(`conversation_${conversationId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { conversationId } = data;
        await Message.updateMany(
          { conversationId },
          {
            $addToSet: {
              readBy: {
                userId: socket.userId,
                readAt: new Date()
              }
            }
          }
        );

        io.to(`conversation_${conversationId}`).emit('messages_read', {
          userId: socket.userId,
          conversationId
        });
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        const updatedUser = await User.findByIdAndUpdate(
          socket.userId,
          { $pull: { socketIds: socket.id } },
          { new: true }
        );

        if (updatedUser && updatedUser.socketIds.length === 0) {
          await User.findByIdAndUpdate(socket.userId, {
            status: 'offline',
            lastActive: new Date()
          });
          io.emit('user_offline', { userId: socket.userId });
        }
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
