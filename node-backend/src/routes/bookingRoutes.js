'use strict';

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// GET all bookings
router.get('/', bookingController.getAllBookings);

// GET booking by ID
router.get('/:id', bookingController.getBookingById);

// POST create a new booking
router.post('/', bookingController.createBooking);

// PUT update a booking
router.put('/:id', bookingController.updateBooking);

// DELETE a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router; 