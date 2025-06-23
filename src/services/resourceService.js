import { contentAPI } from './api';

export const resourceService = {
  // Get content with filters
  getNotes: async (filters = {}) => {
    try {
      const response = await contentAPI.getContent({ ...filters, type: 'notes' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getSyllabus: async (filters = {}) => {
    try {
      const response = await contentAPI.getContent({ ...filters, type: 'syllabus' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      throw error;
    }
  },

  getVideos: async (filters = {}) => {
    try {
      const response = await contentAPI.getContent({ ...filters, type: 'videos' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  getPYQs: async (filters = {}) => {
    try {
      const response = await contentAPI.getContent({ ...filters, type: 'pyqs' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching PYQs:', error);
      throw error;
    }
  },

  // Get single content by ID
  getContentById: async (id) => {
    try {
      const response = await contentAPI.getContentById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  },

  // Create new content
  uploadResource: async (resourceData, type) => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', resourceData.title);
      formData.append('type', type);
      formData.append('branch', resourceData.branch);
      
      if (resourceData.description) {
        formData.append('description', resourceData.description);
      }

      // Add type-specific fields
      if (type !== 'syllabus') {
        formData.append('year', resourceData.year);
        formData.append('semester', resourceData.semester);
        formData.append('subject', resourceData.subject);
      }

      if (type === 'videos') {
        formData.append('videoUrl', resourceData.videoUrl);
        formData.append('duration', resourceData.duration);
        if (resourceData.thumbnail) {
          formData.append('thumbnail', resourceData.thumbnail);
        }
      }

      if (type === 'pyqs') {
        formData.append('examType', resourceData.examType);
        formData.append('examDate', resourceData.examDate);
        formData.append('solved', resourceData.solved);
        if (resourceData.pages) {
          formData.append('pages', resourceData.pages);
        }
      }

      if (type === 'syllabus') {
        formData.append('subjectCount', resourceData.subjectCount);
      }

      // Add file if present
      if (resourceData.file) {
        formData.append('contentFile', resourceData.file);
      }

      // Add tags if present
      if (resourceData.tags) {
        formData.append('tags', resourceData.tags);
      }

      const response = await contentAPI.createContent(formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading resource:', error);
      throw error;
    }
  },

  // Update content
  updateContent: async (id, resourceData) => {
    try {
      const formData = new FormData();
      
      // Add fields that are being updated
      Object.keys(resourceData).forEach(key => {
        if (resourceData[key] !== undefined && resourceData[key] !== null) {
          if (key === 'file') {
            formData.append('contentFile', resourceData[key]);
          } else {
            formData.append(key, resourceData[key]);
          }
        }
      });

      const response = await contentAPI.updateContent(id, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  // Delete content
  deleteContent: async (id) => {
    try {
      const response = await contentAPI.deleteContent(id);
      return response;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },

  // Update resource stats
  updateResourceStats: async (resourceId, type, action) => {
    try {
      let response;
      
      switch (action) {
        case 'like':
          response = await contentAPI.likeContent(resourceId);
          break;
        case 'bookmark':
          response = await contentAPI.bookmarkContent(resourceId);
          break;
        case 'view':
          response = await contentAPI.incrementViews(resourceId);
          break;
        case 'download':
          response = await contentAPI.incrementDownloads(resourceId);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating ${action} stats:`, error);
      throw error;
    }
  },

  // Get user's content
  getUserContent: async (filters = {}) => {
    try {
      const response = await contentAPI.getUserContent(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user content:', error);
      throw error;
    }
  },

  // Get bookmarked content
  getBookmarkedContent: async (filters = {}) => {
    try {
      const response = await contentAPI.getBookmarkedContent(filters);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching bookmarked content:', error);
      throw error;
    }
  }
};