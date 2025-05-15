import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

// Fetch student fee details
export const fetchStudentFeeDetails = createAsyncThunk('payment/fetchStudentFee', async (studentId) => {
  const { data } = await axiosInstance.get(`/student-fee/${studentId}`);
  return data.studentFee;
});

// Collect payment
export const collectPayment = createAsyncThunk('payment/collect', async (formData) => {
  const { data } = await axiosInstance.post('/payment/collect', formData);
  return data.payment;
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    currentFee: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentFeeDetails.fulfilled, (state, action) => {
        state.currentFee = action.payload;
      });
  }
});

export default paymentSlice.reducer;
