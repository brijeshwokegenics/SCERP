const mongoose = require('mongoose');

const OtherPaymentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    class: { type: String, required: true },
    classSection: { type: String },
    student: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: String },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
    description: { type: String }
  }, { timestamps: true });

  module.exports =  mongoose.model('OtherPayment', OtherPaymentSchema);
  