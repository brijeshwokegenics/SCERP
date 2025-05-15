const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // refers to the Class model
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject', // refers to the Subject model
    required: true,
  },
  students: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
      },
      name: String,
      status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        default: 'Absent',
      },
      comment: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Attendance', studentAttendanceSchema);
