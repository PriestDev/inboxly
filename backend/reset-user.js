const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function resetUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worknoon_chat');
    console.log('Connected to MongoDB');

    // Delete old alice user
    await User.deleteOne({ email: 'alice@example.com' });
    console.log('Deleted old alice@example.com user');

    // Create new alice user
    const newUser = new User({
      email: 'alice@example.com',
      username: 'alice',
      password: 'password123',
      firstName: 'Alice',
      lastName: 'Wonder',
      userType: 'buyer'
    });

    await newUser.save();
    console.log('Created new user:', {
      email: newUser.email,
      username: newUser.username,
      hashedPassword: newUser.password.substring(0, 20) + '...'
    });

    mongoose.connection.close();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetUser();
