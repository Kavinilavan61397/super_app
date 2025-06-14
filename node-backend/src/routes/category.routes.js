const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleStatus
} = require('../controllers/category.controller');
const upload = require('../middlewares/upload.middleware');
const validateImage = require('../middlewares/imageValidation.middleware');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), upload.single('category_image'), validateImage, createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('category_image'), validateImage, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleStatus);

module.exports = router; 