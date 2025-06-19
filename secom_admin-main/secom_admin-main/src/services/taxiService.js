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

const taxiService = {
  // Taxi Rides
  getAllTaxiRides: async () => {
    try {
      const response = await api.get('/api/taxi-rides');
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi rides:', error);
      throw error;
    }
  },
  
  getTaxiRideById: async (id) => {
    try {
      const response = await api.get(`/api/taxi-rides/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi ride:', error);
      throw error;
    }
  },
  
  createTaxiRide: async (data) => {
    try {
      const response = await api.post('/api/taxi-rides', data);
      return response.data;
    } catch (error) {
      console.error('Error creating taxi ride:', error);
      throw error;
    }
  },
  
  updateTaxiRide: async (id, data) => {
    try {
      const response = await api.put(`/api/taxi-rides/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating taxi ride:', error);
      throw error;
    }
  },
  
  deleteTaxiRide: async (id) => {
    try {
      const response = await api.delete(`/api/taxi-rides/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting taxi ride:', error);
      throw error;
    }
  },

  // Taxi Drivers
  getAllTaxiDrivers: async () => {
    try {
      const response = await api.get('/api/taxi-drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi drivers:', error);
      throw error;
    }
  },
  
  getTaxiDriverById: async (id) => {
    try {
      const response = await api.get(`/api/taxi-drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi driver:', error);
      throw error;
    }
  },
  
  createTaxiDriver: async (data) => {
    try {
      const response = await api.post('/api/taxi-drivers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating taxi driver:', error);
      throw error;
    }
  },
  
  updateTaxiDriver: async (id, data) => {
    try {
      const response = await api.put(`/api/taxi-drivers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating taxi driver:', error);
      throw error;
    }
  },
  
  deleteTaxiDriver: async (id) => {
    try {
      const response = await api.delete(`/api/taxi-drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting taxi driver:', error);
      throw error;
    }
  },

  // Taxi Vehicles
  getAllTaxiVehicles: async () => {
    try {
      const response = await api.get('/api/taxi-vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi vehicles:', error);
      throw error;
    }
  },
  
  getTaxiVehicleById: async (id) => {
    try {
      const response = await api.get(`/api/taxi-vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching taxi vehicle:', error);
      throw error;
    }
  },
  
  createTaxiVehicle: async (data) => {
    try {
      const response = await api.post('/api/taxi-vehicles', data);
      return response.data;
    } catch (error) {
      console.error('Error creating taxi vehicle:', error);
      throw error;
    }
  },
  
  updateTaxiVehicle: async (id, data) => {
    try {
      const response = await api.put(`/api/taxi-vehicles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating taxi vehicle:', error);
      throw error;
    }
  },
  
  deleteTaxiVehicle: async (id) => {
    try {
      const response = await api.delete(`/api/taxi-vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting taxi vehicle:', error);
      throw error;
    }
  },
};

export default taxiService; 