const TermCategory = require('../models/TermCategory');

// CREATE: Add a new Term Category
exports.createTermCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check for duplicate term
    const existingTerm = await TermCategory.findOne({ name });
    if (existingTerm) {
      return res.status(409).json({ message: 'Term category already exists' });
    }

    const newTerm = new TermCategory({ name });
    await newTerm.save();

    res.status(201).json({ message: 'Term category created successfully', data: newTerm });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create term category', error: error.message });
  }
};

// READ: Get all Term Categories
exports.getAllTermCategories = async (req, res) => {
  try {
    const terms = await TermCategory.find().sort({ createdAt: -1 });
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch term categories', error: error.message });
  }
};

// READ: Get a single Term Category by ID
exports.getTermCategoryById = async (req, res) => {
  try {
    const term = await TermCategory.findById(req.params.id);
    if (!term) {
      return res.status(404).json({ message: 'Term category not found' });
    }
    res.status(200).json(term);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch term category', error: error.message });
  }
};

// UPDATE: Update a Term Category by ID
exports.updateTermCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedTerm = await TermCategory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedTerm) {
      return res.status(404).json({ message: 'Term category not found' });
    }

    res.status(200).json({ message: 'Term category updated successfully', data: updatedTerm });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update term category', error: error.message });
  }
};

// DELETE: Delete a Term Category by ID
exports.deleteTermCategory = async (req, res) => {
  try {
    const deletedTerm = await TermCategory.findByIdAndDelete(req.params.id);
    if (!deletedTerm) {
      return res.status(404).json({ message: 'Term category not found' });
    }

    res.status(200).json({ message: 'Term category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete term category', error: error.message });
  }
};
