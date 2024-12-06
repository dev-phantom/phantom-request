import { useState, useEffect } from "react";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { getPhantomConfig } from "./config/phantomConfig";

interface PhantomGetOptions<T> {
  baseURL?: string;
  route?: string;
  token?: string;
  onUnauthorized?: () => void;
  initialState?: T | null;
  params?: Record<string, any>;
  restHeader?: Record<string, string>;
  asyncAwait?: boolean;
  restOptions?: AxiosRequestConfig;
  fetchOnMount?: boolean;
}

interface PhantomGetResult<T> {
  data: T | null;
  res: T | null;
  error: any;
  loading: boolean;
  refetch: () => void;
}

export function phantomGet<T>(options: PhantomGetOptions<T>): PhantomGetResult<T> {
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
    params,
    restHeader,
    asyncAwait = true,
    restOptions,
    fetchOnMount = true,
  } = mergedOptions;

  const [data, setData] = useState<T | null>(initialState);
  const [res, setRes] = useState<T | null>(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(fetchOnMount);
  const [shouldFetch, setShouldFetch] = useState(fetchOnMount);

  const fetchData = () => {
    if (!baseURL ) {
      console.error("Base URL is required");
      return;
    }

    const url = `${baseURL}${route}`;

    const headers = new AxiosHeaders();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (restHeader) {
      Object.entries(restHeader).forEach(([key, value]) =>
        headers.set(key, value)
      );
    }

    const axiosOptions: AxiosRequestConfig = {
      params,
      headers,
      ...restOptions,
    };

    const fetchPromise = axios.get(url, axiosOptions);

    if (asyncAwait) {
      (async () => {
        try {
          const response: any = await fetchPromise;
          setData(response.data);
          setRes(response);
        } catch (err: any) {
          if (err.response && err.response.status === 401) {
            onUnauthorized?.();
          } else {
            setError(err);
            console.error(`Error fetching data from ${route}:`, err);
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      fetchPromise
        .then((response: any) => {
          setData(response.data);
          setRes(response);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            onUnauthorized?.();
          } else {
            setError(err);
            console.error(`Error fetching data from ${route}:`, err);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [baseURL, route, token, params, restHeader, restOptions, shouldFetch]);

  return {
    res,
    data,
    error,
    loading,
    refetch: () => {
      setShouldFetch(true);
    },
  };
}
