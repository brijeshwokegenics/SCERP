import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/exam-halls'; // Change if needed

// 🔐 Auth Header Helper
const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// 🔄 Fetch all halls
export const fetchExamHalls = createAsyncThunk(
  'examHall/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, getAuthHeader(thunkAPI));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch halls');
    }
  }
);

// ➕ Create a new hall
export const createExamHall = createAsyncThunk(
  'examHall/create',
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, data, getAuthHeader(thunkAPI));
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create hall');
    }
  }
);

// 🔁 Update a hall
export const updateExamHall = createAsyncThunk(
  'examHall/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader(thunkAPI));
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update hall');
    }
  }
);

// ❌ Delete a hall
export const deleteExamHall = createAsyncThunk(
  'examHall/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete hall');
    }
  }
);

const examHallSlice = createSlice({
  name: 'examHall',
  initialState: {
    halls: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExamHalls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamHalls.fulfilled, (state, action) => {
        state.loading = false;
        state.halls = action.payload;
      })
      .addCase(fetchExamHalls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createExamHall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamHall.fulfilled, (state, action) => {
        state.loading = false;
        state.halls.push(action.payload);
      })
      .addCase(createExamHall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateExamHall.fulfilled, (state, action) => {
        const index = state.halls.findIndex(hall => hall._id === action.payload._id);
        if (index !== -1) state.halls[index] = action.payload;
      })

      // Delete
      .addCase(deleteExamHall.fulfilled, (state, action) => {
        state.halls = state.halls.filter(hall => hall._id !== action.payload);
      });
  }
});

export default examHallSlice.reducer;
