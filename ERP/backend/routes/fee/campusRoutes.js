const express = require('express');
const router = express.Router();
const {
  createCampus,
  getAllCampuses,
  getCampusById,
  updateCampus,
  deleteCampus
} = require('../../controllers/feeControllers/campusControllers');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');

// @route POST /api/campuses
// @desc Create a new campus
router.post('/', auth, isSchoolAdmin, createCampus);

// @route GET /api/campuses
// @desc Get all campuses
router.get('/', auth, isSchoolAdmin, getAllCampuses);

// @route GET /api/campuses/:id
// @desc Get campus by ID
router.get('/:id', auth, isSchoolAdmin, getCampusById);

// @route PUT /api/campuses/:id
// @desc Update campus
router.put('/:id', auth, isSchoolAdmin, updateCampus);

// @route DELETE /api/campuses/:id
// @desc Delete campus
router.delete('/:id', auth, isSchoolAdmin, deleteCampus);

module.exports = router;
