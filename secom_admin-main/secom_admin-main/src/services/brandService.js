import API_CONFIG from '../config/api.config';
import axios from 'axios';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const brandService = {
  // Get all brands
  getAllBrands: async () => {
    try {
      console.log('Fetching brands...');
      const response = await api.get('/api/admin/get_all_brand');
      console.log('Brands response:', response);
      
      // Handle both array response and {success, data} response formats
      const brands = Array.isArray(response) ? response : (response.data || []);
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Create brand
  createBrand: async (brandData) => {
    const response = await api.post('/api/admin/save_brand', brandData);
    return response.data;
  },

  // Update brand
  updateBrand: async (id, brandData) => {
    const response = await api.put(`/api/admin/update_brand_by_id/${id}`, brandData);
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await api.delete(`/api/admin/delete_brand_by_id/${id}`);
    return response.data;
  },

  // Bulk delete brands
  bulkDeleteBrands: async (ids) => {
    const response = await api.delete('/api/admin/delete_brands', { data: { ids } });
    return response.data;
  }
};

export default brandService; 