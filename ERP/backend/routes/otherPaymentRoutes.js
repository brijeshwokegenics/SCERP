const express = require('express');
const router = express.Router();
const otherPaymentController = require('../controllers/OtherPaymentController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// Routes
router.post('/', auth, isSchoolAdmin,  otherPaymentController.createPayment);
router.get('/', auth, isSchoolAdmin,  otherPaymentController.getAllPayments);
router.get('/:id', auth, isSchoolAdmin,  otherPaymentController.getPaymentById);
router.put('/:id',  auth, isSchoolAdmin, otherPaymentController.updatePayment);
router.delete('/:id', auth, isSchoolAdmin,  otherPaymentController.deletePayment);

module.exports = router;
