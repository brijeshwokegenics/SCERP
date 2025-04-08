import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/income';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// FETCH
export const fetchIncomes = createAsyncThunk(
  'income/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_BASE_URL, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch incomes');
    }
  }
);

// CREATE
export const createIncome = createAsyncThunk(
  'income/create',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE_URL, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create income');
    }
  }
);

// UPDATE
export const updateIncome = createAsyncThunk(
  'income/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeader(thunkAPI));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update income');
    }
  }
);

// DELETE
export const deleteIncome = createAsyncThunk(
  'income/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete income');
    }
  }
);

// SLICE
const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetIncomeState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetIncomeState } = incomeSlice.actions;
export default incomeSlice.reducer;
