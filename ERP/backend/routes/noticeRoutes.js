const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');



router.post('/notices',auth, isSchoolAdmin, noticeController.createNotice);
router.get('/notices',auth, isSchoolAdmin, noticeController.getAllNotices);
router.get('/notices/:id',auth, isSchoolAdmin, noticeController.getNoticeById);
router.put('/notices/:id',auth, isSchoolAdmin, noticeController.updateNotice);
router.delete('/notices/:id',auth, isSchoolAdmin, noticeController.deleteNotice);

module.exports = router;
