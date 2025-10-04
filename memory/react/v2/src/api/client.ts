import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';

      switch (status) {
        case 401:
          // Unauthorized - could navigate to login
          console.error('Unauthorized:', message);
          break;
        case 403:
          // Forbidden
          console.error('Forbidden:', message);
          break;
        case 404:
          // Not found
          console.error('Not found:', message);
          break;
        case 500:
          // Server error
          console.error('Server error:', message);
          break;
        default:
          console.error('API Error:', message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
