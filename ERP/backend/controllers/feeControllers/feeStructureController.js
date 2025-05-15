const FeeStructure = require('../../models/feeModels/FeeStructure');
const AuditLog = require('../../models/feeModels/AuditLog');

// @desc Create Fee Structure
exports.createFeeStructure = async (req, res, next) => {
  try {
    const { className, stream, academicYear, feeComponents } = req.body;

    const feeStructure = await FeeStructure.create({
      className,
      stream,
      academicYear,
      feeComponents,
      createdBy: req.user._id,
      campus: req.user.campus || null
    });

    await AuditLog.create({
      actionType: 'Fee Structure Created',
      referenceId: feeStructure._id,
      description: `Fee structure created for ${className} ${stream}`,
      changedBy: req.user._id
    });

    res.status(201).json({ success: true, feeStructure });
  } catch (error) {
    next(error);
  }
};

// @desc Get All Fee Structures
exports.getAllFeeStructures = async (req, res, next) => {
  try {
    const feeStructures = await FeeStructure.find({});
    res.status(200).json({ success: true, feeStructures });
  } catch (error) {
    next(error);
  }
};

// @desc Update Fee Structure
exports.updateFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feeStructure = await FeeStructure.findByIdAndUpdate(id, req.body, { new: true });

    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    await AuditLog.create({
      actionType: 'Fee Structure Updated',
      referenceId: id,
      description: `Fee structure updated`,
      changedBy: req.user._id
    });

    res.status(200).json({ success: true, feeStructure });
  } catch (error) {
    next(error);
  }
};

// @desc Delete Fee Structure
exports.deleteFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feeStructure = await FeeStructure.findByIdAndDelete(id);

    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    await AuditLog.create({
      actionType: 'Fee Structure Deleted',
      referenceId: id,
      description: `Fee structure deleted`,
      changedBy: req.user._id
    });

    res.status(200).json({ success: true, message: 'Fee structure deleted' });
  } catch (error) {
    next(error);
  }
};
