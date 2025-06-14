const express = require('express');
const router = express.Router();
const restaurantCategoryController = require('../controllers/restaurantCategory.controller');

// List all categories
router.get('/', restaurantCategoryController.getAll);
// Get category by ID
router.get('/:id', restaurantCategoryController.getById);
// Create category
router.post('/', restaurantCategoryController.create);
// Update category
router.put('/:id', restaurantCategoryController.update);
// Delete category
router.delete('/:id', restaurantCategoryController.delete);

module.exports = router; 