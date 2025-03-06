const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent", "Holiday", "Late"], default: "Undefined" },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;