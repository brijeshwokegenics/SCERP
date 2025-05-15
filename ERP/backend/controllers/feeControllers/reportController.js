const Payment = require('../../models/feeModels/Payment');
const StudentFee = require('../../models/feeModels/StudentFee');

// @desc Create a manual collection report entry (if needed)
exports.createReportEntry = async (req, res, next) => {
  try {
    const report = await Payment.create(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc Get total fee collection report (today/this month/all)
exports.getCollectionReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const payments = await Payment.find(filter).populate('studentId');
    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.status(200).json({
      success: true,
      totalCollection: totalCollected,
      totalTransactions: payments.length,
      payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get dues report (students who have pending fees)
exports.getDuesReport = async (req, res, next) => {
  try {
    const dues = await StudentFee.find({ duesAmount: { $gt: 0 } })
      .populate('studentId', 'firstName lastName className')
      .select('studentId duesAmount');

    res.status(200).json({
      success: true,
      totalStudentsWithDues: dues.length,
      dues
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get a report by ID
exports.getReportById = async (req, res, next) => {
  try {
    const report = await Payment.findById(req.params.id).populate('studentId');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc Update a report entry manually
exports.updateReport = async (req, res, next) => {
  try {
    const report = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a report entry manually
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Payment.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};
