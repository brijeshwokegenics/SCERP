const Payment = require('../models/Payment');

async function generateReceiptNumber() {
  const currentYear = new Date().getFullYear();
  
  const lastPayment = await Payment.findOne({}).sort({ createdAt: -1 });

  let lastNumber = 0;
  if (lastPayment && lastPayment.receiptNumber) {
    const parts = lastPayment.receiptNumber.split('-');
    if (parts[0] === currentYear.toString()) {
      lastNumber = parseInt(parts[1], 10);
    }
  }

  const newNumber = lastNumber + 1;
  const formattedNumber = String(newNumber).padStart(3, '0'); // 001, 002, etc.

  return `${currentYear}-${formattedNumber}`;
}

module.exports = { generateReceiptNumber };
