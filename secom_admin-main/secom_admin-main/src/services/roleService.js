import axios from 'axios';
import API_CONFIG from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
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

export const roleService = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/api/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch roles',
        error: error.message
      };
    }
  },

  // Get role by ID
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/api/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch role',
        error: error.message
      };
    }
  },

  // Create new role
  createRole: async (roleData) => {
    try {
      const response = await api.post('/api/roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to create role',
        error: error.message
      };
    }
  },

  // Update role
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/api/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to update role',
        error: error.message
      };
    }
  },

  // Delete role
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/api/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to delete role',
        error: error.message
      };
    }
  }
}; 