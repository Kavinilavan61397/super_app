const express = require('express');
const router = express.Router();
const {
  getUserGroceryOrders,
  getGroceryOrderById,
  createGroceryOrder,
  cancelGroceryOrder,
  getGroceryOrderStatus
} = require('../controllers/groceryOrder.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protected routes (require authentication)
router.post('/', protect, createGroceryOrder);
router.get('/my-orders', protect, getUserGroceryOrders);
router.get('/:id', protect, getGroceryOrderById);
router.patch('/:id/cancel', protect, cancelGroceryOrder);
router.get('/:id/status', protect, getGroceryOrderStatus);

module.exports = router;
