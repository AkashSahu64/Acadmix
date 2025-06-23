const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  // Student-specific fields
  rollNo: {
    type: String,
    sparse: true, // Allow null but must be unique if present
    uppercase: true
  },
  university: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
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
  // Teacher-specific fields
  department: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  // Common fields
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      announcements: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      updates: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ rollNo: 1 });
userSchema.index({ role: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find by email or roll number
userSchema.statics.findByEmailOrRoll = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { rollNo: identifier.toUpperCase() }
    ]
  }).select('+password');
};

module.exports = mongoose.model('User', userSchema);