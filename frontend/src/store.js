import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import bookingReducer from './features/booking/bookingSlice';
import serviceProviderReducer from './features/serviceProvider/serviceProviderSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    serviceProvider: serviceProviderReducer, 
  },
});
