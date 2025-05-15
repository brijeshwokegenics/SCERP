const mongoose = require("mongoose");

const feeComponentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['class', 'stream', 'exam', 'transport', 'admission', 'book_copy', 'hostel', 'sports', 'miscellaneous'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes',
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true },  // 💡 New field: Specific Student if applicable
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  recurrenceType: {
    type: String,
    enum: ['One Time', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly'],
    required: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tax: {
    type: Number,
    min: 0,
    default: 0
  },
  extraCharges: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
  _id: true
});

const feeStructureSchema = new mongoose.Schema({
  academicYear: {
    type: String, 
    required: true,
    trim: true,
  },
  components: [feeComponentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
}, {
  timestamps: true,
});

module.exports = {
  FeeStructure: mongoose.model('FeeStructures', feeStructureSchema),
  FeeComponent: mongoose.model('FeeComponents', feeComponentSchema)
};
