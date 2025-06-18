import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import API_CONFIG from '../../config/api.config';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Save the attempted URL for redirection after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to={API_CONFIG.ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute; 