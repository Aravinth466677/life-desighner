import axios from "axios";
import { getAdminToken, logoutAdmin } from "@/services/auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const publicApi = axios.create({ baseURL });

export const adminApi = axios.create({ baseURL });

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) logoutAdmin();
    return Promise.reject(err);
  }
);
