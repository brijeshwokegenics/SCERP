import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/marks';

// Helper to get auth token if needed (optional)
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
});

// === Thunks ===

// Fetch all marks
export const fetchMarks = createAsyncThunk('marks/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, getHeaders());
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch marks');
  }
});

// Create a mark
export const createMark = createAsyncThunk('marks/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, getHeaders());
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create mark');
  }
});

// Update a mark
export const updateMark = createAsyncThunk('marks/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, getHeaders());
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update mark');
  }
});

// Delete a mark
export const deleteMark = createAsyncThunk('marks/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getHeaders());
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete mark');
  }
});

// === Slice ===

const markSlice = createSlice({
  name: 'marks',
  initialState: {
    marks: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearMarkMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.marks = action.payload;
      })
      .addCase(fetchMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createMark.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMark.fulfilled, (state, action) => {
        state.loading = false;
        state.marks.push(action.payload);
        state.successMessage = 'Mark added successfully';
      })
      .addCase(createMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateMark.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.marks.findIndex(mark => mark._id === action.payload._id);
        if (index !== -1) state.marks[index] = action.payload;
        state.successMessage = 'Mark updated successfully';
      })
      .addCase(updateMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteMark.fulfilled, (state, action) => {
        state.loading = false;
        state.marks = state.marks.filter(mark => mark._id !== action.payload);
        state.successMessage = 'Mark deleted successfully';
      })
      .addCase(deleteMark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMarkMessages } = markSlice.actions;
export default markSlice.reducer;
