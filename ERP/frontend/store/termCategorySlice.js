import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/term-category';

// Helper to include auth headers if needed
const getHeaders = (state) => {
  const token = state.auth?.token;
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
};

// Fetch all term categories
export const fetchTermCategories = createAsyncThunk(
  'termCategory/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL, getHeaders(thunkAPI.getState()));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch term categories');
    }
  }
);

// Fetch one term category by ID
export const fetchTermCategoryById = createAsyncThunk(
  'termCategory/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getHeaders(thunkAPI.getState()));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch term category');
    }
  }
);

// Create a new term category
export const createTermCategory = createAsyncThunk(
  'termCategory/create',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, data, getHeaders(thunkAPI.getState()));
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create term category');
    }
  }
);

// Update an existing term category
export const updateTermCategory = createAsyncThunk(
  'termCategory/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, getHeaders(thunkAPI.getState()));
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update term category');
    }
  }
);

// Delete a term category
export const deleteTermCategory = createAsyncThunk(
  'termCategory/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getHeaders(thunkAPI.getState()));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete term category');
    }
  }
);

const termCategorySlice = createSlice({
  name: 'termCategory',
  initialState: {
    terms: [],
    selectedTerm: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedTerm: (state) => {
      state.selectedTerm = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTermCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = action.payload;
      })
      .addCase(fetchTermCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTermCategoryById.fulfilled, (state, action) => {
        state.selectedTerm = action.payload;
      })

      .addCase(createTermCategory.fulfilled, (state, action) => {
        state.terms.unshift(action.payload);
      })

      .addCase(updateTermCategory.fulfilled, (state, action) => {
        const index = state.terms.findIndex((term) => term._id === action.payload._id);
        if (index !== -1) {
          state.terms[index] = action.payload;
        }
      })

      .addCase(deleteTermCategory.fulfilled, (state, action) => {
        state.terms = state.terms.filter((term) => term._id !== action.payload);
      });
  }
});

export const { clearSelectedTerm } = termCategorySlice.actions;
export default termCategorySlice.reducer;

