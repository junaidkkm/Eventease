import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingsByServiceProviderId,
  updateBookingStatus,
  selectProviderBookings,
  selectBookingStatus,
  selectBookingError
} from '../features/booking/bookingSlice';

const statusColors = {
  Pending: 'bg-yellow-400 text-white',
  Accepted: 'bg-blue-500 text-white',
  Rejected: 'bg-red-500 text-white',
};

const ServiceProviderBookingPage = () => {
  const dispatch = useDispatch();
  const [statusUpdate, setStatusUpdate] = useState({});
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');

  const bookings = useSelector(selectProviderBookings);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  const storedUser = JSON.parse(localStorage.getItem('userInfo'));
  const serviceProviderId = storedUser?._id;

  useEffect(() => {
    if (serviceProviderId) {
      dispatch(fetchBookingsByServiceProviderId(serviceProviderId));
    }
  }, [dispatch, serviceProviderId]);

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdate = async (bookingId) => {
    const newStatus = statusUpdate[bookingId];
    if (!newStatus) return;

    try {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
      setMessage(`✅ Status updated to "${newStatus}"`);
      dispatch(fetchBookingsByServiceProviderId(serviceProviderId));
    } catch {
      setMessage(`❌ Failed to update status`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const filteredBookings = bookings.filter((b) =>
    filter === 'All' ? true : b.status === filter
  );

  if (status === 'loading') return <p className="text-gray-600">⏳ Loading bookings...</p>;
  if (status === 'failed') return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Service Provider Bookings</h2>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded-md font-medium shadow ${
            message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="mb-8">
        <label className="mr-2 font-semibold text-gray-700">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-gray-500">😕 No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const customer = booking.userId || {};
            const isFinalized = booking.status !== 'Pending';

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 transition-transform hover:scale-[1.01]"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">🛠 {booking.service}</h3>
                  <p className="text-sm text-gray-500">📅 {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">⏰ Timing: {booking.startTime}:00 to {booking.endTime}:00</p>
                </div>

                <div className="text-gray-700 text-sm space-y-1 mb-4">
                  <p><strong>🙍 Customer:</strong> {customer.name || 'Loading...'}</p>
                  <p><strong>📍 Location:</strong> {customer.location || 'Loading...'}</p>
                  <p><strong>📞 Contact:</strong> {customer.contact || 'Loading...'}</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <strong className="text-sm">📌 Status:</strong>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[booking.status] || 'bg-gray-300 text-gray-800'}`}>
                    {booking.status || 'Pending'}
                  </span>
                </div>

                {/* Show dropdown only if status is "Pending" */}
                {!isFinalized && (
                  <div className="flex items-center">
                    <select
                      value={statusUpdate[booking._id] || ''}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm focus:ring-blue-400 focus:ring-2"
                    >
                      <option value="" disabled>Choose status</option>
                      <option value="Accepted">Accept</option>
                      <option value="Rejected">Reject</option>
                    </select>

                    <button
                      onClick={() => handleUpdate(booking._id)}
                      className="ml-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-150"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderBookingPage;
