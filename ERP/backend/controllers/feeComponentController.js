const { FeeStructure } = require('../models/FeePayment');

// ✅ Add a Fee Component to a Fee Structure
exports.addFeeComponent = async (req, res) => {
  try {
    const { id } = req.params; // FeeStructure ID
    const feeStructure = await FeeStructure.findById(id);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    feeStructure.components.push(req.body);
    await feeStructure.save();

    res.status(201).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get All Fee Components for a FeeStructure
exports.getAllFeeComponents = async (req, res) => {
    try {
      const { id } = req.params; // FeeStructure ID
      const feeStructure = await FeeStructure.findById(id)
        .populate('components.class')
        .populate('components.stream')
        .populate('components.student');
        
      if (!feeStructure) {
        return res.status(404).json({ success: false, message: 'Fee Structure not found' });
      }
  
      res.status(200).json({ success: true, data: feeStructure.components });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  // Get Single Fee Component by Component ID
exports.getFeeComponentById = async (req, res) => {
    try {
      const { id, componentId } = req.params; // FeeStructure ID, Component ID
      const feeStructure = await FeeStructure.findById(id)
        .populate('components.class')
        .populate('components.stream')
        .populate('components.student');
  
      if (!feeStructure) {
        return res.status(404).json({ success: false, message: 'Fee Structure not found' });
      }
  
      const component = feeStructure.components.id(componentId);
  
      if (!component) {
        return res.status(404).json({ success: false, message: 'Fee Component not found' });
      }
  
      res.status(200).json({ success: true, data: component });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
// ✅ Update a Fee Component
exports.updateFeeComponent = async (req, res) => {
  try {
    const { id, componentId } = req.params; // FeeStructure ID, Component ID
    const feeStructure = await FeeStructure.findById(id);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    const component = feeStructure.components.id(componentId);
    if (!component) {
      return res.status(404).json({ success: false, message: 'Fee Component not found' });
    }

    Object.assign(component, req.body);
    await feeStructure.save();

    res.status(200).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a Fee Component
exports.deleteFeeComponent = async (req, res) => {
  try {
    const { id, componentId } = req.params;
    const feeStructure = await FeeStructure.findById(id);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee Structure not found' });
    }

    feeStructure.components.id(componentId).remove();
    await feeStructure.save();

    res.status(200).json({ success: true, message: 'Fee Component deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
