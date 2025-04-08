const Hostel = require('../models/Hostel');

// Create Hostel
exports.addHostel = async (req, res) => {
    try {
      const { hostelName, hostelType, hostelAddress, intakeCapacity, description } = req.body;
  
      const newHostel = new Hostel({
        hostelName,
        hostelType,
        hostelAddress,
        intakeCapacity,
        description
      });
  
    
      const savedHostel = await newHostel.save();
      res.status(201).json({ message: 'Hostel added successfully', data: savedHostel });
    } catch (err) {
        res.status(500).json({ message: 'Error adding hostel', error: err.message });
    }
  };
  
// Get All Hostels
exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Hostel
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.status(200).json(hostel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Hostel
exports.updateHostel = async (req, res) => {
  try {
    const updated = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Hostel
exports.deleteHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hostel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
