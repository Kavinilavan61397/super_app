const { TaxiRide, TaxiDriver, TaxiVehicle, User } = require('../models');

module.exports = {
  // List all rides (optionally filter by user_id, driver_id, vehicle_id)
  async getAll(req, res) {
    try {
      const filter = {};
      if (req.query.user_id) filter.user_id = req.query.user_id;
      if (req.query.driver_id) filter.driver_id = req.query.driver_id;
      if (req.query.vehicle_id) filter.vehicle_id = req.query.vehicle_id;

      const rides = await TaxiRide.find(filter)
        .populate('user_id')
        .populate('driver_id')
        .populate('vehicle_id')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: rides });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi rides', error: err.message });
    }
  },

  // Get ride by ID
  async getById(req, res) {
    try {
      const ride = await TaxiRide.findById(req.params.id)
        .populate('user_id')
        .populate('driver_id')
        .populate('vehicle_id');
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });
      res.json({ success: true, data: ride });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi ride', error: err.message });
    }
  },

  // Create ride
  async create(req, res) {
    try {
      const { user_id, driver_id, vehicle_id, pickup_location, dropoff_location, fare, status, requested_at, started_at, completed_at } = req.body;
      const ride = await TaxiRide.create({ 
        user_id, 
        driver_id, 
        vehicle_id, 
        pickup_location, 
        dropoff_location, 
        fare, 
        status, 
        requested_at, 
        started_at, 
        completed_at 
      });
      res.status(201).json({ success: true, message: 'Taxi ride created successfully', data: ride });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error creating taxi ride', error: err.message });
    }
  },

  // Update ride
  async update(req, res) {
    try {
      const { user_id, driver_id, vehicle_id, pickup_location, dropoff_location, fare, status, requested_at, started_at, completed_at } = req.body;
      const ride = await TaxiRide.findById(req.params.id);
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });

      // Update fields
      ride.user_id = user_id;
      ride.driver_id = driver_id;
      ride.vehicle_id = vehicle_id;
      ride.pickup_location = pickup_location;
      ride.dropoff_location = dropoff_location;
      ride.fare = fare;
      ride.status = status;
      ride.requested_at = requested_at;
      ride.started_at = started_at;
      ride.completed_at = completed_at;

      await ride.save();

      res.json({ success: true, message: 'Taxi ride updated successfully', data: ride });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error updating taxi ride', error: err.message });
    }
  },

  // Delete ride
  async delete(req, res) {
    try {
      const ride = await TaxiRide.findById(req.params.id);
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });
      await ride.deleteOne();
      res.json({ success: true, message: 'Taxi ride deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting taxi ride', error: err.message });
    }
  }
}; 