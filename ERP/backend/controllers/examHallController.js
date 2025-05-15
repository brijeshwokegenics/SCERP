const ExamHall = require('../models/ExamHall');

// Add new exam hall
exports.createExamHall = async (req, res) => {
  try {
    const { hallName, hallNumericValue, hallCapacity, description } = req.body;

    if (!hallName || !hallNumericValue || !hallCapacity) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const existing = await ExamHall.findOne({ hallNumericValue });
    if (existing) {
      return res.status(409).json({ message: 'Hall with this numeric value already exists' });
    }

    const newHall = new ExamHall({ hallName, hallNumericValue, hallCapacity, description });
    await newHall.save();

    res.status(201).json({ message: 'Exam Hall added successfully', data: newHall });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add hall', error: error.message });
  }
};

// Get all exam halls
exports.getAllExamHalls = async (req, res) => {
  try {
    const halls = await ExamHall.find().sort({ createdAt: -1 });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch halls', error: error.message });
  }
};

// Get hall by ID
exports.getExamHallById = async (req, res) => {
  try {
    const hall = await ExamHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hall', error: error.message });
  }
};

// Update hall
exports.updateExamHall = async (req, res) => {
  try {
    const updated = await ExamHall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Hall updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update hall', error: error.message });
  }
};

// Delete hall
exports.deleteExamHall = async (req, res) => {
  try {
    await ExamHall.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete hall', error: error.message });
  }
};
