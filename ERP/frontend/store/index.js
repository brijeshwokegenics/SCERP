// frontend/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import admissionReducer from './admissionSlice';
import studentsReducer from './studentsSlice';
import schoolsReducer from './schoolSlice';
import promoteReducer from './promotionSlice';
import teacherReducer from'./teacherSlice';
import paymentReducer from './paymentSlice';
import libraryReducer from './librarySlice';
import subjectReducer from './subjectSlice';
import classRoutineReducer from './classRoutineSlice';
import teacherAttendanceReducer from './attendanceSlice';
import examScheduleReducer from './examScheduleSlice';
import transportReducer from './transportSlice';
import noticeReducer from './noticeSlice';
import messageReducer from './messageSlice';
import notificationReducer from './notificationSlice';
import holidayReducer from './holidaySlice';
import hostelReducer from './hostelSlice';
import bedReducer from './bedSlice';
import roomReducer from './roomSlice';
import feePaymentsReducer from './feePaymentSlice';
import incomeReducer from './incomeSlice';
import expenseReducer from './expenseSlice';
import otherPaymentReducer from './otherPaymentSlice';
import classReducer from './classSlice';



const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    admissions: admissionReducer,
    students: studentsReducer,
    schools: schoolsReducer,
    promotes: promoteReducer,
    teachers: teacherReducer,
    payments: paymentReducer,
    library: libraryReducer,
    subjects: subjectReducer,
    classRoutine: classRoutineReducer,
    teacherAttendance: teacherAttendanceReducer,
    examSchedules: examScheduleReducer,
    transportSystem: transportReducer,
    notices: noticeReducer,
    messages: messageReducer,
    notifications: notificationReducer,
    holiday: holidayReducer,
    bed: bedReducer,
    room: roomReducer,
    hostel: hostelReducer,
    feePayments: feePaymentsReducer,
    incomer: incomeReducer,
    expense: expenseReducer,
    otherPayment: otherPaymentReducer,
    class: classReducer,



    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions for serializable state invariant middleware
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
