import { chatAPI } from './api';

export const communityService = {
  // Get user's chats
  getStudentChats: async () => {
    try {
      const response = await chatAPI.getUserChats({ type: 'student-student' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching student chats:', error);
      throw error;
    }
  },

  getTeacherChats: async () => {
    try {
      const response = await chatAPI.getUserChats({ type: 'student-teacher' });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching teacher chats:', error);
      throw error;
    }
  },

  // Get chat messages
  getChatMessages: async (chatId) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      return response.data?.messages || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },

  // Create new chat
  createNewChat: async (title, participants, type) => {
    try {
      const chatData = {
        title,
        type: type === 'student' ? 'student-student' : 'student-teacher',
        participants: participants.map(p => ({
          userId: p.id,
          role: p.role
        }))
      };

      const response = await chatAPI.createChat(chatData);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Send message
  sendMessage: async (chatId, type, messageData) => {
    try {
      const formData = new FormData();
      formData.append('content', messageData.content);
      
      if (messageData.file) {
        formData.append('chatFile', messageData.file);
        formData.append('messageType', 'file');
      } else {
        formData.append('messageType', 'text');
      }

      const response = await chatAPI.addMessage(chatId, formData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (chatId, messageIds = []) => {
    try {
      const response = await chatAPI.markAsRead(chatId, messageIds);
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Add participant to chat
  addParticipant: async (chatId, userId, role) => {
    try {
      const response = await chatAPI.addParticipant(chatId, { userId, role });
      return response.data;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  },

  // Remove participant from chat
  removeParticipant: async (chatId, userId) => {
    try {
      const response = await chatAPI.removeParticipant(chatId, userId);
      return response;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await chatAPI.deleteChat(chatId);
      return response;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};