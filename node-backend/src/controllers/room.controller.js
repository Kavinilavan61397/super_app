const { Room, Hotel } = require('../models');

// List all rooms (optionally by hotel)
exports.getAllRooms = async (req, res) => {
  try {
    const hotelId = req.query.hotel_id;
    const where = hotelId ? { hotel_id: hotelId } : {};
    const rooms = await Room.findAll({
      where,
      include: [{ model: Hotel, as: 'hotel' }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching rooms', error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [{ model: Hotel, as: 'hotel' }]
    });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching room', error: error.message });
  }
};

// Create room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room, message: 'Room created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating room', error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    await room.update(req.body);
    res.json({ success: true, data: room, message: 'Room updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating room', error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    await room.destroy();
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting room', error: error.message });
  }
}; 