import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/hostel-fees';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// ➕ Create Hostel Fee
export const createHostelFee = createAsyncThunk(
  'hostelFee/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📥 Get All Hostel Fees
export const getAllHostelFees = createAsyncThunk(
  'hostelFee/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📄 Get Hostel Fee by ID
export const getHostelFeeById = createAsyncThunk(
  'hostelFee/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🖊️ Update Hostel Fee
export const updateHostelFee = createAsyncThunk(
  'hostelFee/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Delete Hostel Fee
export const deleteHostelFee = createAsyncThunk(
  'hostelFee/delete',
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

const hostelFeeSlice = createSlice({
  name: 'hostelFee',
  initialState: {
    hostelFees: [],
    currentHostelFee: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentHostelFee: (state) => {
      state.currentHostelFee = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 Get All
      .addCase(getAllHostelFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHostelFees.fulfilled, (state, action) => {
        state.loading = false;
        state.hostelFees = action.payload;
      })
      .addCase(getAllHostelFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get by ID
      .addCase(getHostelFeeById.fulfilled, (state, action) => {
        state.currentHostelFee = action.payload;
      })

      // ➕ Create
      .addCase(createHostelFee.fulfilled, (state, action) => {
        state.hostelFees.unshift(action.payload);
      })

      // 🖊️ Update
      .addCase(updateHostelFee.fulfilled, (state, action) => {
        const index = state.hostelFees.findIndex(f => f._id === action.payload._id);
        if (index !== -1) state.hostelFees[index] = action.payload;
      })

      // ❌ Delete
      .addCase(deleteHostelFee.fulfilled, (state, action) => {
        state.hostelFees = state.hostelFees.filter(f => f._id !== action.payload);
      });
  },
});

export const { clearCurrentHostelFee } = hostelFeeSlice.actions;
export default hostelFeeSlice.reducer;
