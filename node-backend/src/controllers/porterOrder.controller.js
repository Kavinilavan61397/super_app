// PorterOrder Controller
const PorterOrder = require('../models/PorterOrder');
const Porter = require('../models/Porter');

// Utility to calculate distance (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Fare rates (example values)
const BASE_FARE = {
  bike: 30,
  auto: 50,
  'mini-truck': 100
};
const PER_KM_RATE = {
  bike: 8,
  auto: 12,
  'mini-truck': 20
};

module.exports = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const {
        customer, // user id
        pickupAddress,
        pickupLat,
        pickupLng,
        dropAddress,
        dropLat,
        dropLng,
        vehicleType,
        instructions,
        estimatedArrivalTime
      } = req.body;

      // Calculate distance
      const distance = getDistanceFromLatLonInKm(pickupLat, pickupLng, dropLat, dropLng);
      // Calculate fare
      const base = BASE_FARE[vehicleType] || 0;
      const perKm = PER_KM_RATE[vehicleType] || 0;
      const fare = Math.round(base + distance * perKm);

      // Find available porters with matching vehicleType and status 'active'
      const porters = await Porter.find({
        vehicleType,
        status: 'active',
        currentLocation: { $ne: null },
        isAvailable: true
      });

      // Find nearest porter (if any)
      let assignedPorter = null;
      let minDistance = Infinity;
      porters.forEach(porter => {
        if (porter.currentLocation && porter.currentLocation.lat && porter.currentLocation.lng) {
          const d = getDistanceFromLatLonInKm(
            pickupLat,
            pickupLng,
            porter.currentLocation.lat,
            porter.currentLocation.lng
          );
          if (d < minDistance) {
            minDistance = d;
            assignedPorter = porter;
          }
        }
      });

      // Create booking (assign porter if found)
      const booking = await PorterOrder.create({
        customer,
        pickupAddress,
        pickupLat,
        pickupLng,
        dropAddress,
        dropLat,
        dropLng,
        vehicleType,
        fare,
        distance,
        instructions,
        estimatedArrivalTime: estimatedArrivalTime ? new Date(estimatedArrivalTime) : undefined,
        paymentStatus: 'pending',
        status: assignedPorter ? 'in-progress' : 'pending',
        porter: assignedPorter ? assignedPorter._id : null
      });

      res.status(201).json({
        message: assignedPorter ? 'Booking created and porter assigned' : 'Booking created, no porter available',
        booking,
        assignedPorter: assignedPorter ? {
          id: assignedPorter._id,
          user: assignedPorter.user,
          vehicleType: assignedPorter.vehicleType,
          currentLocation: assignedPorter.currentLocation,
          rating: assignedPorter.rating
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  },
  // Get booking by ID
  getBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await PorterOrder.findById(id)
        .populate({ path: 'porter', populate: { path: 'user' } })
        .populate('customer');
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ booking });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
  },
  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatuses = ['pending', 'in-progress', 'on-the-way', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      const booking = await PorterOrder.findByIdAndUpdate(
        id,
        { status, updatedAt: Date.now() },
        { new: true }
      )
        .populate({ path: 'porter', populate: { path: 'user' } })
        .populate('customer');
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
      res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
  },
  // List bookings for user
  listUserBookings: async (req, res) => {
    try {
      const { userId } = req.params;
      const bookings = await PorterOrder.find({ customer: userId })
        .sort({ createdAt: -1 })
        .populate({ path: 'porter', populate: { path: 'user' } })
        .populate('customer');
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
  }
}; 