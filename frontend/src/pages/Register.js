import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, registerServiceProvider } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    location: '',
    service: '',
    hourlyRate: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (role === 'user' && (key === 'service' || key === 'hourlyRate')) return;
      data.append(key, value);
    });

    if (profilePic) data.append('profilePic', profilePic);

    try {
      if (role === 'user') {
        await dispatch(registerUser(data)).unwrap();
        navigate('/user/dashboard');
      } else {
        await dispatch(registerServiceProvider(data)).unwrap();
        navigate('/serviceprovider/dashboard');
      }
    } catch (err) {
      setMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Register</h2>

        {message && (
          <p className={`text-sm mb-4 text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4" encType="multipart/form-data">
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="user">User</option>
            <option value="serviceprovider">Service Provider</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            required
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          {role === 'serviceprovider' && (
            <>
              <input
                type="text"
                name="service"
                placeholder="Service (e.g. Makeup)"
                required
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="hourlyRate"
                placeholder="Hourly Rate (₹)"
                required
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded-full border shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
