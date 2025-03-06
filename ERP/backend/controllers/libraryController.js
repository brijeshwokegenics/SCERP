// controllers/bookController.js
const Book = require("../models/Library");
// controllers/transactionController.js
const Transaction = require("../models/LibraryTransaction");



exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBook= async (req, res) => {
    try {
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate("student").populate("book");
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.createTransaction = async (req, res) => {
    try {
        const { student, book, returnDate, bookStatus } = req.body;

        if (!student || !book) {
            return res.status(400).json({ message: "Student and Book are required" });
        }

        const transaction = new Transaction({
            student,
            book,
            returnDate,
            bookStatus: bookStatus,
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
