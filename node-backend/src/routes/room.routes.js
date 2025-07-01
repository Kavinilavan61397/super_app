const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

// List all rooms (optionally by hotel)
router.get('/', roomController.getAllRooms);
// Get room by ID
router.get('/:id', roomController.getRoomById);
// Create room
router.post('/', roomController.createRoom);
// Update room
router.put('/:id', roomController.updateRoom);
// Delete room
router.delete('/:id', roomController.deleteRoom);

module.exports = router; 