const mongoose = require("mongoose");

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String },
    isbn: { type: String, unique: true, required: true },
    publishedYear: { type: Number },
    copiesAvailable: { type: Number },
    author: { type: String, required: true },
    authorbio: { type: String },
    authorbirthdate: { type: Date }
}, { timestamps: true });








const Book = mongoose.model('Book', bookSchema);
module.exports = Book;


