const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStatus
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validateImage = require('../middlewares/imageValidation.middleware');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), upload.single('product_image'), validateImage, createProduct);
router.put('/:id', protect, authorize('admin'), upload.single('product_image'), validateImage, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleStatus);

module.exports = router; 