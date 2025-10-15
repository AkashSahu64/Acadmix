const Announcement = require('../models/Announcement');

// @desc    Get announcements for students and teachers
// @route   GET /api/announcements
// @access  Private (student, teacher, admin)
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAnnouncements
};