const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');

// List all dishes (optionally filter by restaurantId)
router.get('/', dishController.getAll);
// Get dish by ID
router.get('/:id', dishController.getById);
// Create dish
router.post('/', dishController.create);
// Update dish
router.put('/:id', dishController.update);
// Delete dish
router.delete('/:id', dishController.delete);

module.exports = router; 