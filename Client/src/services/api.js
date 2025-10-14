import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const publicPaths = ['/auth/register', '/auth/login']; // Public routes

    // Check if current request URL ends with any public path
    const isPublic = publicPaths.some((path) => config.url.endsWith(path));

    // Token sirf private routes ke liye bhejo
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    // Return error message from backend or default message
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) => {
    return api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Content API calls
export const contentAPI = {
  getContent: (params = {}) => api.get('/content', { params }),
  getContentById: (id) => api.get(`/content/${id}`),
  createContent: (formData) => {
    return api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateContent: (id, formData) => {
    return api.put(`/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteContent: (id) => api.delete(`/content/${id}`),
  likeContent: (id) => api.post(`/content/${id}/like`),
  bookmarkContent: (id) => api.post(`/content/${id}/bookmark`),
  incrementViews: (id) => api.post(`/content/${id}/view`),
  incrementDownloads: (id) => api.post(`/content/${id}/download`),
  getUserContent: (params = {}) => api.get('/content/user/my-content', { params }),
  getBookmarkedContent: (params = {}) => api.get('/content/user/bookmarks', { params }),
};

// Chat API calls
export const chatAPI = {
  getUserChats: (params = {}) => api.get('/chat', { params }),
  getChatById: (id) => api.get(`/chat/${id}`),
  createChat: (chatData) => api.post('/chat', chatData),
  addMessage: (chatId, messageData) => {
    if (messageData instanceof FormData) {
      return api.post(`/chat/${chatId}/messages`, messageData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post(`/chat/${chatId}/messages`, messageData);
  },
  markAsRead: (chatId, messageIds = []) => api.put(`/chat/${chatId}/read`, { messageIds }),
  addParticipant: (chatId, participantData) => api.post(`/chat/${chatId}/participants`, participantData),
  removeParticipant: (chatId, userId) => api.delete(`/chat/${chatId}/participants/${userId}`),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
};

// AI API calls
export const aiAPI = {
  chatWithAI: (messageData) => api.post('/ai/chat', messageData),
  getAIHistory: (params = {}) => api.get('/ai/history', { params }),
  clearAIHistory: () => api.delete('/ai/history'),
};

// Admin API calls
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllContent: (params = {}) => api.get('/admin/content', { params }),
  approveContent: (id) => api.put(`/admin/content/${id}/approve`),
  rejectContent: (id) => api.put(`/admin/content/${id}/reject`),
  getAllAnnouncements: () => api.get('/admin/announcements'),
  createAnnouncement: (announcementData) => api.post('/admin/announcements', announcementData),
  updateAnnouncement: (id, announcementData) => api.put(`/admin/announcements/${id}`, announcementData),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
  getAllChats: () => api.get('/admin/chats'),
  deleteChat: (id) => api.delete(`/admin/chats/${id}`),
};

// User API calls
export const userAPI = {
  getPublicProfile: (id) => api.get(`/users/${id}/profile`),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationAsRead: (id) => api.put(`/users/notifications/${id}/read`),
};

export default api;