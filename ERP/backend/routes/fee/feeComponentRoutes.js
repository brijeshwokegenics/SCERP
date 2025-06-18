const express = require('express');
const router = express.Router();
const {
  createFeeComponent,
  getAllFeeComponents,
  getFeeComponentById,
  updateFeeComponent,
  deleteFeeComponent,
} = require('../../controllers/feeControllers/feeComponentController');

const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');


router.post('/', auth, isSchoolAdmin,  createFeeComponent);
router.get('/', auth, isSchoolAdmin,  getAllFeeComponents);
router.get('/:id', auth, isSchoolAdmin,  getFeeComponentById);
router.put('/:id', auth, isSchoolAdmin,  updateFeeComponent);
router.delete('/:id', auth, isSchoolAdmin,  deleteFeeComponent);

module.exports = router;
