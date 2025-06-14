const { TaxiDriver } = require('../models');

module.exports = {
  // List all drivers
  async getAll(req, res) {
    try {
      const drivers = await TaxiDriver.findAll();
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch drivers', details: err.message });
    }
  },

  // Get driver by ID
  async getById(req, res) {
    try {
      const driver = await TaxiDriver.findByPk(req.params.id);
      if (!driver) return res.status(404).json({ error: 'Driver not found' });
      res.json(driver);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch driver', details: err.message });
    }
  },

  // Create driver
  async create(req, res) {
    try {
      const { name, phone, license_no, status } = req.body;
      const driver = await TaxiDriver.create({ name, phone, license_no, status });
      res.status(201).json(driver);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create driver', details: err.message });
    }
  },

  // Update driver
  async update(req, res) {
    try {
      const { name, phone, license_no, status } = req.body;
      const driver = await TaxiDriver.findByPk(req.params.id);
      if (!driver) return res.status(404).json({ error: 'Driver not found' });
      await driver.update({ name, phone, license_no, status });
      res.json(driver);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update driver', details: err.message });
    }
  },

  // Delete driver
  async delete(req, res) {
    try {
      const driver = await TaxiDriver.findByPk(req.params.id);
      if (!driver) return res.status(404).json({ error: 'Driver not found' });
      await driver.destroy();
      res.json({ message: 'Driver deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete driver', details: err.message });
    }
  }
}; 