// store/promoteSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000/api';

// Async thunk to promote students in bulk
export const promoteStudents = createAsyncThunk(
  'promotes',
  async ({ studentIds, newAdmissionClass }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${BASE_URL}/promotes`,
        { studentIds, newAdmissionClass },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to promote students'
      );
    }
  }
);

const promoteSlice = createSlice({
  name: 'promote',
  initialState: {
    loading: false,
    error: null,
    promotedData: null,
  },
  reducers: {
    clearPromoteState: (state) => {
      state.loading = false;
      state.error = null;
      state.promotedData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(promoteStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.promotedData = null;
      })
      .addCase(promoteStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.promotedData = action.payload;
      })
      .addCase(promoteStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPromoteState } = promoteSlice.actions;
export default promoteSlice.reducer;
