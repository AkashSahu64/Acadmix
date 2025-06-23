const Content = require('../models/Content');
const { deleteFile, getFileUrl } = require('../middleware/upload');

// @desc    Get all content with filters
// @route   GET /api/content
// @access  Public
const getContent = async (req, res, next) => {
  try {
    const {
      type,
      branch,
      year,
      semester,
      subject,
      examType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      type,
      branch,
      year: year ? parseInt(year) : undefined,
      semester: semester ? parseInt(semester) : undefined,
      subject,
      examType,
      search,
      sortBy,
      sortOrder,
      limit: parseInt(limit)
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    const content = await Content.getFiltered(filters);

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedContent = content.slice(startIndex, endIndex);

    // Pagination info
    const pagination = {
      current: parseInt(page),
      total: Math.ceil(content.length / parseInt(limit)),
      count: paginatedContent.length,
      totalItems: content.length
    };

    res.status(200).json({
      success: true,
      count: paginatedContent.length,
      pagination,
      data: paginatedContent
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching content'
    });
  }
};

// @desc    Get single content by ID
// @route   GET /api/content/:id
// @access  Public
const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'name email role profileImage');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if content is published and approved
    if (content.status !== 'published' || !content.isApproved) {
      // Only allow author and admin to view unpublished/unapproved content
      if (!req.user || (req.user._id.toString() !== content.author._id.toString() && req.user.role !== 'admin')) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching content'
    });
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Teacher, Admin)
const createContent = async (req, res, next) => {
  try {
    const {
      title,
      type,
      description,
      branch,
      year,
      semester,
      subject,
      videoUrl,
      duration,
      thumbnail,
      examType,
      examDate,
      solved,
      pages,
      subjectCount,
      tags
    } = req.body;

    // Prepare content data
    const contentData = {
      title,
      type,
      description,
      branch,
      author: req.user._id,
      authorName: req.user.name,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    // Add type-specific fields
    if (type !== 'syllabus') {
      contentData.year = parseInt(year);
      contentData.semester = parseInt(semester);
      contentData.subject = subject;
    }

    if (type === 'videos') {
      contentData.videoUrl = videoUrl;
      contentData.duration = duration;
      contentData.thumbnail = thumbnail;
    }

    if (type === 'pyqs') {
      contentData.examType = examType;
      contentData.examDate = new Date(examDate);
      contentData.solved = solved === 'true';
      contentData.pages = pages ? parseInt(pages) : undefined;
    }

    if (type === 'syllabus') {
      contentData.subjectCount = parseInt(subjectCount);
    }

    // Handle file upload
    if (req.file && type !== 'videos') {
      contentData.fileUrl = getFileUrl(req, req.file.path);
      contentData.fileName = req.file.originalname;
      contentData.fileSize = req.file.size;
      contentData.mimeType = req.file.mimetype;
    }

    // Auto-approve for teachers and admins
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      contentData.isApproved = true;
      contentData.approvedBy = req.user._id;
      contentData.approvedAt = new Date();
    }

    const content = await Content.create(contentData);
    await content.populate('author', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Create content error:', error);
    
    // Delete uploaded file if content creation fails
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating content'
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Owner, Admin)
const updateContent = async (req, res, next) => {
  try {
    const content = req.resource; // Set by checkOwnership middleware
    const {
      title,
      description,
      branch,
      year,
      semester,
      subject,
      videoUrl,
      duration,
      thumbnail,
      examType,
      examDate,
      solved,
      pages,
      subjectCount,
      tags,
      status
    } = req.body;

    // Update basic fields
    if (title) content.title = title;
    if (description) content.description = description;
    if (branch) content.branch = branch;
    if (tags) content.tags = tags.split(',').map(tag => tag.trim());
    if (status && req.user.role === 'admin') content.status = status;

    // Update type-specific fields
    if (content.type !== 'syllabus') {
      if (year) content.year = parseInt(year);
      if (semester) content.semester = parseInt(semester);
      if (subject) content.subject = subject;
    }

    if (content.type === 'videos') {
      if (videoUrl) content.videoUrl = videoUrl;
      if (duration) content.duration = duration;
      if (thumbnail) content.thumbnail = thumbnail;
    }

    if (content.type === 'pyqs') {
      if (examType) content.examType = examType;
      if (examDate) content.examDate = new Date(examDate);
      if (solved !== undefined) content.solved = solved === 'true';
      if (pages) content.pages = parseInt(pages);
    }

    if (content.type === 'syllabus') {
      if (subjectCount) content.subjectCount = parseInt(subjectCount);
      content.lastUpdated = new Date();
    }

    // Handle file upload
    if (req.file && content.type !== 'videos') {
      // Delete old file
      if (content.fileUrl) {
        const oldFilePath = content.fileUrl.replace(`${req.protocol}://${req.get('host')}/`, '');
        deleteFile(oldFilePath);
      }
      
      content.fileUrl = getFileUrl(req, req.file.path);
      content.fileName = req.file.originalname;
      content.fileSize = req.file.size;
      content.mimeType = req.file.mimetype;
    }

    await content.save();
    await content.populate('author', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Update content error:', error);
    
    // Delete uploaded file if update fails
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating content'
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Owner, Admin)
const deleteContent = async (req, res, next) => {
  try {
    const content = req.resource; // Set by checkOwnership middleware

    // Delete associated file
    if (content.fileUrl) {
      const filePath = content.fileUrl.replace(`${req.protocol}://${req.get('host')}/`, '');
      deleteFile(filePath);
    }

    await Content.findByIdAndDelete(content._id);

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting content'
    });
  }
};

// @desc    Like/Unlike content
// @route   POST /api/content/:id/like
// @access  Private
const likeContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.toggleLike(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Content like status updated',
      data: {
        likes: content.stats.likes,
        isLiked: content.likedBy.includes(req.user._id)
      }
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating like status'
    });
  }
};

