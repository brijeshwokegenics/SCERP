import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/holidays';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Fetch holidays
export const fetchHolidays = createAsyncThunk(
  'holiday/fetchHolidays',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, getAuthHeader(thunkAPI));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add holiday
export const addHoliday = createAsyncThunk(
  'holiday/addHoliday',
  async (holidayData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, holidayData, getAuthHeader(thunkAPI));
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete holiday
export const deleteHoliday = createAsyncThunk(
  'holiday/deleteHoliday',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const holidaySlice = createSlice({
  name: 'holiday',
  initialState: {
    holidays: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays.push(action.payload);
      })
      .addCase(addHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.holidays = state.holidays.filter(h => h._id !== action.payload);
      });
  },
});

export default holidaySlice.reducer;
