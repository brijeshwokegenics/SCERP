import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/grades';

// Utility for headers
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
});

// ========================
// Thunks
// ========================

// Fetch all grades
export const fetchGrades = createAsyncThunk('grades/fetchAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    const res = await axios.get(API_URL, getHeaders(token));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch grades');
  }
});

// Create a new grade
export const createGrade = createAsyncThunk('grades/create', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    const res = await axios.post(API_URL, data, getHeaders(token));
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create grade');
  }
});

// Update grade
export const updateGrade = createAsyncThunk('grades/update', async ({ id, data }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    const res = await axios.put(`${API_URL}/${id}`, data, getHeaders(token));
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update grade');
  }
});

// Delete grade
export const deleteGrade = createAsyncThunk('grades/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    await axios.delete(`${API_URL}/${id}`, getHeaders(token));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete grade');
  }
});

// ========================
// Slice
// ========================

const gradeSlice = createSlice({
  name: 'grades',
  initialState: {
    grades: [],
    loading: false,
    error: null,
    successMessage: '',
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // ==== FETCH ====
      .addCase(fetchGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload;
        state.successMessage = 'Grades fetched successfully';
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==== CREATE ====
      .addCase(createGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades.push(action.payload);
        state.successMessage = 'Grade created successfully';
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==== UPDATE ====
      .addCase(updateGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.grades.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.grades[index] = action.payload;
        }
        state.successMessage = 'Grade updated successfully';
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==== DELETE ====
      .addCase(deleteGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = state.grades.filter(g => g._id !== action.payload);
        state.successMessage = 'Grade deleted successfully';
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMessages } = gradeSlice.actions;
export default gradeSlice.reducer;
