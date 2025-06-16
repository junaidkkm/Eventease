import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerProvider, selectAuthStatus, selectAuthError } from '../features/auth/authSlice';

const ServiceProviderRegister = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    service: '', // 👈 only one service
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerProvider(formData));
  };

  return (
    <div>
      <h2>Service Provider Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="service" placeholder="Service (e.g., Makeup)" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {status === 'loading' && <p>Registering...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ServiceProviderRegister;
