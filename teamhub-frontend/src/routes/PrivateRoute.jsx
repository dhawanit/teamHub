import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error('Session expired. Please log in.');
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please log in.');
      return <Navigate to="/login" replace />;
    }

    return children; // Token is valid
  } catch (err) {
    localStorage.removeItem('token');
    toast.error('Invalid session. Please log in.');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
