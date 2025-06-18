import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import API_CONFIG from '../../config/api.config';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Clear all auth-related items to ensure clean state
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
    localStorage.removeItem('OnlineShop-accessToken');
    localStorage.removeItem('OnlineShop-tokenExpiration');
    
    // Save the attempted URL for redirection after login
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to={API_CONFIG.ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute; 