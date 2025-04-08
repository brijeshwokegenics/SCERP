const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/exams/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx' || ext === '.doc') {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx formats allowed'));
  }
};

module.exports = multer({ storage, fileFilter });
