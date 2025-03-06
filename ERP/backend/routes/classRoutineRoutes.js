const express = require("express");
const {
  createClassRoutine,
  getAllClassRoutines,
  getClassRoutineByClassAndSection,
  updateClassRoutine,
  deleteClassRoutine
} = require("../controllers/classRoutineController");

const router = express.Router();
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// 📌 Class Routine API Endpoints
router.post("/", auth, isSchoolAdmin,  createClassRoutine);  // ✅ Create a new routine
router.get("/", auth, isSchoolAdmin,  auth, isSchoolAdmin,  getAllClassRoutines);  // ✅ Get all routines
router.get("/:className/:section", auth, isSchoolAdmin,  getClassRoutineByClassAndSection);  // ✅ Get by class & section
router.put("/:id", auth, isSchoolAdmin,  updateClassRoutine);  // ✅ Update a routine
router.delete("/:id", auth, isSchoolAdmin,  deleteClassRoutine);  // ✅ Delete a routine

module.exports = router;
