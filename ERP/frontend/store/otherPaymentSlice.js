import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/other-payment';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// FETCH
export const fetchPayments = createAsyncThunk(
  'otherPayment/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_BASE_URL, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

// CREATE
export const createPayment = createAsyncThunk(
  'otherPayment/create',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE_URL, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create payment');
    }
  }
);

// UPDATE
export const updatePayment = createAsyncThunk(
  'otherPayment/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update payment');
    }
  }
);

// DELETE
export const deletePayment = createAsyncThunk(
  'otherPayment/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
    }
  }
);

const otherPaymentSlice = createSlice({
  name: 'otherPayment',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetOtherPaymentState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOtherPaymentState } = otherPaymentSlice.actions;
export default otherPaymentSlice.reducer;
