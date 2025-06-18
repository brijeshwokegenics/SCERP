const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  className: { type: String, required: true },
  stream: { type: String }, // Optional (for +2 level)
  academicYear: { type: String, required: true },
  feeComponents: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'FeeComponent' }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Audit log
  campus: [{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
     required: true }], // Multi-campus support
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
