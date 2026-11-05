// Customer login against the Express API: a one-time code by email or phone.
// Sign up and log in are the same flow (the first login creates the account).
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

// The API's { error: "message" } as one readable string for the modals.
export function getAuthErrorMessage(error) {
  const message = error?.response?.data?.error;
  if (typeof message === "string" && message) return message;
  if (error?.response) return "Something went wrong. Please try again.";
  // No response: API down, CORS blocked or timeout. Non-axios errors (e.g. the
  // missing NEXT_PUBLIC_API_URL guard in api.js) keep their own message.
  if (!error?.isAxiosError && error?.message) return error.message;
  return "Could not reach the server. Check your connection and try again.";
}

// contact: { type: "email" | "phone", value }. For phone, value is already
// international (e.g. "+525512345678"), built by parsePhone() in src/lib/phone.js.
function contactBody(contact) {
  return contact.type === "email" ? { email: contact.value } : { phone: contact.value };
}

function pickUser(data) {
  return { email: data?.email ?? null, phone: data?.phone ?? null, role: data?.role ?? null };
}

// POST /auth/request-otp. Resolves on 200; throws the axios error on 400/429.
export async function requestOtp(contact) {
  await api.post("/auth/request-otp", contactBody(contact));
}

// POST /auth/verify-otp. Returns { token, user } for useAuthStore.setSession().
export async function verifyOtp(contact, code) {
  const res = await api.post("/auth/verify-otp", { ...contactBody(contact), code: String(code) });
  const { token, user } = res.data ?? {};
  if (!token || !user) throw new Error("Unexpected response from the server. Please try again.");
  return { token, user: pickUser(user) };
}

// On page load: confirm the stored token with GET /auth/me and refresh the user.
// A 401 is handled by the api.js interceptor (session cleared, cart kept).
// A network error keeps the session, so a short API outage doesn't log people out.
let restoring = null;
export function restoreSession() {
  if (restoring) return restoring; // dedupe (React Strict Mode runs effects twice in dev)
  const { token } = useAuthStore.getState();
  if (!token) return Promise.resolve();
  restoring = api
    .get("/auth/me")
    .then((res) => {
      // Ignore the answer if the session changed meanwhile (logout or a new login).
      if (useAuthStore.getState().token === token) useAuthStore.getState().setUser(pickUser(res.data));
    })
    .catch(() => {})
    .finally(() => {
      restoring = null;
    });
  return restoring;
}

// Client-side logout: clears the session and the cart (same as the old logout).
// The API has no logout endpoint, so the token stays valid on the server until
// it expires (7 days). A POST /auth/logout that revokes tokens is a later API change.
export function logout() {
  useAuthStore.getState().clearUser();
  useCartStore.getState().clearCart();
}
