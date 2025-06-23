const express = require('express');
const {
  getPublicProfile,
  updatePreferences,
  getNotifications,
  markNotificationAsRead
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/:id/profile', validateObjectId(), getPublicProfile);

// Protected routes
router.use(protect);

router.put('/preferences', updatePreferences);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', validateObjectId(), markNotificationAsRead);

module.exports = router;