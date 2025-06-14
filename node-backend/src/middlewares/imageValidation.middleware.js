const path = require('path');

const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      message: 'Invalid file type. Only JPEG, PNG and GIF images are allowed' 
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      message: 'File size too large. Maximum size is 5MB' 
    });
  }

  next();
};

module.exports = validateImage; 