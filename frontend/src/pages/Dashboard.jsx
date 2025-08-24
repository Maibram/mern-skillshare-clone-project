import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <Link to={`/course/${course._id}`}>
      <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate">{course.title}</h3>
        <p className="text-sm text-gray-500">By {course.instructor.name}</p>
      </div>
    </Link>
  </div>
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ createdCourses: [], enrolledCourses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view the dashboard.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:5000/api/users/dashboard', config);
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {user?.name || 'User'}!</h1>

        {/* My Learning Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Learning</h2>
          {dashboardData.enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dashboardData.enrolledCourses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          ) : (
            <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">You are not enrolled in any courses yet. <Link to="/skills" className="text-purple-600 hover:underline">Explore courses</Link>.</p>
          )}
        </div>

        {/* My Creations Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Creations</h2>
          {dashboardData.createdCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dashboardData.createdCourses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          ) : (
            <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm">You have not created any courses yet. <Link to="/create-course" className="text-purple-600 hover:underline">Create one now</Link>.</p>
          )}
        </div>
      </div>
    </div>
  );
}
