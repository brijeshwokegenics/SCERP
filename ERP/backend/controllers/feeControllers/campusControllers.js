const Campus = require('../../models/feeModels/Campus');

// @desc Create a new campus
exports.createCampus = async (req, res, next) => {
  try {
    const campus = await Campus.create(req.body);
    res.status(201).json({ success: true, campus });
  } catch (error) {
    next(error);
  }
};

// @desc Get all campuses
exports.getAllCampuses = async (req, res, next) => {
  try {
    const campuses = await Campus.find();
    res.status(200).json({ success: true, campuses });
  } catch (error) {
    next(error);
  }
};

// @desc Get campus by ID
exports.getCampusById = async (req, res, next) => {
  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found' });
    res.status(200).json({ success: true, campus });
  } catch (error) {
    next(error);
  }
};

// @desc Update campus by ID
exports.updateCampus = async (req, res, next) => {
  try {
    const campus = await Campus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found' });
    res.status(200).json({ success: true, campus });
  } catch (error) {
    next(error);
  }
};

// @desc Delete campus by ID
exports.deleteCampus = async (req, res, next) => {
  try {
    const campus = await Campus.findByIdAndDelete(req.params.id);
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found' });
    res.status(200).json({ success: true, message: 'Campus deleted' });
  } catch (error) {
    next(error);
  }
};
