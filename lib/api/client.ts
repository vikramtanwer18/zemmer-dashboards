import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/tokens";
import { ApiError, ApiErrorPayload } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

const REFRESH_PATH = "/auth/refresh";
const LOGIN_PATH = "/auth/login";
const LOGOUT_PATH = "/auth/logout";

let onSessionExpiredCallback: (() => void) | null = null;
export function registerSessionExpiredHandler(cb: () => void) {
  onSessionExpiredCallback = cb;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

interface RefreshResult {
  accessToken: string;
}

type RetryRequest = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  try {
    const res = await axios.post<{ status: string; data: RefreshResult }>(
      `${BASE_URL}${REFRESH_PATH}`,
      {},
      { withCredentials: true },
    );
    const newToken = res.data?.data?.accessToken;
    if (newToken) {
      setAccessToken(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeError(err: AxiosError<ApiErrorPayload>): ApiError {
  const status = err.response?.status ?? 0;
  const payload = err.response?.data;
  const message =
    payload?.message ??
    (err.code === "ECONNABORTED"
      ? "Request timed out. Please try again."
      : err.message ?? "Something went wrong. Please try again.");
  return new ApiError(message, status, payload?.code, payload?.errors);
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorPayload>) => {
    const original = error.config as RetryRequest | undefined;
    const status = error.response?.status;

    const isAuthEndpoint =
      original?.url?.includes(LOGIN_PATH) ||
      original?.url?.includes(REFRESH_PATH) ||
      original?.url?.includes(LOGOUT_PATH);

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? performRefresh();
        const newToken = await refreshPromise;
        refreshPromise = null;
        if (newToken) {
          const headers = AxiosHeaders.from(original.headers);
          headers.set("Authorization", `Bearer ${newToken}`);
          original.headers = headers;
          return apiClient(original);
        }
      } catch {
        refreshPromise = null;
      }
      clearAccessToken();
      onSessionExpiredCallback?.();
    }

    return Promise.reject(normalizeError(error));
  },
);

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  const res = await apiClient.get<{ status: string; data: T }>(url, config);
  return res.data.data;
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) {
  const res = await apiClient.post<{ status: string; data: T }>(
    url,
    body,
    config,
  );
  return res.data.data;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) {
  const res = await apiClient.patch<{ status: string; data: T }>(
    url,
    body,
    config,
  );
  return res.data.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const res = await apiClient.delete<{ status: string; data: T }>(url, config);
  return res.data.data;
}
