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
      console.log('Fetching School Admins with token:', auth.token);

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
      
      // Handle token expiration
      if (error.response && error.response.data && error.response.data.error === 'jwt expired') {
        // Optionally, dispatch logout action or handle token refresh here
      }

      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch School Admins' }
      );
    }
  }
);

/**
 * Thunk: createSchoolAdmin
 * Creates a new School Admin.
 */
export const createSchoolAdmin = createAsyncThunk(
  'auth/createSchoolAdmin',
  async (adminData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      console.log('Creating School Admin with token:', auth.token);

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
 * Updates an existing School Admin's status.
 */
export const updateSchoolAdmin = createAsyncThunk(
  'auth/updateSchoolAdminStatus',
  async ({ adminId, isActive }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      console.log(`Updating School Admin status (${adminId}) with token:`, auth.token);

      if (!auth.token) {
        throw new Error('No authentication token found.');
      }

      // Ensure `isActive` is provided and valid
      if (typeof isActive !== 'boolean') {
        throw new Error('Invalid isActive value: Must be a boolean.');
      }

      console.log('Making API call to update isActive status:', { isActive });
      const response = await axios.put(
        `http://localhost:4000/api/users/school-admin/${adminId}`,
        { isActive }, // Only send the isActive field
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log('API Response:', response.data);

      // Check if the response contains the updated schoolAdmin
      if (!response.data || !response.data.schoolAdmin) {
        throw new Error('Invalid API response: Missing schoolAdmin data');
      }

      // Return the updated schoolAdmin object
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
 * Deletes a School Admin.
 */
export const deleteSchoolAdmin = createAsyncThunk(
  'auth/deleteSchoolAdmin',
  async (adminId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      console.log(`Deleting School Admin (${adminId}) with token:`, auth.token);

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
      return adminId; // Return the ID for state update
    } catch (error) {
      console.error('Error deleting School Admin:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to delete School Admin' }
      );
    }
  }
);

/**
 * authSlice
 * Manages authentication state and School Admin data.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,

    // School Admins State
    schoolAdmins: [],
    totalSchoolAdmins: 0,
    schoolAdminPage: 1,
    schoolAdminPages: 1,
    schoolAdminsStatus: 'idle', // Separate status for fetching admins
    schoolAdminsError: null,
  },
  reducers: {
    /**
     * logout
     * Clears authentication and School Admin data.
     */
    logout(state) {
      state.token = null;
      state.user = null;
      state.schoolAdmins = [];
      state.totalSchoolAdmins = 0;
      state.schoolAdminPage = 1;
      state.schoolAdminPages = 1;
      state.status = 'idle';
      state.error = null;
      state.schoolAdminsStatus = 'idle';
      state.schoolAdminsError = null;
      localStorage.removeItem('persist:root'); // Clear persisted state
    },
  },
  extraReducers: (builder) => {
    builder
      // --- loginUser Thunk ---
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to login';
      })

      // --- fetchSchoolAdmins Thunk ---
      .addCase(fetchSchoolAdmins.pending, (state) => {
        state.schoolAdminsStatus = 'loading';
        state.schoolAdminsError = null;
      })
      .addCase(fetchSchoolAdmins.fulfilled, (state, action) => {
        console.log('fetchSchoolAdmins.fulfilled payload:', action.payload);
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

      // --- createSchoolAdmin Thunk ---
      .addCase(createSchoolAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchoolAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schoolAdmins.unshift(action.payload); // Add to the beginning of the list
        state.totalSchoolAdmins += 1;
      })
      .addCase(createSchoolAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create School Admin';
      })

      // --- updateSchoolAdmin Thunk ---
      .addCase(updateSchoolAdmin.fulfilled, (state, action) => {
        const updatedAdmin = action.payload;
        if (updatedAdmin && updatedAdmin._id) {
          state.schoolAdmins = state.schoolAdmins.map((admin) =>
            admin._id === updatedAdmin._id ? updatedAdmin : admin
          );
        } else {
          console.error('Updated admin data is invalid:', updatedAdmin);
        }
      })
      
      

      // --- deleteSchoolAdmin Thunk ---
      .addCase(deleteSchoolAdmin.fulfilled, (state, action) => {
        const deletedAdminId = action.payload;
        state.schoolAdmins = state.schoolAdmins.filter((admin) => admin._id !== deletedAdminId);
        state.totalSchoolAdmins -= 1;
      });
  },
});

// Exporting actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
