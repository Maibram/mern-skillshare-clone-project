// models/OtpToken.js
const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // --- FIX APPLIED HERE ---
    // Restore the 'expires' field to have the database handle expiration.
    // This is the most reliable method.
    expires: 300, 
  },
});

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);

module.exports = OtpToken;
