// backend/controllers/userController.js
const User = require('../models/User');
const School = require('../models/School');
const bcrypt = require('bcrypt');

/**
 * SUPER ADMIN creates a new SCHOOL ADMIN
 */
exports.createSchoolAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, schoolId } = req.body;

   
  

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSchoolAdmin = new User({
      email,
      password: hashedPassword,
      role: 'SCHOOL_ADMIN',
      firstName,
      lastName,
      schoolId,
      isActive: true,
    });

    await newSchoolAdmin.save();
    return res.status(201).json({ message: 'School Admin created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.fetchSchoolAdmins = async (req, res) => {
  try {



    const schoolAdmins = await User.find({ role: 'SCHOOL_ADMIN' })
      .select('-password') // Exclude password



    res.status(200).json({
      success: true,
      schoolAdmins,
   
    });

   
  } catch (error) {
    console.error('Error fetching School Admins:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * SUPER ADMIN updates (or disables) an existing SCHOOL ADMIN
 */
exports.updateSchoolAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { isActive } = req.body;

    // Ensure the isActive field is provided and is a boolean
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'Invalid or missing isActive value' });
    }

    // Find the School Admin by ID and role
    const schoolAdmin = await User.findOne({ _id: adminId, role: 'SCHOOL_ADMIN' });
    if (!schoolAdmin) {
      return res.status(404).json({ message: 'School Admin not found' });
    }

    // Update the isActive field
    schoolAdmin.isActive = isActive;

    // Save the updated admin
    await schoolAdmin.save();

    // Respond with success and the updated admin
    return res.status(200).json({
      message: 'School Admin status updated successfully',
      schoolAdmin: {
        _id: schoolAdmin._id,
        email: schoolAdmin.email,
        firstName: schoolAdmin.firstName,
        lastName: schoolAdmin.lastName,
        isActive: schoolAdmin.isActive,
        role: schoolAdmin.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


/**
 * SUPER ADMIN deletes a SCHOOL ADMIN
 */
exports.deleteSchoolAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const schoolAdmin = await User.findOne({ _id: adminId, role: 'SCHOOL_ADMIN' });
    if (!schoolAdmin) {
      return res.status(404).json({ message: 'School Admin not found' });
    }

    await schoolAdmin.deleteOne();
    return res.status(200).json({ message: 'School Admin deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

/**
 * SCHOOL ADMIN creates STAFF
 */
exports.createStaff = async (req, res) => {
  try {
    // req.user is the School Admin
    const { email, password, firstName, lastName, staffRole } = req.body;

    // Check that the user calling is actually SCHOOL_ADMIN
    if (req.user.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to create staff' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new User({
      email,
      password: hashedPassword,
      role: 'STAFF',
      staffRole,
      schoolId: req.user.schoolId, // The same school as the School Admin
      firstName,
      lastName,
      isActive: true,
    });

    await newStaff.save();
    return res.status(201).json({ message: 'Staff created successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
exports.fetchStaff = async (req, res) => {
  try {
    // Assuming the authenticated user is a SCHOOL_ADMIN and their schoolId is set
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'School ID not found' });
    }

    const staffMembers = await User.find({ role: 'STAFF', schoolId }).select('-password'); // Exclude password

    res.status(200).json({ success: true, count: staffMembers.length, data: staffMembers });
  } catch (error) {
    console.error('Error fetching Staff:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
/**
 * SCHOOL ADMIN updates STAFF
 */
exports.updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { email, firstName, lastName, staffRole, isActive } = req.body;

    const staff = await User.findOne({ 
      _id: staffId, 
      role: 'STAFF', 
      schoolId: req.user.schoolId,  // Must match the School Admin's school
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found in your school' });
    }

    if (email) staff.email = email;
    if (firstName) staff.firstName = firstName;
    if (lastName) staff.lastName = lastName;
    if (staffRole) staff.staffRole = staffRole;
    if (typeof isActive === 'boolean') staff.isActive = isActive;

    await staff.save();
    return res.status(200).json({ message: 'Staff updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

/**
 * SCHOOL ADMIN deletes STAFF
 */
exports.deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await User.findOne({
      _id: staffId,
      role: 'STAFF',
      schoolId: req.user.schoolId,
    });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found in your school' });
    }

    await staff.deleteOne();
    return res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
