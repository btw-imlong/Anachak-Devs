import axios from "axios";
import { BASE_URL } from "../config/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔑 sends cookie automatically on every request
});

// ❌ Removed: token interceptor (no longer needed — cookie is sent automatically)

export default axiosInstance;
