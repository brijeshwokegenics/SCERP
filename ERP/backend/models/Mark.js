const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  classRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes',
    required: true
  },
  section: {
    type: String, // Since section is a string inside the Classes schema
    required: true
  },
  examRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subjectRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  studentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mark', markSchema);
