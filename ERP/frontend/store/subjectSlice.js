import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/subjects";

// Helper function to get auth token safely
const getAuthToken = (getState) => getState()?.auth?.token || null;

// 1️⃣ Fetch all subjects (GET /subjects)
export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getAuthToken(getState);
    if (!token) return rejectWithValue("Unauthorized! Please log in again.");

    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

 // Debugging line

    return response.data;
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return rejectWithValue(err.response?.data?.message || "Failed to fetch subjects");
  }
});


// 2️⃣ Fetch a subject by ID (GET /subjects/:id)
export const fetchSubjectById = createAsyncThunk(
  "subjects/fetchSubjectById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("Unauthorized! Please log in again.");

      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 3️⃣ Create a subject (POST /subjects)
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (subjectData, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("Unauthorized! Please log in again.");

      const response = await axios.post(API_URL, subjectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 4️⃣ Update a subject (PUT /subjects/:id)
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ id, subjectData }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("Unauthorized! Please log in again.");

      const response = await axios.put(`${API_URL}/${id}`, subjectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 5️⃣ Delete a subject (DELETE /subjects/:id)
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("Unauthorized! Please log in again.");

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🎯 Subject Slice
const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: [],
    subject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSubject: (state) => {
      state.subject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Subject By ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.subject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default subjectSlice.reducer;
