// src/app/store.js (or wherever your store file is located)

// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bookingReducer from '../features/booking/bookingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
  },
});

export default store;

