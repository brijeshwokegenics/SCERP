const Holiday = require('../models/Holiday');

// Add a holiday
exports.addHoliday = async (req, res) => {
  try {
    const { title, description, startDate, endDate, sendMail, sendSMS } = req.body;

    const holiday = new Holiday({
      title,
      description,
      startDate,
      endDate,
      sendMail: sendMail || false,
      sendSMS: sendSMS || false,
    });

    const savedHoliday = await holiday.save();
    res.status(201).json({ message: 'Holiday added successfully', data: savedHoliday });
  } catch (err) {
    res.status(500).json({ message: 'Error adding holiday', error: err.message });
  }
};

// Get all holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching holidays', error: err.message });
  }
};

// Delete holiday
exports.deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ message: 'Holiday deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting holiday', error: err.message });
  }
};
