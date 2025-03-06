import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/exam-schedules"; // Update with your backend URL

// Fetch all exam schedules
export const fetchExamSchedules = createAsyncThunk(
  "examSchedules/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch exam schedule by date
export const fetchExamScheduleByDate = createAsyncThunk(
  "examSchedules/fetchByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${date}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new exam schedule
export const createExamSchedule = createAsyncThunk(
  "examSchedules/create",
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, scheduleData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an exam schedule
export const updateExamSchedule = createAsyncThunk(
  "examSchedules/update",
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, scheduleData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete an exam schedule
export const deleteExamSchedule = createAsyncThunk(
  "examSchedules/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id; // Return deleted ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const examScheduleSlice = createSlice({
  name: "examSchedules",
  initialState: {
    schedules: [],
    schedule: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all schedules
      .addCase(fetchExamSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchExamSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch schedule by date
      .addCase(fetchExamScheduleByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamScheduleByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })
      .addCase(fetchExamScheduleByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create schedule
      .addCase(createExamSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createExamSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update schedule
      .addCase(updateExamSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.map(schedule =>
          schedule._id === action.payload._id ? action.payload : schedule
        );
      })
      .addCase(updateExamSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete schedule
      .addCase(deleteExamSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = state.schedules.filter(schedule => schedule._id !== action.payload);
      })
      .addCase(deleteExamSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default examScheduleSlice.reducer;
