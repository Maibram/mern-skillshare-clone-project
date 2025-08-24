// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  enrollInCourse, 
  addLesson,
  deleteCourse
} = require('../controllers/courseController');
// --- 1. Import the new review controller functions ---
const { createCourseReview, getCourseReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const videoUpload = require('../middleware/multer');
const imageUpload = require('../middleware/imageUpload'); 

// ... (handleUploadErrors middleware remains the same) ...
const handleUploadErrors = (req, res, next) => {
  videoUpload.single('video')(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Video file is too large. Maximum size is 50 MB.' });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// GET all courses
router.get('/', getAllCourses);

// POST a new course
router.post('/', protect, imageUpload.single('thumbnail'), createCourse);

// GET a single course by ID
router.get('/:id', getCourseById);

// PUT to enroll in a course
router.put('/:id/enroll', protect, enrollInCourse);

// POST to add a lesson
router.post('/:id/lessons', protect, handleUploadErrors, addLesson);

// DELETE a course
router.delete('/:id', protect, deleteCourse);

// --- 2. ADD NEW ROUTES FOR REVIEWS ---
router.route('/:id/reviews')
  .post(protect, createCourseReview)
  .get(getCourseReviews);

module.exports = router;
