const { TaxiVehicle, TaxiDriver } = require('../models');

module.exports = {
  // List all vehicles
  async getAll(req, res) {
    try {
      const vehicles = await TaxiVehicle.findAll({ include: [{ model: TaxiDriver, as: 'driver' }] });
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch vehicles', details: err.message });
    }
  },

  // Get vehicle by ID
  async getById(req, res) {
    try {
      const vehicle = await TaxiVehicle.findByPk(req.params.id, { include: [{ model: TaxiDriver, as: 'driver' }] });
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch vehicle', details: err.message });
    }
  },

  // Create vehicle
  async create(req, res) {
    try {
      const { driver_id, make, model, plate_number, color, status } = req.body;
      const vehicle = await TaxiVehicle.create({ driver_id, make, model, plate_number, color, status });
      res.status(201).json(vehicle);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create vehicle', details: err.message });
    }
  },

  // Update vehicle
  async update(req, res) {
    try {
      const { driver_id, make, model, plate_number, color, status } = req.body;
      const vehicle = await TaxiVehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      await vehicle.update({ driver_id, make, model, plate_number, color, status });
      res.json(vehicle);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update vehicle', details: err.message });
    }
  },

  // Delete vehicle
  async delete(req, res) {
    try {
      const vehicle = await TaxiVehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      await vehicle.destroy();
      res.json({ message: 'Vehicle deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete vehicle', details: err.message });
    }
  }
}; 