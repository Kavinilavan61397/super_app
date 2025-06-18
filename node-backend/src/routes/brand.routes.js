const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validateImage = require('../middlewares/imageValidation.middleware');

// Import brand controller (we'll create this next)
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  bulkDeleteBrands
} = require('../controllers/brand.controller');

// Public routes
router.get('/get_all_brand', getAllBrands);
router.get('/:id', getBrandById);

// Protected routes (admin only)
router.post('/save_brand', protect, authorize('admin'), upload.single('brand_image'), validateImage, createBrand);
router.put('/update_brand_by_id/:id', protect, authorize('admin'), upload.single('brand_image'), validateImage, updateBrand);
router.delete('/delete_brand_by_id/:id', protect, authorize('admin'), deleteBrand);
router.delete('/delete_brands', protect, authorize('admin'), bulkDeleteBrands);

module.exports = router; 