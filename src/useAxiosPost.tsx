import { useEffect, useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { uploadToCloudinary } from "./lib/utils/uploadToCloudinary";
import { phantomGet } from "./useAxiosGet";

interface CloudinaryUploadOptions {
  cloud_base_url: string;
  cloud_route?: string;
  upload_preset: string;
}

interface UseAxiosPostOptions<R> {
  baseURL: string;
  route: string;
  token?: string;
  onUnauthorized?: () => void;
  initialState?: R | null;
  headers?: Record<string, string>;
  contentType?:
    | "application/json"
    | "multipart/form-data"
    | "application/x-www-form-urlencoded";
  axiosOptions?: AxiosRequestConfig;
  cloudinaryUpload?: CloudinaryUploadOptions;
  getLatestData?: string; // New parameter for fetching latest data
}

interface UseAxiosPostResult<R> {
  response: R | null;
  error: any;
  loading: boolean;
  post: (data: any) => void;
  latestData?: R | null; // To store the fetched latest data
}

export function phantomPost<R>({
  baseURL,
  route,
  token,
  onUnauthorized = () => {},
  initialState = null,
  headers = {},
  contentType = "application/json",
  axiosOptions = {},
  cloudinaryUpload,
  getLatestData, // Destructure the new parameter
}: UseAxiosPostOptions<R>): UseAxiosPostResult<R> {
  const [response, setResponse] = useState<R | null>(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestData, setLatestData] = useState<R | null>(null); // For fetched data

  // Use the hook to fetch latest data but do not fetch on mount
  const {
    data: latestDatas,
    loading: dataLoading,
    error: err,
    refetch,
  } = phantomGet<R>({
    baseURL,
    route: getLatestData || "", // Pass getLatestData only when available
    fetchOnMount: false, // Ensure it does not run on component mount
  });

  // Update latestData only after refetch completes successfully
  useEffect(() => {
    if (!dataLoading && !err && latestDatas) {
      setLatestData(latestDatas);
    }
  }, [latestDatas, dataLoading, err]);

  const prepareHeaders = (): AxiosHeaders => {
    const requestHeaders = new AxiosHeaders();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
    Object.entries(headers).forEach(([key, value]) =>
      requestHeaders.set(key, value)
    );
    requestHeaders.set("Content-Type", contentType);
    return requestHeaders;
  };

  const processRequestData = async (
    data: Record<string, any>
  ): Promise<Record<string, any>> => {
    if (!cloudinaryUpload) return data;

    const processedData = { ...data };

    for (const key in data) {
      const field = data[key];
      if (
        field &&
        typeof field === "object" &&
        field.CloudinaryImage &&
        field.value
      ) {
        processedData[key] = await uploadToCloudinary(
          field.value,
          cloudinaryUpload
        );
      }
    }

    return processedData;
  };

  const sendPostRequest = async (data: any) => {
    const url = `${baseURL}${route}`;
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const requestData = await processRequestData(data);
      const res = await axios.post(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      });

      setResponse(res.data);
      setError(null);

      if (getLatestData) {
        refetch(); // Trigger refetch after successful POST request
      }
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
    post: sendPostRequest,
    latestData, // Expose the latest data
  };
}
