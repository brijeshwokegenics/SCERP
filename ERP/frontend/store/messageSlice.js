import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/messages';

// Helper to get headers with token
const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Async Thunks

export const fetchMessages = createAsyncThunk('messages/fetchAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    console.log('Token:', token);
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Fetch messages error:', error);
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

  

export const fetchMessageById = createAsyncThunk('messages/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const createMessage = createAsyncThunk('messages/create', async (formData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/compose`, formData, {
      ...getAuthHeader(thunkAPI),
      headers: {
        ...getAuthHeader(thunkAPI).headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const updateMessage = createAsyncThunk('messages/update', async ({ id, formData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      ...getAuthHeader(thunkAPI),
      headers: {
        ...getAuthHeader(thunkAPI).headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteMessage = createAsyncThunk('messages/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Slice
const initialState = {
  items: [],
  loading: false,
  error: null
};

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    currentMessage: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentMessage(state) {
      state.currentMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(fetchMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessage = action.payload;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const index = state.items.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.items = state.items.filter(m => m._id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearCurrentMessage } = messageSlice.actions;
export default messageSlice.reducer;
