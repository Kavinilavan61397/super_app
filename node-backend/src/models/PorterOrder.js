const mongoose = require('mongoose');

const PorterOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  porter: { type: mongoose.Schema.Types.ObjectId, ref: 'Porter' },
  pickupAddress: String,
  pickupLat: Number,
  pickupLng: Number,
  dropAddress: String,
  dropLat: Number,
  dropLng: Number,
  vehicleType: { type: String, enum: ['bike', 'auto', 'mini-truck'], required: true },
  fare: Number,
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-the-way'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  distance: Number,
  estimatedArrivalTime: Date,
  instructions: String,
  cancelReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PorterOrder', PorterOrderSchema); 