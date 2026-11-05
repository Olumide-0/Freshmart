import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

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
  // Attach the customer's token to every request (admin calls included).
  // A header set explicitly on a request is left alone.
  const token = useAuthStore.getState().token;
  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// A 401 on a request that carried the current token means the session is
// invalid or expired: clear it (the cart is kept) so the UI shows
// "Sign Up/Log in" again. 401s on requests without a token (e.g. a wrong OTP)
// are not treated as a lost session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { token, clearUser } = useAuthStore.getState();
    const sent = error?.config?.headers?.get?.("Authorization");
    if (error?.response?.status === 401 && token && sent === `Bearer ${token}`) {
      clearUser();
    }
    return Promise.reject(error);
  }
);

export default api;
