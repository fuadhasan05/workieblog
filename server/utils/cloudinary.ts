import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Log configuration status (without exposing secrets)
console.log('Cloudinary configured:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? '✓ Set' : '✗ Missing',
  api_secret: cloudinary.config().api_secret ? '✓ Set' : '✗ Missing'
});

export default cloudinary;
