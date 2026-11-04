import axios from "axios";

// The env var is written out in full so Next.js can inline it into the browser
// bundle. It is read when the dev server starts, so restart after changing it.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Without a base URL axios would call the Next.js app itself (e.g. /products is
// a storefront route), so fail loudly instead.
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart the dev server.");
  }
  return config;
});

export default api;
