const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    admissionNumber: {
      type: String,
      required: [true, 'Admission Number is required'],
      unique: true,
      trim: true,
    },
    admissionDate: {
      type: Date,
      required: [true, 'Admission Date is required'],
      required: true,
      // Use a setter to trim "T00:00:00.000Z"
      
    
    },
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      trim: true,
    },
    admissionClass: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of Birth is required'],
      required: true,

     
    
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP Code is required'],
    },
    countryCode: {
      type: String,
      required: [true, 'Country Code is required'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile Number is required'],
      match: [/^\d{10,15}$/, 'Please enter a valid Mobile Number'],
    },
    alternateMobileNumber: {
      type: String,
      match: [/^\d{10,15}$/, 'Please enter a valid Alternate Mobile Number'],
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, 'Please enter a valid Email Address'],
    },
    previousSchool: {
      type: String,
      trim: true,
    },
    siblings: {
      type: Boolean,
      default: false, // Default to false if not specified
    },
    parentalStatus: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's Name is required"],
      trim: true,
    },
    fatherDOB: {
      type: Date,
      required: true,
      
  
    },
    fatherOccupation: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Mother's Name is required"],
      trim: true,
    },
    motherDOB: {
      type: Date,
      required: true,
       
    
    },
    motherOccupation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
 
module.exports = mongoose.model('Admission', admissionSchema);
