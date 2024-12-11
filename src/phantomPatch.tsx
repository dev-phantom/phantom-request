import { useEffect, useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { uploadToCloudinary } from "./lib/utils/uploadToCloudinary";
import { phantomGet } from "./phantomGet";
import { getPhantomConfig } from "./config/phantomConfig";
import { CloudinaryUploadOptions } from "./lib/interface/cloudinaryUploadOptions";

interface phantomPatchOptions<R> {
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

interface phantomPatchResult<R> {
  response: R | null;
  res: R | null;
  error: any;
  loading: boolean;
  patch: (data: any) => void;
  latestData?: R | null;
}

export function phantomPatch<R>(options: phantomPatchOptions<R>): phantomPatchResult<R> {
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

  const sendPatchRequest = async (data: any) => {
    // If id is provided, append it to the route
    const finalRoute = id ? `${route}/${id}` : route;
    const url = `${baseURL}${finalRoute}`; // Final URL with id appended
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const requestData = await processRequestData(data);
      const res: any = await axios.patch(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      });

      setResponse(res.data);
      setRes(res);
      setError(null);

      if (getLatestData) {
        refetch();
      }
      return res.data;
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError(err);
        onUnauthorized();
      } else {
        setError(err);
        console.error(`Error patching data to ${route}:`, err);
      }
      setError(err);
      throw err.response?.data || err; 
    } finally {
      setLoading(false);
    }
  };

  return {
    res,
    response,
    error,
    loading,
    patch: sendPatchRequest,
    latestData,
  };
}
