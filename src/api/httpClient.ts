// src/api/httpClient.ts
import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change to your backend URL
});

httpClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem("slcm_auth");
  if (stored && config.headers) {
    try {
      const parsed = JSON.parse(stored) as { token: string | null };
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

export default httpClient;
