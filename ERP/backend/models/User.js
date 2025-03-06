// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,

    },
    password: {
      type: String,
      required: true,
    },  
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'STAFF'],
      required: true,
    },
    schoolId: {
      // For SCHOOL_ADMIN and STAFF, link to their School's ObjectId.
      // For SUPER_ADMIN, it can be null.
      type: String,
      required: true,
    },
    isActive: {
      // If false, the user cannot log in or perform any actions
      type: Boolean,
      default: true,
    },

    // For STAFF only, specify which staff role they are
    staffRole: {
      type: String,
      enum: ['ACCOUNTANT', 'PRINCIPAL', 'TEACHER', 'OTHERS'],
      default: 'OTHERS',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
