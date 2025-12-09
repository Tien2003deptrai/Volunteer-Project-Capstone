import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Get credentials with fallback
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

// Log for debugging
if (!cloudName || !apiKey || !apiSecret) {
  console.warn('⚠️ Warning: Cloudinary credentials may be missing. Check your .env file.');
  console.warn('Expected env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  console.warn('Or fallback: CLOUD_NAME, API_KEY, API_SECRET');
}

// Configure cloudinary - use same pattern as user_controller
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export default cloudinary;
