// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageTo: {
    type: String,
    enum: ['Students', 'Teachers', 'Parents'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subject: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  attachment: {
    type: String // store file path or cloud link
  },
  sendMail: {
    type: Boolean,
    default: false
  },
  sendSMS: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);