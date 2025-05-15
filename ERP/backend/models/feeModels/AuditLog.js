const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actionType: { 
    type: String, 
    required: true, 
    enum: [
      'Payment Made', 
      'Fee Updated', 
      'Fee Assigned', 
      'Discount Applied', 
      'Student Updated', 
      'Login Success',
      'Login Failed',
      'Manual Log'
    ] 
  },
  referenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'referenceModel',
    required: false 
  },
  referenceModel: { 
    type: String, 
    enum: ['Payment', 'StudentFee', 'User', 'Student', 'FeeStructure'],
    required: false 
  },
  description: { 
    type: String, 
    required: true 
  },
  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
