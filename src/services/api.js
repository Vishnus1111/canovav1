import axios from 'axios';

// Base API URL - adjust this based on your backend port
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Form API functions
export const formAPI = {
  // Create/Save a new form
  createForm: async (formData) => {
    try {
      const response = await api.post('/forms/save', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create form' };
    }
  },

  // Get form by link
  getFormByLink: async (link) => {
    try {
      const response = await api.get(`/forms/${link}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch form' };
    }
  },

  // Submit form response
  submitFormResponse: async (formId, responses) => {
    try {
      const response = await api.post(`/forms/${formId}/submit`, { responses });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to submit response' };
    }
  },

  // Get all forms for a user
  getUserForms: async (userId) => {
    try {
      const response = await api.get(`/forms/projects/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user forms' };
    }
  }
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  verifyOtp: async (otpData) => {
    try {
      const response = await api.post('/auth/verify-otp', otpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'OTP verification failed' };
    }
  }
};

export default api;
