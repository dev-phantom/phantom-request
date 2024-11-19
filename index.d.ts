import { AxiosRequestConfig } from "axios"; // Import the AxiosRequestConfig type

declare module "phantom-request" {

  export interface UseAxiosGetResult<T> {
    data: T | null;
    error: any;
    loading: boolean;
    refetch: () => void; 
  }

  export default function useAxiosGet<T>(
    baseURL: string,
    route: string,
    token?: string,
    onUnauthorized?: () => void, 
    initialState?: T | null,
    params?: Record<string, any>,
    restHeader?: Record<string, string>,
    asyncAwait?: boolean,
    restOptions?: AxiosRequestConfig,
    fetchOnMount?: boolean
  ): UseAxiosGetResult<T>;
}
