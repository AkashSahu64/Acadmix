const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'specific'],
    default: 'all'
  },
  // For specific targeting
  targetBranches: [{
    type: String,
    trim: true
  }],
  targetYears: [{
    type: Number,
    min: 1,
    max: 4
  }],
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Engagement tracking
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Scheduling
  publishAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String
  }]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ status: 1, publishAt: 1 });
announcementSchema.index({ pinned: -1, createdAt: -1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ author: 1 });

// Virtual for formatted date
announcementSchema.virtual('date').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Method to mark as read by user
announcementSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(
    read => read.user.toString() === userId.toString()
  );
  
  if (!alreadyRead) {
    this.readBy.push({ user: userId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to get announcements for user
announcementSchema.statics.getForUser = function(user) {
  const query = {
    status: 'published',
    publishAt: { $lte: new Date() },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ]
  };
  
  // Filter by target audience
  const audienceFilter = {
    $or: [
      { targetAudience: 'all' },
      { targetAudience: user.role + 's' }, // 'students' or 'teachers'
      { targetUsers: user._id }
    ]
  };
  
  // Add branch/year filtering for students
  if (user.role === 'student' && user.branch) {
    audienceFilter.$or.push({
      targetAudience: 'specific',
      targetBranches: user.branch
    });
    
    if (user.year) {
      audienceFilter.$or.push({
        targetAudience: 'specific',
        targetYears: user.year
      });
    }
  }
  
  query.$and = [audienceFilter];
  
  return this.find(query)
    .populate('author', 'name email role')
    .sort({ pinned: -1, createdAt: -1 });
};

module.exports = mongoose.model('Announcement', announcementSchema);