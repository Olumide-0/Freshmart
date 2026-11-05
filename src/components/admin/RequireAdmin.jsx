"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Loader2, LogIn, ShieldAlert } from "lucide-react";
import AuthFlow from "@/components/auth/AuthFlow";
import { logout, restoreSession } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";

const noopSubscribe = () => () => {};

// false on the server and during hydration, true after. The session lives in
// localStorage, so waiting for this avoids a server/client HTML mismatch.
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// Centered card in the admin look. data-admin-shell drops the root <main>'s
// storefront top padding, like AdminShell does.
function Panel({ children }) {
  return (
    <div
      data-admin-shell
      className="flex min-h-screen items-center justify-center bg-[#F6F0E3] px-[16px] py-[40px] font-sans text-[#1F2937]"
    >
      <div className="w-full max-w-[420px] rounded-[8px] border border-black/5 bg-white p-[24px] text-center sm:p-[32px]">
        {children}
      </div>
    </div>
  );
}

const primaryButton =
  "flex w-full items-center justify-center gap-[8px] rounded-[8px] bg-[#2F5D3A] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#3E5730]";
const backLink = "mt-[12px] inline-block text-[14px] font-semibold text-[#2F5D3A] hover:underline";

// Shows the admin only to a confirmed user with role "admin".
// UI gate only: the Express API enforces role === "admin" on product writes.
export default function RequireAdmin({ children }) {
  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  // The token whose role was confirmed by GET /auth/me. The stored role can be
  // edited in DevTools, so it's only trusted after this check.
  const [checkedToken, setCheckedToken] = useState(null);
  const [authOpen, setAuthOpen] = useState(true); // logged out: open the login modal right away

  // The Navbar (which normally runs restoreSession) is hidden under /admin, so check here.
  // A 401 clears the session in api.js; a network error keeps the stored session.
  useEffect(() => {
    if (!token || checkedToken === token) return;
    let cancelled = false;
    restoreSession().then(() => {
      if (!cancelled) setCheckedToken(token);
    });
    return () => {
      cancelled = true;
    };
  }, [token, checkedToken]);

  if (!mounted) return null;

  // Logged out (or the session was just cleared by a 401).
  if (!token || !user) {
    return (
      <Panel>
        <span className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#E6F0E1] text-[#2F5D3A]">
          <LogIn className="h-[22px] w-[22px]" strokeWidth={2} />
        </span>
        <h1 className="mt-[14px] text-[20px] font-extrabold">Admin sign-in</h1>
        <p className="mt-[6px] text-[14px] text-gray-500">Log in with your admin email or phone number.</p>
        <button type="button" onClick={() => setAuthOpen(true)} className={`mt-[20px] ${primaryButton}`}>
          Sign in
        </button>
        <Link href="/" className={backLink}>
          Back to store
        </Link>
        {authOpen && <AuthFlow onClose={() => setAuthOpen(false)} />}
      </Panel>
    );
  }

  // Waiting for GET /auth/me to confirm this token and its role.
  if (checkedToken !== token) {
    return (
      <Panel>
        <Loader2 className="mx-auto h-[28px] w-[28px] animate-spin text-[#2F5D3A]" strokeWidth={2} />
        <p className="mt-[12px] text-[14px] font-semibold" role="status">
          Checking your access…
        </p>
      </Panel>
    );
  }

  // Logged in, but not an admin.
  if (user.role !== "admin") {
    return (
      <Panel>
        <span className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FBE9D9] text-[#C6672E]">
          <ShieldAlert className="h-[22px] w-[22px]" strokeWidth={2} />
        </span>
        <h1 className="mt-[14px] text-[20px] font-extrabold">Admins only</h1>
        <p className="mt-[6px] break-words text-[14px] text-gray-500">
          You’re signed in as <span className="font-semibold text-[#1F2937]">{user.email || user.phone}</span>, which
          doesn’t have admin access.
        </p>
        <button
          type="button"
          onClick={() => {
            logout(); // then the logged-out panel shows with the login modal open
            setAuthOpen(true);
          }}
          className={`mt-[20px] ${primaryButton}`}
        >
          Log out and switch account
        </button>
        <Link href="/" className={backLink}>
          Back to store
        </Link>
      </Panel>
    );
  }

  return children;
}
