const Notice = require('../models/Notice');

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json({ success: true, message: 'Notice created successfully', data: notice });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating notice', error: error.message });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notices', error: error.message });
  }
};

// Get single notice
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notice', error: error.message });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.json({ success: true, message: 'Notice updated', data: notice });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating notice', error: error.message });
  }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notice', error: error.message });
  }
};
