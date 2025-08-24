import React from 'react';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
            Our Mission
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            To unlock the world's creativity and knowledge by connecting curious minds with passionate teachers. We believe everyone has something to share and something new to learn.
          </p>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-5 rounded-full mb-4">
              <FaLightbulb className="text-4xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
            <p className="text-gray-600">
              We provide the tools and platform for instructors to share their passions and for students to achieve their personal and professional goals.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-5 rounded-full mb-4">
              <FaUsers className="text-4xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Learning is a shared experience. Our platform fosters a supportive community where students and teachers can connect and grow together.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-5 rounded-full mb-4">
              <FaChalkboardTeacher className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
            <p className="text-gray-600">
              We strive to make learning accessible to everyone, everywhere, by offering a diverse range of skills and knowledge at your fingertips.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-purple-600">
        <div className="container mx-auto px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Whether you're looking to learn a new skill or share your expertise with the world, your journey starts here.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/skills" 
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Learning
            </Link>
            <Link 
              to="/create-course" 
              className="bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors"
            >
              Start Teaching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
