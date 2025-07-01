const { Hotel, Room, Policy, Location } = require('../models');

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
    const { policies, locations, ...hotelData } = req.body;
    
    // Create the hotel
    const hotel = await Hotel.create(hotelData);
    
    // Add policies if provided
    if (policies && Array.isArray(policies) && policies.length > 0) {
      // Validate policy IDs exist
      const validPolicies = await Policy.findAll({
        where: { id: policies, status: true }
      });
      if (validPolicies.length !== policies.length) {
        return res.status(400).json({ 
          success: false, 
          message: 'Some policy IDs are invalid or inactive' 
        });
      }
      await hotel.setPolicies(validPolicies);
    }
    
    // Add locations if provided
    if (locations && Array.isArray(locations) && locations.length > 0) {
      // Validate location IDs exist
      const validLocations = await Location.findAll({
        where: { id: locations, status: true }
      });
      if (validLocations.length !== locations.length) {
        return res.status(400).json({ 
          success: false, 
          message: 'Some location IDs are invalid or inactive' 
        });
      }
      await hotel.setLocations(validLocations);
    }
    
    // Fetch the created hotel with associations
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
    const { policies, locations, ...hotelData } = req.body;
    
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    
    // Update hotel data
    await hotel.update(hotelData);
    
    // Update policies if provided
    if (policies !== undefined) {
      if (Array.isArray(policies) && policies.length > 0) {
        // Validate policy IDs exist
        const validPolicies = await Policy.findAll({
          where: { id: policies, status: true }
        });
        if (validPolicies.length !== policies.length) {
          return res.status(400).json({ 
            success: false, 
            message: 'Some policy IDs are invalid or inactive' 
          });
        }
        await hotel.setPolicies(validPolicies);
      } else {
        // Clear all policies
        await hotel.setPolicies([]);
      }
    }
    
    // Update locations if provided
    if (locations !== undefined) {
      if (Array.isArray(locations) && locations.length > 0) {
        // Validate location IDs exist
        const validLocations = await Location.findAll({
          where: { id: locations, status: true }
        });
        if (validLocations.length !== locations.length) {
          return res.status(400).json({ 
            success: false, 
            message: 'Some location IDs are invalid or inactive' 
          });
        }
        await hotel.setLocations(validLocations);
      } else {
        // Clear all locations
        await hotel.setLocations([]);
      }
    }
    
    // Fetch the updated hotel with associations
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