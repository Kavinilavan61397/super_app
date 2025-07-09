// Porter Controller
const Porter = require('../models/Porter');

module.exports = {
  // Create a new porter (admin only or registration)
  createPorter: async (req, res) => {
    try {
      const {
        user,
        vehicleType,
        licenseNumber,
        status,
        currentLocation,
        phoneNumber,
        profilePhoto,
        vehicleNumber,
        isAvailable
      } = req.body;
      const porter = await Porter.create({
        user,
        vehicleType,
        licenseNumber,
        status,
        currentLocation,
        phoneNumber,
        profilePhoto,
        vehicleNumber,
        isAvailable
      });
      res.status(201).json({ message: 'Porter created', porter });
    } catch (error) {
      res.status(500).json({ message: 'Error creating porter', error: error.message });
    }
  },
  // Get porter by ID
  getPorter: async (req, res) => {
    try {
      const { id } = req.params;
      const porter = await Porter.findById(id).populate('user');
      if (!porter) {
        return res.status(404).json({ message: 'Porter not found' });
      }
      res.status(200).json({ porter });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching porter', error: error.message });
    }
  },
  // List all porters
  listPorters: async (req, res) => {
    try {
      const porters = await Porter.find().populate('user');
      res.status(200).json({ porters });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching porters', error: error.message });
    }
  },
  // Update porter
  updatePorter: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = {};
      const allowedFields = [
        'vehicleType',
        'licenseNumber',
        'status',
        'currentLocation',
        'phoneNumber',
        'profilePhoto',
        'vehicleNumber',
        'isAvailable'
      ];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) updateFields[field] = req.body[field];
      });
      const porter = await Porter.findByIdAndUpdate(id, updateFields, { new: true }).populate('user');
      if (!porter) {
        return res.status(404).json({ message: 'Porter not found' });
      }
      res.status(200).json({ message: 'Porter updated', porter });
    } catch (error) {
      res.status(500).json({ message: 'Error updating porter', error: error.message });
    }
  }
}; 