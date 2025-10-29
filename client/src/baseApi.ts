import axios from "axios";

const isProd = import.meta.env.PROD;

export const api = axios.create({
  baseURL: isProd ? import.meta.env.API_URL : "/api"
});
