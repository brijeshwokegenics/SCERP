const Bed = require('../models/Bed');

// Create Bed
exports.createBed = async (req, res) => {
  try {
    const bed = new Bed(req.body);
    const saved = await bed.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all beds
exports.getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate('roomId');
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bed by ID
exports.getBedById = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id).populate('roomId');
    if (!bed) return res.status(404).json({ message: 'Bed not found' });
    res.status(200).json(bed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update bed
exports.updateBed = async (req, res) => {
  try {
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete bed
exports.deleteBed = async (req, res) => {
  try {
    await Bed.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
