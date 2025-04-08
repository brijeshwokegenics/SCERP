const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  sendMail: {
    type: Boolean,
    default: false,
  },
  sendSMS: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Holiday', holidaySchema);
