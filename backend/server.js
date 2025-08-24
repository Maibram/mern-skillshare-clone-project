// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
// --- 1. Import the new user routes ---
const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Skillshare API is running...');
});

// Use authentication routes
app.use('/api/auth', authRoutes);
// Use course routes
app.use('/api/courses', courseRoutes);
// --- 2. Use the new user routes ---
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
