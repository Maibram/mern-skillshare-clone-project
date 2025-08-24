// middleware/multer.js
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video file! Please upload only videos.'), false);
    }
  },
});

module.exports = upload;
