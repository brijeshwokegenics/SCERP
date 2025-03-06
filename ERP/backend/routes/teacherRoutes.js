const express = require("express");
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
  filterTeachers
} = require("../controllers/teacherController");
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');

const router = express.Router();

router.post("/teacher", auth, isSchoolAdmin, createTeacher); // Create teacher
router.get("/teacher", auth, isSchoolAdmin, getAllTeachers); // Get all teachers
router.get("/teacher/search", auth, isSchoolAdmin, searchTeachers); // Search teachers by name, email, subject
router.get("/teacher/filter", auth, isSchoolAdmin, filterTeachers); // Filter teachers
router.get("/teacher/:id", auth, isSchoolAdmin, getTeacherById); // Get teacher by ID
router.put("/teacher/:id", auth, isSchoolAdmin, updateTeacher); // Update teacher
router.delete("/teacher/:id", auth, isSchoolAdmin, deleteTeacher); // Delete teacher

module.exports = router;
