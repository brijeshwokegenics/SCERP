const Classes = require('../models/Classes');

// Add a new class
exports.addClass = async (req, res) => {
  try {
    const { className, classNumericValue, studentCapacity } = req.body;

    if (!className || !classNumericValue || !studentCapacity) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingClass = await Classes.findOne({ classNumericValue });
    if (existingClass) {
      return res.status(409).json({ message: 'Class with this numeric value already exists.' });
    }

    const newClass = new Class({ className, classNumericValue, studentCapacity });
    await newClass.save();

    res.status(201).json({ message: 'Class added successfully', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add class', error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classes.find().sort({ classNumericValue: 1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch classes', error: error.message });
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await Classes.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch class', error: error.message });
  }
};

// Update class by ID
exports.updateClass = async (req, res) => {
  try {
    const { className, classNumericValue, studentCapacity, ClassSection } = req.body;

    const updated = await Classes.findByIdAndUpdate(
      req.params.id,
      { className, classNumericValue, studentCapacity, ClassSection },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ message: 'Class updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update class', error: error.message });
  }
};

// Delete class by ID
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Classes.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete class', error: error.message });
  }
};
