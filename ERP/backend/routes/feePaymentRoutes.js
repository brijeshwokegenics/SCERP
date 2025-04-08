// routes/feePaymentRoutes.js
const express = require('express');
const router = express.Router();
const feePaymentController = require('../controllers/feePaymentController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');



router.post('/', auth, isSchoolAdmin,  feePaymentController.createFeePayment);
router.get('/', auth, isSchoolAdmin,  feePaymentController.getAllFeePayments);
router.get('/:id', auth, isSchoolAdmin,  feePaymentController.getFeePaymentById);
router.put('/:id', auth, isSchoolAdmin,  feePaymentController.updateFeePayment);
router.delete('/:id', auth, isSchoolAdmin,  feePaymentController.deleteFeePayment);

module.exports = router;
