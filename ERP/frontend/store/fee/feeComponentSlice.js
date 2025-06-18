import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/fee-components';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ========================== Thunks ==========================

export const createFeeComponent = createAsyncThunk(
  'feeComponent/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllFeeComponents = createAsyncThunk(
  'feeComponent/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getFeeComponentById = createAsyncThunk(
  'feeComponent/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateFeeComponent = createAsyncThunk(
  'feeComponent/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFeeComponent = createAsyncThunk(
  'feeComponent/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ========================== Slice ==========================

const feeComponentSlice = createSlice({
  name: 'feeComponent',
  initialState: {
    feeComponents: [],
    currentFeeComponent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearFeeComponentState: (state) => {
      state.feeComponents = [];
      state.currentFeeComponent = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllFeeComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeeComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.feeComponents = action.payload;
      })
      .addCase(getAllFeeComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getFeeComponentById.fulfilled, (state, action) => {
        state.currentFeeComponent = action.payload;
      })

      // Create
      .addCase(createFeeComponent.fulfilled, (state, action) => {
        state.feeComponents.unshift(action.payload);
      })

      // Update
      .addCase(updateFeeComponent.fulfilled, (state, action) => {
        const index = state.feeComponents.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.feeComponents[index] = action.payload;
      })

      // Delete
      .addCase(deleteFeeComponent.fulfilled, (state, action) => {
        state.feeComponents = state.feeComponents.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearFeeComponentState } = feeComponentSlice.actions;
export default feeComponentSlice.reducer;
