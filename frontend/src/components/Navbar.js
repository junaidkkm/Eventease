import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
      {user?.role === 'user' && (
        <>
          <Link to="/user/dashboard" style={{ marginRight: '20px' }}>Dashboard</Link>
          <Link to="/user/profile">Profile</Link>
        </>
      )}
      {user?.role === 'serviceprovider' && (
        <>
          <Link to="/serviceprovider/dashboard" style={{ marginRight: '20px' }}>Dashboard</Link>
          <Link to="/serviceprovider/profile">Profile</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
