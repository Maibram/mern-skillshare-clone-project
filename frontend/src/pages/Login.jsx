import React, { useState } from "react";
import axios from 'axios';
// Step 1: Import the useNavigate hook from react-router-dom
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // States for user feedback
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 2: Initialize the navigate function
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Connect to the backend's login endpoint
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // On successful login, the backend sends back user data and a token
      setMessage('Login successful! Redirecting...');

      // IMPORTANT: Store the token in localStorage to keep the user logged in
      localStorage.setItem('token', response.data.token);
      
      // You can also store user info for display purposes
      localStorage.setItem('user', JSON.stringify({
          name: response.data.name,
          email: response.data.email,
      }));

      // Step 3: Redirect the user to the home page after a short delay
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      // Handle errors from the backend (e.g., "Invalid credentials", "Please verify your email")
      setError(err.response?.data?.message || 'Something went wrong during login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
          <div>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Display feedback messages to the user */}
        {message && <p className="text-center text-green-500">{message}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

      </div>
    </div>
  );
};

export default Login;
