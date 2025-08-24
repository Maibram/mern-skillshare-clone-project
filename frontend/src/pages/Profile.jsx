import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: { 'Authorization': `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/profile', config);
        setUser(response.data);
        setName(response.data.name);
        setBio(response.data.bio || '');
      } catch (err) {
        setError('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${token}` },
      };
      const response = await axios.put('http://localhost:5000/api/users/profile', { name, bio }, config);
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.name = response.data.name;
      localStorage.setItem('user', JSON.stringify(storedUser));

      setMessage('Profile updated successfully!');
      setUser(prevUser => ({...prevUser, name: response.data.name, bio: response.data.bio}));
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading Profile...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          <img 
            src={user?.profilePicture} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover bg-gray-200"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-400 mt-2">
              <FaCalendarAlt className="mr-2" />
              Joined on {new Date(user?.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-4">Edit Your Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About Me</label>
              <textarea
                id="bio"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
          {message && <p className="text-center text-green-500 mt-4">{message}</p>}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
