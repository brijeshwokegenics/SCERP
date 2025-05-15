const mongoose = require('mongoose');

const TermCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('TermCategory', TermCategorySchema);
