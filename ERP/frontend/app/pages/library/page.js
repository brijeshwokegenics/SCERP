'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../../store/librarySlice';

export default function Home() {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.library);

  const [tab, setTab] = useState('add');
  const [form, setForm] = useState({
    title: '', genre: '', isbn: '', publishedYear: '', copiesAvailable: '',
    author: '', authorbio: '', authorbirthdate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch books on load or refresh
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!editMode && books.some(book => book.isbn === form.isbn)) {
      setError('❌ ISBN must be unique!');
      return;
    }

    if (editMode) {
      dispatch(updateBook({ id: editId, bookData: form }));
      setSuccessMessage('✅ Book updated successfully!');
    } else {
      dispatch(createBook(form));
      setSuccessMessage('✅ Book added successfully!');
    }

    setForm({
      title: '', genre: '', isbn: '', publishedYear: '', copiesAvailable: '',
      author: '', authorbio: '', authorbirthdate: ''
    });

    setEditMode(false);
    setEditId(null);

    setTimeout(() => {
      setSuccessMessage('');
      setError('');
    }, 3000);
  };

  const handleEdit = (book) => {
    setForm({ ...book });
    setEditMode(true);
    setEditId(book._id);
    setTab('add');
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      dispatch(deleteBook(id));
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.genre.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Library Management</h1>

      {/* Tabs */}
      <div className="flex mb-4 space-x-4">
        <button onClick={() => setTab('add')} className={`px-4 py-2 rounded ${tab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Add Book
        </button>
        <button onClick={() => setTab('list')} className={`px-4 py-2 rounded ${tab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Book List
        </button>
      </div>

      {/* Add/Edit Form */}
      {tab === 'add' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{editMode ? 'Edit Book' : 'Add New Book'}</h2>
          {error && <p className="text-red-600 font-medium mb-2">{error}</p>}
          {successMessage && <p className="text-green-600 font-medium mb-2">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg">
            <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2" required />
            <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="border p-2" required />
            <input type="text" name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} className="border p-2" required />
            <input type="number" name="publishedYear" placeholder="Published Year" value={form.publishedYear} onChange={handleChange} className="border p-2" required />
            <input type="number" name="copiesAvailable" placeholder="Copies Available" value={form.copiesAvailable} onChange={handleChange} className="border p-2" required />
            <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2" required />
            <input type="text" name="authorbio" placeholder="Author Bio" value={form.authorbio} onChange={handleChange} className="border p-2" />
            <input type="date" name="authorbirthdate" value={form.authorbirthdate} onChange={handleChange} className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2 rounded">
              {editMode ? 'Update Book' : 'Add Book'}
            </button>
          </form>
        </div>
      )}

      {/* Book List */}
      {tab === 'list' && (
        <div>
          <input
            type="text"
            placeholder="Search by title, author, genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full mb-4"
          />

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <table className="min-w-full bg-white border shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-2">No</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Author</th>
                    <th className="p-2">Genre</th>
                    <th className="p-2">ISBN</th>
                    <th className="p-2">Year</th>
                    <th className="p-2">Copies</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book, index) => (
                    <tr key={book._id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-2">{book.title}</td>
                      <td className="p-2">{book.author}</td>
                      <td className="p-2">{book.genre}</td>
                      <td className="p-2">{book.isbn}</td>
                      <td className="p-2">{book.publishedYear}</td>
                      <td className="p-2">{book.copiesAvailable}</td>
                      <td className="p-2">
                        <button onClick={() => handleEdit(book)} className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded">Edit</button>
                        <button onClick={() => handleDelete(book._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
