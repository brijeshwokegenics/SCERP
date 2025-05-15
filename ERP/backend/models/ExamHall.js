const mongoose = require('mongoose');

const ExamHallSchema = new mongoose.Schema({
  hallName: {
    type: String,
    required: true,
    trim: true
  },
  hallNumericValue: {
    type: Number,
    required: true,
    unique: true
  },
  hallCapacity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamHall', ExamHallSchema);

