import axios from "axios";
import { getAdminToken, logoutAdmin } from "@/services/auth";

const baseURL = import.meta.env.VITE_API_URL || "https://life-desighner.onrender.com/api";

export const API_BASE_URL = baseURL;
export const FILES_BASE_URL = baseURL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      logoutAdmin();
    }
    return Promise.reject(err);
  }
);
