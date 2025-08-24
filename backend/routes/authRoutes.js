// routes/authRoutes.js
// Defines the API endpoints for authentication

const express = require('express');
const router = express.Router();
// Import the new resendOtp function
const { register, verifyOtp, login, resendOtp } = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/resend-otp
router.post('/resend-otp', resendOtp); // Add this new route

module.exports = router;
