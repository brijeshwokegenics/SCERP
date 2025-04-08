const Exam = require('../models/Exam');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const {
      examName,
      className,
      sectionName,
      examTerm,
      passingMarks,
      totalMarks,
      examStartDate,
      examEndDate,
      examComment,
      sendMailToParentsAndStudents,
      sendSMSToStudents,
      sendSMSToParents
    } = req.body;

    const examSyllabus = req.file ? req.file.filename : null;

    const newExam = new Exam({
      examName,
      className,
      sectionName,
      examTerm,
      passingMarks,
      totalMarks,
      examStartDate,
      examEndDate,
      examComment,
      examSyllabus,
      sendMailToParentsAndStudents,
      sendSMSToStudents,
      sendSMSToParents
    });

    await newExam.save();
    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

// Update exam by ID
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const {
      examName,
      className,
      sectionName,
      examTerm,
      passingMarks,
      totalMarks,
      examStartDate,
      examEndDate,
      examComment,
      sendMailToParentsAndStudents,
      sendSMSToStudents,
      sendSMSToParents
    } = req.body;

    if (req.file) {
      exam.examSyllabus = req.file.filename;
    }

    Object.assign(exam, {
      examName,
      className,
      sectionName,
      examTerm,
      passingMarks,
      totalMarks,
      examStartDate,
      examEndDate,
      examComment,
      sendMailToParentsAndStudents,
      sendSMSToStudents,
      sendSMSToParents
    });

    await exam.save();
    res.status(200).json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

// Delete exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};
