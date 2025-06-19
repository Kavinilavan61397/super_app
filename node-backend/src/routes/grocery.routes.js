const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');
const groceryController = require('../controllers/grocery.controller');

// GET all groceries
router.get('/', protect, authorize('admin'), groceryController.getAllGroceries);
// GET grocery by ID
router.get('/:id', protect, authorize('admin'), groceryController.getGroceryById);
// POST create grocery (with image upload)
router.post('/', protect, authorize('admin'), upload.single('grocery_image'), groceryController.createGrocery);
// PUT update grocery (with image upload)
router.put('/:id', protect, authorize('admin'), upload.single('grocery_image'), groceryController.updateGrocery);
// DELETE grocery
router.delete('/:id', protect, authorize('admin'), groceryController.deleteGrocery);

module.exports = router;
