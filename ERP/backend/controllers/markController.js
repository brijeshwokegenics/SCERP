const Mark = require('../models/Mark');

// Create a new mark entry
exports.createMark = async (req, res) => {
  try {
    const newMark = new Mark(req.body);
    await newMark.save();
    res.status(201).json({ message: 'Mark created successfully', data: newMark });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mark', error: error.message });
  }
};

// Get all marks
exports.getAllMarks = async (req, res) => {
  try {
    const marks = await Mark.find()
      .populate('classRef')
      .populate('examRef')
      .populate('subjectRef')
      .populate('studentRef');
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch marks', error: error.message });
  }
};

// Get mark by ID
exports.getMarkById = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id)
      .populate('classRef')
      .populate('examRef')
      .populate('subjectRef')
      .populate('studentRef');
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    res.status(200).json(mark);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mark', error: error.message });
  }
};

// Update mark
exports.updateMark = async (req, res) => {
  try {
    const updatedMark = await Mark.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedMark) return res.status(404).json({ message: 'Mark not found' });
    res.status(200).json({ message: 'Mark updated', data: updatedMark });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update mark', error: error.message });
  }
};

// Delete mark
exports.deleteMark = async (req, res) => {
  try {
    const deletedMark = await Mark.findByIdAndDelete(req.params.id);
    if (!deletedMark) return res.status(404).json({ message: 'Mark not found' });
    res.status(200).json({ message: 'Mark deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mark', error: error.message });
  }
};
