import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/fee-structures';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// ➕ Create Fee Structure
export const createFeeStructure = createAsyncThunk(
  'feeStructure/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📥 Get All Fee Structures
export const getAllFeeStructures = createAsyncThunk(
  'feeStructure/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🖊️ Update Fee Structure
export const updateFeeStructure = createAsyncThunk(
  'feeStructure/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Delete Fee Structure
export const deleteFeeStructure = createAsyncThunk(
  'feeStructure/delete',
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

const feeStructureSlice = createSlice({
  name: 'feeStructure',
  initialState: {
    structures: [],
    loading: false,
    error: null,
    currentStructure: null,
  },
  reducers: {
    clearCurrentStructure: (state) => {
      state.currentStructure = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 Get All
      .addCase(getAllFeeStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeeStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = action.payload;
      })
      .addCase(getAllFeeStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.structures.unshift(action.payload);
      })

      // 🖊️ Update
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        const index = state.structures.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.structures[index] = action.payload;
      })

      // ❌ Delete
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.structures = state.structures.filter(s => s._id !== action.payload);
      });
  },
});

export const { clearCurrentStructure } = feeStructureSlice.actions;
export default feeStructureSlice.reducer;
