// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/payments',auth, isSchoolAdmin, paymentController.createPayment);
router.get('/payments',auth, isSchoolAdmin, paymentController.getPayments);
router.get('/payments/:id',auth, isSchoolAdmin, paymentController.getPaymentById);
router.put('/payments/:id',auth, isSchoolAdmin, paymentController.updatePayment);
router.delete('/payments/:id',auth, isSchoolAdmin, paymentController.deletePayment);

module.exports = router;