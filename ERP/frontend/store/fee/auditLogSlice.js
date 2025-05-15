import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/audit-logs';

// 🔐 Helper to set headers
const getHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ===============================
// Thunks
// ===============================

// 📌 Create a new audit log
export const createAuditLog = createAsyncThunk(
  'auditLog/create',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📌 Get all audit logs
export const getAuditLogs = createAsyncThunk(
  'auditLog/getAll',
  async ({ token, params = {} }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`, {
        ...getHeaders(token),
        params,
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📌 Get audit log by ID
export const getAuditLogById = createAsyncThunk(
  'auditLog/getById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📌 Get logs by reference ID
export const getLogsByReference = createAsyncThunk(
  'auditLog/getByReference',
  async ({ referenceId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/reference/${referenceId}`, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📌 Update audit log
export const updateAuditLog = createAsyncThunk(
  'auditLog/update',
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, formData, getHeaders(token));
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📌 Delete audit log
export const deleteAuditLog = createAsyncThunk(
  'auditLog/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, getHeaders(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ===============================
// Slice
// ===============================

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState: {
    logs: [],
    currentLog: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuditState: (state) => {
      state.logs = [];
      state.currentLog = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔵 Get all logs
      .addCase(getAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔵 Get single log
      .addCase(getAuditLogById.fulfilled, (state, action) => {
        state.currentLog = action.payload;
      })

      // 🔵 Create log
      .addCase(createAuditLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      })

      // 🔵 Update log
      .addCase(updateAuditLog.fulfilled, (state, action) => {
        const index = state.logs.findIndex(log => log._id === action.payload._id);
        if (index !== -1) state.logs[index] = action.payload;
      })

      // 🔵 Delete log
      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter(log => log._id !== action.payload);
      })

      // 🔵 Get logs by reference
      .addCase(getLogsByReference.fulfilled, (state, action) => {
        state.logs = action.payload;
      });
  },
});

export const { clearAuditState } = auditLogSlice.actions;
export default auditLogSlice.reducer;
