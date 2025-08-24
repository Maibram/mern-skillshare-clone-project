// config/db.js
// Handles the database connection

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from environment variables
    // The connection options are no longer needed in recent Mongoose versions.
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Connected...');
  } catch (err) {
    // Log any errors that occur during connection and exit the process
    console.error('Database Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
