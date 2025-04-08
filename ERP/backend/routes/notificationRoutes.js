const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');

router.post('/',auth, isSchoolAdmin,  notificationController.addNotification);                // CREATE
router.get('/',auth, isSchoolAdmin,  notificationController.getNotifications);               // READ ALL
router.get('/:id',auth, isSchoolAdmin,  notificationController.getNotificationById);         // READ ONE
router.put('/:id',auth, isSchoolAdmin,  notificationController.updateNotification);          // UPDATE
router.delete('/:id',auth, isSchoolAdmin,  notificationController.deleteNotification);       // DELETE

module.exports = router;
