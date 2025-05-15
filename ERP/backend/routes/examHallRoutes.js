const express = require('express');
const router = express.Router();
const examHallController = require('../controllers/examHallController');

// Create
router.post('/', examHallController.createExamHall);

// Read
router.get('/', examHallController.getAllExamHalls);
router.get('/:id', examHallController.getExamHallById);

// Update
router.put('/:id', examHallController.updateExamHall);

// Delete
router.delete('/:id', examHallController.deleteExamHall);

module.exports = router;
