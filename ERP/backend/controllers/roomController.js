const Room = require('../models/Room');

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const saved = await room.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('hostelId');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
