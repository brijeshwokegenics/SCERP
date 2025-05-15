const express = require('express');
const router = express.Router();
const {
  createHostelFee,
  getAllHostelFees,
  getHostelFeeById,
  updateHostelFee,
  deleteHostelFee
} = require('../../controllers/feeControllers/hostelFeeController');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');

// @route POST /api/hostel-fees
// @desc Create a new hostel fee entry
router.post('/',  auth, isSchoolAdmin, createHostelFee);

// @route GET /api/hostel-fees
// @desc Get all hostel fee records
router.get('/', auth, isSchoolAdmin, getAllHostelFees);

// @route GET /api/hostel-fees/:id
// @desc Get hostel fee by ID
router.get('/:id', auth, isSchoolAdmin, getHostelFeeById);

// @route PUT /api/hostel-fees/:id
// @desc Update hostel fee
router.put('/:id', auth, isSchoolAdmin, updateHostelFee);

// @route DELETE /api/hostel-fees/:id
// @desc Delete hostel fee
router.delete('/:id', auth, isSchoolAdmin, deleteHostelFee);

module.exports = router;
