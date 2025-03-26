const Transport = require('../models/Transport');
const Route = require('../models/Route');
// Create new transport assignment
exports.createTransport = async (req, res) => {
  try {
    const transport = await Transport.create(req.body);
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transport records
exports.getAllTransport = async (req, res) => {
  try {
    const transports = await Transport.find()
      .populate('student')
      .populate('route')
      .populate('attendant');
    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transport by ID
exports.getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate('student')
      .populate('route')
      .populate('attendant');

    if (!transport) return res.status(404).json({ error: 'Transport not found' });
    res.json(transport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update transport
exports.updateTransport = async (req, res) => {
  try {
    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransport) return res.status(404).json({ error: 'Transport not found' });
    res.json(updatedTransport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete transport
exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) return res.status(404).json({ error: 'Transport not found' });
    res.json({ message: 'Transport record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// Create a new route
exports.createRoute = async (req, res) => {
    try {
      const route = await Route.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Get all routes
  exports.getAllRoutes = async (req, res) => {
    try {
      const routes = await Route.find();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get route by ID
  exports.getRouteById = async (req, res) => {
    try {
      const route = await Route.findById(req.params.id);
      if (!route) return res.status(404).json({ error: 'Route not found' });
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update route
  exports.updateRoute = async (req, res) => {
    try {
      const updatedRoute = await Route.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedRoute) return res.status(404).json({ error: 'Route not found' });
      res.json(updatedRoute);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Delete route
  exports.deleteRoute = async (req, res) => {
    try {
      const route = await Route.findByIdAndDelete(req.params.id);
      if (!route) return res.status(404).json({ error: 'Route not found' });
      res.json({ message: 'Route deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
