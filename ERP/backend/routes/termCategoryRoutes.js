const express = require('express');
const router = express.Router();
const termCategoryController = require('../controllers/termCategoryController');

// Routes
router.post('/', termCategoryController.createTermCategory);
router.get('/', termCategoryController.getAllTermCategories);
router.get('/:id', termCategoryController.getTermCategoryById);
router.put('/:id', termCategoryController.updateTermCategory);
router.delete('/:id', termCategoryController.deleteTermCategory);

module.exports = router;
