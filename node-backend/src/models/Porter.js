const mongoose = require('mongoose');

const PorterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleType: { type: String, enum: ['bike', 'auto', 'mini-truck'], required: true },
  licenseNumber: { type: String },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  rating: { type: Number, default: 0 },
  phoneNumber: String,
  profilePhoto: String,
  vehicleNumber: String,
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Porter', PorterSchema); 