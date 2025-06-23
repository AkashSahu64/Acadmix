const express = require('express');
const {
  getAnalytics,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAllContent,
  approveContent,
  rejectContent,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllChats,
  deleteChat
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateAnnouncement, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Analytics
router.get('/analytics', getAnalytics);

// User management
router.get('/users', validatePagination, getAllUsers);
router.get('/users/:id', validateObjectId(), getUserById);
router.put('/users/:id/status', validateObjectId(), updateUserStatus);
router.delete('/users/:id', validateObjectId(), deleteUser);

// Content management
router.get('/content', validatePagination, getAllContent);
router.put('/content/:id/approve', validateObjectId(), approveContent);
router.put('/content/:id/reject', validateObjectId(), rejectContent);

// Announcement management
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', validateAnnouncement, createAnnouncement);
router.put('/announcements/:id', validateObjectId(), validateAnnouncement, updateAnnouncement);
router.delete('/announcements/:id', validateObjectId(), deleteAnnouncement);

// Chat management
router.get('/chats', getAllChats);
router.delete('/chats/:id', validateObjectId(), deleteChat);

module.exports = router;