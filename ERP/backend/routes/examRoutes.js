const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const upload = require('../middleware/upload');

router.post('/', upload.single('examSyllabus'), examController.createExam);
router.get('/', examController.getAllExams);
router.get('/:id', examController.getExamById);
router.put('/:id', upload.single('examSyllabus'), examController.updateExam);
router.delete('/:id', examController.deleteExam);

module.exports = router;
