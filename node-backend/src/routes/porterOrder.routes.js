const express = require('express');
const router = express.Router();
const porterOrderController = require('../controllers/porterOrder.controller');

router.post('/', porterOrderController.createBooking);
router.get('/:id', porterOrderController.getBooking);
router.patch('/:id/status', porterOrderController.updateBookingStatus);
router.get('/user/:userId', porterOrderController.listUserBookings);

module.exports = router; 