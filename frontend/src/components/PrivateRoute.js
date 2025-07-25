import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  try {
    const storedUser = localStorage.getItem('userInfo');
    const userInfo = storedUser ? JSON.parse(storedUser) : null;

    if (!userInfo) {
      // Not logged in
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
      // Role not allowed
      return <Navigate to="/" />;
    }

    return children; // ✅ Access allowed
  } catch (error) {
    console.error("Error parsing user info:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
