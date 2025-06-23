const User = require('../models/User');

// @desc    Get a user's public profile by ID
// @route   GET /api/users/:id/profile
// @access  Public
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.preferences = {
      ...user.preferences,
      ...req.body
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Dummy notifications array (replace with DB logic if needed)
let notificationsStore = {};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = notificationsStore[req.user._id] || [];

  res.status(200).json({
    success: true,
    data: notifications
  });
};

// @desc    Mark a specific notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res) => {
  const notifications = notificationsStore[req.user._id] || [];

  const index = notifications.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  notifications[index].read = true;
  notificationsStore[req.user._id] = notifications;

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notifications[index]
  });
};

module.exports = {
  getPublicProfile,
  updatePreferences,
  getNotifications,
  markNotificationAsRead
};
