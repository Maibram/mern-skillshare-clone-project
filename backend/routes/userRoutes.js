// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserDashboard, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Dashboard route
router.get('/dashboard', protect, getUserDashboard);

// --- NEW ROUTES FOR PROFILE PAGE ---
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
