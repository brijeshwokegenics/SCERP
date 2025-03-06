const Teacher = require("../models/Teacher");
const mongoose = require("mongoose");
// Create a new teacher


exports.createTeacher = async (req, res) => {
  try {
    // Ensure `school` is an ObjectId
    if (req.body.school && typeof req.body.school === "object" && req.body.school.id) {
      req.body.school = new mongoose.Types.ObjectId(req.body.school.id);
    }

    const teacher = new Teacher(req.body);
    await teacher.save();

    res.status(201).json({ success: true, teacher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update teacher details
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search teachers by name, email, or subject
exports.searchTeachers = async (req, res) => {
  try {
    const { query } = req.query;
    const teachers = await Teacher.find({
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { subjects: { $in: [new RegExp(query, "i")] } }
      ]
    });

    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Filter teachers by department, experience, or active status
exports.filterTeachers = async (req, res) => {
  try {
    const { department, experience, isActive } = req.query;
    let filter = {};

    if (department) filter.departments = department;
    if (experience) filter.experience = { $gte: Number(experience) };
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const teachers = await Teacher.find(filter);
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
