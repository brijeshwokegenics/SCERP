const ExamSchedule = require('../models/ExamSchedule'); // Import ExamSchedule model

// Create a new exam schedule
exports.createExamSchedule = async (req, res) => {
  try {
    const { date, day, exams } = req.body;
    const newExamSchedule = new ExamSchedule({ date, day, exams });
    await newExamSchedule.save();
    res.status(201).json({ message: 'Exam schedule created successfully', data: newExamSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam schedule', error });
  }
};

// Get all exam schedules
exports.getAllExamSchedules = async (req, res) => {
  try {
    const schedules = await ExamSchedule.find();
    res.status(200).json({ message: 'Exam schedules retrieved successfully', data: schedules });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exam schedules', error });
  }
};

// Get exam schedule by date
exports.getExamScheduleByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const schedule = await ExamSchedule.findOne({ date });
    if (!schedule) return res.status(404).json({ message: 'Exam schedule not found' });

    res.status(200).json({ message: 'Exam schedule retrieved', data: schedule });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exam schedule', error });
  }
};

// Update an exam schedule
exports.updateExamSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await ExamSchedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSchedule) return res.status(404).json({ message: 'Exam schedule not found' });

    res.status(200).json({ message: 'Exam schedule updated', data: updatedSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam schedule', error });
  }
};

// Delete an exam schedule
exports.deleteExamSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await ExamSchedule.findByIdAndDelete(id);
    if (!deletedSchedule) return res.status(404).json({ message: 'Exam schedule not found' });

    res.status(200).json({ message: 'Exam schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam schedule', error });
  }
};
