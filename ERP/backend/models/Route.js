const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true
  },
  time: {
    type: String, // Format: HH:mm AM/PM
    required: true
  }
});

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Pickup', 'Drop', 'Both'],
    default: 'Both'
  },
  stops: [stopSchema], // Array of stopName + time
  totalDistance: {
    type: Number, // in km
  },
  estimatedTime: {
    type: String, // e.g. "45 mins"
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
