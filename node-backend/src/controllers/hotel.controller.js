const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Policy = require('../models/policy');
const Location = require('../models/location');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

// List all hotels (with optional status filter)
exports.getAllHotels = async (req, res) => {
  try {
    console.log('GET /api/hotels - Request received');
    const status = req.query.status;
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    console.log('Filter:', filter);
    
    const hotels = await Hotel.find(filter)
      .populate('rooms')
      .populate('policies')
      .populate('amenities')
      .populate('owner')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${hotels.length} hotels`);
    console.log('Hotels:', hotels.map(h => ({ id: h._id, name: h.name, status: h.status })));
    
    res.json({ success: true, data: hotels });
  } catch (error) {
    console.error('Error in getAllHotels:', error);
    res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
  }
};

// Get hotel by ID (with rooms)
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('rooms')
      .populate('policies')
      .populate('amenities')
      .populate('owner');
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hotel', error: error.message });
  }
};

// Create hotel
exports.createHotel = async (req, res) => {
  try {
    console.log('POST /api/hotels - Request received');
    console.log('Request body:', req.body);
    
    const { 
      name, 
      description, 
      phone, 
      email, 
      website, 
      rating, 
      total_reviews, 
      amenities, 
      images, 
      main_image, 
      star_rating, 
      check_in_time, 
      check_out_time, 
      policies, 
      status, 
      owner_id 
    } = req.body;

    // Construct address object from individual fields or nested object
    const address = {
      street: req.body['address[street]'] || req.body.address?.street || '',
      city: req.body['address[city]'] || req.body.address?.city || '',
      state: req.body['address[state]'] || req.body.address?.state || '',
      country: req.body['address[country]'] || req.body.address?.country || '',
      postal_code: req.body['address[postal_code]'] || req.body.address?.postal_code || ''
    };
    
    console.log('Constructed address:', address);

    let mainImagePath = null;
    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'hotels');
      mainImagePath = `/uploads/hotels/${processedImage.filename}`;
    } else if (main_image) {
      mainImagePath = main_image;
    } else {
      return res.status(400).json({ success: false, message: 'Hotel image is required.' });
    }

    const hotel = new Hotel({
      name,
      description,
      address,
      phone,
      email,
      website,
      rating,
      total_reviews,
      amenities,
      images,
      main_image: mainImagePath,
      star_rating,
      check_in_time,
      check_out_time,
      policies,
      status: status || 'active',
      owner_id
    });
    await hotel.save();
    const createdHotel = await Hotel.findById(hotel._id)
      .populate('rooms')
      .populate('policies')
      .populate('amenities')
      .populate('owner');
    res.status(201).json({ success: true, data: createdHotel, message: 'Hotel created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating hotel', error: error.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    console.log('PUT /api/hotels/:id - Request received');
    console.log('Request body:', req.body);
    
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    
    const { 
      name, 
      description, 
      phone, 
      email, 
      website, 
      rating, 
      total_reviews, 
      amenities, 
      images, 
      main_image, 
      star_rating, 
      check_in_time, 
      check_out_time, 
      policies, 
      status, 
      owner_id 
    } = req.body;

    // Construct address object from individual fields or nested object
    const address = {
      street: req.body['address[street]'] || req.body.address?.street || hotel.address?.street || '',
      city: req.body['address[city]'] || req.body.address?.city || hotel.address?.city || '',
      state: req.body['address[state]'] || req.body.address?.state || hotel.address?.state || '',
      country: req.body['address[country]'] || req.body.address?.country || hotel.address?.country || '',
      postal_code: req.body['address[postal_code]'] || req.body.address?.postal_code || hotel.address?.postal_code || ''
    };
    
    console.log('Constructed address:', address);

    let mainImagePath = hotel.main_image;
    if (req.file) {
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
      mainImagePath = `/uploads/hotels/${processedImage.filename}`;
    } else if (main_image) {
      mainImagePath = main_image;
    }

    hotel.name = name || hotel.name;
    hotel.description = description || hotel.description;
    hotel.address = address;
    hotel.phone = phone || hotel.phone;
    hotel.email = email || hotel.email;
    hotel.website = website || hotel.website;
    hotel.rating = rating || hotel.rating;
    hotel.total_reviews = total_reviews || hotel.total_reviews;
    hotel.amenities = amenities || hotel.amenities;
    hotel.images = images || hotel.images;
    hotel.main_image = mainImagePath;
    hotel.star_rating = star_rating || hotel.star_rating;
    hotel.check_in_time = check_in_time || hotel.check_in_time;
    hotel.check_out_time = check_out_time || hotel.check_out_time;
    hotel.policies = policies || hotel.policies;
    hotel.status = status || hotel.status;
    hotel.owner_id = owner_id || hotel.owner_id;
    
    await hotel.save();
    const updatedHotel = await Hotel.findById(hotel._id)
      .populate('rooms')
      .populate('policies')
      .populate('amenities')
      .populate('owner');
    res.json({ success: true, data: updatedHotel, message: 'Hotel updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating hotel', error: error.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    await Hotel.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting hotel', error: error.message });
  }
};