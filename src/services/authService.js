import { authAPI } from './api';

export const authService = {
  login: async (credentials, role) => {
    try {
      const response = await authAPI.login({
        identifier: credentials.email || credentials.rollNo,
        password: credentials.password,
        role
      });
      
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      }
      throw new Error('Failed to get user data');
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  updateProfile: async (formData) => {
    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  getStoredToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
};