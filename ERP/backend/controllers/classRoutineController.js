const ClassRoutine = require("../models/ClassRoutine");

// 1️⃣ Create a Class Routine
exports.createClassRoutine = async (req, res) => {
  try {
    const newRoutine = new ClassRoutine(req.body);
    const savedRoutine = await newRoutine.save();
    res.status(201).json(savedRoutine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2️⃣ Get All Class Routines
exports.getAllClassRoutines = async (req, res) => {
  try {
    const routines = await ClassRoutine.find(); 
    res.status(200).json(routines);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Get Routine by Class & Section
exports.getClassRoutineByClassAndSection = async (req, res) => {
  try {
    const { className, section } = req.params;
    const routine = await ClassRoutine.findOne({ class: className, section })
      .populate("schedule.periods.teacher");

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json(routine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Update a Class Routine
exports.updateClassRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRoutine = await ClassRoutine.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedRoutine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json(updatedRoutine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5️⃣ Delete a Class Routine
exports.deleteClassRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoutine = await ClassRoutine.findByIdAndDelete(id);

    if (!deletedRoutine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json({ message: "Routine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
