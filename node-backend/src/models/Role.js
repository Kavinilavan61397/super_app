const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role; 