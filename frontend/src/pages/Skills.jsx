import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <Link to={`/course/${course._id}`}>
      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">By {course.instructor?.name || 'Unknown'}</p>
        <p className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded-full">{course.category}</p>
        <div className="mt-4 text-lg font-bold text-gray-900">
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </div>
      </div>
    </Link>
  </div>
);

const Skills = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryQuery = queryParams.get('category');

  useEffect(() => {
    const fetchCoursesAndCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch all courses just to extract the unique categories for the filter buttons
        const allCoursesRes = await axios.get('http://localhost:5000/api/courses');
        const uniqueCategories = [...new Set(allCoursesRes.data.map(course => course.category))];
        setCategories(['All', ...uniqueCategories]);

        // Build the URL for fetching the courses to display, including any filters
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (categoryQuery && categoryQuery !== 'All') params.append('category', categoryQuery);
        
        const url = `http://localhost:5000/api/courses?${params.toString()}`;
            
        const response = await axios.get(url);
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndCategories();
  }, [searchQuery, categoryQuery]); // Re-run when search or category changes

  const handleCategoryClick = (category) => {
      const params = new URLSearchParams(location.search);
      if (category === 'All') {
          params.delete('category');
      } else {
          params.set('category', category);
      }
      navigate(`/skills?${params.toString()}`);
  };

  if (loading) return <p className="text-center mt-8">Loading courses...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {searchQuery ? `Results for "${searchQuery}"` : 'Explore All Skills'}
      </h1>
      
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
              <button 
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      (categoryQuery === category || (category === 'All' && !categoryQuery))
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                  {category}
              </button>
          ))}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No courses found for the selected criteria.</p>
      )}
    </div>
  );
};

export default Skills;
