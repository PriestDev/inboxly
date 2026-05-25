const express = require('express');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Get user by ID
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
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
    if (req.userId !== req.params.userId) {
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

module.exports = router;
