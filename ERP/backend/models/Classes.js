const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  classNumericValue: {
    type: Number,
    required: true,
    unique: true
  },
  studentCapacity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Classes', classSchema);
