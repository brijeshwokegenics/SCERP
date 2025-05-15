const mongoose = require('mongoose');

const feeComponentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  taxable: { type: Boolean, default: false }, // GST Applicable?
  gstRate: { type: Number, default: 0 }, // GST Rate if applicable
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FeeComponent', feeComponentSchema);
