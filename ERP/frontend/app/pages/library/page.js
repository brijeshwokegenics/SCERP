import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../../store/librarySlice';

export default function Home() {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.library);
  const [form, setForm] = useState({
    title: '', genre: '', isbn: '', publishedYear: '', copiesAvailable: '',
    author: '', authorbio: '', authorbirthdate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!editMode && books.some(book => book.isbn === form.isbn)) {
      setError('ISBN must be unique!');
      return;
    }
    
    if (editMode) {
      dispatch(updateBook({ id: editId, bookData: form }));
    } else {
      dispatch(createBook(form));
    }
    
    setForm({ title: '', genre: '', isbn: '', publishedYear: '', copiesAvailable: '', author: '', authorbio: '', authorbirthdate: '' });
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (book) => {
    setForm({ ...book });
    setEditMode(true);
    setEditId(book._id);
  };

  const handleDelete = (id) => dispatch(deleteBook(id));

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
      <h2 className="text-xl font-semibold mb-2">Add / Edit Book</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4 bg-white p-6 shadow-md rounded-lg">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2" required />
        <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="border p-2" required />
        <input type="text" name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} className="border p-2" required />
        <input type="number" name="publishedYear" placeholder="Published Year" value={form.publishedYear} onChange={handleChange} className="border p-2" required />
        <input type="number" name="copiesAvailable" placeholder="Copies Available" value={form.copiesAvailable} onChange={handleChange} className="border p-2" required />
        <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2" required />
        <input type="text" name="authorbio" placeholder="Author Bio" value={form.authorbio} onChange={handleChange} className="border p-2" />
        <input type="date" name="authorbirthdate" value={form.authorbirthdate} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 col-span-2 rounded">{editMode ? 'Update' : 'Add'} Book</button>
      </form>
      <input type="text" placeholder="Search by title, author, genre..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 w-full mb-4" />
      {loading ? <p className="text-center">Loading...</p> : (
        <div>
          <table className="min-w-full bg-white border shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
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
              {paginatedBooks.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-100">
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
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{index + 1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
