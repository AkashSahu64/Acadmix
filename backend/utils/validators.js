const validator = require('validator');

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Please provide a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }

  // Check for at least one uppercase, one lowercase, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }

  return { isValid: true };
};

/**
 * Validate roll number format
 * @param {string} rollNo - Roll number to validate
 * @returns {Object} - Validation result
 */
const validateRollNumber = (rollNo) => {
  if (!rollNo) {
    return { isValid: false, message: 'Roll number is required' };
  }

  // Remove spaces and convert to uppercase
  const cleanRollNo = rollNo.replace(/\s+/g, '').toUpperCase();

  if (cleanRollNo.length < 3 || cleanRollNo.length > 20) {
    return { isValid: false, message: 'Roll number must be between 3 and 20 characters' };
  }

  // Check for valid characters (alphanumeric)
  if (!/^[A-Z0-9]+$/.test(cleanRollNo)) {
    return { isValid: false, message: 'Roll number can only contain letters and numbers' };
  }

  return { isValid: true, cleanValue: cleanRollNo };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} - Validation result
 */
const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { isValid: false, message: 'Phone number must be between 10 and 15 digits' };
  }

  return { isValid: true, cleanValue: cleanPhone };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} - Validation result
 */
const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, message: 'Name cannot exceed 50 characters' };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, cleanValue: trimmedName };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {Object} - Validation result
 */
const validateURL = (url, required = false) => {
  if (!url) {
    if (required) {
      return { isValid: false, message: 'URL is required' };
    }
    return { isValid: true };
  }

  if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
    return { isValid: false, message: 'Please provide a valid URL' };
  }

  return { isValid: true };
};

/**
 * Validate file type
 * @param {string} filename - Filename to validate
 * @param {Array} allowedTypes - Array of allowed file extensions
 * @returns {Object} - Validation result
 */
const validateFileType = (filename, allowedTypes) => {
  if (!filename) {
    return { isValid: false, message: 'Filename is required' };
  }

  const extension = filename.split('.').pop().toLowerCase();

  if (!allowedTypes.includes(extension)) {
    return {
      isValid: false,
      message: `File type .${extension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes
 * @returns {Object} - Validation result
 */
const validateFileSize = (size, maxSize) => {
  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      message: `File size exceeds the maximum limit of ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Validate academic year
 * @param {number} year - Year to validate
 * @returns {Object} - Validation result
 */
const validateAcademicYear = (year) => {
  if (!year) {
    return { isValid: false, message: 'Academic year is required' };
  }

  const yearNum = parseInt(year);

  if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
    return { isValid: false, message: 'Academic year must be between 1 and 4' };
  }

  return { isValid: true, cleanValue: yearNum };
};

/**
 * Validate semester
 * @param {number} semester - Semester to validate
 * @returns {Object} - Validation result
 */
const validateSemester = (semester) => {
  if (!semester) {
    return { isValid: false, message: 'Semester is required' };
  }

  const semesterNum = parseInt(semester);

  if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
    return { isValid: false, message: 'Semester must be between 1 and 8' };
  }

  return { isValid: true, cleanValue: semesterNum };
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {Object} - Validation result
 */
const validateObjectId = (id) => {
  if (!id) {
    return { isValid: false, message: 'ID is required' };
  }

  if (!validator.isMongoId(id)) {
    return { isValid: false, message: 'Invalid ID format' };
  }

  return { isValid: true };
};

/**
 * Sanitize HTML content
 * @param {string} content - Content to sanitize
 * @returns {string} - Sanitized content
 */
const sanitizeHTML = (content) => {
  if (!content) return '';
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

/**
 * Validate and sanitize text input
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {boolean} required - Whether text is required
 * @returns {Object} - Validation result
 */
const validateText = (text, minLength = 0, maxLength = 1000, required = false) => {
  if (!text || text.trim().length === 0) {
    if (required) {
      return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, cleanValue: '' };
  }

  const trimmedText = text.trim();

  if (trimmedText.length < minLength) {
    return { isValid: false, message: `Text must be at least ${minLength} characters long` };
  }

  if (trimmedText.length > maxLength) {
    return { isValid: false, message: `Text cannot exceed ${maxLength} characters` };
  }

  return { isValid: true, cleanValue: sanitizeHTML(trimmedText) };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRollNumber,
  validatePhoneNumber,
  validateName,
  validateURL,
  validateFileType,
  validateFileSize,
  validateAcademicYear,
  validateSemester,
  validateObjectId,
  sanitizeHTML,
  validateText
};