import { AxiosRequestConfig } from "axios"; // Import the AxiosRequestConfig type

// Result type for the useAxiosGet hook
export interface UseAxiosGetResult<T> {
  data: T | null; // The fetched data
  error: any; // Error details, if any
  loading: boolean; // Loading state
  refetch: () => void; // Function to refetch the data
}

// Options for configuring the useAxiosGet hook
export interface UseAxiosGetOptions<T> {
  baseURL: string; // Base URL for the API
  route: string; // API route to fetch data from
  token?: string; // Optional authorization token
  onUnauthorized?: () => void; // Callback when 401 Unauthorized is encountered
  initialState?: T | null; // Initial state for the data
  params?: Record<string, any>; // Query parameters
  restHeader?: Record<string, string>; // Additional headers
  asyncAwait?: boolean; // Use async/await or promise chaining
  restOptions?: AxiosRequestConfig; // Additional Axios configuration options
  fetchOnMount?: boolean; // Whether to fetch data on component mount
}

// Hook function definition for useAxiosGet
export default function useAxiosGet<T>(
  options: UseAxiosGetOptions<T>
): UseAxiosGetResult<T>;

// Result type for the useAxiosPost hook
export interface UseAxiosPostResult<R> {
  response: R | null; // Response data from the POST request
  error: any; // Error details, if any
  loading: boolean; // Loading state
  post: (data: any) => void; // Function to trigger the POST request with payload
  latestData?: R | null; // get lastest data if specified
}
interface CloudinaryUploadOptions {
  cloud_base_url: string;
  upload_preset: string;
}

// Options for configuring the useAxiosPost hook
export interface UseAxiosPostOptions<R> {
  baseURL: string; // Base URL for the API
  route: string; // API route for the POST request
  token?: string; // Optional authorization token
  onUnauthorized?: () => void; // Callback when 401 Unauthorized is encountered
  initialState?: R | null; // Initial state for the response data
  headers?: Record<string, string>; // Additional headers
  contentType?:
    | "application/json"
    | "multipart/form-data"
    | "application/x-www-form-urlencoded"; // Content-Type for the request
  axiosOptions?: AxiosRequestConfig; // Additional Axios configuration options
  cloudinaryUpload?: CloudinaryUploadOptions;
  getLatestData?: string; // New parameter for fetching latest data
}

// Hook function definition for useAxiosPost
export function useAxiosPost<R>(
  options: UseAxiosPostOptions<R>
): UseAxiosPostResult<R>;
