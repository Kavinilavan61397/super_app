const express = require('express');
const router = express.Router();
const taxiDriverController = require('../controllers/taxiDriver.controller');

// List all drivers
router.get('/', taxiDriverController.getAll);
// Get driver by ID
router.get('/:id', taxiDriverController.getById);
// Create driver
router.post('/', taxiDriverController.create);
// Update driver
router.put('/:id', taxiDriverController.update);
// Delete driver
router.delete('/:id', taxiDriverController.delete);

module.exports = router; 