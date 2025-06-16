import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../features/booking/bookingSlice';

const BookingList = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  const status = useSelector((state) => state.booking.status);
  const error = useSelector((state) => state.booking.error);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading bookings...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Bookings List</h2>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.service} — {new Date(booking.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingList;
