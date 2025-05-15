const express = require('express');
const router = express.Router();
const markController = require('../controllers/markController');

// POST /api/marks
router.post('/', markController.createMark);

// GET /api/marks
router.get('/', markController.getAllMarks);

// GET /api/marks/:id
router.get('/:id', markController.getMarkById);

// PUT /api/marks/:id
router.put('/:id', markController.updateMark);

// DELETE /api/marks/:id
router.delete('/:id', markController.deleteMark);

module.exports = router;
