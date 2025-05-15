const express = require('express');
const router = express.Router();
const feeComponentController = require('../controllers/feeComponentController');

// FeeComponent Routes
router.post('/:id/components', feeComponentController.addFeeComponent);
router.get('/:id/components', feeComponentController.getAllFeeComponents); // ✅ NEW
router.get('/:id/components/:componentId', feeComponentController.getFeeComponentById); // ✅ NEW
router.put('/:id/components/:componentId', feeComponentController.updateFeeComponent);
router.delete('/:id/components/:componentId', feeComponentController.deleteFeeComponent);

module.exports = router;
