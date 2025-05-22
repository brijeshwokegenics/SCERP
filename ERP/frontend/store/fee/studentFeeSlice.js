import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/student-fees';

const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ==========================
// Thunks
// ==========================

// ➕ Create Student Fee
export const createStudentFee = createAsyncThunk(
  'studentFee/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📥 Get All Student Fees
export const getAllStudentFees = createAsyncThunk(
  'studentFee/getAll',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📄 Get Student Fee by ID
export const getStudentFeeById = createAsyncThunk(
  'studentFee/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🖊️ Update Student Fee
export const updateStudentFee = createAsyncThunk(
  'studentFee/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Delete Student Fee
export const deleteStudentFee = createAsyncThunk(
  'studentFee/delete',
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

const studentFeeSlice = createSlice({
  name: 'studentFee',
  initialState: {
    studentFees: [],
    currentStudentFee: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStudentFee: (state) => {
      state.currentStudentFee = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📥 Get All
      .addCase(getAllStudentFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudentFees.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees = action.payload;
      })
      .addCase(getAllStudentFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Get by ID
      .addCase(getStudentFeeById.fulfilled, (state, action) => {
        state.currentStudentFee = action.payload;
      })

      // ➕ Create
      .addCase(createStudentFee.fulfilled, (state, action) => {
        state.studentFees.unshift(action.payload);
      })

      // 🖊️ Update
      .addCase(updateStudentFee.fulfilled, (state, action) => {
        const index = state.studentFees.findIndex(fee => fee._id === action.payload._id);
        if (index !== -1) state.studentFees[index] = action.payload;
      })

      // ❌ Delete
      .addCase(deleteStudentFee.fulfilled, (state, action) => {
        state.studentFees = state.studentFees.filter(fee => fee._id !== action.payload);
      });
  },
});

export const { clearCurrentStudentFee } = studentFeeSlice.actions;
export default studentFeeSlice.reducer;
