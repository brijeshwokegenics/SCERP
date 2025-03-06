const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  // Basic Details
  firstName: { 
    type: String, 
    required: true 
  },
  middleName: { 
    type: String 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: { 
    type: String 
  },
  
  // Professional Details
  subjects: [{ 
    type: String 
  }],
  designation: {
    type: String, // e.g. "Senior Teacher", "Assistant Teacher", etc.
  },
  qualifications: { 
    type: String 
  },
  experience: { 
    type: Number, // in years
    default: 0 
  },
  joiningDate: { 
    type: Date, 
    default: Date.now 
  },
  departments: [{ 
    type: String // e.g. "Mathematics", "Science", etc.
  }],
  certifications: [{
    type: String // e.g. "Teaching Certificate", "Advanced Degree", etc.
  }],
  
  // Personal Details
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'] 
  },
  dateOfBirth: { 
    type: Date 
  },
  address: { 
    type: String 
  },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String }
  },
  
 
  // Working & Status Information
  workingHours: {
    start: { type: String }, // e.g. "08:00 AM"
    end: { type: String }    // e.g. "03:00 PM"
  },
  isActive: { 
    type: Boolean, 
    default: true // Whether the teacher is currently active/employed
  },
  monthlySalary: { 
    type: Number,
    // required: true, // Uncomment if monthly salary is required
  },

  // Association with School
  school: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Teacher', teacherSchema);
