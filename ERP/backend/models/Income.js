// Income Schema & Model
const mongoose = require("mongoose");
const IncomeSchema = new mongoose.Schema({
    class: { type: String, required: true },
    classSection: { type: String },
    student: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
    entries: [{
      amount: { type: Number, required: true },
      label: { type: String, required: true }
    }]
  }, { timestamps: true });


  module.exports =  mongoose.model('Income', IncomeSchema);