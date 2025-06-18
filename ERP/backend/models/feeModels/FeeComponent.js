const mongoose = require('mongoose');

const feeComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'Admission Fee',
      'Tuition Fee',
      'Transport Fee',
      'Activity Fee',
      'Library Fee',
      'Miscellaneous Fee',
      'Exam Fee',
      'Hostel Fee',
      'Sports Fee',
      'Lab Fee',
      'uniform Fee',
      'other' // general-purpose
    ],
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  taxable: {
    type: Boolean,
    default: false, // ✅ Is GST applicable?
  },
  gstRate: {
    type: Number,
    default: 0, // ✅ GST % if applicable
    min: 0,
    max: 100,
  },  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  
}, { timestamps: true });

module.exports = mongoose.model('FeeComponent', feeComponentSchema);
