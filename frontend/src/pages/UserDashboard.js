// src/pages/UserDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookings,
  selectBookings,
  selectBookingStatus,
  selectBookingError,
} from '../features/booking/bookingSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  // Replace this with actual logged-in user ID from localStorage
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchBookings()); // You can filter later or create a new thunk `fetchBookingsByUser(userId)`
    }
  }, [dispatch, userId]);

  const userBookings = bookings.filter(b => b.userId === userId);

  return (
    <div>
      <h2>📋 My Bookings</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>❌ {error}</p>}
      {userBookings.length === 0 && status === 'succeeded' ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {userBookings.map((booking) => (
            <li key={booking._id}>
              ✅ <strong>{booking.service}</strong> on{' '}
              {new Date(booking.date).toLocaleDateString()} — Status: <em>{booking.status}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
