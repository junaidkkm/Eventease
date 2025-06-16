import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSelection = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome to EventEase</h2>
      <p>Choose how you want to register:</p>
      <Link to="/register/user">
        <button style={{ margin: '10px' }}>Register as User</button>
      </Link>
      <Link to="/register/provider">
        <button style={{ margin: '10px' }}>Register as Service Provider</button>
      </Link>
    </div>
  );
};

export default RegisterSelection;
