import axios from 'axios';
import API_CONFIG from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Order Service
export const orderService = {
  // Create order from cart
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to create order',
        error: error.message
      };
    }
  },

  // Get user orders with pagination and filtering
  getUserOrders: async (params = {}) => {
    try {
      const response = await api.get('/api/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      };
    }
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      };
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/api/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      };
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to cancel order',
        error: error.message
      };
    }
  }
};

// Admin Order Service
export const adminOrderService = {
  // Get all orders with advanced filtering
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      };
    }
  },

  // Get order statistics for dashboard
  getOrderStats: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/orders/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch order statistics',
        error: error.message
      };
    }
  },

  // Get single order by ID (admin)
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/api/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to update order status',
        error: error.message
      };
    }
  },

  // Bulk update orders
  bulkUpdateOrders: async (updateData) => {
    try {
      const response = await api.put('/api/admin/orders/bulk-update', updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to update orders',
        error: error.message
      };
    }
  },

  // Export orders
  exportOrders: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/orders/export/data', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Failed to export orders',
        error: error.message
      };
    }
  }
}; 