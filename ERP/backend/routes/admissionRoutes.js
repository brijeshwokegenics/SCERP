const express = require('express');
const router = express.Router();
const {
  getAdmissions,
  createAdmission,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  viewStudentsList,
  viewStudentDetails,
  generateStudentIdCard,
  generateVehiclePass,
  promoteStudents
} = require('../controllers/admissionController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');

// Routes with authentication
router.get('/admissions', auth, isSchoolAdmin, getAdmissions);
router.post('/admissions', auth, isSchoolAdmin, createAdmission);
router.get('/admissions/:id', auth, isSchoolAdmin, getAdmissionById)
router.put('/admissions/:id', auth, isSchoolAdmin, updateAdmission)
router.delete('/admissions/:id', auth,isSchoolAdmin, deleteAdmission);

// New routes for viewing and generating
router.get('/students/list', auth, isSchoolAdmin, viewStudentsList);
router.get('/students/details/:id', auth, isSchoolAdmin, viewStudentDetails);

// PDF generation routes
router.post('/students/generate-idcard', auth, isSchoolAdmin, generateStudentIdCard);
router.post('/students/generate-vehicle-pass', auth, isSchoolAdmin, generateVehiclePass);

router.post('/promotes', auth, isSchoolAdmin, promoteStudents);

module.exports = router;
