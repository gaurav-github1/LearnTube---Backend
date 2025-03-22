import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto" // Automatically detect the resource type
    });
    console.log("File uploaded on cloudinary", response.url);
    
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    console.error("Error uploading to cloudinary:", error);
    return null;
  }
};


export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.error("Error deleting from cloudinary:", error);
    return null;
  }
};