import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

// Assign Fee Structure
export const assignFeeStructure = createAsyncThunk('studentFee/assign', async (formData) => {
  const { data } = await axiosInstance.post('/student-fee/assign', formData);
  return data.studentFee;
});
export const fetchStudentLedger = createAsyncThunk('studentFee/fetchLedger', async (studentId) => {
    const { data } = await axiosInstance.get(`/student-fee/ledger/${studentId}`);
    return data.ledger;
  });
const studentFeeSlice = createSlice({
  name: 'studentFee',
  initialState: {
    records: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignFeeStructure.pending, (state) => { state.loading = true; })
      .addCase(assignFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(assignFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      .addCase(fetchStudentLedger.fulfilled, (state, action) => {
        state.ledger = action.payload;
      });
  }
});

export default studentFeeSlice.reducer;
