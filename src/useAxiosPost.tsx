import { useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

interface CloudinaryUploadOptions {
  cloud_base_url: string;
  cloud_route?: string
  upload_preset: string;
}

interface UseAxiosPostOptions<R> {
  baseURL: string;
  route: string;
  token?: string;
  onUnauthorized?: () => void;
  initialState?: R | null;
  headers?: Record<string, string>;
  contentType?: "application/json" | "multipart/form-data" | "application/x-www-form-urlencoded"; // Set content type
  axiosOptions?: AxiosRequestConfig; // Additional Axios options
  cloudinaryUpload?: CloudinaryUploadOptions; // Optional Cloudinary upload options
}

interface UseAxiosPostResult<R> {
  response: R | null;
  error: any;
  loading: boolean;
  post: (data: any) => void; // Manual trigger for the POST request with data
}

export function useAxiosPost<R>({
  baseURL,
  route,
  token,
  onUnauthorized = () => {},
  initialState = null,
  headers = {},
  contentType = "application/json",
  axiosOptions = {},
  cloudinaryUpload,
}: UseAxiosPostOptions<R>): UseAxiosPostResult<R> {
  const [response, setResponse] = useState<R | null>(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prepare headers
  const prepareHeaders = (): AxiosHeaders => {
    const requestHeaders = new AxiosHeaders();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
    Object.entries(headers).forEach(([key, value]) => requestHeaders.set(key, value));

    // Add content type
    requestHeaders.set("Content-Type", contentType);
    return requestHeaders;
  };

  const uploadToCloudinary = async (image: File | string): Promise<string> => {
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
  

  const processRequestData = async (data: Record<string, any>): Promise<Record<string, any>> => {
    if (!cloudinaryUpload) return data;

    const processedData = { ...data };

    for (const key in data) {
      const field = data[key];

      // Check if the field is tagged for Cloudinary upload
      if (field && typeof field === "object" && field.CloudinaryImage && field.value) {
        processedData[key] = await uploadToCloudinary(field.value);
      }
    }

    return processedData;
  };

  const sendPostRequest = async (data: any) => {
    const url = `${baseURL}${route}`;
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const requestData = await processRequestData(data); // Handle Cloudinary uploads dynamically

      const res = await axios.post(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      });

      setResponse(res.data);
      setError(null);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        onUnauthorized();
      } else {
        setError(err);
        console.error(`Error posting data to ${route}:`, err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    error,
    loading,
    post: sendPostRequest, // Directly use sendPostRequest for manual post trigger
  };
}
