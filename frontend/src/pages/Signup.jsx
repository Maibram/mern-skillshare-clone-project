import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userIdForSignup, setUserIdForSignup] = useState(null);

  // --- State for the countdown timer (updated to 1 minute) ---
  const [countdown, setCountdown] = useState(300); // 1 minute in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const navigate = useNavigate();

  // --- useEffect hook to manage the countdown timer ---
  useEffect(() => {
    let timer;
    // Start the timer only when on the OTP step and countdown is active
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // When countdown finishes, enable the resend button
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    // Cleanup function to clear the interval when the component unmounts or step changes
    return () => clearInterval(timer);
  }, [step, countdown]);


  const handleRegisterAndRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password }
      );
      setMessage(response.data.message);
      setUserIdForSignup(response.data.userId);
      setStep(2); // Move to OTP step, which will trigger the useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!userIdForSignup) {
        setError('No user ID found. Please try registering again.');
        return;
    }

    try {
        await axios.post(
            'http://localhost:5000/api/auth/verify-otp',
            { userId: userIdForSignup, otp }
        );
        setMessage('Verification successful! Redirecting to login page...');
        setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong during OTP verification');
    }
  };

  // --- New function to handle resending the OTP ---
  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    try {
      // Note: You will need to create this new endpoint on your backend
      await axios.post('http://localhost:5000/api/auth/resend-otp', { userId: userIdForSignup });
      setMessage('A new OTP has been sent to your email.');
      // Reset the timer to 1 minute
      setCountdown(300);
      setIsResendDisabled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  // Helper function to format the countdown time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100"> 
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {step === 1 && (
          <form onSubmit={handleRegisterAndRequestOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Enter email" className="w-full px-4 py-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Register</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
            <p className="text-center text-gray-600">Please enter the OTP sent to {email}</p>
            <input type="text" placeholder="Enter OTP" className="w-full px-4 py-2 text-center border rounded-lg" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg">Verify OTP</button>
            <div className="text-center text-sm text-gray-500">
              {isResendDisabled ? (
                <span>Resend OTP in {formatTime(countdown)}</span>
              ) : (
                <button type="button" onClick={handleResendOtp} className="text-blue-500 hover:underline">
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
        {message && <p className="text-center text-green-500">{message}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}
