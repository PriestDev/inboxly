const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'designer', 'agent'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  type: {
    type: String,
    enum: ['direct', 'group', 'support'],
    default: 'direct'
  },
  title: String,
  description: String,
  subject: String,
  productId: mongoose.Schema.Types.ObjectId,
  orderId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastActivityAt: -1 });
conversationSchema.index({ status: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
