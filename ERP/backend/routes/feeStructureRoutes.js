const express = require('express');
const router = express.Router();
const feeStructureController = require('../controllers/feeStructureController');

// ✅ FeeStructure CRUD
router.post('/', feeStructureController.createFeeStructure);
router.get('/', feeStructureController.getAllFeeStructures);
router.get('/:id', feeStructureController.getFeeStructureById);
router.put('/:id', feeStructureController.updateFeeStructure);
router.delete('/:id', feeStructureController.deleteFeeStructure);

module.exports = router;
