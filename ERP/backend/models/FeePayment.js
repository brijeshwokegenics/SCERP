// models/FeePayment.js
const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema({
  recurrenceType: {
    type: String,
    enum: ['One Time', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  classSection: {
    type: String
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  feesType: {
    type: String
  },
  tax: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  sendSMSToStudent: {
    type: Boolean,
    default: false
  },
  sendSMSToParents: {
    type: Boolean,
    default: false
  },
  sendEmailToStudentsAndParents: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', FeePaymentSchema);
