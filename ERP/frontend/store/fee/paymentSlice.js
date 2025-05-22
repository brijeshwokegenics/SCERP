import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/payments';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// ➕ Create Payment
export const createPayment = createAsyncThunk(
  'payment/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📥 Get All Payments
export const getAllPayments = createAsyncThunk(
  'payment/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📄 Get Payment by ID
export const getPaymentById = createAsyncThunk(
  'payment/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🖊️ Update Payment
export const updatePayment = createAsyncThunk(
  'payment/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Delete Payment
export const deletePayment = createAsyncThunk(
  'payment/delete',
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

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 Get All
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get by ID
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
      })

      // ➕ Create
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })

      // 🖊️ Update
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.payments[index] = action.payload;
      })

      // ❌ Delete
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
