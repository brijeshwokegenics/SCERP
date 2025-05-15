const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
  getAllFeeStructures,
  updateFeeStructure,
  deleteFeeStructure
} = require('../../controllers/feeControllers/feeStructureController');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');

// Create
router.post('/', auth, isSchoolAdmin, createFeeStructure);

// Get All
router.get('/', auth, isSchoolAdmin, getAllFeeStructures);

// Update
router.put('/:id', auth, isSchoolAdmin, updateFeeStructure);

// Delete
router.delete('/:id', auth, isSchoolAdmin, deleteFeeStructure);

module.exports = router;
