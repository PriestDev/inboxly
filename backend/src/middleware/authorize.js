const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userType)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = authorize;
