import axios from "axios";

export const uploadToCloudinary = async (image: File | string, cloudinaryUpload: any): Promise<string> => {
    if (!cloudinaryUpload) {
      throw new Error("Cloudinary upload options are not provided.");
    }
  
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", cloudinaryUpload.upload_preset);
  
    // Ensure the URL is formed correctly
    const res = await axios.post(
      `${cloudinaryUpload.cloud_base_url}${cloudinaryUpload.cloud_route || '/image/upload'}`, 
      formData, 
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  
    return res.data.secure_url; // Return the uploaded image's URL
  };