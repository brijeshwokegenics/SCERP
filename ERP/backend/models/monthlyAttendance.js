const mongoose = require('mongoose');

const monthlyAttendanceSummarySchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalAttendance: {
    type: Number,
    default: 0,
  },
  totalPresent: {
    type: Number,
    default: 0,
  },
  totalAbsent: {
    type: Number,
    default: 0,
  },
  totalIndefary: {
    type: Number,
    default: 0,
  },
});

const MonthlyAttendanceSummary = mongoose.model('MonthlyAttendanceSummary', monthlyAttendanceSummarySchema);

module.exports = MonthlyAttendanceSummary;