const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(protect);

// Create order from cart
router.post('/', orderController.createOrder);

// Get user orders with pagination and filtering
router.get('/', orderController.getUserOrders);

// Get single order by ID
router.get('/:id', orderController.getOrder);

// Get order by order number
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router; 