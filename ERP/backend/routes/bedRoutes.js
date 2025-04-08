const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/',auth, isSchoolAdmin,  bedController.createBed);
router.get('/',auth, isSchoolAdmin,  bedController.getAllBeds);
router.get('/:id',auth, isSchoolAdmin,  bedController.getBedById);
router.put('/:id',auth, isSchoolAdmin,  bedController.updateBed);
router.delete('/:id',auth, isSchoolAdmin,  bedController.deleteBed);

module.exports = router;
