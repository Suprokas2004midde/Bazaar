import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path, { format } from "path";
import cloudinary from "../config/clodinaryConfig.js";

const cldStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);

    const customname = `${basename}-${Date.now()}`;
    let file_format = extname.substring(1).toLowerCase();

    return {
      folder: "Bazaar",
      format: file_format,
      public_id: customname,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedtypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg",
    "image/webp",
  ];

  if (allowedtypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"), false);
  }
};

export const upload = multer({
  storage: cldStorage,
  fileFilter: fileFilter,
  limits: { files: 5 },
});
