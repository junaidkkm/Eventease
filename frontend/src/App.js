import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import BookingList from './components/BookingList';

import RegisterSelection from './pages/RegisterSelection'; // New page to select user/provider
import UserRegister from './pages/UserRegister';
import ServiceProviderRegister from './pages/ServiceProviderRegister';

import UserDashboard from './pages/UserDashboard';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import ServiceProviderPage from './pages/ServiceProviderPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route shows register selection */}
        <Route path='/' element={<RegisterSelection />} />

        {/* Login */}
        <Route path='/login' element={<Login />} />

        {/* Register routes */}
        <Route path='/register/user' element={<UserRegister />} />
        <Route path='/register/provider' element={<ServiceProviderRegister />} />

        {/* Dashboard routes */}
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path='/user/dashboard' element={<UserDashboard />} />
        <Route path='/provider/dashboard' element={<ServiceProviderDashboard />} />

        {/* Service Providers Page */}
        <Route path='/providers' element={<ServiceProviderPage />} />

        {/* Profile and Bookings (private) */}
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path='/bookings' element={
          <PrivateRoute>
            <BookingList />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
