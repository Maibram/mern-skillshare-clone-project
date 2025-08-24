import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaGlobe, FaSearch } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  // State for the search input
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
          // --- FIX APPLIED HERE ---
          // encodeURIComponent ensures special characters like '+' are handled correctly
          navigate(`/skills?search=${encodeURIComponent(searchTerm)}`);
      } else {
          navigate('/skills');
      }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-black hover:text-blue-600 text-2xl font-bold">
        SkillShare
      </Link>

      {/* Center: Search Bar */}
      <div className="flex-1 mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search for anything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button type="submit" className="absolute top-2.5 left-3 text-gray-500">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Right: Links & Buttons */}
      <div className="flex items-center space-x-4 text-sm font-medium">
        <Link to="/skills" className="text-gray-700 hover:text-purple-600">Skills</Link>
        <Link to="/about" className="text-gray-700 hover:text-purple-600">About Us</Link>
        {token ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
            <Link to="/create-course" className="text-gray-700 hover:text-purple-600">Post Skill</Link>
            <Link to="/profile" className="text-gray-700 hover:text-purple-600">
              Hi, {user?.name || 'User'}
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50">
              Log in
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Sign up
            </Link>
          </>
        )}
        <FaGlobe className="text-xl text-gray-700 hover:text-purple-600 cursor-pointer" />
      </div>
    </nav>
  );
}
