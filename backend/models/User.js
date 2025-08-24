// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  // --- NEW FIELDS ADDED HERE ---
  bio: {
    type: String,
    default: '',
    maxLength: 500
  },
  profilePicture: {
      type: String,
      default: 'https://placehold.co/400x400/EFEFEF/AAAAAA?text=User'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// ... (the rest of the file remains the same)
// Middleware to hash the password before saving a new user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
