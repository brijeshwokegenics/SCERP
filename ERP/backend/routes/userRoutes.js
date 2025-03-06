// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { isSuperAdmin, isSchoolAdmin } = require('../middlewares/roles');
const {
  createSchoolAdmin,
  fetchSchoolAdmins,
  updateSchoolAdmin,
  deleteSchoolAdmin,
  createStaff,
  fetchStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/userController');



// SUPER ADMIN routes
router.post('/school-admin', auth, isSuperAdmin, createSchoolAdmin);
router.get('/school-admin', auth, isSuperAdmin, fetchSchoolAdmins);
router.put('/school-admin/:adminId', auth, isSuperAdmin, updateSchoolAdmin);
router.delete('/school-admin/:adminId', auth, isSuperAdmin, deleteSchoolAdmin);

// SCHOOL ADMIN routes
router.post('/staff', auth, isSchoolAdmin, createStaff);
router.get('/staff', auth,isSchoolAdmin, fetchStaff )
router.put('/staff/:staffId', auth, isSchoolAdmin, updateStaff);
router.delete('/staff/:staffId', auth, isSchoolAdmin, deleteStaff);

module.exports = router;
