import React, { useState } from 'react';
import axios from 'axios';

const ServiceProviderRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    service: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    try {
      const res = await axios.post('http://localhost:5001/api/provider/register', formData);
      setMessage(res.data.message || 'Service provider registration successful!');
      setFormData({ name: '', email: '', password: '', contact: '', service: '' });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Service Provider Registration</h2>

      {message && <p>{message}</p>}
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((error, index) => (
            <li key={index}>{error.msg}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required /><br /><br />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br /><br />
        <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required /><br /><br />
        <input type="text" name="service" placeholder="Service (e.g., Makeup, Camera)" value={formData.service} onChange={handleChange} required /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ServiceProviderRegister;

