import axios from 'axios';
import API_CONFIG from '../../../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const HotelService = {
  getAllHotels: () => api.get('/api/hotels'),
  getHotelById: (id) => api.get(`/api/hotels/${id}`),
  createHotel: (data) => api.post('/api/hotels', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateHotel: (id, data) => api.put(`/api/hotels/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteHotel: (id) => api.delete(`/api/hotels/${id}`),
  getAmenities: () => api.get('/api/amenities'),
  getPolicies: () => api.get('/api/policies'),
  getFAQs: () => api.get('/api/faqs'),
  getLocations: () => api.get('/api/locations'),
};

export default HotelService; 