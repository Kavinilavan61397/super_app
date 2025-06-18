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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const brandService = {
  getAllBrands: async () => {
    const response = await api.get('/api/admin/get_all_brand');
    return response.data;
  },
  createBrand: async (formData) => {
    const response = await api.post('/api/admin/add_brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  updateBrand: async (id, formData) => {
    const response = await api.put(`/api/admin/update_brand/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deleteBrand: async (id) => {
    const response = await api.delete(`/api/admin/delete_brand/${id}`);
    return response.data;
  },
}; 