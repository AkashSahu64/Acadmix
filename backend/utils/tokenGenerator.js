const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} expiresIn - Token expiration time
 * @returns {string} - JWT token
 */
const generateJWT = (userId, role = null, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  const payload = { id: userId };
  
  if (role) {
    payload.role = role;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate random token for password reset, email verification, etc.
 * @param {number} length - Token length in bytes
 * @returns {string} - Random hex token
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate API key
 * @param {string} prefix - Optional prefix for the API key
 * @returns {string} - API key
 */
const generateAPIKey = (prefix = 'sc') => {
  const randomPart = crypto.randomBytes(24).toString('hex');
  return `${prefix}_${randomPart}`;
};

/**
 * Hash token for storage
 * @param {string} token - Token to hash
 * @returns {string} - Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate refresh token
 * @returns {string} - Refresh token
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Create token response object
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @returns {Object} - Token response
 */
const createTokenResponse = (user, statusCode = 200, message = 'Success') => {
  const token = generateJWT(user._id, user.role);
  const refreshToken = generateRefreshToken();

  return {
    success: true,
    statusCode,
    message,
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    },
    expiresIn: process.env.JWT_EXPIRE || '7d'
  };
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromRequest = (req) => {
  let token = null;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Check query parameter (for file downloads, etc.)
  else if (req.query && req.query.token) {
    token = req.query.token;
  }

  return token;
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - Whether token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
  generateRandomToken,
  generateAPIKey,
  hashToken,
  generateRefreshToken,
  createTokenResponse,
  extractTokenFromRequest,
  isTokenExpired,
  getTokenExpiration
};