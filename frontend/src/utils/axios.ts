import axios from "axios";
import { ROUTES } from "../constants/route.constant.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const isAuthRoute =
      config.url?.includes(ROUTES.LOGIN) ||
      config.url?.includes(ROUTES.REGISTER);
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
