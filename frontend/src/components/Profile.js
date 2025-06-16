// src/components/Profile.js

// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', service: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/serviceprovider/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        console.log(res.data);

      } catch (error) {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    await axios.put('/api/serviceprovider/profile', profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage('Profile updated successfully');
  } catch (error) {
    setMessage('Update failed');
  }
};


  return (
    <div>
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="service"
          value={profile.service}
          onChange={handleChange}
          placeholder="Service Offered"
          required
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
