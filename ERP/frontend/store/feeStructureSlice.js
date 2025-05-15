import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set API base
const BASE_URL = 'http://localhost:4000/api/feestructures';

// Helper to attach token in header
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// Create FeeStructure
export const createFeeStructure = createAsyncThunk(
  'feeStructure/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get All FeeStructures
export const getAllFeeStructures = createAsyncThunk(
  'feeStructure/getAll',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get Single FeeStructure
export const getFeeStructureById = createAsyncThunk(
  'feeStructure/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update FeeStructure
export const updateFeeStructure = createAsyncThunk(
  'feeStructure/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete FeeStructure
export const deleteFeeStructure = createAsyncThunk(
  'feeStructure/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
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
    currentStructure: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStructure: (state) => {
      state.currentStructure = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createFeeStructure.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get All
      .addCase(getAllFeeStructures.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFeeStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = action.payload;
      })
      .addCase(getAllFeeStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get One
      .addCase(getFeeStructureById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeeStructureById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStructure = action.payload;
      })
      .addCase(getFeeStructureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateFeeStructure.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.structures.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.structures[index] = action.payload;
        }
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteFeeStructure.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = state.structures.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStructure } = feeStructureSlice.actions;

export default feeStructureSlice.reducer;
