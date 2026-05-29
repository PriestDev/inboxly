const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, 'email username firstName lastName avatar userType status isActive createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:userId', authenticate, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { firstName, lastName, avatar, userType } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, avatar, userType },
      { new: true }
    );

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.patch('/:userId/status', authenticate, async (req, res) => {
  try {
    if (req.userId !== req.params.userId && req.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status, lastActive: new Date() },
      { new: true }
    );
    res.json({ status: user.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change user role (admin only)
router.patch('/:userId/role', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userType } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { userType },
      { new: true }
    );

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
