const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  noticeFor: {
    type: String,
    enum: ['All', 'Students', 'Teachers', 'Admins'], // Extend as per your use case
    default: 'All'
  },
  sendMail: {
    type: Boolean,
    default: false
  },
  sendSMS: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', NoticeSchema);
