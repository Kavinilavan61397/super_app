const express = require('express');
const router = express.Router();
const porterAdminController = require('../controllers/porterAdmin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// List all porters
router.get('/porters', protect, authorize('admin'), porterAdminController.listAllPorters);
// Update porter status
router.patch('/porters/:id/status', protect, authorize('admin'), porterAdminController.updatePorterStatus);
// List all orders
router.get('/orders', protect, authorize('admin'), porterAdminController.listAllOrders);
// Get order details
router.get('/orders/:id', protect, authorize('admin'), porterAdminController.getOrderDetails);

module.exports = router; 