const express = require('express');
const router = express.Router();
const {
  createReportEntry,
  getCollectionReport,
  getDuesReport,
  getReportById,
  updateReport,
  deleteReport
} = require('../../controllers/feeControllers/reportController');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');

// @route POST /api/reports
// @desc Create a manual report entry
router.post('/', auth, isSchoolAdmin, createReportEntry);

// @route GET /api/reports/collection
// @desc Get total fee collection report
router.get('/collection', auth, isSchoolAdmin, getCollectionReport);

// @route GET /api/reports/dues
// @desc Get dues report
router.get('/dues', auth, isSchoolAdmin, getDuesReport);

// @route GET /api/reports/:id
// @desc Get a report by ID
router.get('/:id', auth, isSchoolAdmin, getReportById);

// @route PUT /api/reports/:id
// @desc Update a report entry
router.put('/:id', auth, isSchoolAdmin, updateReport);

// @route DELETE /api/reports/:id
// @desc Delete a report entry
router.delete('/:id', auth, isSchoolAdmin, deleteReport);

module.exports = router;
