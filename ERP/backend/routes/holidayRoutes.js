const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/', auth, isSchoolAdmin,   holidayController.addHoliday);
router.get('/',auth, isSchoolAdmin,  holidayController.getHolidays);
router.delete('/:id', auth, isSchoolAdmin,  holidayController.deleteHoliday);

module.exports = router;
