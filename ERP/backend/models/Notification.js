const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  class: { type: String, default: 'All' },
  section: { type: String, default: 'All' },
  users: { type: String, default: 'All' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
