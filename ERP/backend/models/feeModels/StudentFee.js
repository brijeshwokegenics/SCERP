const mongoose = require('mongoose');

const studentFeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  feeStructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
  academicYear: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  duesAmount: { type: Number, required: true },
  scholarshipDiscount: { type: Number, default: 0 }, // Any scholarship applied
  lateFine: { type: Number, default: 0 }, // Late fine auto calculated
  advanceAmount: { type: Number, default: 0 }, // Future payments
  ledger: [
    {
      type: { type: String, enum: ['Payment', 'Fine', 'Discount', 'Advance'], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      remarks: { type: String },
    }
  ],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Audit log
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' }, // Multi-campus support
}, { timestamps: true });

module.exports = mongoose.model('StudentFee', studentFeeSchema);
