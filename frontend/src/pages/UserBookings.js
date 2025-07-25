import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingsByUserId,
  selectUserBookings,
  selectBookingStatus,
  selectBookingError,
} from '../features/booking/bookingSlice';

const UserBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectUserBookings);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userId = userInfo?._id;

    if (userId) {
      dispatch(fetchBookingsByUserId(userId));
    }
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 My Bookings</h2>

      {status === 'loading' && <p className="text-gray-600">⏳ Loading...</p>}
      {status === 'failed' && <p className="text-red-600">{error}</p>}

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow rounded-xl p-5 mb-5 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold">🛠 {booking.service}</h3>
                <p className="text-sm text-gray-500">
                  👨‍🔧 {booking.serviceProviderId?.name || 'N/A'} | 📍{' '}
                  {booking.serviceProviderId?.location || 'N/A'}
                </p>
              </div>
              <div
                className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </div>
            </div>

            <div className="text-sm text-gray-700 mt-2">
              <p>
                📅 <strong>Date:</strong>{' '}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                ⏰ <strong>Time:</strong>{' '}
                {booking.startTime && booking.endTime
                  ? `${booking.startTime} - ${booking.endTime}`
                  : 'Not provided'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserBookings;
