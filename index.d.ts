import { AxiosRequestConfig } from "axios"; // Import the AxiosRequestConfig type

// Result type for the phantomGet hook
export interface phantomGetResult<T> {
  data: T | null; // The fetched data
  error: any; // Error details, if any
  loading: boolean; // Loading state
  refetch: () => void; // Function to refetch the data
}

// Options for configuring the phantomGet hook
export interface phantomGetOptions<T> {
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

// Alias for the phantomGet hook
export type phantomGet<T> = (options: phantomGetOptions<T>) => phantomGetResult<T>;

// Result type for the useAxiosPost hook
export interface phantomPostResult<R> {
  response: R | null; // Response data from the POST request
  error: any; // Error details, if any
  loading: boolean; // Loading state
  post: (data: any) => void; // Function to trigger the POST request with payload
  latestData?: R | null; // get lastest data if specified
}

interface CloudinaryUploadOptions {
  cloud_base_url: string;
  cloud_route?: string;
  upload_preset: string;
}

// Options for configuring the useAxiosPost hook
export interface phantomPostOptions<R> {
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

// Alias for the useAxiosPost hook
export type phantomPost<R> = (options: phantomPostOptions<R>) => phantomPostResult<R>;

// Result type for the useAxiosPatch hook
export interface phantomPatchResult<R> {
  response: R | null; // Response data from the POST request
  error: any; // Error details, if any
  loading: boolean; // Loading state
  patch: (data: any) => void; // Function to trigger the POST request with payload
  latestData?: R | null; // get lastest data if specified
}

// Options for configuring the useAxiosPatch hook
export interface phantomPatchOptions<R> {
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
  id?: string;
}

// Alias for the useAxiosPatch hook
export type phantomPatch<R> = (options: phantomPatchOptions<R>) => phantomPatchResult<R>;

// Result type for the useAxiosPut hook
export interface phantomPutResult<R> {
  response: R | null; // Response data from the POST request
  error: any; // Error details, if any
  loading: boolean; // Loading state
  put: (data: any) => void; // Function to trigger the POST request with payload
  latestData?: R | null; // get lastest data if specified
}

// Options for configuring the useAxiosPut hook
export interface phantomPutOptions<R> {
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
  id?: string;
}

// Alias for the useAxiosPut hook
export type phantomPut<R> = (options: phantomPutOptions<R>) => phantomPutResult<R>;


interface phantomDeleteOptions<R> {
  baseURL: string;
  route: string;
  id?: string; // Optional ID for dynamic routing
  token?: string;
  onUnauthorized?: () => void;
  initialState?: R | null;
  headers?: Record<string, string>;
  axiosOptions?: AxiosRequestConfig;
  getLatestData?: string; // Optional route for fetching the latest data
}

interface phantomDeleteResult<R> {
  response: R | null;
  error: any;
  loading: boolean;
  deleteRequest: (options?: {
    id?: string;
    body?: Record<string, any>;
  }) => void;
  latestData?: R | null;
}

export type phantomDelete<R> = (options: phantomDeleteOptions<R>) => phantomDeleteResult<R>;
