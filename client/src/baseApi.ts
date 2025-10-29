import axios from "axios";

const isProd = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProd ? import.meta.env.VITE_API_URL : "/api",
  withCredentials: true
});
