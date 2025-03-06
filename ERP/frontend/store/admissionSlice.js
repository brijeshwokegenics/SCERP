import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/admissions'; // Adjust this URL based on your backend setup

// Fetch all admissions for the logged-in user
export const fetchAdmissions = createAsyncThunk(
  'admissions/fetchAdmissions',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admissions');
    }
  }
);

// Fetch a single admission by ID
export const fetchAdmissionById = createAsyncThunk(
  'admissions/fetchAdmissionById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admission');
    }
  }
);

// Create a new admission
export const createAdmission = createAsyncThunk(
  'admissions/createAdmission',
  async (admissionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(BASE_URL, admissionData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create admission');
    }
  }
);

// Update an existing admission
export const updateAdmission = createAsyncThunk(
  'admissions/updateAdmission',
  async ({ id, updatedData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${BASE_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update admission');
    }
  }
);

// Delete an admission
export const deleteAdmission = createAsyncThunk(
  'admissions/deleteAdmission',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete admission');
    }
  }
);

// Admission Slice
const admissionSlice = createSlice({
  name: 'admissions',
  initialState: {
    admissions: [],
    currentAdmission: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentAdmission: (state) => {
      state.currentAdmission = null;
    },
    createAdmission: (state, action) => {
      // Add the new admission to the array
      const newAdmission = action.payload;
      state.admissions.push(newAdmission);

      // Update maxAdmissionNumber if needed
      const admissionNum = parseInt(newAdmission.admissionNumber, 10);
      if (admissionNum > state.maxAdmissionNumber) {
        state.maxAdmissionNumber = admissionNum;
      }
    },
    updateAdmission: (state, action) => {
      const updatedAdmission = action.payload;
      const index = state.admissions.findIndex(
        (item) => item.id === updatedAdmission.id
      );
      if (index !== -1) {
        state.admissions[index] = updatedAdmission;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all admissions
      .addCase(fetchAdmissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdmissions.fulfilled, (state, action) => {
        state.admissions = action.payload;

        // Determine the max admissionNumber from the fetched data
        const maxNum = Math.max(
          0,
          ...action.payload.map((item) => parseInt(item.admissionNumber, 10))
        );
        state.maxAdmissionNumber = maxNum;
        state.status = "succeeded";
      })
      .addCase(fetchAdmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch a single admission by ID
      .addCase(fetchAdmissionById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdmissionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAdmission = action.payload;
      })
      .addCase(fetchAdmissionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create a new admission
      .addCase(createAdmission.fulfilled, (state, action) => {
        state.admissions.push(action.payload);
      })

      // Update an existing admission
      .addCase(updateAdmission.fulfilled, (state, action) => {
        const index = state.admissions.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.admissions[index] = action.payload;
        }
      })

      // Delete an admission
      .addCase(deleteAdmission.fulfilled, (state, action) => {
        state.admissions = state.admissions.filter((a) => a._id !== action.payload);
      });
  },
});

// Export reducers and actions
export const { clearCurrentAdmission, } = admissionSlice.actions;
export const selectMaxAdmissionNumber = (state) =>
  state.admissions.maxAdmissionNumber;

export const selectAdmissions = (state) => state.admissions.admissions;

// Returns a single admission by ID
export const selectAdmissionById = (state, id) =>
  state.admissions.admissions.find((a) => a.id === id);

export default admissionSlice.reducer;
