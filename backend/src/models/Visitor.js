const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  page: {
    type: String,
    trim: true
  },
  device: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'waiting', 'offline'],
    default: 'active'
  },
  source: {
    type: String,
    trim: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

visitorSchema.index({ email: 1 });
visitorSchema.index({ status: 1 });
visitorSchema.index({ lastSeenAt: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);