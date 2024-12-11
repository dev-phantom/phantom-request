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

interface phantomPutOptions<R> {
  baseURL?: string;
  route?: string;
  id?: string; // Optional id parameter
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
  getLatestData?: string;
}

interface phantomPutResult<R> {
  response: R | null;
  res: R | null;
  error: any;
  loading: boolean;
  put: (data: any) => void;
  latestData?: R | null;
}

export function phantomPut<R>(options: phantomPutOptions<R>): phantomPutResult<R> {
  const globalConfig = getPhantomConfig();
  const mergedOptions = {
    ...globalConfig,
    ...options, // Per-call overrides
  };
  
  const {
    baseURL,
    route,
    id, // Optional id
    token,
    onUnauthorized = () => {},
    initialState = null,
    headers = {},
    contentType = "application/json",
    axiosOptions = {},
    cloudinaryUpload,
    getLatestData,
  } = mergedOptions;

  const [response, setResponse] = useState<R | null>(initialState);
  const [res, setRes] = useState<R | null>(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestData, setLatestData] = useState<R | null>(null);

  const {
    data: latestDatas,
    loading: dataLoading,
    error: err,
    refetch,
  } = phantomGet<R>({
    baseURL,
    route: getLatestData || "",
    fetchOnMount: false,
  });

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

  const sendPutRequest = async (data: any) => {
    // If id is provided, append it to the route
    const finalRoute = id ? `${route}/${id}` : route;
    const url = `${baseURL}${finalRoute}`;  // Final URL with id appended
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const requestData = await processRequestData(data);
      const res = await axios.put(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      });

      setResponse(res.data);
      setError(null);

      if (getLatestData) {
        refetch();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError(err);
        onUnauthorized();
      } else {
        setError(err);
        console.error(`Error putting data to ${route}:`, err);
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    res,
    response,
    error,
    loading,
    put: sendPutRequest,
    latestData,
  };
}
