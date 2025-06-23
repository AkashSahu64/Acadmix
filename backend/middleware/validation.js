const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// User validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be student, teacher, or admin'),
  
  // Student-specific validations
  body('rollNo')
    .if(body('role').equals('student'))
    .notEmpty()
    .withMessage('Roll number is required for students')
    .isLength({ min: 3, max: 20 })
    .withMessage('Roll number must be between 3 and 20 characters'),
  
  body('university')
    .if(body('role').equals('student'))
    .notEmpty()
    .withMessage('University is required for students'),
  
  body('branch')
    .if(body('role').equals('student'))
    .notEmpty()
    .withMessage('Branch is required for students'),
  
  body('year')
    .if(body('role').equals('student'))
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4'),
  
  body('semester')
    .if(body('role').equals('student'))
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  
  // Teacher-specific validations
  body('department')
    .if(body('role').equals('teacher'))
    .notEmpty()
    .withMessage('Department is required for teachers'),
  
  handleValidationErrors
];

const validateLogin = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or roll number is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('role')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Role must be student, teacher, or admin'),
  
  handleValidationErrors
];

// Content validation rules
const validateContent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('type')
    .isIn(['notes', 'syllabus', 'videos', 'pyqs'])
    .withMessage('Type must be notes, syllabus, videos, or pyqs'),
  
  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch is required'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  // Conditional validations based on type
  body('year')
    .if(body('type').not().equals('syllabus'))
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4'),
  
  body('semester')
    .if(body('type').not().equals('syllabus'))
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  
  body('subject')
    .if(body('type').not().equals('syllabus'))
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  
  // Video-specific validations
  body('videoUrl')
    .if(body('type').equals('videos'))
    .isURL()
    .withMessage('Valid video URL is required for videos'),
  
  body('duration')
    .if(body('type').equals('videos'))
    .matches(/^\d{1,2}:\d{2}$/)
    .withMessage('Duration must be in format MM:SS or HH:MM'),
  
  // PYQ-specific validations
  body('examType')
    .if(body('type').equals('pyqs'))
    .isIn(['Mid-Semester', 'End-Semester', 'Quiz', 'Assignment', 'Practical'])
    .withMessage('Invalid exam type'),
  
  body('examDate')
    .if(body('type').equals('pyqs'))
    .isISO8601()
    .withMessage('Valid exam date is required'),
  
  // Syllabus-specific validations
  body('subjectCount')
    .if(body('type').equals('syllabus'))
    .isInt({ min: 1 })
    .withMessage('Subject count must be a positive number'),
  
  handleValidationErrors
];

// Chat validation rules
const validateChat = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Chat title must be between 3 and 100 characters'),
  
  body('type')
    .isIn(['student-student', 'student-teacher'])
    .withMessage('Chat type must be student-student or student-teacher'),
  
  body('participants')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required'),
  
  body('participants.*.userId')
    .isMongoId()
    .withMessage('Valid user ID is required for each participant'),
  
  body('participants.*.role')
    .isIn(['student', 'teacher'])
    .withMessage('Participant role must be student or teacher'),
  
  handleValidationErrors
];

const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  
  body('messageType')
    .optional()
    .isIn(['text', 'file', 'image'])
    .withMessage('Message type must be text, file, or image'),
  
  handleValidationErrors
];

// Announcement validation rules
const validateAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  
  body('targetAudience')
    .optional()
    .isIn(['all', 'students', 'teachers', 'specific'])
    .withMessage('Target audience must be all, students, teachers, or specific'),
  
  body('targetBranches')
    .optional()
    .isArray()
    .withMessage('Target branches must be an array'),
  
  body('targetYears')
    .optional()
    .isArray()
    .withMessage('Target years must be an array'),
  
  body('targetYears.*')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Each target year must be between 1 and 4'),
  
  handleValidationErrors
];

// Parameter validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'views', 'downloads', 'likes'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateContent,
  validateChat,
  validateMessage,
  validateAnnouncement,
  validateObjectId,
  validatePagination,
  handleValidationErrors
};