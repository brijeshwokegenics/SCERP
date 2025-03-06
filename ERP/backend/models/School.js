const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  website: { type: String },
  principal: { type: String },
  address:{ type: String },
  slogan:{ type: String },
  terms:{ type: String },
  conditions:{ type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', SchoolSchema);
