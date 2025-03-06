const express = require('express');
const router = express.Router();
const examScheduleController = require('../controllers/examScheduleController');

// Define routes for exam schedule
router.post('/', examScheduleController.createExamSchedule); // Create a new exam schedule
router.get('/', examScheduleController.getAllExamSchedules); // Get all exam schedules
router.get('/:date', examScheduleController.getExamScheduleByDate); // Get a schedule by date
router.put('/:id', examScheduleController.updateExamSchedule); // Update an exam schedule
router.delete('/:id', examScheduleController.deleteExamSchedule); // Delete an exam schedule

module.exports = router;
