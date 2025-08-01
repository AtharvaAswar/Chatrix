import { v2 as cloudnary } from "cloudinary";
import { config } from "dotenv";

config();

cloudnary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export default cloudnary;