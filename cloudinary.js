import "dotenv/config";
import cloudinary from "cloudinary";
import multerStorage from "multer-storage-cloudinary";

const  CloudinaryStorage  = multerStorage;

 cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_key, 
   api_secret: process.env.API_Secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nestify_dev",
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

export { cloudinary, storage };