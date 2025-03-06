import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

// Async Thunks
export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${BASE_URL}/payments`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payments");
    }
  }
);

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${BASE_URL}/payments`, paymentData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create payment");
    }
  }
);

export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async ({ id, paymentData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${BASE_URL}/payments/${id}`, paymentData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update payment");
    }
  }
);

export const deletePayment = createAsyncThunk(
  "payments/deletePayment",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${BASE_URL}/payments/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete payment");
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p._id !== action.payload);
      });
  },
});

export default paymentSlice.reducer;
