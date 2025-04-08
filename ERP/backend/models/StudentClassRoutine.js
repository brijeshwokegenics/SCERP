// models/Route.js
const mongoose = require("mongoose");

const studentRoutineSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classes",
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  days: {
    type: [String], // e.g., ['Monday', 'Wednesday']
    required: true,
  },
  startTime: {
    type: String, // You can use Date type too if using actual time objects
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("StudentClassRoutine", studentRoutineSchema);
