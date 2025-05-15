import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

export const fetchCollectionReport = createAsyncThunk('report/fetchCollection', async () => {
  const { data } = await axiosInstance.get('/report/collection');
  return data;
});

export const fetchDuesReport = createAsyncThunk('report/fetchDues', async () => {
  const { data } = await axiosInstance.get('/report/dues');
  return data;
});



const reportSlice = createSlice({
  name: 'report',
  initialState: {
    collection: { totalCollection: 0 },
    dues: { totalStudentsWithDues: 0 },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionReport.fulfilled, (state, action) => {
        state.collection = action.payload;
      })
      .addCase(fetchDuesReport.fulfilled, (state, action) => {
        state.dues = action.payload;
      });
  }
});

export default reportSlice.reducer;
