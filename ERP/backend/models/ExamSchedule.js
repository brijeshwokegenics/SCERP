const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for storing the exam schedule for different classes
const examScheduleSchema = new Schema({
  date: { type: Date, required: true },
  day: { type: String, required: true },
  exams: [
    {
      class: { type: String, required: true }, // Example: "Class 1", "Class 2", etc.
      subject: { type: String, required: false } // Subject name (can be empty for preparatory leave)
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
