import { adminAPI } from './api';

export const adminService = {
  // Analytics
  getAnalytics: async () => {
    try {
      const response = await adminAPI.getAnalytics();
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // User management
  getTeachers: async (filters = {}) => {
    try {
      const response = await adminAPI.getAllUsers({ ...filters, role: 'teacher' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  getStudents: async (filters = {}) => {
    try {
      const response = await adminAPI.getAllUsers({ ...filters, role: 'student' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await adminAPI.getUserById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  updateUserStatus: async (id, status) => {
    try {
      const response = await adminAPI.updateUserStatus(id, status);
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await adminAPI.deleteUser(id);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Content management
  getAllContent: async (filters = {}) => {
    try {
      const response = await adminAPI.getAllContent(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all content:', error);
      throw error;
    }
  },

  approveContent: async (id) => {
    try {
      const response = await adminAPI.approveContent(id);
      return response.data;
    } catch (error) {
      console.error('Error approving content:', error);
      throw error;
    }
  },

  rejectContent: async (id) => {
    try {
      const response = await adminAPI.rejectContent(id);
      return response.data;
    } catch (error) {
      console.error('Error rejecting content:', error);
      throw error;
    }
  },

  // Announcements
  getAnnouncements: async () => {
    try {
      const response = await adminAPI.getAllAnnouncements();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  createAnnouncement: async (announcementData) => {
    try {
      const response = await adminAPI.createAnnouncement(announcementData);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  updateAnnouncement: async (id, announcementData) => {
    try {
      const response = await adminAPI.updateAnnouncement(id, announcementData);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const response = await adminAPI.deleteAnnouncement(id);
      return response;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  // Chat management
  getAllChats: async () => {
    try {
      const response = await adminAPI.getAllChats();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all chats:', error);
      throw error;
    }
  },

  deleteChat: async (id) => {
    try {
      const response = await adminAPI.deleteChat(id);
      return response;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};