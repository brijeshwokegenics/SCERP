import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/notices';

// Helper function to get headers with token
const getAuthHeaders = (thunkAPI) => {
  const token = thunkAPI.getState()?.auth?.token || localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Async Thunks with Token

export const fetchNotices = createAsyncThunk('notices/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(BASE_URL, getAuthHeaders(thunkAPI));
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notices');
  }
});

export const fetchNoticeById = createAsyncThunk('notices/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, getAuthHeaders(thunkAPI));
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notice');
  }
});

export const createNotice = createAsyncThunk('notices/create', async (noticeData, thunkAPI) => {
  try {
    const response = await axios.post(BASE_URL, noticeData, getAuthHeaders(thunkAPI));
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create notice');
  }
});

export const updateNotice = createAsyncThunk('notices/update', async ({ id, noticeData }, thunkAPI) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, noticeData, getAuthHeaders(thunkAPI));
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update notice');
  }
});

export const deleteNotice = createAsyncThunk('notices/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders(thunkAPI));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete notice');
  }
});

// Slice
const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    notices: [],
    notice: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetNoticeState: (state) => {
      state.notice = null;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.notice = action.payload;
      })

      .addCase(createNotice.fulfilled, (state, action) => {
        state.notices.unshift(action.payload);
        state.success = true;
      })

      .addCase(updateNotice.fulfilled, (state, action) => {
        state.notices = state.notices.map(n => n._id === action.payload._id ? action.payload : n);
        state.success = true;
      })

      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(n => n._id !== action.payload);
        state.success = true;
      });
  }
});

export const { resetNoticeState } = noticeSlice.actions;
export default noticeSlice.reducer;
