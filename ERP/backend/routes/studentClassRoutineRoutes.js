const express = require("express");
const router = express.Router();
const studentClassRoutineController = require("../controllers/studentRoutineController");

// POST - Create new routine
router.post("/", studentClassRoutineController.createRoute);

// GET - Get all routines
router.get("/", studentClassRoutineController.getAllRoutes);

// GET - Get routine by ID
router.get("/:id", studentClassRoutineController.getRouteById);

// PUT - Update routine by ID
router.put("/:id", studentClassRoutineController.updateRoute);

// DELETE - Delete routine by ID
router.delete("/:id", studentClassRoutineController.deleteRoute);

module.exports = router;
