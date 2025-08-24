// controllers/authController.js
const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const sendEmail = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user and send OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                const otp = crypto.randomInt(100000, 999999).toString();
                await OtpToken.findOneAndUpdate({ userId: user._id }, { otp, createdAt: Date.now() }, { upsert: true, new: true, setDefaultsOnInsert: true });
                const message = `Welcome back! Your new One-Time Password (OTP) for Skillshare is: ${otp}. It is valid for 1 minute.`;
                await sendEmail({ to: user.email, subject: 'Skillshare - New OTP Request', text: message });
                return res.status(200).json({ 
                    message: 'User already exists. A new OTP has been sent to your email.',
                    userId: user._id 
                });
            }
            return res.status(400).json({ message: 'User with this email already exists and is verified.' });
        }

        user = new User({ name, email, password });
        user.profilePicture = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
        user.isVerified = false;
        await user.save();

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpToken = new OtpToken({ userId: user._id, otp });
        await otpToken.save();

        const message = `Your One-Time Password (OTP) for Skillshare is: ${otp}. It is valid for 1 minute.`;
        await sendEmail({ to: user.email, subject: 'Skillshare - Verify Your Email', text: message });

        res.status(201).json({ 
            message: 'Registration successful. Please check your email for an OTP to verify your account.',
            userId: user._id 
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify user's email with OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const otpToken = await OtpToken.findOne({ userId, otp });

        // This first check handles cases where the OTP is wrong or already deleted by the database.
        if (!otpToken) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // --- FIX APPLIED HERE ---
        // Manually check if the token is expired, making the check instantaneous.
        const oneMinute = 60 * 1000; // 60 seconds in milliseconds
        if (new Date() - otpToken.createdAt > oneMinute) {
            // If it's expired, delete it from the DB and send an error
            await OtpToken.deleteOne({ _id: otpToken._id });
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        // --- END OF FIX ---

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        user.isVerified = true;
        await user.save();
        await OtpToken.deleteOne({ _id: otpToken._id });
        res.status(200).json({
            message: 'Email verified successfully. You can now log in.',
        });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOtp = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'This account is already verified.' });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        await OtpToken.findOneAndUpdate(
            { userId: user._id },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        const message = `Your new One-Time Password (OTP) for Skillshare is: ${otp}. It is valid for 1 minute.`;
        await sendEmail({
            to: user.email,
            subject: 'Skillshare - New Verification Code',
            text: message,
        });
        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
