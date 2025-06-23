const express = require('express');
const { chatWithAI, getAIHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// AI chat validation
const validateAIChat = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  
  body('contentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid content ID'),
  
  body('context')
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('Context cannot exceed 2000 characters'),
  
  handleValidationErrors
];

// AI chat routes
router.post('/chat', validateAIChat, chatWithAI);
router.get('/history', getAIHistory);

module.exports = router;