const express = require('express');
const {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  likeContent,
  bookmarkContent,
  incrementViews,
  incrementDownloads,
  getUserContent,
  getBookmarkedContent
} = require('../controllers/contentController');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { validateContent, validateObjectId, validatePagination } = require('../middleware/validation');
const { uploadContentFile, handleUploadError } = require('../middleware/upload');
const Content = require('../models/Content');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', validatePagination, getContent);
router.get('/:id', validateObjectId(), getContentById);
router.post('/:id/view', validateObjectId(), incrementViews);

// Protected routes
router.use(protect);

// Content management
router.post('/', authorize('teacher', 'admin'), uploadContentFile, handleUploadError, validateContent, createContent);
router.put('/:id', validateObjectId(), checkOwnership(Content), uploadContentFile, handleUploadError, updateContent);
router.delete('/:id', validateObjectId(), checkOwnership(Content), deleteContent);

// User interactions
router.post('/:id/like', validateObjectId(), likeContent);
router.post('/:id/bookmark', validateObjectId(), bookmarkContent);
router.post('/:id/download', validateObjectId(), incrementDownloads);

// User-specific content
router.get('/user/my-content', getUserContent);
router.get('/user/bookmarks', getBookmarkedContent);

module.exports = router;