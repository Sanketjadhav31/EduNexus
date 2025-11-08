import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloudinary Config:', {
  cloud_name: cloudName,
  api_key: apiKey ? `${apiKey.substring(0, 4)}...` : 'NOT SET',
  api_secret: apiSecret ? '***' + apiSecret.slice(-4) : 'NOT SET'
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error('⚠️ WARNING: Cloudinary credentials not set properly!');
  console.error('Please check your .env file');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.originalname, file.mimetype);
    cb(null, true);
  }
});

export default cloudinary;
