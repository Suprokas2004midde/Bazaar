import {v2 as cloudinary} from "cloudinary"
import cloudinaryStorage from 'multer-storage-cloudinary'
import { CLD_API_KEY, CLD_NAME, CLD_SECRET_KEY } from "./serverConfig.js"

cloudinary.config({
    cloud_name: CLD_NAME,
    api_key:CLD_API_KEY,
    api_secret:CLD_SECRET_KEY,
})

export default cloudinary; // It is used in the middleware/storageEngine.js file.. 