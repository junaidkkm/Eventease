// src/pages/ServiceProviderDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceProviderDashboard = () => {
  const [provider, setProvider] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/serviceprovider/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProvider(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {provider.name}</h2>
      <p><strong>Email:</strong> {provider.email}</p>
      <p><strong>Service:</strong> {provider.service}</p>

      <button onClick={() => navigate('/provider/profile')}>Edit Profile</button>
      <button onClick={() => navigate('/provider/bookings')}>View Bookings</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ServiceProviderDashboard;
