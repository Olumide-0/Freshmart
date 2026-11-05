// import { create } from "zustand";

// export const useAuthStore = create((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
//   clearUser: () => set({ user: null }),
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Customer session: { token, user: { email, phone, role } } from the API.
// Persisted to localStorage ("auth-storage") so it survives reloads.
// Trade-off: any script on the page can read localStorage, so an XSS bug could
// steal the token (valid 7 days). An httpOnly cookie set by the API is a later change.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // After verify-otp succeeds.
      setSession: ({ token, user }) => set({ token, user }),

      // Refreshes the user from GET /auth/me (token unchanged).
      setUser: (user) => set({ user }),

      // Logout and 401: clears the whole session.
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      // Version 0 stored simulated users with no token. Drop them so nobody
      // stays "logged in" without a real session.
      version: 1,
      migrate: () => ({ user: null, token: null }),
    }
  )
);

