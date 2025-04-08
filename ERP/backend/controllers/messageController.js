const Message = require('../models/Message');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const {
      messageTo,
      class: className,
      section,
      users,
      subject,
      comment,
      sendMail,
      sendSMS
    } = req.body;

    const attachment = req.file ? req.file.path : null;

    const newMessage = new Message({
      messageTo,
      class: className,
      section,
      users,
      subject,
      comment,
      attachment,
      sendMail,
      sendSMS
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('users');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('users');
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.attachment = req.file.path;
    }
    const message = await Message.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
