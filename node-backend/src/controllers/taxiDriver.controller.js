const TaxiDriver = require('../models/taxidriver');

module.exports = {
  // List all drivers
  async getAll(req, res) {
    try {
      const drivers = await TaxiDriver.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: drivers });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi drivers', error: err.message });
    }
  },

  // Get driver by ID
  async getById(req, res) {
    try {
      const driver = await TaxiDriver.findById(req.params.id);
      if (!driver) return res.status(404).json({ success: false, message: 'Taxi driver not found' });
      res.json({ success: true, data: driver });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi driver', error: err.message });
    }
  },

  // Create driver
  async create(req, res) {
    try {
      const { name, phone, license_number, status, user_id } = req.body;
      const driver = new TaxiDriver({ name, phone, license_number, status, user_id });
      await driver.save();
      res.status(201).json({ success: true, message: 'Taxi driver created successfully', data: driver });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error creating taxi driver', error: err.message });
    }
  },

  // Update driver
  async update(req, res) {
    try {
      const { name, phone, license_number, status, user_id } = req.body;
      const driver = await TaxiDriver.findById(req.params.id);
      if (!driver) return res.status(404).json({ success: false, message: 'Taxi driver not found' });
      driver.name = name || driver.name;
      driver.phone = phone || driver.phone;
      driver.license_number = license_number || driver.license_number;
      driver.status = status || driver.status;
      driver.user_id = user_id || driver.user_id;
      await driver.save();
      res.json({ success: true, message: 'Taxi driver updated successfully', data: driver });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error updating taxi driver', error: err.message });
    }
  },

  // Delete driver
  async delete(req, res) {
    try {
      const driver = await TaxiDriver.findById(req.params.id);
      if (!driver) return res.status(404).json({ success: false, message: 'Taxi driver not found' });
      await TaxiDriver.deleteOne({ _id: req.params.id });
      res.json({ success: true, message: 'Taxi driver deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting taxi driver', error: err.message });
    }
  }
}; 