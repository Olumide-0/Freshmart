"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthFlow from "@/components/auth/AuthFlow";
import { useAuthStore } from "@/store/useAuthStore";
import Crate from "@/assets/image/empty Cart image.png";

const noopSubscribe = () => () => {};

// false on the server and during hydration, true after. The session lives in
// localStorage, so waiting for this avoids a server/client HTML mismatch.
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// Shows children only with a session. Without one it opens the login modal
// right away; after a successful login the children appear in place, so the
// customer continues where they were (e.g. checkout).
// This is a UI gate only: the API must check the token on anything it protects.
export default function RequireAuth({ children }) {
  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [authOpen, setAuthOpen] = useState(true);

  if (!mounted) return null;
  if (user && token) return children;

  return (
    <div className="flex w-full flex-col items-center justify-center bg-[#F6F0E3] px-[20px] py-[60px] text-center sm:px-[40px] sm:py-[80px] md:px-[64px] xl:px-[10px] xl:py-[180px]">
      <Image src={Crate} alt="" className="h-[188px] w-[209px]" />

      <h1 className="mt-[16px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px]">
        Sign up or log in to continue to checkout
      </h1>

      <p className="mt-[8px] text-[14px] text-gray-500 sm:text-[16px]">
        You need an account to place your order.
      </p>

      <button
        onClick={() => setAuthOpen(true)}
        className="mt-[20px] rounded-[8px] bg-[#3E5730] px-[24px] py-[12px] text-[14px] font-semibold text-white sm:px-[32px] sm:py-[14px] sm:text-[15px]"
      >
        Sign up / Log in
      </button>

      <Link href="/cart" className="mt-[12px] text-[14px] font-semibold text-[#3E5730] underline">
        Back to cart
      </Link>

      {authOpen && <AuthFlow onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
