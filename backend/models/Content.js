const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['notes', 'syllabus', 'videos', 'pyqs']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  // Academic details
  branch: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  subject: {
    type: String,
    trim: true
  },
  // File details
  fileUrl: {
    type: String,
    required: function() {
      return this.type !== 'videos';
    }
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  mimeType: {
    type: String
  },
  // Video-specific fields
  videoUrl: {
    type: String,
    required: function() {
      return this.type === 'videos';
    }
  },
  duration: {
    type: String // Format: "45:12"
  },
  thumbnail: {
    type: String
  },
  // PYQ-specific fields
  examType: {
    type: String,
    enum: ['Mid-Semester', 'End-Semester', 'Quiz', 'Assignment', 'Practical']
  },
  examDate: {
    type: Date
  },
  solved: {
    type: Boolean,
    default: false
  },
  pages: {
    type: Number,
    min: 1
  },
  // Syllabus-specific fields
  subjectCount: {
    type: Number,
    min: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Author information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  // Engagement metrics
  stats: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    watchCount: { type: Number, default: 0 } // for videos
  },
  // User interactions
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Content status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for teachers, require approval for students
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  // Tags for better searchability
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
contentSchema.index({ type: 1, branch: 1, year: 1, semester: 1 });
contentSchema.index({ author: 1 });
contentSchema.index({ status: 1, isApproved: 1 });
contentSchema.index({ title: 'text', description: 'text', subject: 'text' });

// Virtual for formatted upload date
contentSchema.virtual('uploadDate').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

// Method to increment view count
contentSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Method to increment download count
contentSchema.methods.incrementDownloads = function() {
  this.stats.downloads += 1;
  return this.save();
};

// Method to toggle like
contentSchema.methods.toggleLike = function(userId) {
  const isLiked = this.likedBy.includes(userId);
  
  if (isLiked) {
    this.likedBy.pull(userId);
    this.stats.likes -= 1;
  } else {
    this.likedBy.push(userId);
    this.stats.likes += 1;
  }
  
  return this.save();
};

// Method to toggle bookmark
contentSchema.methods.toggleBookmark = function(userId) {
  const isBookmarked = this.bookmarkedBy.includes(userId);
  
  if (isBookmarked) {
    this.bookmarkedBy.pull(userId);
    this.stats.bookmarks -= 1;
  } else {
    this.bookmarkedBy.push(userId);
    this.stats.bookmarks += 1;
  }
  
  return this.save();
};

// Static method to get content with filters
contentSchema.statics.getFiltered = function(filters = {}) {
  const query = { status: 'published', isApproved: true };
  
  if (filters.type) query.type = filters.type;
  if (filters.branch) query.branch = filters.branch;
  if (filters.year) query.year = filters.year;
  if (filters.semester) query.semester = filters.semester;
  if (filters.subject) query.subject = new RegExp(filters.subject, 'i');
  if (filters.examType) query.examType = filters.examType;
  if (filters.author) query.author = filters.author;
  
  let mongoQuery = this.find(query).populate('author', 'name email role');
  
  if (filters.search) {
    mongoQuery = mongoQuery.find({
      $text: { $search: filters.search }
    });
  }
  
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
    mongoQuery = mongoQuery.sort({ [filters.sortBy]: sortOrder });
  } else {
    mongoQuery = mongoQuery.sort({ createdAt: -1 });
  }
  
  if (filters.limit) {
    mongoQuery = mongoQuery.limit(parseInt(filters.limit));
  }
  
  return mongoQuery;
};

module.exports = mongoose.model('Content', contentSchema);