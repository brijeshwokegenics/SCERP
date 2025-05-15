import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/attendance';

// 🔁 Helper to get auth headers (if using token)
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
});

// 🔄 Async Thunks

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axios.post(API_BASE_URL, data, getHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create attendance');
    }
  }
);

export const getAllAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (token, thunkAPI) => {
    try {
      const res = await axios.get(API_BASE_URL, getHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const getAttendanceById = createAsyncThunk(
  'attendance/fetchById',
  async ({ id, token }, thunkAPI) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${id}`, getHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch attendance by ID');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, data, getHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update attendance');
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async ({ id, token }, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete attendance');
    }
  }
);

// ⚙️ Slice

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentAttendance: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload.data);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(getAttendanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getAttendanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) state.records[index] = action.payload.data;
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
