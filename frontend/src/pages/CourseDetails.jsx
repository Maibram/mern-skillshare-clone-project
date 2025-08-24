import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { FaStar, FaRegStar, FaCamera } from 'react-icons/fa'; // For star ratings and icons

// --- Sub-component for displaying star ratings ---
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        index < fullStars 
          ? <FaStar key={index} className="text-yellow-400" /> 
          : <FaRegStar key={index} className="text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

// --- Sub-component for the "Add Review" form ---
const AddReviewForm = ({ courseId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/courses/${courseId}/reviews`, { rating, comment }, config);
      setMessage('Review submitted successfully!');
      setRating(0);
      setComment('');
      onReviewAdded(); // Tell the parent component to refetch reviews
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-8 border">
      <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Rating</label>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={ratingValue}
                  className="cursor-pointer text-2xl"
                  color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                  onClick={() => setRating(ratingValue)}
                />
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Comment</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows="4" className="w-full px-3 py-2 mt-1 border rounded-lg"></textarea>
        </div>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">Submit Review</button>
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

// --- Sub-component for the "Add Lesson" form with Video Upload ---
const AddLessonForm = ({ courseId, onLessonAdded }) => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null); 
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file to upload.');
      return;
    }
    setError('');
    setMessage('');
    setUploading(true);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.post(`http://localhost:5000/api/courses/${courseId}/lessons`, formData, config);
      setMessage('Lesson added successfully!');
      setTitle('');
      setVideoFile(null);
      document.getElementById('video-upload-input').value = ""; 
      onLessonAdded(response.data.course);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-6 border">
      <h4 className="text-lg font-semibold mb-4">Add a New Lesson</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Video</label>
          <input id="video-upload-input" type="file" accept="video/*" onChange={handleFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <button type="submit" disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
          {uploading ? 'Uploading...' : 'Add Lesson'}
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};


export default function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;

  const fetchData = async () => {
    try {
      const [courseRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/${courseId}`),
        axios.get(`http://localhost:5000/api/courses/${courseId}/reviews`)
      ]);
      
      const fetchedCourse = courseRes.data;
      setCourse(fetchedCourse);
      setReviews(reviewsRes.data);

      if (userId) {
        setIsInstructor(fetchedCourse.instructor && fetchedCourse.instructor._id === userId);
        setIsEnrolled(fetchedCourse.students.includes(userId));
        setHasReviewed(reviewsRes.data.some(review => review.user._id === userId));
      }
    } catch (err) {
      setError('Failed to fetch course data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, userId]);
  
  const handleEnroll = async () => {
    if (!token) {
      setEnrollmentMessage('You must be logged in to enroll.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.put(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, config);
      setEnrollmentMessage(response.data.message);
      fetchData(); // Refetch data to update enrollment status
    } catch (err) {
      setEnrollmentMessage(err.response?.data?.message || 'Enrollment failed.');
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, config);
        navigate('/skills');
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-500 mt-10">{error}</h2>;
  if (!course) return <h2 className="text-center text-red-500 mt-10">Course not found</h2>;

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
       <div className="relative w-full h-64 mb-8">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-xl shadow-md" />
        <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-700 mb-2">Instructor: {course.instructor?.name || 'N/A'}</p>
        <div className="flex items-center mb-4">
            <StarRating rating={course.rating} />
            <span className="ml-2 text-sm text-gray-500">({course.numReviews} reviews)</span>
        </div>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center space-x-4">
          <button onClick={handleEnroll} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
            Enroll Now
          </button>
          {isInstructor && (
            <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Delete Course
            </button>
          )}
        </div>
        {enrollmentMessage && <p className="mt-4 text-sm text-green-600">{enrollmentMessage}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Course Lessons</h3>
        {course.lessons && course.lessons.length > 0 ? (
          <ul className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <li key={lesson._id || index} className="flex justify-between items-center border-b pb-2">
                <span>{lesson.title}</span>
                <Link to={`/course/${course._id}/lesson/${lesson._id}`} className="text-purple-600 hover:underline">
                  Watch →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No lessons have been added to this course yet.</p>
        )}
        {isInstructor && <AddLessonForm courseId={courseId} onLessonAdded={(updatedCourse) => setCourse(updatedCourse)} />}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Student Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="flex space-x-4 border-b pb-4 last:border-b-0">
                <img src={review.user.profilePicture} alt={review.user.name} className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <p className="font-semibold">{review.user.name}</p>
                  <StarRating rating={review.rating} />
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}
        
        {isEnrolled && !hasReviewed && <AddReviewForm courseId={courseId} onReviewAdded={fetchData} />}
      </div>
    </div>
  );
}
