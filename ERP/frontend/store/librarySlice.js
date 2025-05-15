import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/library'; // Adjust according to your backend

// ---------------------- BOOKS ----------------------
// Fetch all books
export const fetchBooks = createAsyncThunk('library/fetchBooks', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${BASE_URL}/books`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
  }
});

// Add a book
export const createBook = createAsyncThunk('library/createBook', async (bookData, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post(`${BASE_URL}/books`, bookData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add book');
  }
});

// Update a book
export const updateBook = createAsyncThunk('library/updateBook', async ({ id, bookData }, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put(`${BASE_URL}/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update book');
  }
});

// Delete a book
export const deleteBook = createAsyncThunk('library/deleteBook', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${BASE_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return id; // Return deleted book ID
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete book');
  }
});




// ---------------------- TRANSACTIONS ----------------------
// Fetch all transactions
export const fetchTransactions = createAsyncThunk('library/fetchTransactions', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
  }
});

// Add a transaction
export const addTransaction = createAsyncThunk('library/addTransaction', async (transactionData, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.post(`${BASE_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add transaction');
  }
});

// Update a transaction
export const updateTransaction = createAsyncThunk('library/updateTransaction', async ({ id, transactionData }, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.put(`${BASE_URL}/transactions/${id}`, transactionData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    dispatch(fetchTransactions());

    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update transaction');
  }
});

// Delete a transaction
export const deleteTransaction = createAsyncThunk('library/deleteTransaction', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${BASE_URL}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete transaction');
  }
});

// ---------------------- SLICE ----------------------
const librarySlice = createSlice({
  name: 'library',
  initialState: {
    books: [],
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch books';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = true;
        state.books.push(action.payload); })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book._id === action.payload._id);
        if (index !== -1) state.books[index] = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book._id !== action.payload);
      })
     
      // Transactions
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = true;
         state.transactions = action.payload; })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = true;
         state.transactions.push(action.payload); })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = true;
        const index = state.transactions.findIndex(transaction => transaction._id === action.payload._id);
        if (index !== -1) state.transactions[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(transaction => transaction._id !== action.payload);
      });
  },
});

export default librarySlice.reducer;
