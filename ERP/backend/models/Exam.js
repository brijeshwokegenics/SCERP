const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  sectionName: {
    type: String
  },
  examTerm: [{
    type: String,
    required: true
  }],
  passingMarks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  examStartDate: {
    type: Date,
    required: true
  },
  examEndDate: {
    type: Date,
    required: true
  },
  examComment: {
    type: String
  },
  examSyllabus: {
    type: String // Path or URL to the uploaded file
  },
  sendMailToParentsAndStudents: {
    type: Boolean,
    default: false
  },
  sendSMSToStudents: {
    type: Boolean,
    default: false
  },
  sendSMSToParents: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', ExamSchema);
