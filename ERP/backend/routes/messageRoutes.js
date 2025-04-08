
// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/compose', upload.single('attachment'),auth, isSchoolAdmin, messageController.createMessage);
router.get('/',auth, isSchoolAdmin, messageController.getAllMessages);
router.get('/:id',auth, isSchoolAdmin, messageController.getMessageById);
router.put('/:id',auth, isSchoolAdmin, upload.single('attachment'), messageController.updateMessage);
router.delete('/:id',auth, isSchoolAdmin, messageController.deleteMessage);

module.exports = router;