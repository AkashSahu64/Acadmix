const express = require('express');
const { register, login, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { uploadProfileImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/profile', uploadProfileImage, handleUploadError, updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;