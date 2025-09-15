import axios, { AxiosError, type AxiosInstance } from "axios";
import { urls } from "../helpers/urls";

const rawAxios = axios.create({ withCredentials: true });

const createApiClient = (
  baseURL: string,
  withCredentials: boolean = true,
  headers: Record<string, string> = {}
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });


  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      if (error.response?.status === 401 && !originalRequest._retry) {        
        originalRequest._retry = true;
        try {
          await rawAxios.post(`${urls.apiGateway}${urls.refresh}`);
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance; 
};

export const apigateway = createApiClient(urls.apiGateway, true);

export const handleApiError = (
  error: unknown,
  fallback = "Something went wrong!"
) => {
  const err = error as AxiosError<{ message?: string }>;
  const message = err.response?.data?.message || fallback;
  return message;
};
