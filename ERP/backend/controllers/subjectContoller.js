const Subject = require("../models/Subject");

// Get all subjects

exports.getSubjects = async (req, res) => {
  try {
      const subject = await Subject.find().populate("teacher", "firstName lastName");
      res.status(200).json(subject);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Get a single subject by ID
const mongoose = require("mongoose");

exports.getSubjectById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid subject ID" });
    }

    const subject = await Subject.findById(req.params.id).populate("teacher", "firstName lastName");
    if (!subject) {
      return res.status(404).json({ success: false, error: "Subject not found" });
    }
    return res.status(200).json({ success: true, data: subject });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


exports.createSubject = async (req, res) => {
  try {
    const { name, code, teacher, classes } = req.body;

    // Check if required fields are provided
    if (!name || !code || !teacher || !classes) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check for duplicate subject code
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ success: false, error: "Subject code already exists" });
    }

    const subject = new Subject(req.body);
    await subject.save();
    return res.status(201).json({ success: true, data: subject });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Update a subject by ID
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subject) {
      return res.status(404).json({ success: false, error: "Subject not found" });
    }
    return res.status(200).json({ success: true, data: subject });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, error: "Subject not found" });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
