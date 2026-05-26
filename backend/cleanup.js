require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknoon_chat');
    console.log('Connected to MongoDB');

    // Delete all users to start fresh
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users`);

    // Create a fresh user
    const user = new User({
      email: 'alice@example.com',
      username: 'alice',
      password: 'password123',
      firstName: 'Alice',
      lastName: 'Wonder',
      userType: 'buyer'
    });

    await user.save();
    console.log('Created fresh user:', user.email);

    await mongoose.connection.close();
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
}

cleanup();
