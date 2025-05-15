const express = require('express');
const router = express.Router();
const { collectPayment,
    downloadReceipt,
    getAllPayments,
    getPaymentById,
    deletePayment } = require('../../controllers/feeControllers/paymentController');
    const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
    const { isSchoolAdmin } = require('../../middlewares/roles');
 // optional, if you have auth

// POST /api/payment/collect
router.post('/collect', auth, isSchoolAdmin, collectPayment);
router.get('/receipt/:id',auth, isSchoolAdmin, downloadReceipt);
router.get('/all', auth, isSchoolAdmin, getAllPayments);
// @route GET /api/payments/:id
// @desc Get single payment by ID
router.get('/:id', auth, isSchoolAdmin, getPaymentById);

// @route DELETE /api/payments/:id
// @desc Delete a payment record
router.delete('/:id', auth, isSchoolAdmin, deletePayment);

module.exports = router;
