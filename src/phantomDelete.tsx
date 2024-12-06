import { useEffect, useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { phantomGet } from "./phantomGet";
import { getPhantomConfig } from "./config/phantomConfig";

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
  res: R | null;
  error: any;
  loading: boolean;
  deleteRequest: (options?: {
    id?: string;
    body?: Record<string, any>;
  }) => void;
  latestData?: R | null;
}
export function phantomDelete<R>(options: phantomDeleteOptions<R>): phantomDeleteResult<R> {
  const globalConfig = getPhantomConfig();
  const mergedOptions = {
    ...globalConfig,
    ...options, // Per-call overrides
  };
  const {
    baseURL,
    route,
    id, 
    token,
    onUnauthorized = () => {},
    initialState = null,
    headers = {},
    axiosOptions = {},
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
    error: fetchError,
    refetch,
  } = phantomGet<R>({
    baseURL,
    route: getLatestData || "",
    fetchOnMount: false,
  });

  useEffect(() => {
    if (!dataLoading && !fetchError && latestDatas) {
      setLatestData(latestDatas);
    }
  }, [latestDatas, dataLoading, fetchError]);

  const prepareHeaders = (): AxiosHeaders => {
    const requestHeaders = new AxiosHeaders();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
    Object.entries(headers).forEach(([key, value]) =>
      requestHeaders.set(key, value)
    );
    return requestHeaders;
  };

  const sendDeleteRequest = async (options?: {
    id?: string;
    body?: Record<string, any>;
  }) => {
    const finalId = options?.id || id; // Use ID from options or default from config
    const finalRoute = finalId ? `${route}/${finalId}` : route;
    const url = `${baseURL}${finalRoute}`;
    const headersConfig = prepareHeaders();
    setLoading(true);

    try {
      const res: any = await axios.delete(url, {
        headers: headersConfig,
        data: options?.body, // Pass body if provided
        ...axiosOptions,
      });

      setResponse(res.data);
      setRes(res)
      setError(null);

      if (getLatestData) {
        refetch();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        onUnauthorized();
      } else {
        setError(err);
        console.error(`Error deleting data from ${route}:`, err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    res,
    response,
    error,
    loading,
    deleteRequest: sendDeleteRequest,
    latestData,
  };
}
