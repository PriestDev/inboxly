const User = require('../models/User');
const { verifyToken } = require('../config/jwt');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = user._id.toString();
    req.userType = user.userType;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = authenticate;
