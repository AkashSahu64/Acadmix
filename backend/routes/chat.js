const express = require('express');
const {
  getUserChats,
  getChatById,
  createChat,
  addMessage,
  markAsRead,
  addParticipant,
  removeParticipant,
  deleteChat
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/auth');
const { validateChat, validateMessage, validateObjectId } = require('../middleware/validation');
const { uploadChatFile, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Chat management
router.get('/', getUserChats);
router.post('/', validateChat, createChat);
router.get('/:id', validateObjectId(), getChatById);
router.delete('/:id', validateObjectId(), deleteChat);

// Message management
router.post('/:id/messages', validateObjectId(), uploadChatFile, handleUploadError, validateMessage, addMessage);
router.put('/:id/read', validateObjectId(), markAsRead);

// Participant management
router.post('/:id/participants', validateObjectId(), addParticipant);
router.delete('/:id/participants/:userId', validateObjectId(), removeParticipant);

module.exports = router;