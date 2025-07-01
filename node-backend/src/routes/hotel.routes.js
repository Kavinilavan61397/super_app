const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const hotelController = require('../controllers/hotel.controller');

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// List all hotels (with optional status filter)
router.get('/', hotelController.getAllHotels);
// Get hotel by ID
router.get('/:id', hotelController.getHotelById);
// Create hotel
router.post('/', hotelController.createHotel);
// Update hotel
router.put('/:id', hotelController.updateHotel);
// Delete hotel
router.delete('/:id', hotelController.deleteHotel);

module.exports = router; 