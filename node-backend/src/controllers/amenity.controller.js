const Amenity = require('../models/Amenity');

exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.findAll();
    res.json({ success: true, data: amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching amenities', error: error.message });
  }
};

exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ success: false, message: 'Amenity not found' });
    res.json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching amenity', error: error.message });
  }
};

exports.createAmenity = async (req, res) => {
  try {
    const { name, icon, status } = req.body;
    const amenity = await Amenity.create({ name, icon, status });
    res.status(201).json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating amenity', error: error.message });
  }
};

exports.updateAmenity = async (req, res) => {
  try {
    const { name, icon, status } = req.body;
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ success: false, message: 'Amenity not found' });
    await amenity.update({ name, icon, status });
    res.json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating amenity', error: error.message });
  }
};

exports.deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ success: false, message: 'Amenity not found' });
    await amenity.destroy();
    res.json({ success: true, message: 'Amenity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting amenity', error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ success: false, message: 'Amenity not found' });
    amenity.status = !amenity.status;
    await amenity.save();
    res.json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling status', error: error.message });
  }
}; 