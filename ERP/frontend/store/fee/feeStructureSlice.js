import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/fee-structure';

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

export const getAllFeeStructures = createAsyncThunk(
  'feeStructure/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, getHeaders(token));
      return res.data.feeStructures; // ✅ Only return the actual array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// 🔍 Get Fee Structure By ID
export const getFeeStructureById = createAsyncThunk(
  'feeStructure/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
     console.log("res Id" + id)
      return res.data;
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
        console.log("res" + res.data.data)
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
    currentFeeStructure: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStructure: (state) => {
      state.currentFeeStructure = null;
      state.error = null;
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
      .addCase(createFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures.unshift(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔍 Get By ID
      .addCase(getFeeStructureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeStructureById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeeStructure = action.payload;
      })
      .addCase(getFeeStructureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentStructure = null;
      })

      // 🖊️ Update
      .addCase(updateFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.structures.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.structures[index] = action.payload;
        state.currentStructure = null;
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = state.structures.filter(s => s._id !== action.payload);
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStructure } = feeStructureSlice.actions;
export default feeStructureSlice.reducer;
