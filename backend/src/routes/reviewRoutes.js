const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: { $in: ['approved', 'featured'] } })
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(12);

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, title, company, role, email, avatar, rating, message, screenshotUrl, tags } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'Name, rating, and message are required' });
    }

    const review = new Review({
      name,
      title,
      company,
      role,
      email,
      avatar,
      rating,
      message,
      screenshotUrl,
      tags: Array.isArray(tags) ? tags : [],
      source: 'landing-page',
      status: 'pending'
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;