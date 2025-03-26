const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
    trim: true
  },
  pickupStop: {
    type: String,
    required: true
  },
  dropStop: {
    type: String,
    required: true
  },
  pickupTime: {
    type: String, // Format: HH:mm AM/PM
    required: true
  },
  dropTime: {
    type: String, // Format: HH:mm AM/PM
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverContact: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, 'Enter a valid mobile number']
  },
  attendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // If a teacher is assigned as the bus attendant
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transport', transportSchema);
