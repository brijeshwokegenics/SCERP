// redux/slices/feePaymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get auth token from thunkAPI
const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const API_BASE_URL = 'http://localhost:4000/api/fee-payments'; // update if needed

// CREATE Fee Payment
export const createFeePayment = createAsyncThunk(
  'feePayments/create',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(API_BASE_URL, formData, getAuthHeader(thunkAPI));
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

// GET All Fee Payments
export const getAllFeePayments = createAsyncThunk(
  'feePayments/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_BASE_URL, getAuthHeader(thunkAPI));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// GET One Fee Payment
export const getFeePaymentById = createAsyncThunk(
  'feePayments/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeader(thunkAPI));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch by ID failed');
    }
  }
);

// UPDATE Fee Payment
export const updateFeePayment = createAsyncThunk(
  'feePayments/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, getAuthHeader(thunkAPI));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// DELETE Fee Payment
export const deleteFeePayment = createAsyncThunk(
  'feePayments/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

const feePaymentSlice = createSlice({
  name: 'feePayments',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearFeeMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createFeePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFeePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Fee Payment created';
        state.list.push(action.payload);
      })
      .addCase(createFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllFeePayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFeePayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllFeePayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getFeePaymentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeePaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getFeePaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateFeePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFeePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Fee Payment updated';
        const index = state.list.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteFeePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFeePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Fee Payment deleted';
        state.list = state.list.filter(item => item._id !== action.payload);
      })
      .addCase(deleteFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeeMessages } = feePaymentSlice.actions;
export default feePaymentSlice.reducer;
