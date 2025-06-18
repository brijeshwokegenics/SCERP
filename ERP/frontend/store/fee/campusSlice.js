import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/campus';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// 🔵 Create Campus
export const createCampus = createAsyncThunk(
  'campus/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.campus; // ✅ correct key from backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔵 Get All Campuses
export const getAllCampus = createAsyncThunk(
  'campus/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, getHeaders(token));
      return res.data.campuses; // ✅ correct key from backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔵 Get Campus by ID
export const getCampusById = createAsyncThunk(
  'campus/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.campus;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔵 Update Campus
export const updateCampus = createAsyncThunk(
  'campus/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.campus;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔵 Delete Campus
export const deleteCampus = createAsyncThunk(
  'campus/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ==========================
// Slice
// ==========================

const campusSlice = createSlice({
  name: 'campus',
  initialState: {
    campuses: [], // ✅ plural for list
    currentCampus: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCampusState: (state) => {
      state.campuses = [];
      state.currentCampus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Get All
      .addCase(getAllCampus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCampus.fulfilled, (state, action) => {
        state.loading = false;
        state.campuses = action.payload;
      })
      .addCase(getAllCampus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get by ID
      .addCase(getCampusById.fulfilled, (state, action) => {
        state.currentCampus = action.payload;
      })

      // ➕ Create
      .addCase(createCampus.fulfilled, (state, action) => {
        if (action.payload) {
          state.campuses.unshift(action.payload);
        }
      })

      // 🖊️ Update
      .addCase(updateCampus.fulfilled, (state, action) => {
        const index = state.campuses.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.campuses[index] = action.payload;
        }
      })

      // ❌ Delete
      .addCase(deleteCampus.fulfilled, (state, action) => {
        state.campuses = state.campuses.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearCampusState } = campusSlice.actions;
export default campusSlice.reducer;
