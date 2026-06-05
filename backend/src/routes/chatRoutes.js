const express = require('express');
const authenticate = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

const ensureParticipant = (conversation, userId) => {
  return conversation.participants.some(participant => participant.userId.toString() === userId);
};

const findDefaultAgent = async () => {
  let agent = await User.findOne({ userType: 'agent', isActive: true }).sort({ lastActive: -1 });
  if (agent) {
    return agent;
  }
  return await User.findOne({ userType: 'admin', isActive: true }).sort({ lastActive: -1 });
};

// Get user conversations
router.get('/', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.userId
    })
      .populate('participants.userId', 'username avatar status userType')
      .populate('assignedAgent', 'username avatar status userType')
      .populate('lastMessage')
      .sort({ lastActivityAt: -1 });

    const enriched = await Promise.all(conversations.map(async conversation => {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        senderId: { $ne: req.userId },
        isDeleted: false,
        'readBy.userId': { $ne: req.userId }
      });

      return {
        ...conversation.toObject(),
        unreadCount
      };
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create conversation
router.post('/', authenticate, async (req, res) => {
  try {
    const { participantIds = [], participants = [], type, title, subject } = req.body;
    const normalizedParticipants = [];

    if (Array.isArray(participants) && participants.length > 0) {
      participants.forEach(participant => {
        if (participant.userId) {
          normalizedParticipants.push({
            userId: participant.userId,
            role: participant.role || 'customer'
          });
        }
      });
    }

    if (normalizedParticipants.length === 0) {
      normalizedParticipants.push({ userId: req.userId, role: 'customer' });
      participantIds
        .filter(id => id.toString() !== req.userId)
        .forEach(id => normalizedParticipants.push({ userId: id, role: 'agent' }));
    }

    if (!normalizedParticipants.some(p => p.userId.toString() === req.userId)) {
      normalizedParticipants.unshift({ userId: req.userId, role: 'customer' });
    }

    const conversationType = ['direct', 'group', 'support'].includes(type) ? type : 'support';
    const agentParticipants = normalizedParticipants.filter(p => p.role === 'agent');
    let assignedAgent = agentParticipants.length > 0 ? agentParticipants[0].userId : null;

    if (!assignedAgent && conversationType === 'support') {
      const defaultAgent = await findDefaultAgent();
      if (defaultAgent) {
        normalizedParticipants.push({ userId: defaultAgent._id, role: 'agent' });
        assignedAgent = defaultAgent._id;
      }
    }

    const assignedAgentIds = normalizedParticipants
      .filter(participant => participant.role === 'agent')
      .map(participant => participant.userId);

    const conversation = new Conversation({
      participants: normalizedParticipants,
      type: conversationType,
      title,
      subject,
      assignedAgent,
      assignedAgentIds,
      lastActivityAt: new Date()
    });

    await conversation.save();
    await conversation.populate('participants.userId', 'username avatar status userType');
    await conversation.populate('assignedAgent', 'username avatar status userType');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single conversation
router.get('/:conversationId', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants.userId', 'username avatar status userType')
      .populate('assignedAgent', 'username avatar status userType')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update conversation metadata
router.put('/:conversationId', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, subject, type } = req.body;
    conversation.title = title ?? conversation.title;
    conversation.subject = subject ?? conversation.subject;
    conversation.type = type ?? conversation.type;
    await conversation.save();

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete conversation
router.delete('/:conversationId', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.deleteMany({ conversationId: conversation._id });
    await Conversation.findByIdAndDelete(conversation._id);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get conversation messages
router.get('/:conversationId/messages', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
      isDeleted: false
    })
      .populate('senderId', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/:conversationId/messages', authenticate, async (req, res) => {
  try {
    const { content, messageType, attachments } = req.body;
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

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
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: message._id,
      lastActivityAt: new Date()
    });

    await message.populate('senderId', 'username avatar');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit message
router.put('/:conversationId/messages/:messageId', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.senderId.toString() !== req.userId) {
      const requestingUser = await User.findById(req.userId);
      if (requestingUser.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    message.editHistory.push({
      content: message.content,
      editedAt: new Date()
    });
    message.content = content;
    message.editedAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete('/:conversationId/messages/:messageId', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.senderId.toString() !== req.userId) {
      const requestingUser = await User.findById(req.userId);
      if (requestingUser.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    message.editedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.patch('/:conversationId/read', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!ensureParticipant(conversation, req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

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
