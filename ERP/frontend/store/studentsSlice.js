import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Adjust to match your backend’s base URL (or set via .env)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// 1) Fetch list of students (GET /students/list)
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Retrieve token from localStorage (or anywhere you store it)
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/students/list`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
     

      return response.data; // An array of students
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2) Fetch single student details (GET /students/details/:id)
export const fetchStudentDetails = createAsyncThunk(
  'students/fetchStudentDetails',
  async (studentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/students/details/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // A single student object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3) Generate ID Card PDFs for a specific class (POST /students/generate-idcard)
export const generateIdCards = createAsyncThunk(
  'students/generateIdCards',
  async (className, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/students/generate-idcard`,
        { className },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // needed to handle PDFs or binary files
        }
      );
      return {
        blob: response.data,
        fileName: `ID_Cards_${className}.pdf`,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4) Generate Vehicle Pass PDFs for selected students (POST /students/generate-vehicle-pass)
export const generateVehiclePass = createAsyncThunk(
  'students/generateVehiclePass',
  async (studentIds, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/students/generate-vehicle-pass`,
        { studentIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
      return {
        blob: response.data,
        fileName: 'Vehicle_Pass.pdf',
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    list: [],
    currentStudent: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // =======================
    // fetchStudents
    // =======================
    builder.addCase(fetchStudents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // =======================
    // fetchStudentDetails
    // =======================
    builder.addCase(fetchStudentDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentStudent = null;
    });
    builder.addCase(fetchStudentDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentStudent = action.payload;
    });
    builder.addCase(fetchStudentDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // =======================
    // generateIdCards
    // =======================
    builder.addCase(generateIdCards.pending, (state) => {
      state.error = null;
    });
    builder.addCase(generateIdCards.fulfilled, (state) => {
      // The PDF blob is handled at component-level
    });
    builder.addCase(generateIdCards.rejected, (state, action) => {
      state.error = action.payload;
    });

    // =======================
    // generateVehiclePass
    // =======================
    builder.addCase(generateVehiclePass.pending, (state) => {
      state.error = null;
    });
    builder.addCase(generateVehiclePass.fulfilled, (state) => {
      // The PDF blob is handled at component-level
    });
    builder.addCase(generateVehiclePass.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default studentsSlice.reducer;
