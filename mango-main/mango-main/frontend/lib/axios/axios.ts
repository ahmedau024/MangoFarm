import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const authorizedRequest = axios.create({
  baseURL: "http://localhost:8081",
});
authorizedRequest.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.headers["Content-Type"] = "application/json";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authorizedRequest;
