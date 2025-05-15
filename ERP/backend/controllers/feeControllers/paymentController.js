const Payment = require('../../models/feeModels/Payment');
const StudentFee = require('../../models/feeModels/StudentFee');
const { generateReceiptNumber } = require('../../utils/autoReceiptNumber');
const AuditLog = require('../../models/feeModels/AuditLog');
const PDFDocument = require('pdfkit');

// @desc Collect Payment
exports.collectPayment = async (req, res, next) => {
  try {
    const { studentId, amountPaid, paymentMode, remarks = "", campus } = req.body;

    if (!studentId || !amountPaid || !paymentMode) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const studentFee = await StudentFee.findOne({ studentId });
    if (!studentFee) {
      return res.status(404).json({ success: false, message: 'Student fee record not found' });
    }

    if (amountPaid > (studentFee.duesAmount + studentFee.lateFine)) {
      return res.status(400).json({ success: false, message: 'Payment exceeds due amount' });
    }

    const receiptNumber = await generateReceiptNumber();

    const newPayment = await Payment.create({
      studentId,
      academicYear: studentFee.academicYear,
      amountPaid,
      paymentMode,
      receiptNumber,
      remarks,
      campus,
      generatedBy: req.user._id,
    });

    studentFee.paidAmount += amountPaid;
    const calculatedDue = (studentFee.totalAmount + studentFee.lateFine) - (studentFee.paidAmount + studentFee.scholarshipDiscount + studentFee.advanceAmount);

    if (calculatedDue < 0) {
      studentFee.advanceAmount += Math.abs(calculatedDue);
      studentFee.duesAmount = 0;
    } else {
      studentFee.duesAmount = calculatedDue;
    }

    studentFee.ledger.push({
      type: 'Payment',
      amount: amountPaid,
      date: new Date(),
      remarks: `Payment Received. Receipt#: ${receiptNumber}`,
    });

    await studentFee.save();

    await AuditLog.create({
      actionType: 'Payment Made',
      referenceId: newPayment._id,
      description: `Collected ₹${amountPaid} from Student ${studentId} (Receipt: ${receiptNumber})`,
      changedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Payment collected successfully',
      payment: newPayment,
      updatedFee: {
        totalAmount: studentFee.totalAmount,
        paidAmount: studentFee.paidAmount,
        duesAmount: studentFee.duesAmount,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Download Receipt as PDF
exports.downloadReceipt = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId).populate('studentId');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment;filename=receipt-${payment.receiptNumber}.pdf`,
          'Content-Length': pdfData.length,
        })
        .end(pdfData);
    });

    doc.fontSize(20).text('School Fee Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt Number: ${payment.receiptNumber}`);
    doc.text(`Student Name: ${payment.studentId.firstName} ${payment.studentId.lastName}`);
    doc.text(`Amount Paid: ₹${payment.amountPaid}`);
    doc.text(`Payment Mode: ${payment.paymentMode}`);
    doc.text(`Date: ${payment.paymentDate.toDateString()}`);
    if (payment.remarks) doc.text(`Remarks: ${payment.remarks}`);
    doc.text('Thank you for your payment.', { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc Get all payments (optionally by date range)
exports.getAllPayments = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const payments = await Payment.find(filter).populate('studentId');

    res.status(200).json({
      success: true,
      totalPayments: payments.length,
      payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single payment by ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('studentId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a payment (admin only)
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    next(error);
  }
};
