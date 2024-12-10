import axios from "axios";

const baseURL: string = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
