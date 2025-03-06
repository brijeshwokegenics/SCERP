const Admission = require('../models/Admission');
const PDFDocument = require('pdfkit'); // For PDF generation
// @desc Get all admissions for the logged-in user
// @route GET /api/admissions
// @access Private
exports.getAdmissions = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from auth middleware
    const admissions = await Admission.find({ user: userId }); // Fetch only admissions for the logged-in user
    res.status(200).json({ success: true, data: admissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get a single admission by ID for the logged-in user
// @route GET /api/admissions/:id
// @access Private
exports.getAdmissionById = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from auth middleware
    const admission = await Admission.findOne({ _id: req.params.id, user: userId });

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: admission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create a new admission for the logged-in user
// @route POST /api/admissions
// @access Private
exports.createAdmission = async (req, res) => {
  try {
    const newAdmission = { ...req.body, user: req.user._id }; // Assign the logged-in user's ID
    const admission = await Admission.create(newAdmission);
    res.status(201).json({ success: true, data: admission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Update an admission by ID for the logged-in user
// @route PUT /api/admissions/:id
// @access Private
exports.updateAdmission = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from auth middleware
    const admission = await Admission.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Ensure the user owns the record
      req.body,
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: admission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Delete an admission by ID for the logged-in user
// @route DELETE /api/admissions/:id
// @access Private
exports.deleteAdmission = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from auth middleware
    const admission = await Admission.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Admission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Fetch and return the list of all students.
 */
exports.viewStudentsList = async (req, res) => {
  try {
    const students = await Admission.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch and return details for a single student by ID.
 */
exports.viewStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Admission.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate and return a PDF of ID cards for all students in a specified class.
 */
exports.generateStudentIdCard = async (req, res) => {
  try {
    // E.g., pass the class in request body => { className: "Grade 10" }
    const { className } = req.body;

    // Find all students in the specified class
    const students = await Admission.find({ admissionClass: className });
    if (!students.length) {
      return res.status(404).json({ message: `No students found in class: ${className}` });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Collect PDF data in chunks before sending
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res
        .status(200)
        .set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="ID_Cards_${className}.pdf"`,
        })
        .send(pdfBuffer);
    });

    // Example simple layout; customize as needed
    doc.fontSize(18).text(`ID Cards for Class: ${className}`, { align: 'center' });
    doc.moveDown(2);

    students.forEach((student, index) => {
      doc
        .fontSize(14)
        .text(`Name: ${student.firstName} ${student.lastName}`)
        .text(`Admission No: ${student.admissionNumber}`)
        .text(`DOB: ${student.dateOfBirth.toDateString()}`)
        .text(`Father's Name: ${student.fatherName}`)
        .text(`Mother's Name: ${student.motherName}`);
      
      // Add a separator or blank line before next student
      if (index < students.length - 1) {
        doc.moveDown(2);
        doc.text('--------------------------------------');
        doc.moveDown(1);
      }
    });

    // Finalize PDF
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate and return a PDF vehicle pass for selected students.
 */
exports.generateVehiclePass = async (req, res) => {
  try {
    // E.g., pass selected studentIds => { studentIds: ["id1", "id2"] }
    const { studentIds } = req.body;

    // Find students whose IDs are in the array
    const students = await Admission.find({ _id: { $in: studentIds } });
    if (!students.length) {
      return res.status(404).json({ message: 'No students found with provided IDs.' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res
        .status(200)
        .set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Vehicle_Pass.pdf"`,
        })
        .send(pdfBuffer);
    });

    // Title
    doc.fontSize(18).text('Vehicle Pass', { align: 'center' });
    doc.moveDown(2);

    // List each student
    students.forEach((student, index) => {
      doc
        .fontSize(14)
        .text(`Name: ${student.firstName} ${student.lastName}`)
        .text(`Admission No: ${student.admissionNumber}`)
        .text(`Class: ${student.admissionClass}`)
        .text(`Mobile: ${student.mobileNumber}`)
        .moveDown(1);

      if (index < students.length - 1) {
        doc.text('--------------------------------------');
        doc.moveDown(1);
      }
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.promoteStudents = async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user from auth middleware
    const { studentIds, newAdmissionClass } = req.body;

    // Validate the incoming data
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student IDs are required."
      });
    }
    if (!newAdmissionClass) {
      return res.status(400).json({
        success: false,
        message: "New admission class is required."
      });
    }

    // Perform a bulk update: Only update records owned by the logged-in user
    const result = await Admission.updateMany(
      { _id: { $in: studentIds }, user: userId },
      { $set: { admissionClass: newAdmissionClass } },
      { runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No student records were updated. Please verify the IDs and your permissions."
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} students promoted successfully.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
