import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";

const storage = multer.memoryStorage();

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const upload = multer({ storage });
