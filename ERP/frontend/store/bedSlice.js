import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/beds';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Create
export const addBed = createAsyncThunk('bed/addBed', async ({ data, token }, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Get All
export const getBeds = createAsyncThunk('bed/getAllBeds', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, getAuthHeader(thunkAPI));
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update
export const updateBed = createAsyncThunk('bed/updateBed', async ({ id, data, token }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Delete
export const deleteBed = createAsyncThunk('bed/deleteBed', async ({ id, token }, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const bedSlice = createSlice({
  name: 'bed',
  initialState: {
    beds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addBed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBed.fulfilled, (state, action) => {
        state.loading = false;
        state.beds.push(action.payload);
      })
      .addCase(addBed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getBeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = action.payload;
      })
      .addCase(getBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBed.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.beds.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.beds[idx] = action.payload;
      })
      .addCase(updateBed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteBed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBed.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = state.beds.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBedError } = bedSlice.actions;
export default bedSlice.reducer;
