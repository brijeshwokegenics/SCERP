const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  className: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  sectionName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  examTerm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TermCategory',
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  passingMarks: {
    type: Number,
    required: true,
  },
  examStartDate: {
    type: Date,
    required: true,
  },
  examEndDate: {
    type: Date,
    required: true,
  },
  examComment: {
    type: String,
  },
  examSyllabus: {
    type: String, // This will be a file path or URL to the uploaded file
  },
  notifyByMail: {
    type: Boolean,
    default: false,
  },
  notifyBySMSStudents: {
    type: Boolean,
    default: false,
  },
  notifyBySMSParents: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);

