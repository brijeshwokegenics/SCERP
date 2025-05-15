const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Campus', campusSchema);
