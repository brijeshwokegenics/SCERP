const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/',auth, isSchoolAdmin,  hostelController.addHostel);
router.get('/',auth, isSchoolAdmin,  hostelController.getAllHostels);
router.get('/:id',auth, isSchoolAdmin,  hostelController.getHostelById);
router.put('/:id',auth, isSchoolAdmin,  hostelController.updateHostel);
router.delete('/:id',auth, isSchoolAdmin,  hostelController.deleteHostel);

module.exports = router;
