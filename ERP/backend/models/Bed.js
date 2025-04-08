const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  bedUniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  charge: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied'],
    default: 'Available',
  }
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
