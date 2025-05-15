const mongoose = require('mongoose');

const hostelFeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  hostelName: { type: String, required: true },
  roomNumber: { type: String },
  monthlyRent: { type: Number, required: true },
  foodCharges: { type: Number },
  totalMonthlyFee: { type: Number, required: true },
  paymentHistory: [
    {
      month: { type: String, required: true }, // e.g., "April 2025"
      amountPaid: { type: Number, required: true },
      paymentDate: { type: Date, default: Date.now },
      receiptNumber: { type: String, required: true }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('HostelFee', hostelFeeSchema);
