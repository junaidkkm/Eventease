import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{ padding: '10px', background: '#eee' }}>
      <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
      <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
      <Link to="/bookings" style={{ marginRight: '10px' }}>Bookings</Link>
      <Link to="/dashboard">My Bookings</Link>

      <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
    </nav>
  );
};

export default Navbar;


