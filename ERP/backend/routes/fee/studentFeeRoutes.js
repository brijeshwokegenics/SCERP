const express = require('express');
const router = express.Router();
const {
  assignFeeStructure,
  getStudentFee,
  updateStudentFee,
  getStudentLedger
} = require('../../controllers/feeControllers/studentFeeController');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');


// Assign Fee Structure
router.post('/assign', auth, isSchoolAdmin, assignFeeStructure);

// Get Fee by StudentId
router.get('/:studentId', auth, isSchoolAdmin, getStudentFee);

// Update Fee by StudentId
router.put('/:studentId', auth, isSchoolAdmin, updateStudentFee);

// Get Ledger
router.get('/ledger/:studentId', auth, isSchoolAdmin, getStudentLedger);

module.exports = router;
