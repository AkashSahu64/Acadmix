import { commonAPI } from './api';

export const commonService = {
  getAnnouncements: async () => {
    try {
      const response = await commonAPI.getAnnouncements();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }
};