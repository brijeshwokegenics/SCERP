const Income = require('../models/Income');

// Create new income record
exports.createIncome = async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all income records
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get income by ID
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update income by ID
exports.updateIncome = async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedIncome) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete income by ID
exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);
    if (!deletedIncome) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
