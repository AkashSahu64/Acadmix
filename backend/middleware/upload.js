const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'profileImage') {
      uploadPath = path.join(uploadsDir, 'profiles');
    } else if (file.fieldname === 'contentFile') {
      uploadPath = path.join(uploadsDir, 'content');
    } else if (file.fieldname === 'chatFile') {
      uploadPath = path.join(uploadsDir, 'chat');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types based on field name
  const allowedTypes = {
    profileImage: /jpeg|jpg|png|gif/,
    contentFile: /pdf|doc|docx|ppt|pptx/,
    chatFile: /jpeg|jpg|png|gif|pdf|doc|docx|txt/
  };
  
  const allowedMimes = {
    profileImage: /image\/(jpeg|jpg|png|gif)/,
    contentFile: /application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)/,
    chatFile: /image\/(jpeg|jpg|png|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/plain/
  };
  
  const fieldName = file.fieldname;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;
  
  // Check if field name is allowed
  if (!allowedTypes[fieldName]) {
    return cb(new Error(`Unexpected field: ${fieldName}`), false);
  }
  
  // Check file extension
  if (!allowedTypes[fieldName].test(fileExtension)) {
    return cb(new Error(`Invalid file type. Allowed types for ${fieldName}: ${allowedTypes[fieldName]}`), false);
  }
  
  // Check MIME type
  if (!allowedMimes[fieldName].test(mimeType)) {
    return cb(new Error(`Invalid MIME type: ${mimeType}`), false);
  }
  
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Middleware for different upload types
const uploadProfileImage = upload.single('profileImage');
const uploadContentFile = upload.single('contentFile');
const uploadChatFile = upload.single('chatFile');
const uploadMultiple = upload.array('files', 5);

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 50MB.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  next();
};

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Utility function to get file URL
const getFileUrl = (req, filePath) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const relativePath = path.relative(path.join(__dirname, '../'), filePath);
  return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
};

module.exports = {
  uploadProfileImage,
  uploadContentFile,
  uploadChatFile,
  uploadMultiple,
  handleUploadError,
  deleteFile,
  getFileUrl
};