// models/Course.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
      type: String,
      default: 'https://placehold.co/600x400/EEE/31343C?text=Skillshare'
  },
  lessons: [lessonSchema],
  students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  // --- NEW FIELDS FOR RATINGS ---
  rating: {
      type: Number,
      required: true,
      default: 0
  },
  numReviews: {
      type: Number,
      required: true,
      default: 0
  }
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
