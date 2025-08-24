// middleware/imageUpload.js
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Create the multer instance for image uploads
const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit for images
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image file! Please upload only images.'), false);
    }
  },
});

module.exports = imageUpload;
