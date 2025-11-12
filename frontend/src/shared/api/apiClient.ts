import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
export const TOKEN_KEY = "pd_token";

const apiClient = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    const common = apiClient.defaults.headers.common as unknown as Record<string, unknown>;
    delete common.Authorization;
  }
}

const persisted = localStorage.getItem(TOKEN_KEY);
if (persisted) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${persisted}`;
}

apiClient.interceptors.request.use((config) => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) setAuthToken(undefined);
    const msg =
      error.response?.data?.message || error.message || "Error de red";
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;
