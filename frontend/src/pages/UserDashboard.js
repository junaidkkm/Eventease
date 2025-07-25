import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchAllServiceProviders,
  selectAllProviders,
  selectProviderStatus,
  selectProviderError,
} from '../features/serviceProvider/serviceProviderSlice';

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const dispatch = useDispatch();

  const providers = useSelector(selectAllProviders);
  const status = useSelector(selectProviderStatus);
  const error = useSelector(selectProviderError);

  const [showProviders, setShowProviders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBrowseProviders = () => {
    setShowProviders(true);
    dispatch(fetchAllServiceProviders())
      .unwrap()
      .then((data) => console.log('✅ Providers fetched:', data))
      .catch((err) => console.error('❌ Error fetching providers:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const filteredProviders = providers.filter((provider) =>
    provider.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (filename) => {
    if (!filename) return 'http://localhost:5001/uploads/default-avatar.jpg';
    return filename.startsWith('http')
      ? filename
      : `http://localhost:5001/uploads/${filename}`;
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={getImageUrl(user?.profilePic)}
          alt="User"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'http://localhost:5001/uploads/default-avatar.jpg';
          }}
          className="h-32 w-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4"
        />
        <h2 className="text-3xl font-extrabold text-blue-800">
          👋 Welcome, {user?.name || 'User'}!
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          🔐 Role: <strong>{user?.role}</strong>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link to="/my-bookings">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow">
            📅 My Bookings
          </button>
        </Link>
        <Link to="/user/profile">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow">
            ✏️ Edit Profile
          </button>
        </Link>
        <button
          onClick={handleBrowseProviders}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow"
        >
          🔍 Browse Service Providers
        </button>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm shadow"
        >
          🚪 Logout
        </button>
      </div>

      {/* Service Providers Section */}
      {showProviders && (
        <div className="mt-8 px-4 sm:px-8 md:px-16">
          <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            🧰 Available Service Providers
          </h3>

          {/* Search Input */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="🔎 Search by service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Status Feedback */}
          {status === 'loading' && (
            <p className="text-gray-500 text-center">⏳ Loading providers...</p>
          )}
          {error && (
            <p className="text-red-600 text-center">❌ {error}</p>
          )}
          {status === 'succeeded' && filteredProviders.length === 0 && (
            <p className="text-gray-600 text-center">
              😕 No service providers found.
            </p>
          )}

          {/* Providers List */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-200 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getImageUrl(provider.profilePic)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'http://localhost:5001/uploads/default-avatar.jpg';
                    }}
                    alt={provider.name}
                    className="h-16 w-16 object-cover rounded-full border"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{provider.name}</h4>
                    <p className="text-sm text-gray-500">🛠 {provider.service}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><strong>📍 Location:</strong> {provider.location}</p>
                  <p><strong>📞 Contact:</strong> {provider.contact}</p>
                  <p><strong>💵 Hourly Rate:</strong> ₹{provider.hourlyRate || 0}</p>
                </div>

                <Link to={`/book/${provider._id}`}>
                  <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition">
                    ➕ Book Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
