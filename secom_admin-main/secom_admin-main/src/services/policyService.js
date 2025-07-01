import { apiService } from './api.service';

const PolicyService = {
  // Get all policies with pagination and search
  getAllPolicies: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    
    return apiService.get(`/api/policies?${queryParams.toString()}`);
  },

  // Get policy by ID
  getPolicyById: (id) => apiService.get(`/api/policies/${id}`),

  // Create new policy
  createPolicy: (data) => apiService.post('/api/policies', data),

  // Update policy
  updatePolicy: (id, data) => apiService.put(`/api/policies/${id}`, data),

  // Toggle policy status
  togglePolicyStatus: (id) => apiService.patch(`/api/policies/${id}/toggle-status`),

  // Delete policy
  deletePolicy: (id) => apiService.delete(`/api/policies/${id}`),

  // Get active policies for dropdown/multi-select
  getActivePolicies: () => apiService.get('/api/policies?status=true&limit=100')
};

export default PolicyService; 