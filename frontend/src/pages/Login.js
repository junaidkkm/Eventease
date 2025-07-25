import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && role === 'admin') {
      const admin = { name: 'Admin', email, role: 'admin', token: 'admin-token' };
      localStorage.setItem('userInfo', JSON.stringify(admin));
      navigate('/admin/dashboard');
      return;
    }

    try {
      const endpoint =
        role === 'serviceprovider'
          ? 'http://localhost:5001/api/serviceprovider/login'
          : 'http://localhost:5001/api/user/login';

      const res = await axios.post(endpoint, { email, password });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    try {
      const endpoint =
        role === 'serviceprovider'
          ? 'http://localhost:5001/api/serviceprovider/verify-otp'
          : 'http://localhost:5001/api/user/verify-otp';

      const res = await axios.post(endpoint, { email, otp });

      const userInfo =
        role === 'serviceprovider'
          ? { ...res.data.provider, token: res.data.token }
          : { ...res.data.user, token: res.data.token };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      if (role === 'user') {
        navigate('/user/dashboard');
      } else {
        navigate('/serviceprovider/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* ✅ Left Side: Logo + Branding */}
        <div className="w-1/2 bg-blue-100 flex flex-col items-center justify-center p-8">
          <img
            src="/logo192.png"
            alt="EventEase Logo"
            className="h-32 w-auto mb-6 drop-shadow-md"
          />
          <h1 className="text-4xl font-bold text-blue-700 mb-2">EventEase</h1>
          <p className="text-lg text-gray-700 text-center">
            Bringing Events Home, Effortlessly.
          </p>
        </div>

        {/* ✅ Right Side: Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">🔐 Login to EventEase</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}

          {step === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <div className="text-right mt-1">
                  <span
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="user">User</option>
                <option value="serviceprovider">Service Provider</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? 'Sending OTP...' : 'Login / Send OTP'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpVerify();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </form>
          )}

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
