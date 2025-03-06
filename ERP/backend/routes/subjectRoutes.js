const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectContoller.js') ;
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');



router.get('/',auth, isSchoolAdmin,  getSubjects); // Get all subjects
router.get("/:id", auth, isSchoolAdmin,  getSubjectById); // Get subject by ID
router.post('/', auth, isSchoolAdmin,  createSubject); // Create a subject
router.put("/:id",auth, isSchoolAdmin,  updateSubject); // Update a subject
router.delete("/:id",auth, isSchoolAdmin,  deleteSubject); // Delete a subject

module.exports = router;
