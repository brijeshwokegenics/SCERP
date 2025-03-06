import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

// Async Thunks
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${BASE_URL}/teacher`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.teachers;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch teachers");
    }
  }
);

export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (teacherData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${BASE_URL}/teacher`, teacherData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create teacher");
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async ({ id, teacherData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${BASE_URL}/teacher/${id}`, teacherData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update teacher");
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${BASE_URL}/teacher/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete teacher");
    }
  }
);

const initialState = {
  teachers: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(t => t._id !== action.payload);
      });
  },
});

export default teacherSlice.reducer;
