const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateAgentCode } = require('../utils/codeGenerator');

const userSchema = new mongoose.Schema({
  agentCode: {
    type: String,
    unique: true,
    sparse: true
  },
  wpUserId: {
    type: Number,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  avatar: String,
  userType: {
    type: String,
    enum: ['admin', 'agent', 'client'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: Date,
  socketIds: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userSchema.pre('validate', async function (next) {
  if (!this.isNew || this.agentCode) {
    return next();
  }

  try {
    let agentCode = await generateAgentCode();

    while (await mongoose.models.User.findOne({ agentCode })) {
      agentCode = await generateAgentCode();
    }

    this.agentCode = agentCode;
    next();
  } catch (error) {
    next(error);
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

// Hide password on JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
