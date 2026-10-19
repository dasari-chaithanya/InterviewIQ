import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, setAccessToken } from './token.store';
import axios from 'axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAuthInterceptors = (apiClient: AxiosInstance) => {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      const isAuthEndpoint = originalRequest?.url?.includes('/auth/refresh') || originalRequest?.url?.includes('/auth/login');
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = 'Bearer ' + token;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // The refresh token is in HttpOnly cookies, so we just call the refresh endpoint
          // Must use withCredentials so cookies are sent
          const { data } = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = data.data.accessToken;
          setAccessToken(newToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          setAccessToken(null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
