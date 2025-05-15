const Grade = require('../models/Grade');

// Create Grade
exports.createGrade = async (req, res) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.status(201).json({ message: 'Grade added successfully', data: grade });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add grade', error: error.message });
  }
};

// Get All Grades
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().sort({ markFrom: 1 });
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grades', error: error.message });
  }
};

// Get Grade By ID
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.status(200).json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch grade', error: error.message });
  }
};

// Update Grade
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.status(200).json({ message: 'Grade updated successfully', data: grade });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update grade', error: error.message });
  }
};

// Delete Grade
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.status(200).json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete grade', error: error.message });
  }
};
