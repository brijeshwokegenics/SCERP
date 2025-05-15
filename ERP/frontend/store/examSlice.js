import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/exams';

// Helper to get headers for file and token (if needed)
const getHeaders = (state, isFileUpload = false) => {
  const token = state.auth?.token;
  const headers = {
    ...(isFileUpload ? { 'Content-Type': 'multipart/form-data' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return { headers };
};

// Get all exams
export const fetchExams = createAsyncThunk('exams/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, getHeaders(thunkAPI.getState()));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch exams');
  }
});

// Get single exam by ID
export const fetchExamById = createAsyncThunk('exams/fetchById', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`, getHeaders(thunkAPI.getState()));
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch exam');
  }
});

// Create a new exam (with file upload)
export const createExam = createAsyncThunk('exams/create', async (formData, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, formData, getHeaders(thunkAPI.getState(), true));
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create exam');
  }
});

// Update exam
export const updateExam = createAsyncThunk('exams/update', async ({ id, formData }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, formData, getHeaders(thunkAPI.getState(), true));
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update exam');
  }
});

// Delete exam
export const deleteExam = createAsyncThunk('exams/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getHeaders(thunkAPI.getState()));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete exam');
  }
});

const examSlice = createSlice({
  name: 'exams',
  initialState: {
    exams: [],
    exam: null,
    loading: false,
    error: null
  },
  reducers: {
    clearExam: (state) => {
      state.exam = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.exam = action.payload;
      })

      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload);
      })

      .addCase(updateExam.fulfilled, (state, action) => {
        const index = state.exams.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.exams[index] = action.payload;
      })

      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((e) => e._id !== action.payload);
      });
  }
});

export const { clearExam } = examSlice.actions;
export default examSlice.reducer;
