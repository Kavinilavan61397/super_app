import axios from 'axios';
import API_CONFIG from '../config/api.config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: API_CONFIG.HEADERS
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
      
      // Only redirect if not already on login page
      if (window.location.pathname !== API_CONFIG.ROUTES.LOGIN) {
        window.location.href = API_CONFIG.ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

const setAuthData = (data) => {
  if (data.data && data.data.token) {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.data.token);
    
    // Set token expiration (default to 24 hours if not provided)
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    localStorage.setItem(
      API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION, 
      String(Date.now() + expiresIn)
    );

    // Store user data if available
    if (data.data.user) {
      localStorage.setItem(
        API_CONFIG.STORAGE_KEYS.USER_DATA, 
        JSON.stringify(data.data.user)
      );
    }
  }
  return data;
};

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post(API_CONFIG.AUTH.REGISTER, userData);
      setAuthData(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Registration failed. Please try again.' 
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_CONFIG.AUTH.LOGIN, credentials);
      setAuthData(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { 
        message: 'Login failed. Please check your credentials and try again.' 
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(API_CONFIG.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
      window.location.href = API_CONFIG.ROUTES.LOGIN;
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const expiration = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
    
    if (!token || !expiration) {
      return false;
    }

    // Check if token is expired
    if (Date.now() > parseInt(expiration, 10)) {
      // Clear expired token
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
      return false;
    }

    return true;
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get(API_CONFIG.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to fetch profile. Please try again.' 
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(API_CONFIG.AUTH.PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        message: 'Failed to update profile. Please try again.' 
      };
    }
  }
}; 