// @desc    Bookmark/Unbookmark content
// @route   POST /api/content/:id/bookmark
// @access  Private
const bookmarkContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.toggleBookmark(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Content bookmark status updated',
      data: {
        bookmarks: content.stats.bookmarks,
        isBookmarked: content.bookmarkedBy.includes(req.user._id)
      }
    });
  } catch (error) {
    console.error('Bookmark content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bookmark status'
    });
  }
};

// @desc    Increment view count
// @route   POST /api/content/:id/view
// @access  Public
const incrementViews = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.incrementViews();

    res.status(200).json({
      success: true,
      message: 'View count updated',
      data: {
        views: content.stats.views
      }
    });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating view count'
    });
  }
};

// @desc    Increment download count
// @route   POST /api/content/:id/download
// @access  Private
const incrementDownloads = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await content.incrementDownloads();

    res.status(200).json({
      success: true,
      message: 'Download count updated',
      data: {
        downloads: content.stats.downloads
      }
    });
  } catch (error) {
    console.error('Increment downloads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating download count'
    });
  }
};

// @desc    Get user's content
// @route   GET /api/content/user/my-content
// @access  Private
const getUserContent = async (req, res, next) => {
  try {
    const {
      type,
      status = 'published',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = { author: req.user._id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    const content = await Content.find(query)
      .populate('author', 'name email role')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      count: content.length,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalItems: total
      },
      data: content
    });
  } catch (error) {
    console.error('Get user content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user content'
    });
  }
};

// @desc    Get user's bookmarked content
// @route   GET /api/content/user/bookmarks
// @access  Private
const getBookmarkedContent = async (req, res, next) => {
  try {
    const {
      type,
      page = 1,
      limit = 20
    } = req.query;

    const query = {
      bookmarkedBy: req.user._id,
      status: 'published',
      isApproved: true
    };
    
    if (type) query.type = type;

    const content = await Content.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      count: content.length,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalItems: total
      },
      data: content
    });
  } catch (error) {
    console.error('Get bookmarked content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookmarked content'
    });
  }
};

module.exports = {
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
};