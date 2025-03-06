"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, fetchTransactions, addTransaction, updateTransaction } from "../../../../store/librarySlice";
import { fetchStudents } from "../../../../store/studentsSlice";

export default function BookTransactionPage() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.library);
  const { books } = useSelector((state) => state.library);
  const { list: students } = useSelector((state) => state.students);

  const [form, setForm] = useState({ student: "", book: "", returnDate: "", bookStatus: "Borrowed" });
  const [filter, setFilter] = useState({ student: "", bookStatus: "" });
  const [error, setError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [page, setPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchStudents());
  }, [dispatch]);

  const filteredTransactions = transactions.filter(
    (t) => (filter.student === "" || t.student._id === filter.student) &&
           (filter.bookStatus === "" || t.bookStatus === filter.bookStatus)
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * transactionsPerPage,
    page * transactionsPerPage
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (editingTransaction) {
      dispatch(updateTransaction({ id: editingTransaction._id, transactionData: {...form} }));
      setEditingTransaction(null);
    } else {
      const existingTransaction = transactions.find(
        (t) => t.book === form.book && t.student === form.student && t.bookStatus === "borrowed"
      );
      if (existingTransaction) {
        setError("This book is already borrowed by the student.");
        return;
      }
      dispatch(addTransaction(form));
    }
    dispatch(fetchTransactions());
    setForm({ student: "", book: "", returnDate: "", bookStatus: "Borrowed" });
  };

  const handleEdit = (transaction) => {
    setForm({
      student: transaction.student._id,
      book: transaction.book._id,
      returnDate: transaction.returnDate || "",
      bookStatus: transaction.bookStatus,
    });
    setEditingTransaction(transaction);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Library Transactions</h1>

      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg">
        <div>
          <label className="block text-gray-700">Student</label>
          <select name="student" value={form.student} onChange={handleChange} className="border p-2 w-full" required>
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.firstName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Book</label>
          <select name="book" value={form.book} onChange={handleChange} className="border p-2 w-full" required>
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>{book.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={form.returnDate ? form.returnDate.split("T")[0] : ""}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select name="bookStatus" value={form.bookStatus} onChange={handleChange} className="border p-2 w-full">
            <option value="Borrowed">Borrowed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2 rounded">
          {editingTransaction ? "Update Transaction" : "Borrow Book"}
        </button>
      </form>



      <div className="mb-4 grid grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg">
        <div>
          <label className="block text-gray-700">Filter by Student</label>
          <select name="student" value={filter.student} onChange={handleFilterChange} className="border p-2 w-full">
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.firstName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Filter by Status</label>
          <select name="bookStatus" value={filter.bookStatus} onChange={handleFilterChange} className="border p-2 w-full">
            <option value="">All Statuses</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Student</th>
            <th className="py-3 px-6 text-left">Book</th>
            <th className="py-3 px-6 text-left">Return Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction._id} className="border-b border-gray-300 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{transaction.student.firstName} {transaction.student.lastName}</td>
              <td className="py-3 px-6 text-left">{transaction.book.title}</td>
              <td className="py-3 px-6 text-left">{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : "-"}</td>
              <td className="py-3 px-6 text-left">{transaction.bookStatus}</td>
              <td className="py-3 px-6 text-center">
                <button onClick={() => handleEdit(transaction)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
