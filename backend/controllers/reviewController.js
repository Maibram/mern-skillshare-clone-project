// controllers/reviewController.js
const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Create a new review
// @route   POST /api/courses/:id/reviews
// @access  Private (Enrolled Students only)
exports.createCourseReview = async (req, res) => {
  const { rating, comment } = req.body;
  const courseId = req.params.id;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!course.students.includes(userId)) {
      return res.status(403).json({ message: 'Only enrolled students can review this course.' });
    }

    // Check if user has already reviewed
    const alreadyReviewed = await Review.findOne({ course: courseId, user: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this course.' });
    }

    const review = new Review({
      rating: Number(rating),
      comment,
      user: userId,
      course: courseId,
    });

    await review.save();

    // Update the course's overall rating
    const reviews = await Review.find({ course: courseId });
    course.numReviews = reviews.length;
    course.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await course.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all reviews for a course
// @route   GET /api/courses/:id/reviews
// @access  Public
exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.id }).populate('user', 'name profilePicture');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
