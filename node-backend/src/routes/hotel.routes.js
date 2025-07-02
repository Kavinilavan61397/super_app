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

module.exports = router; 