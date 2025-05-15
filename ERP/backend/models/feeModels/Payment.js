const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  academicYear: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['Cash', 'Card', 'UPI', 'Cheque', 'BankTransfer'], required: true },
  receiptNumber: { type: String, required: true, unique: true }, // Auto Invoice Number
  transactionId: { type: String }, // For online payment
  remarks: { type: String },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Audit log
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' }, // Multi-campus support
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', paymentSchema);
