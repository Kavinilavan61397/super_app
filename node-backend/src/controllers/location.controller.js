const Location = require('../models/Location');
const { Op } = require('sequelize');

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    if (status !== undefined && status !== 'all') {
      whereClause.status = status === 'true';
    }

    const locations = await Location.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: locations.rows,
      total: locations.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(locations.count / limit)
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get location by ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Create new location
const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const location = await Location.create({
      name,
      description: description || null,
      status: true
    });
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    await location.update({
      name: name || location.name,
      description: description !== undefined ? description : location.description
    });
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle location status
const toggleLocationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    await location.update({ status: !location.status });
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Error toggling location status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }
    await location.destroy();
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  toggleLocationStatus,
  deleteLocation
}; 