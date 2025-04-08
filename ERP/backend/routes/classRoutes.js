const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/add', auth, isSchoolAdmin,  classController.addClass);
router.get('/', auth, isSchoolAdmin,  classController.getAllClasses);
router.get('/:id', auth, isSchoolAdmin,  classController.getClassById);
router.put('/:id', auth, isSchoolAdmin,  classController.updateClass);
router.delete('/:id', auth, isSchoolAdmin,  classController.deleteClass);

module.exports = router;
