import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingsByServiceProviderId,
  selectProviderBookings
} from '../features/booking/bookingSlice';

const ServiceProviderDashboard = () => {
  const serviceprovider = JSON.parse(localStorage.getItem('userInfo'));
  const dispatch = useDispatch();

  const bookings = useSelector(selectProviderBookings);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);

  // Fetch bookings on mount if provider ID exists
  useEffect(() => {
    if (serviceprovider?._id) {
      dispatch(fetchBookingsByServiceProviderId(serviceprovider._id));
    }
  }, [dispatch, serviceprovider?._id]);

  // Calculate total earnings from paid bookings
  useEffect(() => {
    if (bookings?.length > 0) {
      const earnings = bookings
        .filter((b) => b.isPaid)
        .reduce((sum, b) => sum + (b.serviceProviderEarnings || 0), 0);
      setTotalEarnings(earnings);
    } else {
      setTotalEarnings(0);
    }
  }, [bookings]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  // Resolve image URL or fallback
  const getImageUrl = (filename) => {
    if (!filename || filename === 'null') {
      return 'http://localhost:5001/uploads/default-avatar.jpg';
    }
    return `http://localhost:5001/uploads/${filename.replace(/^\/?uploads\//, '')}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-6 flex-wrap border-b pb-4">
        <img
          src={getImageUrl(serviceprovider?.profilePic)}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover border shadow"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'http://localhost:5001/uploads/default-avatar.jpg';
          }}
        />
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-1">
            👋 Welcome, {serviceprovider?.name || 'Service Provider'}!
          </h2>
          <p className="text-gray-600 text-sm">
            🛠 Service: <strong>{serviceprovider?.service || 'N/A'}</strong>
          </p>
          <p className="text-gray-600 text-sm">
            🧾 Role: <strong>{serviceprovider?.role || 'N/A'}</strong>
          </p>
          <p className="text-green-700 font-semibold mt-2 text-lg">
            💰 Total Earnings: ₹{totalEarnings}
          </p>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="flex gap-4 flex-wrap mb-8">
        <Link to="/serviceprovider/bookings">
          <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">
            📅 View My Bookings
          </button>
        </Link>

        <Link to="/serviceprovider/profile">
          <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">
            ✏️ Edit Profile
          </button>
        </Link>

        <button
          onClick={() => setShowEarnings(!showEarnings)}
          className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
        >
          {showEarnings ? '🙈 Hide Earnings' : '💼 View Earnings'}
        </button>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
        >
          🚪 Logout
        </button>
      </div>

      {/* Earnings List */}
      {showEarnings && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-700 mb-4">💸 Paid Bookings</h3>
          {bookings.filter((b) => b.isPaid).length === 0 ? (
            <p className="text-gray-500">No paid bookings yet.</p>
          ) : (
            bookings
              .filter((b) => b.isPaid)
              .map((b) => (
                <div
                  key={b._id}
                  className="bg-white shadow-sm border rounded-lg p-4 mb-4"
                >
                  <p><strong>📅 Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                  <p><strong>⏱ Hours:</strong> {b.hours}</p>
                  <p><strong>💵 Earned:</strong> ₹{b.serviceProviderEarnings}</p>
                  <p><strong>👤 Booked By:</strong> {b.userId?.name || 'User'}</p>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
