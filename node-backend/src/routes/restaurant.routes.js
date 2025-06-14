const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// List all restaurants (optionally filter by categoryId)
router.get('/', restaurantController.getAll);
// Get restaurant by ID
router.get('/:id', restaurantController.getById);
// Create restaurant
router.post('/', restaurantController.create);
// Update restaurant
router.put('/:id', restaurantController.update);
// Delete restaurant
router.delete('/:id', restaurantController.delete);

module.exports = router; 