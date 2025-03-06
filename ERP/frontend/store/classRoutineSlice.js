import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/class-routines";

// 🔹 Fetch All Class Routines
export const fetchClassRoutines = createAsyncThunk(
  "classRoutine/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch Routine by Class & Section
export const fetchClassRoutineByClassAndSection = createAsyncThunk(
  "classRoutine/fetchByClassAndSection",
  async ({ className, section }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/${className}/${section}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Create Class Routine
export const createClassRoutine = createAsyncThunk(
  "classRoutine/create",
  async (routineData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}`, routineData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Update Class Routine
export const updateClassRoutine = createAsyncThunk(
  "classRoutine/update",
  async ({ id, routineData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/${id}`, routineData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Delete Class Routine
export const deleteClassRoutine = createAsyncThunk(
  "classRoutine/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const classRoutineSlice = createSlice({
  name: "classRoutine",
  initialState: {
    routines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Routines
      .addCase(fetchClassRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassRoutines.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = action.payload;
      })
      .addCase(fetchClassRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By Class & Section
      .addCase(fetchClassRoutineByClassAndSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassRoutineByClassAndSection.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = [action.payload];
      })
      .addCase(fetchClassRoutineByClassAndSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Routine
      .addCase(createClassRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClassRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.routines.push(action.payload);
      })
      .addCase(createClassRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Routine
      .addCase(updateClassRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = state.routines.map((routine) =>
          routine._id === action.payload._id ? action.payload : routine
        );
      })
      .addCase(updateClassRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Routine
      .addCase(deleteClassRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClassRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = state.routines.filter((routine) => routine._id !== action.payload);
      })
      .addCase(deleteClassRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classRoutineSlice.reducer;
