const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Admission", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    bookStatus: { type: String, enum: ["Borrowed", "Returned"], default: "Borrowed" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
