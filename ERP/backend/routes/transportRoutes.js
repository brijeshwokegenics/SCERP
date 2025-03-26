const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


// Create a new transport record
router.post('/',auth, isSchoolAdmin,  transportController.createTransport);

// Get all transport records
router.get('/',auth, isSchoolAdmin,  transportController.getAllTransport);

// Get transport by ID
router.get('/:id',auth, isSchoolAdmin,  transportController.getTransportById);

// Update transport by ID
router.put('/:id',auth, isSchoolAdmin,  transportController.updateTransport);

// Delete transport by ID
router.delete('/:id',auth, isSchoolAdmin,  transportController.deleteTransport);

// Create a new route
router.post('/',auth, isSchoolAdmin,  transportController.createRoute);

// Get all routes
router.get('/',auth, isSchoolAdmin,  transportController.getAllRoutes);

// Get a route by ID
router.get('/:id',auth, isSchoolAdmin,  transportController.getRouteById);

// Update route by ID
router.put('/:id',auth, isSchoolAdmin,  transportController.updateRoute);

// Delete route by ID
router.delete('/:id',auth, isSchoolAdmin,  transportController.deleteRoute);

module.exports = router;