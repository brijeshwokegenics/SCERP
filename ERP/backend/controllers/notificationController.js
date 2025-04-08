const Notification = require('../models/Notification');

// Create Notification
exports.addNotification = async (req, res) => {
  try {
    const { class: className, section, users, title, message } = req.body;

    const notification = new Notification({
      class: className,
      section,
      users,
      title,
      message
    });

    await notification.save();
    res.status(201).json({ message: 'Notification added successfully', notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Single Notification
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Notification
exports.updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification updated successfully', updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
