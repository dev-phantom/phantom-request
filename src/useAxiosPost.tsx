import { useState } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

interface UseAxiosPostOptions<R> {
  baseURL: string;
  route: string;
  token?: string;
  onUnauthorized?: () => void;
  initialState?: R | null;
  headers?: Record<string, string>;
  contentType?: "application/json" | "multipart/form-data" | "application/x-www-form-urlencoded"; // Set content type
  axiosOptions?: AxiosRequestConfig; // Additional Axios options
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

  const sendPostRequest = (requestData: any) => {
    const url = `${baseURL}${route}`;
    const headersConfig = prepareHeaders();
    setLoading(true);

    axios
      .post(url, requestData, {
        headers: headersConfig,
        ...axiosOptions,
      })
      .then((res) => {
        setResponse(res.data);
        setError(null);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          onUnauthorized();
        } else {
          setError(err);
          console.error(`Error posting data to ${route}:`, err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    response,
    error,
    loading,
    post: sendPostRequest, // Directly use sendPostRequest for manual post trigger
  };
}
