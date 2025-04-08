const OtherPayment = require('../models/OtherPayment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const payment = new OtherPayment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await OtherPayment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await OtherPayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const updated = await OtherPayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deleted = await OtherPayment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
