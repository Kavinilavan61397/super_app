const express = require('express');
const router = express.Router();
const taxiRideController = require('../controllers/taxiRide.controller');

// List all rides (optionally filter by user_id, driver_id, vehicle_id)
router.get('/', taxiRideController.getAll);
// Get ride by ID
router.get('/:id', taxiRideController.getById);
// Create ride
router.post('/', taxiRideController.create);
// Update ride
router.put('/:id', taxiRideController.update);
// Delete ride
router.delete('/:id', taxiRideController.delete);

module.exports = router; 