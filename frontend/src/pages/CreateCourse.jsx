import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
  });
  // --- New state to hold the thumbnail image file ---
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { title, description, category, price } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- New handler for the file input ---
  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setUploading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a course.');
      setUploading(false);
      return;
    }

    // Use FormData to send text fields and the image file together
    const courseData = new FormData();
    courseData.append('title', title);
    courseData.append('description', description);
    courseData.append('category', category);
    courseData.append('price', price);
    if (thumbnail) {
      // 'thumbnail' must match the field name in the backend route
      courseData.append('thumbnail', thumbnail);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // This is crucial for file uploads
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:5000/api/courses', courseData, config);
      
      setMessage('Course created successfully! Redirecting...');
      setTimeout(() => navigate(`/course/${response.data._id}`), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create a New Course</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={title} onChange={onChange} required className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={description} onChange={onChange} required rows="4" className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          {/* --- New File Input for Thumbnail --- */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
            <input 
              type="file" 
              name="thumbnail" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <p className="text-xs text-gray-500 mt-1">Optional. A default image will be used if none is provided.</p>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" name="category" value={category} onChange={onChange} required className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" value={price} onChange={onChange} required min="0" className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300">
            {uploading ? 'Creating Course...' : 'Create Course'}
          </button>
        </form>
        {message && <p className="text-center text-green-500 mt-4">{message}</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CreateCourse;
