const School = require('../models/School');

// Create a new school
exports.createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    return res.status(201).json({ success: true, data: school });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieve all schools
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    return res.status(200).json({ success: true, data: schools });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieve a single school by ID
exports.getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }
    return res.status(200).json({ success: true, data: school });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update a school by ID
exports.updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }
    return res.status(200).json({ success: true, data: school });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a school by ID
exports.deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
