const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Temporary demo token bypass for development
    if (token === 'demo-token') {
      req.user = {
        id: '000000000000000000000001', // Valid ObjectId for demo user
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      };
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }

      // Attach user to request object
      // req.user = user;
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }; // ✅ Plain object
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in authentication',
      error: error.message
    });
  }
};

// Case-insensitive role check
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    next();
  };
}; 