import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const MONGO_URL = process.env.MONGO_URL

export const CLD_API_KEY = process.env.CLOUDINARY_API_KEY; 

export const CLD_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;

export const CLD_NAME = process.env.CLOUD_NAME;

export const JWT_SECRET = process.env.JWT_SECRET || "user_suprokas" 

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;