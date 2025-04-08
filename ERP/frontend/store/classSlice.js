import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Get auth token from thunkAPI
const getAuthHeader = (thunkAPI) => {
    const token = thunkAPI.getState().auth?.token;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  
  const API_BASE_URL = 'http://localhost:4000/api/class'; // update if needed
  
// Thunks

export const addClass = createAsyncThunk('class/add', async (classData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/add`, classData, getAuthHeader(thunkAPI));
    return response.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add class');
  }
});

export const getAllClasses = createAsyncThunk('class/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, getAuthHeader(thunkAPI));
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch classes');
  }
});

export const getClassById = createAsyncThunk('class/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch class');
  }
});

export const updateClass = createAsyncThunk('class/update', async ({ id, classData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, classData, getAuthHeader(thunkAPI));
    return response.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update class');
  }
});

export const deleteClass = createAsyncThunk('class/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete class');
  }
});

// Initial State
const initialState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null,
  successMessage: null
};

// Slice
const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
        state.successMessage = 'Class added successfully';
      })
      .addCase(addClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.map(cls =>
          cls._id === action.payload._id ? action.payload : cls
        );
        state.successMessage = 'Class updated successfully';
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(cls => cls._id !== action.payload);
        state.successMessage = 'Class deleted successfully';
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMessages, clearCurrentClass } = classSlice.actions;

export default classSlice.reducer;
