import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/forgot-password/send-otp', { email, role });
      setMessage(res.data.message);
      setError('');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setMessage('');
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/forgot-password/verify-reset', {
        email,
        otp,
        newPassword,
        role
      });
      setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">🔑 Forgot Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md"
            >
              <option value="user">User</option>
              <option value="serviceprovider">Service Provider</option>
            </select>
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
