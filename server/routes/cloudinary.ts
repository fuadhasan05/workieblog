import express from 'express';
import { uploadToCloudinary } from '../controllers/cloudinary.controller.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Use memory storage for Cloudinary uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/upload', authenticate, upload.single('file'), uploadToCloudinary);

export default router;
