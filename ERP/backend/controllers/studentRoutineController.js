const StudentClassRoutine = require("../models/StudentClassRoutine");

exports.createRoute = async (req, res) => {
  try {
    const routine = new StudentClassRoutine(req.body);
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routines = await StudentClassRoutine.find()
      .populate("class")
      .populate("teacher");
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const routine = await StudentClassRoutine.findById(req.params.id)
      .populate("class")
      .populate("teacher");
    if (!routine) return res.status(404).json({ message: "Routine not found" });
    res.json(routine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const updatedRoutine = await StudentClassRoutine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRoutine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await StudentClassRoutine.findByIdAndDelete(req.params.id);
    res.json({ message: "Routine deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
