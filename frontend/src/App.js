// App.js
import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard'; // ✅ Corrected import
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import ServiceProviderProfile from './pages/ServiceProviderProfile';
import UserBookingPage from './pages/UserBookingPage';
import ServiceProviderBookingPage from './pages/ServiceProviderBookingPage';
import ServiceProviderPublicProfile from './pages/ServiceProviderPublicProfile';
import BookingForm from './pages/BookingForm';
import ForgotPassword from './pages/ForgotPassword';

import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service-provider/:id" element={<ServiceProviderPublicProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserBookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/serviceprovider/dashboard"
          element={
            <PrivateRoute allowedRoles={['serviceprovider']}>
              <ServiceProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/serviceprovider/profile"
          element={
            <PrivateRoute allowedRoles={['serviceprovider']}>
              <ServiceProviderProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/serviceprovider/bookings"
          element={
            <PrivateRoute allowedRoles={['serviceprovider']}>
              <ServiceProviderBookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/book/:providerId"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <BookingForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
