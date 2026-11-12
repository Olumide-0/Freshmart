"use client";

import { useEffect, useTransition } from "react";
import Image from "next/image";
import Crate from "@/assets/image/empty Cart image.png";

// Friendly fallback for storefront routes when the API is slow or down
// (e.g. the free Render instance waking up). Rendered by each route's error.jsx.
// retry() re-fetches and re-renders the page on the server; nothing retries on its own.
export default function ApiErrorState({ error, retry }) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Full message in dev; in production only the digest reaches the browser.
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full flex-col items-center justify-center bg-[#F6F0E3] px-[20px] py-[60px] text-center sm:px-[40px] sm:py-[80px] md:px-[64px] xl:py-[120px]">
      <Image src={Crate} alt="" className="h-[150px] w-[167px] sm:h-[188px] sm:w-[209px]" />

      <h1 className="mt-[16px] text-[20px] font-extrabold text-[#1F2937] sm:text-[22px] md:text-[24px]">
        FreshMart is waking up
      </h1>

      <p className="mt-[8px] max-w-[420px] text-[14px] text-gray-500 sm:text-[16px]">
        Please try again in a few seconds.
      </p>

      <button
        type="button"
        onClick={() => startTransition(() => retry())}
        disabled={pending}
        className="mt-[20px] rounded-[8px] bg-[#3E5730] px-[24px] py-[12px] text-[14px] font-semibold text-white disabled:cursor-wait disabled:opacity-70 sm:px-[32px] sm:py-[14px] sm:text-[15px]"
      >
        {pending ? "Trying…" : "Try again"}
      </button>
    </div>
  );
}
