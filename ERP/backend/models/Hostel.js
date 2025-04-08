const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true
  },
  hostelType: {
    type: String,
    required: true
  },
  hostelAddress: {
    type: String,
    default: ''
  },
  intakeCapacity: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
