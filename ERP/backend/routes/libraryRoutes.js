const express = require("express");
const router = express.Router();

const {getBooks,createBook,updateBook,deleteBook,getTransactions, createTransaction,updateTransaction,deleteTransaction } = require("../controllers/libraryController");

const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');
// Book Routes
router.get("/books", auth, isSchoolAdmin,  getBooks);
router.post("/books", auth, isSchoolAdmin,  createBook);
router.put("/books/:id", auth, isSchoolAdmin,  updateBook);
router.delete("/books/:id", auth, isSchoolAdmin, deleteBook);



// Transaction Routes
router.get("/transactions", auth, isSchoolAdmin,  getTransactions);
router.post("/transactions", auth, isSchoolAdmin,  createTransaction);
router.put("/transactions/:id", auth, isSchoolAdmin,  updateTransaction);
router.delete("/transactions/:id", auth, isSchoolAdmin,  deleteTransaction);

module.exports = router;
