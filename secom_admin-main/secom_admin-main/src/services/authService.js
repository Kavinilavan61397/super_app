import axios from 'axios';
import API_CONFIG from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
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
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
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
    return !!token;
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
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
  },

  getToken: () => {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  },

  getUserData: () => {
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
}; 