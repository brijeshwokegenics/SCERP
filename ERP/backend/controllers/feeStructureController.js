const { FeeStructure } = require('../models/FeePayment');

// ✅ Create a Fee Structure
exports.createFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.create(req.body);
    res.status(201).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All Fee Structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find()
      .populate('components.class')
      .populate('components.stream')
      .populate('components.student')
      .populate('createdBy')
      .populate('schoolId');
    res.status(200).json({ success: true, data: feeStructures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a Single Fee Structure by ID
exports.getFeeStructureById = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id)
      .populate('components.class')
      .populate('components.stream')
      .populate('components.student')
      .populate('createdBy')
      .populate('schoolId');

    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    res.status(200).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update a Fee Structure
exports.updateFeeStructure = async (req, res) => {
  try {
    const updatedFeeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFeeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    res.status(200).json({ success: true, data: updatedFeeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a Fee Structure
exports.deleteFeeStructure = async (req, res) => {
  try {
    const deletedFeeStructure = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!deletedFeeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    res.status(200).json({ success: true, message: 'Fee Structure deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


