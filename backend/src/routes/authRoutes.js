const express = require('express');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../config/jwt');
const authenticate = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, userType } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      userType: userType || 'client'
    });

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Inboxly',
        text: `Hi ${user.firstName || user.username},\n\nWelcome to Inboxly chat! Your account has been created successfully.\n\nThanks,\nThe Inboxly team`
      });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError.message);
    }

    const token = generateToken(user._id, user.userType);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    console.log('Login attempt:', { email, password, userExists: !!user });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.userType);
    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// WordPress login integration
router.post('/wp-login', async (req, res) => {
  try {
    const { wpUserId, email, username, firstName, lastName, avatar } = req.body;

    if (!wpUserId || !email || !username) {
      return res.status(400).json({ message: 'wpUserId, email, and username are required' });
    }

    let user = await User.findOne({ wpUserId });

    if (!user) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = new User({
        wpUserId,
        email,
        username,
        password: Math.random().toString(36).slice(-12),
        firstName,
        lastName,
        avatar,
        userType: 'client'
      });
      await user.save();
    } else if (!user.wpUserId) {
      user.wpUserId = wpUserId;
      await user.save();
    }

    const token = generateToken(user._id, user.userType);
    res.json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ valid: true, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
