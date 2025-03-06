import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Adjust to match your backend’s base URL (or set via .env)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// 1) Fetch all schools (GET /schools)
export const fetchSchools = createAsyncThunk(
  'schools/fetchSchools',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/schools`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      // Assuming the API returns { success: true, data: [...] }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2) Create a new school (POST /schools)
export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (schoolData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/schools`, schoolData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3) Update an existing school (PUT /schools/:id)
export const updateSchool = createAsyncThunk(
  'schools/updateSchool',
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/schools/${id}`, data, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4) Delete a school (DELETE /schools/:id)
export const deleteSchool = createAsyncThunk(
  'schools/deleteSchool',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/schools/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const schoolsSlice = createSlice({
  name: 'schools',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers (if needed) can be added here.
  },
  extraReducers: (builder) => {
    builder
      // fetchSchools
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // createSchool
      .addCase(createSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // updateSchool
      .addCase(updateSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (school) => school._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // deleteSchool
      .addCase(deleteSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (school) => school._id !== action.payload
        );
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default schoolsSlice.reducer;
