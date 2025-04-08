// Expense Schema & Model
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for storing the exam schedule for different classes
const ExpenseSchema = new Schema({
    supplierName: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
    entries: [{
      amount: { type: Number, required: true },
      label: { type: String, required: true }
    }]
  }, { timestamps: true });


  module.exports  = mongoose.model('Expense', ExpenseSchema);