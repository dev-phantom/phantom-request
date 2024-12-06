import { useEffect, useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { uploadToCloudinary } from "./lib/utils/uploadToCloudinary";
import { phantomGet } from "./phantomGet";
import { getPhantomConfig } from "./config/phantomConfig";

interface CloudinaryUploadOptions {
  cloud_base_url: string;
  cloud_route?: string;
  upload_preset: string;
}

interface phantomPostOptions<R> {
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

interface phantomPostResult<R> {
  response: R | null;
  res: R | null;
  error: any;
  loading: boolean;
  post: (data: any) => void;
  latestData?: R | null; // To store the fetched latest data
}

export function phantomPost<R>(options : phantomPostOptions<R>): phantomPostResult<R> {
  const globalConfig = getPhantomConfig();
  const mergedOptions = {
    ...globalConfig,
    ...options, // Per-call overrides
  };

  const {
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
  } = mergedOptions;

  const [response, setResponse] = useState<R | null>(initialState);
  const [res, setRes] = useState<R | null>(initialState);
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
    if (!baseURL ) {
      console.error("Base URL is required");
      return;
    }
    
    const url = `${baseURL}${route}`;
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const requestData = await processRequestData(data);
      const res: any = await axios.post(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      });

      setResponse(res.data);
      setRes(res)
      setError(null);

      if (getLatestData) {
        refetch(); // Trigger refetch after successful POST request
      }
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        onUnauthorized();
      }else if (err.response.data && err.response.status === 401) {
        setError(err.data);
        console.error(`Error posting data to ${route}:`, err.data);
      }
       else {
        setError(err);
        console.error(`Error posting data to ${route}:`, err);
      }
      throw err.response?.data || err; 
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    res,
    error,
    loading,
    post: sendPostRequest,
    latestData, // Expose the latest data
  };
}
