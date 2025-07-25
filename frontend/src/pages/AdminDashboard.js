import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// ✅ Helper function to resolve image URL
const getImageUrl = (profilePic) => {
  if (!profilePic) return 'http://localhost:5001/uploads/default-avatar.jpg';
  if (profilePic.startsWith('/uploads/')) {
    return `http://localhost:5001${profilePic}`;
  }
  return `http://localhost:5001/uploads/${profilePic}`;
};

const handleImgError = (e) => {
   e.target.src = 'http://localhost:5001/uploads/default-avatar.jpg';
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [section, setSection] = useState('users');
  const [earnings, setEarnings] = useState({
    totalCommission: 0,
    totalSPEarnings: 0,
    totalRevenue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        const [userRes, providerRes, bookingRes, earningsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/user', config),
          axios.get('http://localhost:5001/api/serviceprovider', config),
          axios.get('http://localhost:5001/api/bookings', config),
          axios.get('http://localhost:5001/api/admin/earnings', config),
        ]);

        setUsers(userRes.data.users || []);
        setProviders(providerRes.data.providers || []);
        setBookings(bookingRes.data.bookings || []);
        setEarnings(earningsRes.data.earnings || {});
      } catch (err) {
        console.error('Admin data fetch error:', err.response?.data || err.message);
        setError('Failed to load data. Please check your backend.');
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === 'user'
          ? `http://localhost:5001/api/user/${id}`
          : type === 'provider'
          ? `http://localhost:5001/api/serviceprovider/${id}`
          : `http://localhost:5001/api/bookings/${id}`;

      await axios.delete(endpoint, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      toast.success(`${type} deleted successfully!`);

      if (type === 'user') setUsers((prev) => prev.filter((u) => u._id !== id));
      if (type === 'provider') setProviders((prev) => prev.filter((p) => p._id !== id));
      if (type === 'booking') setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const monthlyChartData = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const month = new Date(b.date).toLocaleString('default', { month: 'short' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, bookings: count }));
  }, [bookings]);

  const filterList = (list) =>
    list.filter((item) =>
      Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold text-blue-800 mb-6">🛠 Admin Dashboard</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-wrap gap-3 mb-6">
        {['users', 'providers', 'bookings', 'stats'].map((key) => (
          <button
            key={key}
            onClick={() => {
              setSection(key);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded transition ${
              section === key
                ? 'bg-blue-700 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {key === 'users'
              ? 'Users'
              : key === 'providers'
              ? 'Providers'
              : key === 'bookings'
              ? 'Bookings'
              : '📊 Stats'}
          </button>
        ))}
      </div>

      {section !== 'stats' && (
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-5 px-4 py-2 border rounded w-full md:w-1/2"
        />
      )}

      {section === 'users' &&
        (filterList(users).length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="grid gap-4">
            {filterList(users).map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-4 border rounded bg-white shadow-sm"
              >
                <img
                src={getImageUrl(user.profilePic)}
                alt="User"
                onError={handleImgError}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
              />

                <div className="flex-1">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">User</span>
                  <button
                    onClick={() => handleDelete(user._id, 'user')}
                    className="ml-3 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {section === 'providers' &&
        (filterList(providers).length === 0 ? (
          <p>No providers found.</p>
        ) : (
          <div className="grid gap-4">
            {filterList(providers).map((provider) => (
              <div
                key={provider._id}
                className="flex items-center gap-4 p-4 border rounded bg-white shadow-sm"
              >
                <img
                src={getImageUrl(provider.profilePic)}
                alt="Provider"
                onError={handleImgError}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
              />

                <div className="flex-1">
                  <p><strong>Name:</strong> {provider.name}</p>
                  <p><strong>Email:</strong> {provider.email}</p>
                  <p><strong>Service:</strong> {provider.service}</p>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Service Provider</span>
                  <button
                    onClick={() => handleDelete(provider._id, 'provider')}
                    className="ml-3 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {section === 'bookings' &&
        (filterList(bookings).length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid gap-4">
            {filterList(bookings).map((b) => (
              <div
                key={b._id}
                className="p-4 border rounded bg-white shadow-sm space-y-2"
              >
                <p><strong>User:</strong> {b.userId?.name}</p>
                <p><strong>Provider:</strong> {b.serviceProviderId?.name}</p>
                <p><strong>Service:</strong> {b.service}</p>
                <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded ${
                    b.status === 'Accepted'
                      ? 'bg-green-100 text-green-700'
                      : b.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : b.status === 'Completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {b.status}
                </span>
                <button
                  onClick={() => handleDelete(b._id, 'booking')}
                  className="ml-3 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}

      {section === 'stats' && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">📊 Platform Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Users" value={users.length} color="green" />
            <StatCard label="Providers" value={providers.length} color="yellow" />
            <StatCard label="Bookings" value={bookings.length} color="blue" />
            <StatCard label="Commission" value={`₹${earnings.totalCommission.toFixed(2)}`} color="purple" />
            <StatCard label="SP Earnings" value={`₹${earnings.totalSPEarnings.toFixed(2)}`} color="pink" />
            <StatCard label="Revenue" value={`₹${earnings.totalRevenue.toFixed(2)}`} color="indigo" />
          </div>

          <h4 className="text-lg font-semibold mb-2">📈 Monthly Bookings</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const bgColors = {
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    pink: 'bg-pink-100',
    indigo: 'bg-indigo-100',
  };

  const textColors = {
    green: 'text-green-800',
    yellow: 'text-yellow-800',
    blue: 'text-blue-800',
    purple: 'text-purple-800',
    pink: 'text-pink-800',
    indigo: 'text-indigo-800',
  };

  return (
    <div className={`${bgColors[color]} ${textColors[color]} p-4 rounded shadow`}>
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

export default AdminDashboard;
