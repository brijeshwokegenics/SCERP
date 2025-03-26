// frontend/store/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Thunk: loginUser
 * Authenticates the user and stores the token.
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        return response.data;
      } else {
        return rejectWithValue({ message: 'Invalid login response.' });
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to login' }
      );
    }
  }
);

/**
 * Thunk: fetchSchoolAdmins
 * Fetches a paginated list of School Admins.
 */
export const fetchSchoolAdmins = createAsyncThunk(
  'auth/fetchSchoolAdmins',
  async ({ page = 1, limit = 10 }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.get(
        `http://localhost:4000/api/users/school-admin?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching School Admins:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch School Admins' }
      );
    }
  }
);

/**
 * Thunk: createSchoolAdmin
 */
export const createSchoolAdmin = createAsyncThunk(
  'auth/createSchoolAdmin',
  async (adminData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.post(
        'http://localhost:4000/api/users/school-admin',
        adminData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data.schoolAdmin;
    } catch (error) {
      console.error('Error creating School Admin:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to create School Admin' }
      );
    }
  }
);

/**
 * Thunk: updateSchoolAdmin
 */
export const updateSchoolAdmin = createAsyncThunk(
  'auth/updateSchoolAdminStatus',
  async ({ adminId, isActive }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No authentication token found.');
      }

      if (typeof isActive !== 'boolean') {
        throw new Error('Invalid isActive value: Must be a boolean.');
      }

      const response = await axios.put(
        `http://localhost:4000/api/users/school-admin/${adminId}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.data || !response.data.schoolAdmin) {
        throw new Error('Invalid API response: Missing schoolAdmin data');
      }

      return response.data.schoolAdmin;
    } catch (error) {
      console.error('Error updating School Admin status:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update School Admin status' }
      );
    }
  }
);

/**
 * Thunk: deleteSchoolAdmin
 */
export const deleteSchoolAdmin = createAsyncThunk(
  'auth/deleteSchoolAdmin',
  async (adminId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.delete(
        `http://localhost:4000/api/users/school-admin/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return adminId;
    } catch (error) {
      console.error('Error deleting School Admin:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to delete School Admin' }
      );
    }
  }
);

/**
 * Slice: auth
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    schoolAdmins: [],
    totalSchoolAdmins: 0,
    schoolAdminPage: 1,
    schoolAdminPages: 1,
    schoolAdminsStatus: 'idle',
    schoolAdminsError: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.schoolAdmins = [];
      state.totalSchoolAdmins = 0;
      state.schoolAdminPage = 1;
      state.schoolAdminPages = 1;
      state.status = 'idle';
      state.error = null;
      state.schoolAdminsStatus = 'idle';
      state.schoolAdminsError = null;

      // ❌ Do not manually clear persist:root here!
      // Redux Persist will handle clearing automatically
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to login';
      })
      .addCase(fetchSchoolAdmins.pending, (state) => {
        state.schoolAdminsStatus = 'loading';
        state.schoolAdminsError = null;
      })
      .addCase(fetchSchoolAdmins.fulfilled, (state, action) => {
        state.schoolAdminsStatus = 'succeeded';
        state.schoolAdmins = action.payload.schoolAdmins;
        state.totalSchoolAdmins = action.payload.total;
        state.schoolAdminPage = action.payload.page;
        state.schoolAdminPages = action.payload.pages;
      })
      .addCase(fetchSchoolAdmins.rejected, (state, action) => {
        state.schoolAdminsStatus = 'failed';
        state.schoolAdminsError = action.payload?.message || 'Failed to fetch School Admins';
      })
      .addCase(createSchoolAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchoolAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolAdmins.unshift(action.payload);
        state.totalSchoolAdmins += 1;
      })
      .addCase(createSchoolAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create School Admin';
      })
      .addCase(updateSchoolAdmin.fulfilled, (state, action) => {
        const updatedAdmin = action.payload;
        if (updatedAdmin && updatedAdmin._id) {
          state.schoolAdmins = state.schoolAdmins.map((admin) =>
            admin._id === updatedAdmin._id ? updatedAdmin : admin
          );
        }
      })
      .addCase(deleteSchoolAdmin.fulfilled, (state, action) => {
        const deletedAdminId = action.payload;
        state.schoolAdmins = state.schoolAdmins.filter((admin) => admin._id !== deletedAdminId);
        state.totalSchoolAdmins -= 1;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
