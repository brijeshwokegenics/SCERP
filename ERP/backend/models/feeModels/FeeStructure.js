const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  className: { type: String, required: true },
  stream: { type: String }, // Optional (for +2 level)
  academicYear: { type: String, required: true },
  feeComponents: [
    {
      name: { type: String, required: true }, // Tuition Fee, Transport Fee, etc.
      amount: { type: Number, required: true },
      isOptional: { type: Boolean, default: false } // For optional fees like Transport
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Audit log
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' }, // Multi-campus support
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
