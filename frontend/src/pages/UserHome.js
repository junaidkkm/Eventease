import React from 'react';
import { Link } from 'react-router-dom';

const UserHome = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || 'User'}! 🎉</h1>
      <p className="text-gray-600 mb-6">
        You can now book services from trusted providers in your area.
      </p>

      <div className="flex flex-col gap-4 items-center">
        <Link to="/providers">
          <button className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-300">
            🔍 View All Providers
          </button>
        </Link>

        <Link to="/my-bookings">
          <button className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition duration-300">
            📋 My Bookings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserHome;
