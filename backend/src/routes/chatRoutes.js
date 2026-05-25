const express = require('express');
const authenticate = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Get user conversations
router.get('/', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.userId
    })
      .populate('participants.userId', 'username avatar status')
      .populate('lastMessage')
      .sort({ lastActivityAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create conversation
router.post('/', authenticate, async (req, res) => {
  try {
    const { participantIds, type, title, subject } = req.body;

    const participants = [
      { userId: req.userId, role: 'buyer' },
      ...participantIds.map(id => ({ userId: id, role: 'agent' }))
    ];

    const conversation = new Conversation({
      participants,
      type: type || 'direct',
      title,
      subject,
      lastActivityAt: new Date()
    });

    await conversation.save();
    await conversation.populate('participants.userId', 'username avatar status');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get conversation messages
router.get('/:conversationId/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
      .populate('senderId', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/:conversationId/messages', authenticate, async (req, res) => {
  try {
    const { content, messageType, attachments } = req.body;

    const sender = await User.findById(req.userId);

    const message = new Message({
      conversationId: req.params.conversationId,
      senderId: req.userId,
      senderName: sender.username,
      senderAvatar: sender.avatar,
      content,
      messageType: messageType || 'text',
      attachments
    });

    await message.save();

    // Update conversation
    await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      {
        lastMessage: message._id,
        lastActivityAt: new Date()
      }
    );

    await message.populate('senderId', 'username avatar');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.patch('/:conversationId/read', authenticate, async (req, res) => {
  try {
    await Message.updateMany(
      { conversationId: req.params.conversationId },
      {
        $addToSet: {
          readBy: {
            userId: req.userId,
            readAt: new Date()
          }
        }
      }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
