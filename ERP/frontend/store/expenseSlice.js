import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/expense';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
  'expense/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_BASE_URL, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

// Create new expense
export const createExpense = createAsyncThunk(
  'expense/create',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE_URL, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create expense');
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  'expense/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update expense');
    }
  }
);

// Delete expense
export const deleteExpense = createAsyncThunk(
  'expense/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
    }
  }
);

// Slice
const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetExpenseState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExpenseState } = expenseSlice.actions;
export default expenseSlice.reducer;
