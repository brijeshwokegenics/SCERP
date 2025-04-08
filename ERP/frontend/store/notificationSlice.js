import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/notifications';

// Helper to get token from state or localStorage
const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState()?.auth?.token || localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ========== Thunks ==========

// Create Notification
export const createNotification = createAsyncThunk(
  'notifications/create',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, data, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get All Notifications
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get One Notification
export const getNotificationById = createAsyncThunk(
  'notifications/getOne',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Notification
export const updateNotification = createAsyncThunk(
  'notifications/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders(thunkAPI));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders(thunkAPI));
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ========== Slice ==========
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    currentNotification: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationState: (state) => {
      state.notifications = [];
      state.currentNotification = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload.notification);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Read All
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Read One
      .addCase(getNotificationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotification = action.payload;
      })
      .addCase(getNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((notif) =>
          notif._id === action.payload.updated._id ? action.payload.updated : notif
        );
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notif) => notif._id !== action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;