// src/features/booking/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/bookings';

// 🔹 Create Booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}`, bookingData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔹 Fetch Bookings by User ID
export const fetchBookingsByUserId = createAsyncThunk(
  'bookings/fetchBookingsByUserId',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data.bookings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  }
);

// 🔹 Fetch Bookings by Service Provider ID
export const fetchBookingsByServiceProviderId = createAsyncThunk(
  'bookings/fetchBookingsByServiceProviderId',
  async (serviceProviderId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/serviceprovider/${serviceProviderId}`);
      return response.data.bookings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch service provider bookings');
    }
  }
);

// 🔹 Update Booking Status
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ bookingId, status }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/status/${bookingId}`, { status });
      return res.data.updatedBooking;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update booking status');
    }
  }
);

const initialState = {
  bookings: [],
  userBookings: [],
  providerBookings: [],
  status: 'idle',
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings.push(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // User Bookings
      .addCase(fetchBookingsByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingsByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userBookings = action.payload;
      })
      .addCase(fetchBookingsByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Service Provider Bookings
      .addCase(fetchBookingsByServiceProviderId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookingsByServiceProviderId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.providerBookings = action.payload;
      })
      .addCase(fetchBookingsByServiceProviderId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.providerBookings.findIndex((b) => b._id === updated._id);
        if (index !== -1) {
          state.providerBookings[index] = updated;
        }
      });
  },
});

export const selectBookings = (state) => state.booking.bookings;
export const selectUserBookings = (state) => state.booking.userBookings;
export const selectProviderBookings = (state) => state.booking.providerBookings;
export const selectBookingStatus = (state) => state.booking.status;
export const selectBookingError = (state) => state.booking.error;

export default bookingSlice.reducer;
