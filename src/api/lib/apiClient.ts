import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ENDPOINTS } from "@/api/constants/endpoints";
import { useAuthStore } from "@/store/auth.store";

const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ── Request interceptor: attach access token ── */
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ── Response interceptor: 401 → refresh → retry ── */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshOrLogin =
      original?.url?.includes("/auth/refresh") ||
      original?.url?.includes("/auth/login");

    if (
      error.response?.status !== 401 ||
      typeof window === "undefined" ||
      original?._retry ||
      isRefreshOrLogin
    ) {
      return Promise.reject(error);
    }

    /* Another request is already refreshing – queue this one */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post<{ access_token: string }>(
        `${ENDPOINTS.auth}/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = res.data.access_token;
      useAuthStore.getState().setAccessToken(newToken);

      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError);
      useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
