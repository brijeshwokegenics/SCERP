const express = require('express');
const router = express.Router();
const {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getLogsByReference,
  updateAuditLog,
  deleteAuditLog,
} = require('../../controllers/feeControllers/auditLogController');
const auth = require('../../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../../middlewares/roles');

// @route   POST /api/audit-logs
// @desc    Create audit log manually
router.post('/',  auth, isSchoolAdmin, createAuditLog);

// @route   GET /api/audit-logs
// @desc    Get all audit logs with pagination and filters
router.get('/', auth, isSchoolAdmin, getAuditLogs);

// @route   GET /api/audit-logs/:id
// @desc    Get single audit log by ID
router.get('/:id', auth, isSchoolAdmin, getAuditLogById);

// @route   GET /api/audit-logs/reference/:referenceId
// @desc    Get logs by reference ID (Payment, Fee, etc.)
router.get('/reference/:referenceId', auth, isSchoolAdmin, getLogsByReference);

// @route   PUT /api/audit-logs/:id
// @desc    Update audit log entry
router.put('/:id', auth, isSchoolAdmin, updateAuditLog);

// @route   DELETE /api/audit-logs/:id
// @desc    Delete audit log entry
router.delete('/:id', auth, isSchoolAdmin, deleteAuditLog);

module.exports = router;
