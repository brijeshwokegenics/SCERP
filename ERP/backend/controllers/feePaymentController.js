// controllers/feePaymentController.js
const FeePayment = require('../models/FeePayment');

exports.createFeePayment = async (req, res) => {
  try {
    const feePayment = new FeePayment(req.body);
    await feePayment.save();
    res.status(201).json({ message: 'Fee payment created successfully', data: feePayment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllFeePayments = async (req, res) => {
  try {
    const payments = await FeePayment.find().populate('users');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeePaymentById = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id).populate('users');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeePayment = async (req, res) => {
  try {
    const updated = await FeePayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFeePayment = async (req, res) => {
  try {
    const deleted = await FeePayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
