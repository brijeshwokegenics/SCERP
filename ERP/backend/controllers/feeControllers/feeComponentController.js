const FeeComponent = require('../../models/feeModels/FeeComponent');

// @desc Create a new fee component
exports.createFeeComponent = async (req, res, next) => {
  try {
    console.log('User:', req.user); // 🔍 Log user info

    const component = await FeeComponent.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: component });
  } catch (err) {
    console.error('CREATE FeeComponent Error:', err); // 🔥 Full error trace
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};


// @desc Get all fee components
exports.getAllFeeComponents = async (req, res, next) => {
  try {
    const components = await FeeComponent.find().populate('createdBy', 'name email');
    return res.status(200).json({ success: true, data: components });
  } catch (err) {
    return next(err);
  }
};

// @desc Get single fee component by ID
exports.getFeeComponentById = async (req, res, next) => {
  try {
    const component = await FeeComponent.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ success: false, message: 'Component not found' });
    }
    return res.status(200).json({ success: true, data: component });
  } catch (err) {
    return next(err);
  }
};

// @desc Update fee component
exports.updateFeeComponent = async (req, res, next) => {
  try {
    const updated = await FeeComponent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // ensures data is validated during update
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Component not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
};

// @desc Delete fee component
exports.deleteFeeComponent = async (req, res, next) => {
  try {
    const deleted = await FeeComponent.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Component not found' });
    }
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return next(err);
  }
};
