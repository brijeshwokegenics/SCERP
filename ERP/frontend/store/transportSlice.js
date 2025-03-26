import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const TRANSPORT_URL = '/api/transports';
const ROUTE_URL = '/api/routes';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ============================
// TRANSPORT Thunks
// ============================

export const fetchTransports = createAsyncThunk(
  'transport/fetchAll',
  async (token, thunkAPI) => {
    try {
      const res = await axios.get(TRANSPORT_URL, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createTransport = createAsyncThunk(
  'transport/create',
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axios.post(TRANSPORT_URL, data, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateTransport = createAsyncThunk(
  'transport/update',
  async ({ id, data, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${TRANSPORT_URL}/${id}`, data, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteTransport = createAsyncThunk(
  'transport/delete',
  async ({ id, token }, thunkAPI) => {
    try {
      await axios.delete(`${TRANSPORT_URL}/${id}`, getAuthHeaders(token));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ============================
// ROUTE Thunks
// ============================

export const fetchRoutes = createAsyncThunk(
  'route/fetchAll',
  async (token, thunkAPI) => {
    try {
      const res = await axios.get(ROUTE_URL, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createRoute = createAsyncThunk(
  'route/create',
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axios.post(ROUTE_URL, data, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateRoute = createAsyncThunk(
  'route/update',
  async ({ id, data, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${ROUTE_URL}/${id}`, data, getAuthHeaders(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteRoute = createAsyncThunk(
  'route/delete',
  async ({ id, token }, thunkAPI) => {
    try {
      await axios.delete(`${ROUTE_URL}/${id}`, getAuthHeaders(token));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ============================
// Slice
// ============================

const transportSlice = createSlice({
  name: 'transportSystem',
  initialState: {
    transports: [],
    routes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTransportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Transport
    builder
      .addCase(fetchTransports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransports.fulfilled, (state, action) => {
        state.transports = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransports.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createTransport.fulfilled, (state, action) => {
        state.transports.push(action.payload);
      })
      .addCase(updateTransport.fulfilled, (state, action) => {
        const index = state.transports.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.transports[index] = action.payload;
      })
      .addCase(deleteTransport.fulfilled, (state, action) => {
        state.transports = state.transports.filter(t => t._id !== action.payload);
      })

      // Route
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.routes = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.routes.push(action.payload);
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        const index = state.routes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.routes[index] = action.payload;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter(r => r._id !== action.payload);
      });
  },
});

export const { clearTransportError } = transportSlice.actions;
export default transportSlice.reducer;