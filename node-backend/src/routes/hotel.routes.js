const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const hotelController = require('../controllers/hotel.controller');
const upload = require('../middlewares/upload.middleware');
const { validateImage } = require('../middlewares/imageValidation.middleware');

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// List all hotels (with optional status filter)
router.get('/', hotelController.getAllHotels);
// Get hotel by ID
router.get('/:id', hotelController.getHotelById);
// Create hotel (with image upload and validation)

router.post('/', upload.single('main_image'), validateImage, hotelController.createHotel);
// Update hotel (with optional image upload)
router.put('/:id', upload.single('main_image'), hotelController.updateHotel);
// Delete hotel
router.delete('/:id', hotelController.deleteHotel);

// Add room to a hotel with multiple images
router.post('/:hotelId/rooms', upload.array('images'), hotelController.createRoomForHotel);

// Get all rooms for a hotel with their latest booking (for owner dashboard)
router.get('/:hotelId/rooms-with-booking-status', protect, authorize('admin', 'hotel_admin'), hotelController.getRoomsWithBookingStatus);

module.exports = router; 