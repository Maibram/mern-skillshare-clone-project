import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaPlayCircle, FaLock } from 'react-icons/fa'; // Importing icons

export default function LessonPlayer() {
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);

        const foundLesson = fetchedCourse.lessons.find(l => l._id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          setError('Lesson not found in this course.');
        }

        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const isUserEnrolled = fetchedCourse.students.includes(userId) || fetchedCourse.instructor._id === userId;
          setIsEnrolled(isUserEnrolled);
        }

      } catch (err) {
        setError('Failed to load lesson data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [courseId, lessonId]);

  if (loading) return <div className="text-center p-10">Loading Lesson...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
                {isEnrolled ? (
                  <video src={lesson?.videoUrl} controls autoPlay className="w-full h-full">
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
                    <FaLock className="text-5xl mb-4" />
                    <h3 className="text-xl font-bold">Enroll to Watch</h3>
                    <p className="text-gray-400">This lesson is locked. Enroll in the course to get access.</p>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{lesson?.title}</h1>
              <p className="text-gray-600">Part of the course: 
                <Link to={`/course/${courseId}`} className="text-purple-600 hover:underline ml-1">{course?.title}</Link>
              </p>
            </div>
          </div>

          {/* Sidebar: Lesson List */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Course Content</h3>
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                {course?.lessons.map((item, index) => (
                  <li key={item._id}>
                    <Link 
                      to={`/course/${courseId}/lesson/${item._id}`}
                      className={`flex items-center p-3 rounded-md transition-colors ${
                        item._id === lessonId 
                          ? 'bg-purple-100 text-purple-700 font-semibold' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FaPlayCircle className={`mr-3 ${item._id === lessonId ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="flex-grow">{index + 1}. {item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
