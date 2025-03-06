const express = require('express');
const router = express.Router();
const {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// Route to create a new school
router.post('/',  auth, isSchoolAdmin, createSchool);

// Route to retrieve all schools
router.get('/', auth, isSchoolAdmin,  getSchools);

// Route to retrieve a single school by its ID
router.get('/:id', auth, isSchoolAdmin,  getSchool);

// Route to update a school by its ID
router.put('/:id', auth, isSchoolAdmin,  updateSchool);

// Route to delete a school by its ID
router.delete('/:id', auth, isSchoolAdmin,  deleteSchool);

module.exports = router;
