const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Chat title cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['student-student', 'student-teacher'],
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  messages: [messageSchema],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderName: String,
    timestamp: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For student-teacher chats
  subject: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
    default: 'open'
  },
  // Chat settings
  settings: {
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 10
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });

// Virtual for participant count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Method to add participant
chatSchema.methods.addParticipant = function(userId, role) {
  // Check if user is already a participant
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    existingParticipant.isActive = true;
    return this.save();
  }
  
  // Check participant limit
  if (this.participantCount >= this.settings.maxParticipants) {
    throw new Error('Chat has reached maximum participant limit');
  }
  
  this.participants.push({
    user: userId,
    role: role
  });
  
  return this.save();
};

// Method to remove participant
chatSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.isActive = false;
  }
  
  return this.save();
};

// Method to add message
chatSchema.methods.addMessage = function(messageData) {
  const message = {
    sender: messageData.sender,
    senderName: messageData.senderName,
    content: messageData.content,
    messageType: messageData.messageType || 'text',
    fileUrl: messageData.fileUrl,
    fileName: messageData.fileName
  };
  
  this.messages.push(message);
  
  // Update last message
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    senderName: message.senderName,
    timestamp: new Date()
  };
  
  return this.save();
};

// Method to mark messages as read
chatSchema.methods.markAsRead = function(userId, messageIds = []) {
  if (messageIds.length === 0) {
    // Mark all messages as read
    this.messages.forEach(message => {
      const alreadyRead = message.readBy.some(
        read => read.user.toString() === userId.toString()
      );
      
      if (!alreadyRead) {
        message.readBy.push({ user: userId });
      }
    });
  } else {
    // Mark specific messages as read
    messageIds.forEach(messageId => {
      const message = this.messages.id(messageId);
      if (message) {
        const alreadyRead = message.readBy.some(
          read => read.user.toString() === userId.toString()
        );
        
        if (!alreadyRead) {
          message.readBy.push({ user: userId });
        }
      }
    });
  }
  
  return this.save();
};

// Static method to get user chats
chatSchema.statics.getUserChats = function(userId, type = null) {
  const query = {
    'participants.user': userId,
    'participants.isActive': true,
    isActive: true
  };
  
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .populate('participants.user', 'name email role profileImage')
    .populate('lastMessage.sender', 'name')
    .sort({ 'lastMessage.timestamp': -1 });
};

// Static method to create new chat
chatSchema.statics.createChat = function(chatData) {
  const chat = new this({
    title: chatData.title,
    type: chatData.type,
    participants: chatData.participants.map(p => ({
      user: p.userId,
      role: p.role
    })),
    subject: chatData.subject,
    priority: chatData.priority || 'medium'
  });
  
  return chat.save();
};

module.exports = mongoose.model('Chat', chatSchema);