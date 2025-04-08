const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomUniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Dormitory'], // You can customize these options
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true,
  },
  bedCapacity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
