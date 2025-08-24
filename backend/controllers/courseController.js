// controllers/courseController.js
const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');

// ... (createCourse function remains the same) ...
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const instructor = req.user._id;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    let thumbnailUrl = 'https://placehold.co/600x400/EEE/31343C?text=Skillshare'; // Default

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'thumbnails' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      thumbnailUrl = result.secure_url;
    }

    const course = new Course({
      title,
      description,
      category,
      price,
      instructor,
      thumbnail: thumbnailUrl,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get all courses (with search and category filtering)
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
    try {
        const { search, category } = req.query;
        const filter = {};

        // Add search keyword to filter if it exists
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Add category to filter if it exists
        if (category) {
            filter.category = category;
        }

        const courses = await Course.find(filter).populate('instructor', 'name email');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (the rest of your controller functions: getCourseById, enroll, etc., remain the same) ...
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const userId = req.user._id;
    if (course.students.includes(userId)) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }
    if (course.instructor.equals(userId)) {
        return res.status(400).json({ message: 'Instructors cannot enroll in their own course.' });
    }
    course.students.push(userId);
    await course.save();
    res.json({ message: 'Successfully enrolled in the course!' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const { title } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (!course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a video file.' });
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'video' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading video.' });
        }
        const newLesson = {
          title,
          videoUrl: result.secure_url,
        };
        course.lessons.push(newLesson);
        await course.save();
        res.status(201).json({ message: 'Lesson added successfully', course });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (!course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to delete this course' });
    }
    await course.deleteOne();
    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
