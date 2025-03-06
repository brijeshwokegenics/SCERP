const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/teacherAttendanceController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// Attendance summary routes
router.post('/summary', auth, isSchoolAdmin,  attendanceController.createOrUpdateSummary);
router.get('/summary/:staffId/:month/:year', auth, isSchoolAdmin,  attendanceController.getSummary);
router.get('/summaries', auth, isSchoolAdmin,  attendanceController.getAllSummaries);
router.delete('/summary/:id', auth, isSchoolAdmin,  attendanceController.deleteSummary);

// Attendance record routes
router.post('/attendance', auth, isSchoolAdmin,  attendanceController.createOrUpdateAttendance);
router.get('/attendance/:staffId/:date', auth, isSchoolAdmin,  attendanceController.getAttendance);
router.get('/attendances', auth, isSchoolAdmin,  attendanceController.getAllAttendance);
router.delete('/attendance/:id', auth, isSchoolAdmin,  attendanceController.deleteAttendance);

module.exports = router;
