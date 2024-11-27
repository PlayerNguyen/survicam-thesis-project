import axios from "axios";
const BASE_URL = import.meta.env.API_GATEWAY_BASE_URL || "http://localhost";
console.log(`Base URL: ${BASE_URL}`);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// TODO: Register interceptor here

export default axiosInstance;
