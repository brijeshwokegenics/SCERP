import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/reports';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// ➕ Create Report
export const createReport = createAsyncThunk(
  'report/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📥 Get All Reports
export const getAllReports = createAsyncThunk(
  'report/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📄 Get Report by ID
export const getReportById = createAsyncThunk(
  'report/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🖊️ Update Report
export const updateReport = createAsyncThunk(
  'report/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Delete Report
export const deleteReport = createAsyncThunk(
  'report/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ==========================
// Slice
// ==========================

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    reports: [],
    currentReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 Get All
      .addCase(getAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get by ID
      .addCase(getReportById.fulfilled, (state, action) => {
        state.currentReport = action.payload;
      })

      // ➕ Create
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
      })

      // 🖊️ Update
      .addCase(updateReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.reports[index] = action.payload;
      })

      // ❌ Delete
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(r => r._id !== action.payload);
      });
  },
});

export const { clearCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;
