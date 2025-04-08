import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/hostels';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch Hostels
export const getAllHostels = createAsyncThunk('hostel/fetchHostels', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}`, getAuthHeader(thunkAPI));
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Add Hostel
export const addHostel = createAsyncThunk('hostel/addHostel', async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}`, data, getAuthHeader(thunkAPI));
    return response.data;

  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update Hostel
export const updateHostel = createAsyncThunk('hostel/updateHostel', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader(thunkAPI));
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Delete Hostel
export const deleteHostel = createAsyncThunk('hostel/deleteHostel', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const hostelSlice = createSlice({
  name: 'hostel',
  initialState: {
    hostels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHostels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHostels.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels = action.payload;
      })
      .addCase(getAllHostels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addHostel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHostel.fulfilled, (state, action) => {
        state.loading = false;
        state.hostels.push(action.payload);
      })
      .addCase(addHostel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateHostel.fulfilled, (state, action) => {
        const index = state.hostels.findIndex(h => h._id === action.payload._id);
        if (index !== -1) state.hostels[index] = action.payload;
      })

      .addCase(deleteHostel.fulfilled, (state, action) => {
        state.hostels = state.hostels.filter(h => h._id !== action.payload);
      });
  },
});

export default hostelSlice.reducer;
