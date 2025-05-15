const AuditLog = require('../../models/feeModels/AuditLog');


// @desc Create Audit Log manually
exports.createAuditLog = async (req, res, next) => {
  try {
    const { actionType, referenceId, referenceModel, description } = req.body;
    const changedBy = req.user?._id || req.body.changedBy;

    if (!actionType || !description || !changedBy) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const log = await AuditLog.create({
      actionType,
      referenceId,
      referenceModel,
      description,
      changedBy
    });

    res.status(201).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// @desc Get all audit logs with pagination & filter
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, actionType, referenceModel } = req.query;
    const query = {};

    if (actionType) query.actionType = actionType;
    if (referenceModel) query.referenceModel = referenceModel;

    const logs = await AuditLog.find(query)
      .populate('changedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      logs,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get a single audit log by ID
exports.getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('changedBy', 'name email');
    if (!log) return res.status(404).json({ success: false, message: 'Audit log not found' });
    res.status(200).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// @desc Get logs related to a specific reference (e.g., Payment, StudentFee, etc.)
exports.getLogsByReference = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({ referenceId: req.params.referenceId })
      .populate('changedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

// @desc Update audit log manually
exports.updateAuditLog = async (req, res, next) => {
  try {
    const log = await AuditLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ success: false, message: 'Audit log not found' });
    res.status(200).json({ success: true, log });
  } catch (error) {
    next(error);
  }
};

// @desc Delete an audit log (superadmin only)
exports.deleteAuditLog = async (req, res, next) => {
  try {
    const log = await AuditLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Audit log not found' });
    res.status(200).json({ success: true, message: 'Audit log deleted' });
  } catch (error) {
    next(error);
  }
};