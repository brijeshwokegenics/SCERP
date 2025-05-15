import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/feecomponents';

// Helper to set headers with token
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});


// ==========================
// Thunks (Async Actions)
// ==========================

// 🔵 Add Fee Component
export const addFeeComponent = createAsyncThunk(
  'feeComponent/add',
  async ({ structureId, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/${structureId}/components`, formData, getHeaders(token));
      return res.data.data; // updated full FeeStructure
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 🔵 Get All Fee Components of a FeeStructure
export const getAllFeeComponents = createAsyncThunk(
  'feeComponent/getAll',
  async ({ structureId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${structureId}/components`, getHeaders(token));
      return res.data.data; // array of components
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 🔵 Get Single Fee Component by ID
export const getFeeComponentById = createAsyncThunk(
  'feeComponent/getById',
  async ({ structureId, componentId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${structureId}/components/${componentId}`, getHeaders(token));
      return res.data.data; // single component
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 🔵 Update Fee Component
export const updateFeeComponent = createAsyncThunk(
  'feeComponent/update',
  async ({ structureId, componentId, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${structureId}/components/${componentId}`, formData, getHeaders(token));
      return res.data.data; // updated full FeeStructure
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 🔵 Delete Fee Component
export const deleteFeeComponent = createAsyncThunk(
  'feeComponent/delete',
  async ({ structureId, componentId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${structureId}/components/${componentId}`, getHeaders(token));
      return { componentId };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



// ==========================
// Slice
// ==========================

const feeComponentSlice = createSlice({
  name: 'feeComponent',
  initialState: {
    components: [],      // array of components
    currentComponent: null, // selected component
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentComponent: (state) => {
      state.currentComponent = null;
    },
    clearFeeComponentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // 🔵 Add Fee Component
      .addCase(addFeeComponent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFeeComponent.fulfilled, (state, action) => {
        state.loading = false;
        // After adding, components refreshed separately
      })
      .addCase(addFeeComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Get All Components
      .addCase(getAllFeeComponents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFeeComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.components = action.payload;
      })
      .addCase(getAllFeeComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Get Single Component
      .addCase(getFeeComponentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeeComponentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComponent = action.payload;
      })
      .addCase(getFeeComponentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Update Fee Component
      .addCase(updateFeeComponent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFeeComponent.fulfilled, (state) => {
        state.loading = false;
        // After update, refetch all components if needed
      })
      .addCase(updateFeeComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Delete Fee Component
      .addCase(deleteFeeComponent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFeeComponent.fulfilled, (state, action) => {
        state.loading = false;
        state.components = state.components.filter(c => c._id !== action.payload.componentId);
      })
      .addCase(deleteFeeComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentComponent, clearFeeComponentError } = feeComponentSlice.actions;

export default feeComponentSlice.reducer;
