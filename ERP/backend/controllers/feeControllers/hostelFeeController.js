const HostelFee = require('../../models/feeModels/HostelFee');

// @desc Create new hostel fee record
exports.createHostelFee = async (req, res, next) => {
  try {
    const hostelFee = await HostelFee.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, hostelFee });
  } catch (error) {
    next(error);
  }
};

// @desc Get all hostel fee records
exports.getAllHostelFees = async (req, res, next) => {
  try {
    const hostelFees = await HostelFee.find().populate('studentId', 'firstName lastName className');
    res.status(200).json({ success: true, hostelFees });
  } catch (error) {
    next(error);
  }
};

// @desc Get single hostel fee record by ID
exports.getHostelFeeById = async (req, res, next) => {
  try {
    const hostelFee = await HostelFee.findById(req.params.id).populate('studentId');
    if (!hostelFee) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, hostelFee });
  } catch (error) {
    next(error);
  }
};

// @desc Update hostel fee record
exports.updateHostelFee = async (req, res, next) => {
  try {
    const hostelFee = await HostelFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hostelFee) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, hostelFee });
  } catch (error) {
    next(error);
  }
};

// @desc Delete hostel fee record
exports.deleteHostelFee = async (req, res, next) => {
  try {
    const hostelFee = await HostelFee.findByIdAndDelete(req.params.id);
    if (!hostelFee) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
