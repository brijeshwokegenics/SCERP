const Exam = require('../models/Exam');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const {
      examName,
      className,
      sectionName,
      examTerm,
      totalMarks,
      passingMarks,
      examStartDate,
      examEndDate,
      examComment,
      notifyByMail,
      notifyBySMSStudents,
      notifyBySMSParents
    } = req.body;

    const examSyllabus = req.file ? req.file.path : null;

    const exam = new Exam({
      examName,
      className,
      sectionName,
      examTerm,
      totalMarks,
      passingMarks,
      examStartDate,
      examEndDate,
      examComment,
      examSyllabus,
      notifyByMail,
      notifyBySMSStudents,
      notifyBySMSParents
    });

    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', data: exam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('className')
      .populate('sectionName')
      .populate('examTerm');
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('className')
      .populate('sectionName')
      .populate('examTerm');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) updatedData.examSyllabus = req.file.path;

    const exam = await Exam.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Exam updated successfully', data: exam });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};
