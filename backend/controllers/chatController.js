const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Get user's chats
// @route   GET /api/chat
// @access  Private
const getUserChats = async (req, res, next) => {
  try {
    const { type } = req.query;
    
    const chats = await Chat.getUserChats(req.user._id, type);

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chats'
    });
  }
};

// @desc    Get chat by ID
// @route   GET /api/chat/:id
// @access  Private
const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.user', 'name email role profileImage')
      .populate('messages.sender', 'name profileImage');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      p => p.user._id.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this chat.'
      });
    }

    // Mark messages as read for the current user
    await chat.markAsRead(req.user._id);

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Get chat by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat'
    });
  }
};

// @desc    Create new chat
// @route   POST /api/chat
// @access  Private
const createChat = async (req, res, next) => {
  try {
    const { title, type, participants, subject, priority } = req.body;

    // Validate participants
    const participantIds = participants.map(p => p.userId);
    const users = await User.find({ _id: { $in: participantIds } });

    if (users.length !== participants.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more participants not found'
      });
    }

    // Validate chat type and participants
    if (type === 'student-teacher') {
      const hasStudent = participants.some(p => p.role === 'student');
      const hasTeacher = participants.some(p => p.role === 'teacher');
      
      if (!hasStudent || !hasTeacher) {
        return res.status(400).json({
          success: false,
          message: 'Student-teacher chat must have at least one student and one teacher'
        });
      }
    }

    // Ensure current user is included in participants
    const currentUserParticipant = participants.find(
      p => p.userId === req.user._id.toString()
    );

    if (!currentUserParticipant) {
      participants.push({
        userId: req.user._id,
        role: req.user.role
      });
    }

    const chatData = {
      title,
      type,
      participants,
      subject,
      priority
    };

    const chat = await Chat.createChat(chatData);
    await chat.populate('participants.user', 'name email role profileImage');

    // Emit socket event to notify participants
    const io = req.app.get('io');
    participants.forEach(participant => {
      io.to(participant.userId).emit('new-chat', {
        chatId: chat._id,
        title: chat.title,
        type: chat.type
      });
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating chat'
    });
  }
};

// @desc    Add message to chat
// @route   POST /api/chat/:id/messages
// @access  Private
const addMessage = async (req, res, next) => {
  try {
    const { content, messageType = 'text' } = req.body;
    
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this chat.'
      });
    }

    const messageData = {
      sender: req.user._id,
      senderName: req.user.name,
      content,
      messageType
    };

    // Handle file upload
    if (req.file) {
      messageData.fileUrl = getFileUrl(req, req.file.path);
      messageData.fileName = req.file.originalname;
      messageData.messageType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
    }

    await chat.addMessage(messageData);
    await chat.populate('messages.sender', 'name profileImage');

    const newMessage = chat.messages[chat.messages.length - 1];

    // Emit socket event to chat participants
    const io = req.app.get('io');
    io.to(req.params.id).emit('new-message', {
      chatId: chat._id,
      message: newMessage
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Add message error:', error);
    
    // Delete uploaded file if message creation fails
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { messageIds } = req.body;
    
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this chat.'
      });
    }

    await chat.markAsRead(req.user._id, messageIds);

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking messages as read'
    });
  }
};

// @desc    Add participant to chat
// @route   POST /api/chat/:id/participants
// @access  Private
const addParticipant = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if current user is a participant or admin
    const isParticipant = chat.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only participants can add new members.'
      });
    }

    // Verify the user to be added exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User to add not found'
      });
    }

    await chat.addParticipant(userId, role);
    await chat.populate('participants.user', 'name email role profileImage');

    // Emit socket event
    const io = req.app.get('io');
    io.to(userId).emit('added-to-chat', {
      chatId: chat._id,
      title: chat.title
    });

    res.status(200).json({
      success: true,
      message: 'Participant added successfully',
      data: chat
    });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding participant'
    });
  }
};

// @desc    Remove participant from chat
// @route   DELETE /api/chat/:id/participants/:userId
// @access  Private
const removeParticipant = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check permissions: user can remove themselves, or admin can remove anyone
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only remove yourself from the chat.'
      });
    }

    await chat.removeParticipant(userId);

    // Emit socket event
    const io = req.app.get('io');
    io.to(userId).emit('removed-from-chat', {
      chatId: chat._id
    });

    res.status(200).json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing participant'
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Only admin or chat creator can delete chat
    const isCreator = chat.participants[0].user.toString() === req.user._id.toString();
    
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only chat creator or admin can delete the chat.'
      });
    }

    // Delete associated files
    chat.messages.forEach(message => {
      if (message.fileUrl) {
        const filePath = message.fileUrl.replace(`${req.protocol}://${req.get('host')}/`, '');
        deleteFile(filePath);
      }
    });

    await Chat.findByIdAndDelete(req.params.id);

    // Emit socket event to all participants
    const io = req.app.get('io');
    chat.participants.forEach(participant => {
      io.to(participant.user.toString()).emit('chat-deleted', {
        chatId: chat._id
      });
    });

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting chat'
    });
  }
};

module.exports = {
  getUserChats,
  getChatById,
  createChat,
  addMessage,
  markAsRead,
  addParticipant,
  removeParticipant,
  deleteChat
};