// adminController.js
const User = require('../models/User');
const Content = require('../models/Content');
const Announcement = require('../models/Announcement');
const Chat = require('../models/Chat');

// Dashboard analytics
const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const contentCount = await Content.countDocuments();
    const announcementCount = await Announcement.countDocuments();
    const chatCount = await Chat.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        userCount,
        contentCount,
        announcementCount,
        chatCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// User management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, message: 'User status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Content management
const getAllContent = async (req, res) => {
  try {
    const content = await Content.find().populate('author', 'name email');
    res.status(200).json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const approveContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    content.isApproved = true;
    content.status = 'published';
    content.approvedBy = req.user._id;
    content.approvedAt = new Date();
    await content.save();

    res.status(200).json({ success: true, message: 'Content approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const rejectContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    content.status = 'archived';
    content.isApproved = false;
    await content.save();

    res.status(200).json({ success: true, message: 'Content rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Announcement management
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, author: req.user._id, authorName: req.user.name });
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Chat management
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.status(200).json({ success: true, message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
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
};
