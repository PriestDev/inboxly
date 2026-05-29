const jwt = require('jsonwebtoken');

const generateToken = (userId, userType, expiresIn = '7d') => {
  return jwt.sign(
    { id: userId, userType },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
