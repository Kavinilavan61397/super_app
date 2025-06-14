const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getAllUsers } = require('../controllers/user.controller');

// Protected route - Get all users (admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// Protected route - Get user profile
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

module.exports = router; 