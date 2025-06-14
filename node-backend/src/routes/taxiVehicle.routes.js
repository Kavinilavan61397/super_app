const express = require('express');
const router = express.Router();
const taxiVehicleController = require('../controllers/taxiVehicle.controller');

// List all vehicles
router.get('/', taxiVehicleController.getAll);
// Get vehicle by ID
router.get('/:id', taxiVehicleController.getById);
// Create vehicle
router.post('/', taxiVehicleController.create);
// Update vehicle
router.put('/:id', taxiVehicleController.update);
// Delete vehicle
router.delete('/:id', taxiVehicleController.delete);

module.exports = router; 