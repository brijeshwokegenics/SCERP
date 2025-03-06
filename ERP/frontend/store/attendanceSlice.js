import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/attendance';

// 🔹 Fetch All Summaries
export const fetchAllSummaries = createAsyncThunk(
  'attendance/fetchAllSummaries',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/summaries`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch Summary by staffId, month, and year
export const fetchSummary = createAsyncThunk(
  'attendance/fetchSummary',
  async ({ staffId, month, year }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${API_URL}/summary/${staffId}/${month}/${year}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Delete Summary
export const deleteSummary = createAsyncThunk(
  'attendance/deleteSummary',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`${API_URL}/summary/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Create or Update Attendance
export const createOrUpdateAttendance = createAsyncThunk(
  'attendance/createOrUpdateAttendance',
  async (attendanceData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/attendance`, attendanceData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch All Attendance Records
export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAllAttendance',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/attendances`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch Attendance by staffId and date
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ staffId, date }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/attendance/${staffId}/${date}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Redux slice for attendance and summaries
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    summaries: [],
    attendanceRecords: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Summaries
      .addCase(fetchAllSummaries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSummaries.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = action.payload;
      })
      .addCase(fetchAllSummaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Summary by staffId, month, and year
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = [action.payload];
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Summary
      .addCase(deleteSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries = state.summaries.filter(
          (summary) => summary.id !== action.payload
        );
      })
      .addCase(deleteSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create or Update Attendance
      .addCase(createOrUpdateAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrUpdateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload || []; 
      })
      .addCase(createOrUpdateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Attendance Records
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Attendance by staffId and date
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = [action.payload];
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
