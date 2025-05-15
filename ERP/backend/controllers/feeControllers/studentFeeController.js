const StudentFee = require('../../models/feeModels/StudentFee');
const FeeStructure = require('../../models/feeModels/FeeStructure');
const AuditLog = require('../../models/feeModels/AuditLog');

// Assign Fee Structure to Student
exports.assignFeeStructure = async (req, res, next) => {
  try {
    const { studentId, feeStructureId, campus } = req.body;

    if (!studentId || !feeStructureId) {
      return res.status(400).json({ success: false, message: 'Missing studentId or feeStructureId' });
    }

    // Fetch FeeStructure
    const feeStructure = await FeeStructure.findById(feeStructureId);
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    // Calculate Total Amount
    let totalAmount = 0;
    feeStructure.feeComponents.forEach(component => {
      totalAmount += component.amount;
    });

    // Create StudentFee
    const studentFee = await StudentFee.create({
      studentId,
      feeStructureId,
      academicYear: feeStructure.academicYear,
      totalAmount,
      paidAmount: 0,
      duesAmount: totalAmount,
      campus,
      ledger: [{
        type: 'Fee Assigned',
        amount: totalAmount,
        date: new Date(),
        remarks: 'Fee structure assigned on admission.'
      }]
    });

    // Audit Log
    await AuditLog.create({
      actionType: 'Fee Structure Assigned',
      referenceId: studentFee._id,
      description: `Assigned Fee Structure to Student ${studentId}`,
      changedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Fee assigned successfully',
      studentFee,
    });

  } catch (error) {
    next(error);
  }
};

// @desc Get Student Fee Details
exports.getStudentFee = async (req, res, next) => {
    try {
      const { studentId } = req.params;
  
      const studentFee = await StudentFee.findOne({ studentId }).populate('studentId');
  
      if (!studentFee) {
        return res.status(404).json({ success: false, message: 'Student fee record not found' });
      }
  
      res.status(200).json({ success: true, studentFee });
    } catch (error) {
      next(error);
    }
  };

// @desc Update Student Fee (Admin can apply discount, adjust dues, etc.)
exports.updateStudentFee = async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const updateData = req.body;
  
      const studentFee = await StudentFee.findOneAndUpdate({ studentId }, updateData, { new: true });
  
      if (!studentFee) {
        return res.status(404).json({ success: false, message: 'Student fee record not found' });
      }
  
      await AuditLog.create({
        actionType: 'Student Fee Updated',
        referenceId: studentFee._id,
        description: `Student Fee updated for ${studentId}`,
        changedBy: req.user._id
      });
  
      res.status(200).json({ success: true, studentFee });
    } catch (error) {
      next(error);
    }
  };
  
  
exports.getDuesReport = async (req, res, next) => {
    try {
      const dues = await StudentFee.find({ duesAmount: { $gt: 0 } }).populate('studentId');
  
      res.status(200).json({
        success: true,
        totalStudentsWithDues: dues.length,
        dues,
      });
  
    } catch (error) {
      next(error);
    }
  };
  // Get Student Ledger
exports.getStudentLedger = async (req, res, next) => {
    try {
      const { studentId } = req.params;
  
      const studentFee = await StudentFee.findOne({ studentId }).populate('studentId');
  
      if (!studentFee) {
        return res.status(404).json({ success: false, message: 'Student fee record not found' });
      }
  
      res.status(200).json({
        success: true,
        ledger: studentFee.ledger,
      });
  
    } catch (error) {
      next(error);
    }
  };
  