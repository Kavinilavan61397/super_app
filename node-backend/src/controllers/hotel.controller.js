const { Hotel, Room, Policy, Location } = require('../models');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

// List all hotels (with optional status filter)
exports.getAllHotels = async (req, res) => {
  try {
    const status = req.query.status;
    const where = status === 'all' ? {} : (status === 'inactive' ? { status: false } : { status: true });
    const hotels = await Hotel.findAll({
      where,
      include: [
        { model: Room, as: 'rooms' },
        { model: Policy, as: 'policies', attributes: ['id', 'title', 'description'] },
        { model: Location, as: 'locations', attributes: ['id', 'name', 'description'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
  }
};

// Get hotel by ID (with rooms)
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        { model: Room, as: 'rooms' },
        { model: Policy, as: 'policies', attributes: ['id', 'title', 'description'] },
        { model: Location, as: 'locations', attributes: ['id', 'name', 'description'] }
      ]
    });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hotel', error: error.message });
  }
};

// Create hotel
exports.createHotel = async (req, res) => {
  try {
    const { name, address, city, state, country, description, status } = req.body;
    let imagePath = null;

    // Image is required for create
    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'hotels');
      imagePath = `/uploads/hotels/${processedImage.filename}`;
    } else {
      return res.status(400).json({ success: false, message: 'Hotel image is required.' });
    }

    // Parse status as boolean
    const statusBool = typeof status !== 'undefined' ? (String(status) === 'true') : true;

    // Create hotel
    const hotel = await Hotel.create({
      name,
      address,
      city,
      state,
      country,
      description,
      status: statusBool,
      main_image: imagePath
    });

    // Handle policies and locations
    let policies = req.body['policies[]'] || [];
    let locations = req.body['locations[]'] || [];
    if (!Array.isArray(policies)) policies = policies ? [policies] : [];
    if (!Array.isArray(locations)) locations = locations ? [locations] : [];

    if (policies.length > 0) {
      const validPolicies = await Policy.findAll({ where: { id: policies, status: true } });
      await hotel.setPolicies(validPolicies);
    }
    if (locations.length > 0) {
      const validLocations = await Location.findAll({ where: { id: locations, status: true } });
      await hotel.setLocations(validLocations);
    }

    const createdHotel = await Hotel.findByPk(hotel.id, {
      include: [
        { model: Room, as: 'rooms' },
        { model: Policy, as: 'policies', attributes: ['id', 'title', 'description'] },
        { model: Location, as: 'locations', attributes: ['id', 'name', 'description'] }
      ]
    });

    res.status(201).json({ success: true, data: createdHotel, message: 'Hotel created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating hotel', error: error.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    const { name, address, city, state, country, description, status } = req.body;
    let imagePath = hotel.main_image;

    // If new image uploaded, process and replace old
    if (req.file) {
      // Delete old image if exists
      if (hotel.main_image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', hotel.main_image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'hotels');
      imagePath = `/uploads/hotels/${processedImage.filename}`;
    }

    // Parse status as boolean
    const statusBool = typeof status !== 'undefined' ? (String(status) === 'true') : hotel.status;

    await hotel.update({
      name: name || hotel.name,
      address: address || hotel.address,
      city: city || hotel.city,
      state: state || hotel.state,
      country: country || hotel.country,
      description: description || hotel.description,
      status: statusBool,
      main_image: imagePath
    });

    // Handle policies and locations
    let policies = req.body['policies[]'] || [];
    let locations = req.body['locations[]'] || [];
    if (!Array.isArray(policies)) policies = policies ? [policies] : [];
    if (!Array.isArray(locations)) locations = locations ? [locations] : [];

    if (policies.length > 0) {
      const validPolicies = await Policy.findAll({ where: { id: policies, status: true } });
      await hotel.setPolicies(validPolicies);
    } else {
      await hotel.setPolicies([]);
    }
    if (locations.length > 0) {
      const validLocations = await Location.findAll({ where: { id: locations, status: true } });
      await hotel.setLocations(validLocations);
    } else {
      await hotel.setLocations([]);
    }

    const updatedHotel = await Hotel.findByPk(hotel.id, {
      include: [
        { model: Room, as: 'rooms' },
        { model: Policy, as: 'policies', attributes: ['id', 'title', 'description'] },
        { model: Location, as: 'locations', attributes: ['id', 'name', 'description'] }
      ]
    });

    res.json({ success: true, data: updatedHotel, message: 'Hotel updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating hotel', error: error.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    await hotel.destroy();
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting hotel', error: error.message });
  }
}; 