const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/',auth, isSchoolAdmin,  roomController.createRoom);
router.get('/',auth, isSchoolAdmin,  roomController.getAllRooms);
router.get('/:id',auth, isSchoolAdmin,  roomController.getRoomById);
router.put('/:id',auth, isSchoolAdmin,  roomController.updateRoom);
router.delete('/:id',auth, isSchoolAdmin,  roomController.deleteRoom);

module.exports = router;
