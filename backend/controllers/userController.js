// controllers/userController.js
const Course = require('../models/Course');
const User = require('../models/User');

// ... (getUserDashboard and getUserProfile functions remain the same) ...
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const createdCourses = await Course.find({ instructor: userId }).populate('instructor', 'name');
    const enrolledCourses = await Course.find({ students: userId }).populate('instructor', 'name');
    res.json({ createdCourses, enrolledCourses });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // --- UPDATE TO HANDLE BIO ---
      // Use req.body.bio if it exists, otherwise keep the old bio
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

      const updatedUser = await user.save();
      // Send back the updated fields
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
