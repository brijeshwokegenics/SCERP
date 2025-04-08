import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/rooms';

const getAuthHeader = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Create Room
export const createRoom = createAsyncThunk('room/create', async (data, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, data, getAuthHeader(thunkAPI));
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Get All Rooms
export const getRooms = createAsyncThunk('room/getAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, getAuthHeader(thunkAPI));
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update Room
export const updateRoom = createAsyncThunk('room/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeader(thunkAPI));
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Delete Room
export const deleteRoom = createAsyncThunk('room/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const roomSlice = createSlice({
  name: 'room',
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateRoom.fulfilled, (state, action) => {
        const idx = state.rooms.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.rooms[idx] = action.payload;
      })

      // Delete
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(r => r._id !== action.payload);
      });
  }
});

export const { clearRoomError } = roomSlice.actions;
export default roomSlice.reducer;
